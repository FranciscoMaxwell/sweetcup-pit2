"""Regras compartilhadas pelos servidores local e Cloudflare. Valores em centavos."""
import hashlib
import json
import re
import secrets
import time
from datetime import datetime, timezone


class APIError(Exception):
    def __init__(self, message, status=400):
        self.message, self.status = message, status


def now():
    return datetime.now(timezone.utc).isoformat()


def text(value, label, minimum=2, maximum=500):
    if not isinstance(value, str) or not minimum <= len(value.strip()) <= maximum:
        raise APIError(f'{label}: informe de {minimum} a {maximum} caracteres.')
    return value.strip()


def quantity(value):
    if type(value) is not int or not 0 <= value <= 20:
        raise APIError('A quantidade deve ser um número inteiro de 0 a 20.')
    return value


def totals(items, coupon=''):
    if coupon not in ('', 'SWEET10', 'PROMO20'):
        raise APIError('Cupom inválido. Use SWEET10 ou PROMO20.')
    subtotal = sum(item['price_cents'] * item['quantity'] for item in items)
    rate = {'SWEET10': 10, 'PROMO20': 20}.get(coupon, 0)
    discount = (subtotal * rate + 50) // 100
    delivery = 890 if items else 0
    return dict(subtotal_cents=subtotal, discount_cents=discount, delivery_cents=delivery,
                total_cents=subtotal - discount + delivery)


class SweetCupService:
    def __init__(self, repo):
        self.repo = repo

    async def one(self, sql, params=()):
        rows = await self.repo.all(sql, params)
        return rows[0] if rows else None

    async def session(self, token):
        if not token:
            raise APIError('Entre como cliente de demonstração para continuar.', 401)
        hashed = hashlib.sha256(token.encode()).hexdigest()
        user = await self.one('SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>?', (hashed, int(time.time())))
        if not user:
            raise APIError('Sua sessão expirou. Entre novamente.', 401)
        return user

    async def create_session(self, data):
        name = text(data.get('name', 'Cliente de demonstração'), 'Nome', 2, 80)
        uid, token = secrets.token_hex(16), secrets.token_urlsafe(32)
        await self.repo.batch([
            ('INSERT INTO users(id,name,created_at) VALUES(?,?,?)', (uid, name, now())),
            ('INSERT INTO sessions VALUES(?,?,?)', (hashlib.sha256(token.encode()).hexdigest(), uid, int(time.time()) + 1209600)),
            ('INSERT INTO carts(user_id) VALUES(?)', (uid,)),
        ])
        return token

    async def catalog(self):
        rows = await self.repo.all('SELECT * FROM products ORDER BY id')
        ingredients = await self.repo.all('SELECT p.product_id,i.name FROM ingredients i JOIN product_ingredients p ON p.ingredient_id=i.id ORDER BY p.product_id,p.position')
        by_product = {}
        for ingredient in ingredients:
            by_product.setdefault(ingredient['product_id'], []).append(ingredient['name'])
        for row in rows:
            row['price'] = row['price_cents'] / 100
            row['ingredients'] = by_product.get(row['id'], [])
        return rows

    async def cart(self, uid):
        items = await self.repo.all('SELECT p.id,p.name,p.price_cents,c.quantity FROM cart_items c JOIN products p ON p.id=c.product_id WHERE c.user_id=? ORDER BY p.id', (uid,))
        cart = await self.one('SELECT coupon,version FROM carts WHERE user_id=?', (uid,))
        return dict(items=items, **cart, **totals(items, cart['coupon']))

    async def orders(self, uid):
        rows = await self.repo.all('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC,id DESC LIMIT 100', (uid,))
        items = await self.repo.all('SELECT i.* FROM order_items i JOIN (SELECT id FROM orders WHERE user_id=? ORDER BY created_at DESC,id DESC LIMIT 100) o ON o.id=i.order_id ORDER BY i.order_id,i.product_id', (uid,))
        by_order = {}
        for item in items:
            oid = item.pop('order_id')
            by_order.setdefault(oid, []).append(item)
        for row in rows:
            row.pop('request_key', None)
            row.pop('user_id', None)
            row['items'] = by_order.get(row['id'], [])
        return rows

    async def state(self, user):
        uid = user['id']
        favorites = await self.repo.all('SELECT product_id FROM favorites WHERE user_id=? ORDER BY product_id', (uid,))
        return dict(user=user, products=await self.catalog(), cart=await self.cart(uid),
                    favorites=[r['product_id'] for r in favorites], orders=await self.orders(uid))

    async def product(self, pid):
        if not isinstance(pid, str) or not pid.isdigit():
            raise APIError('Produto inválido.', 404)
        if not await self.one('SELECT id FROM products WHERE id=?', (int(pid),)):
            raise APIError('Produto não encontrado.', 404)
        return int(pid)

    async def checkout(self, uid, data):
        key = text(data.get('request_key'), 'Identificador da compra', 8, 80)
        previous = await self.one('SELECT id FROM orders WHERE user_id=? AND request_key=?', (uid, key))
        if previous:
            return previous['id']
        address = text(data.get('address'), 'Endereço de demonstração', 8, 200)
        payment = data.get('payment')
        if payment not in ('pix', 'card', 'cash'):
            raise APIError('Selecione uma forma de pagamento válida.')
        cart = await self.cart(uid)
        if not cart['items']:
            raise APIError('Seu carrinho está vazio. Adicione um cupcake antes de finalizar.')
        expected_version = data.get('cart_version')
        if type(expected_version) is not int or expected_version != cart['version']:
            raise APIError('Seu carrinho mudou. Confira os valores e tente novamente.', 409)
        oid = 'SC-' + secrets.token_hex(6).upper()
        fields = ('subtotal_cents', 'discount_cents', 'delivery_cents', 'total_cents')
        params = (oid, uid, key, now(), *(cart[f] for f in fields), cart['coupon'], payment, address, uid, cart['version'])
        # A versão protege contra alterações concorrentes. Todos os comandos são atômicos.
        statements = [('INSERT INTO orders(id,user_id,request_key,created_at,subtotal_cents,discount_cents,delivery_cents,total_cents,coupon,payment,address) SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM carts WHERE user_id=? AND version=?)', params)]
        for item in cart['items']:
            statements.append(('INSERT INTO order_items SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM orders WHERE id=?)',
                               (oid, item['id'], item['name'], item['price_cents'], item['quantity'], oid)))
        statements += [
            ('DELETE FROM cart_items WHERE user_id=? AND EXISTS(SELECT 1 FROM orders WHERE id=?)', (uid, oid)),
            ("UPDATE carts SET coupon='',version=version+1 WHERE user_id=? AND EXISTS(SELECT 1 FROM orders WHERE id=?)", (uid, oid)),
            ('UPDATE users SET address=? WHERE id=? AND EXISTS(SELECT 1 FROM orders WHERE id=?)', (address, uid, oid)),
        ]
        try:
            await self.repo.batch(statements)
        except Exception:
            previous = await self.one('SELECT id FROM orders WHERE user_id=? AND request_key=?', (uid, key))
            if previous:
                return previous['id']
            raise
        if not await self.one('SELECT id FROM orders WHERE id=?', (oid,)):
            raise APIError('Seu carrinho mudou durante a compra. Atualize e tente novamente.', 409)
        return oid

    async def dispatch(self, method, path, data, token):
        if method == 'GET' and path == '/api/health':
            await self.one('SELECT count(*) AS total FROM products')
            return {'status': 'ok', 'backend': 'Python', 'environment': 'academic-demo'}, None
        if method == 'GET' and path == '/api/products':
            return {'products': await self.catalog()}, None
        if method == 'POST' and path == '/api/session':
            token = await self.create_session(data)
            return await self.state(await self.session(token)), token
        user = await self.session(token)
        uid = user['id']
        if method == 'GET' and path == '/api/state':
            return await self.state(user), None
        if method == 'DELETE' and path == '/api/session':
            await self.repo.batch([('DELETE FROM sessions WHERE token_hash=?', (hashlib.sha256(token.encode()).hexdigest(),))])
            return {'message': 'Sessão encerrada.'}, ''
        if method == 'PUT' and path == '/api/profile':
            name = text(data.get('name'), 'Nome', 2, 80)
            address = text(data.get('address', ''), 'Endereço', 0, 200)
            await self.repo.batch([('UPDATE users SET name=?,address=? WHERE id=?', (name, address, uid))])
        elif method == 'PUT' and path.startswith('/api/cart/items/'):
            pid = await self.product(path.rsplit('/', 1)[-1])
            qty = quantity(data.get('quantity'))
            stmt = ('INSERT INTO cart_items VALUES(?,?,?) ON CONFLICT(user_id,product_id) DO UPDATE SET quantity=excluded.quantity', (uid, pid, qty)) if qty else ('DELETE FROM cart_items WHERE user_id=? AND product_id=?', (uid, pid))
            await self.repo.batch([stmt, ('UPDATE carts SET version=version+1 WHERE user_id=?', (uid,))])
        elif method == 'PUT' and path == '/api/cart/coupon':
            coupon = data.get('coupon', '')
            if not isinstance(coupon, str):
                raise APIError('Cupom inválido.')
            coupon = coupon.strip().upper()
            totals([], coupon)
            await self.repo.batch([('UPDATE carts SET coupon=?,version=version+1 WHERE user_id=?', (coupon, uid))])
        elif method in ('PUT', 'DELETE') and path.startswith('/api/favorites/'):
            pid = await self.product(path.rsplit('/', 1)[-1])
            stmt = ('INSERT OR IGNORE INTO favorites VALUES(?,?)', (uid, pid)) if method == 'PUT' else ('DELETE FROM favorites WHERE user_id=? AND product_id=?', (uid, pid))
            await self.repo.batch([stmt])
        elif method == 'POST' and path == '/api/orders':
            oid = await self.checkout(uid, data)
            state = await self.state(await self.session(token))
            return dict(state, created_order_id=oid), None
        elif method == 'POST' and re.fullmatch(r'/api/orders/SC-[A-F0-9]{12}/advance', path):
            oid = path.split('/')[3]
            order = await self.one('SELECT status FROM orders WHERE id=? AND user_id=?', (oid, uid))
            if not order:
                raise APIError('Pedido não encontrado.', 404)
            await self.repo.batch([('UPDATE orders SET status=min(status+1,3) WHERE id=? AND user_id=?', (oid, uid))])
        elif method == 'POST' and path == '/api/feedback':
            name = text(data.get('tester_name'), 'Nome de quem testou', 2, 100)
            date = text(data.get('tested_at'), 'Data do teste', 10, 10)
            try:
                parsed = datetime.strptime(date, '%Y-%m-%d').date()
                if parsed > datetime.now(timezone.utc).date():
                    raise ValueError()
            except ValueError:
                raise APIError('Informe uma data válida, sem estar no futuro.')
            fields = [text(data.get(f), label, 3, 2000) for f, label in [('worked', 'O que funcionou'), ('failed', 'O que falhou ou pode melhorar'), ('untested', 'O que não foi testado')]]
            fid = secrets.token_hex(12)
            await self.repo.batch([('INSERT INTO feedback VALUES(?,?,?,?,?,?,?,?)', (fid, uid, name, date, *fields, now()))])
            return {'message': 'Avaliação registrada.', 'id': fid}, None
        elif method == 'GET' and path == '/api/feedback':
            return {'feedback': await self.repo.all('SELECT id,tester_name,tested_at,worked,failed,untested,created_at FROM feedback WHERE user_id=? ORDER BY created_at', (uid,))}, None
        else:
            raise APIError('Rota não encontrada.', 404)
        return await self.state(await self.session(token)), None

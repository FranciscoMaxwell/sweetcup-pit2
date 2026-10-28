"""Verificação HTTP do mesmo contrato no servidor local ou Worker. Dados fictícios."""
import json
import sys
import urllib.request
import urllib.error
import http.cookiejar
import uuid
from datetime import datetime, timezone

base = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8787'
jar = http.cookiejar.CookieJar()
client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
checks = []


def call(path, method='GET', body=None):
    raw = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(base + '/api' + path, data=raw, method=method, headers={'Content-Type': 'application/json', 'Origin': base, 'User-Agent': 'SweetCup-PIT2-Test/1.0'})
    with client.open(req, timeout=45) as response:
        return json.load(response)


def check(label, condition):
    if not condition:
        raise AssertionError(label)
    checks.append({'test': label, 'status': 'PASS'})


check('Saúde da API Python', call('/health')['status'] == 'ok')
state = call('/session', 'POST', {'name': 'Teste HTTP automatizado'})
check('Sessão e catálogo com oito produtos', len(state['products']) == 8)
state = call('/cart/items/1', 'PUT', {'quantity': 2})
check('Carrinho persistente com duas unidades', call('/state')['cart']['items'][0]['quantity'] == 2)
state = call('/cart/coupon', 'PUT', {'coupon': 'SWEET10'})
check('Total com cupom calculado pelo servidor', state['cart']['total_cents'] == 3572)
state = call('/favorites/3', 'PUT')
check('Favorito persistido', call('/state')['favorites'] == [3])
body = {'request_key': str(uuid.uuid4()), 'cart_version': state['cart']['version'], 'payment': 'pix', 'address': 'Rua dos Testes, 123'}
state = call('/orders', 'POST', body)
oid = state['created_order_id']
check('Pedido salvo com desconto e carrinho esvaziado', state['orders'][0]['total_cents'] == 3572 and not state['cart']['items'])
retry = call('/orders', 'POST', body)
check('Reenvio da compra sem duplicidade', retry['created_order_id'] == oid and len(retry['orders']) == 1)
state = call('/orders/' + oid + '/advance', 'POST', {})
check('Status demonstrativo persistido', state['orders'][0]['status'] == 1 and call('/state')['orders'][0]['status'] == 1)
call('/profile', 'PUT', {'name': 'Cliente HTTP Editado', 'address': 'Rua Fictícia, 123'})
check('Perfil editado persistido', call('/state')['user']['name'] == 'Cliente HTTP Editado')
try:
    call('/cart/items/1', 'PUT', {'quantity': -1})
    raise AssertionError('Quantidade inválida deveria ser rejeitada')
except urllib.error.HTTPError as error:
    check('Quantidade inválida recebe erro tratado', error.code == 400 and 'error' in json.load(error))
call('/session', 'DELETE')
try:
    call('/state')
    raise AssertionError('Sessão encerrada deveria ser rejeitada')
except urllib.error.HTTPError as error:
    check('Logout invalida acesso', error.code == 401)
print(json.dumps({'executed_at': datetime.now(timezone.utc).isoformat(), 'base_url': base, 'checks': checks, 'total': len(checks), 'status': 'PASS'}, ensure_ascii=False, indent=2))

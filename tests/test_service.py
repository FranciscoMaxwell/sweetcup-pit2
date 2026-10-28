"""Testes reais das regras e integração com SQLite temporário."""
import asyncio
import json
import sqlite3
import tempfile
import unittest
from contextlib import closing
from pathlib import Path
from backend.local_server import initialize
from backend.repository import SQLiteRepository
from backend.service import SweetCupService, APIError, totals
from backend.http_utils import parse_body, check_origin, session_cookie


class ServiceTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = Path(self.tmp.name) / 'test.sqlite3'
        initialize(self.path)
        self.service = SweetCupService(SQLiteRepository(self.path))
        self.token = await self.service.create_session({'name': 'Cliente Teste'})

    async def asyncTearDown(self):
        self.tmp.cleanup()

    async def call(self, method, path, body=None, token=None):
        result, _ = await self.service.dispatch(method, path, body or {}, token or self.token)
        return result

    async def prepare_cart(self):
        await self.call('PUT', '/api/cart/items/1', {'quantity': 2})
        return await self.call('PUT', '/api/cart/coupon', {'coupon': 'sweet10'})

    async def order(self, key='test-purchase-001'):
        state = await self.prepare_cart()
        return await self.call('POST', '/api/orders', {'request_key': key, 'cart_version': state['cart']['version'], 'address': 'Rua de Teste, 123', 'payment': 'pix'})

    async def test_catalog_has_eight_seeded_products(self):
        state = await self.call('GET', '/api/state')
        self.assertEqual(len(state['products']), 8)
        self.assertEqual(state['products'][0]['price_cents'], 1490)

    async def test_unknown_or_expired_session_rejected(self):
        for token in ('not-a-session', ''):
            with self.assertRaises(APIError) as error:
                await self.service.session(token)
            self.assertEqual(error.exception.status, 401)
        with closing(sqlite3.connect(self.path)) as conn:
            with conn:
                conn.execute('UPDATE sessions SET expires_at=0')
        with self.assertRaises(APIError):
            await self.service.session(self.token)

    async def test_cart_persists_when_service_restarts(self):
        await self.call('PUT', '/api/cart/items/1', {'quantity': 2})
        restarted = SweetCupService(SQLiteRepository(self.path))
        state, _ = await restarted.dispatch('GET', '/api/state', {}, self.token)
        self.assertEqual(state['cart']['items'][0]['quantity'], 2)

    async def test_quantity_rejects_negative_fraction_boolean_and_limit(self):
        for value in (-1, 1.5, True, 21, '2', None):
            with self.subTest(value=value), self.assertRaises(APIError):
                await self.call('PUT', '/api/cart/items/1', {'quantity': value})

    async def test_remove_last_item_clears_total_and_delivery(self):
        await self.prepare_cart()
        state = await self.call('PUT', '/api/cart/items/1', {'quantity': 0})
        self.assertEqual(state['cart']['items'], [])
        self.assertEqual(state['cart']['total_cents'], 0)
        self.assertEqual(state['cart']['delivery_cents'], 0)

    async def test_invalid_product_rejected(self):
        for pid in ('999', "1 OR 1=1"):
            with self.assertRaises(APIError) as error:
                await self.call('PUT', '/api/cart/items/' + pid, {'quantity': 1})
            self.assertEqual(error.exception.status, 404)

    async def test_coupon_recalculates_when_quantity_changes(self):
        state = await self.prepare_cart()
        self.assertEqual(state['cart']['total_cents'], 3572)
        state = await self.call('PUT', '/api/cart/items/1', {'quantity': 3})
        self.assertEqual(state['cart']['discount_cents'], 447)
        self.assertEqual(state['cart']['total_cents'], 4913)

    async def test_invalid_coupon_does_not_change_previous_quote(self):
        state = await self.prepare_cart()
        with self.assertRaises(APIError):
            await self.call('PUT', '/api/cart/coupon', {'coupon': 'WRONG'})
        after = await self.call('GET', '/api/state')
        self.assertEqual(after['cart'], state['cart'])

    async def test_remove_coupon(self):
        await self.prepare_cart()
        state = await self.call('PUT', '/api/cart/coupon', {'coupon': ''})
        self.assertEqual(state['cart']['discount_cents'], 0)
        self.assertEqual(state['cart']['total_cents'], 3870)

    async def test_checkout_keeps_discount_and_clears_cart(self):
        state = await self.order()
        order = state['orders'][0]
        self.assertEqual(order['total_cents'], 3572)
        self.assertEqual(order['coupon'], 'SWEET10')
        self.assertEqual(order['items'][0]['quantity'], 2)
        self.assertEqual(state['cart']['items'], [])
        self.assertEqual(state['cart']['coupon'], '')

    async def test_repeated_purchase_request_creates_one_order(self):
        state = await self.order()
        retry = await self.call('POST', '/api/orders', {'request_key': 'test-purchase-001'})
        self.assertEqual(retry['created_order_id'], state['created_order_id'])
        self.assertEqual(len(retry['orders']), 1)

    async def test_checkout_ignores_prices_sent_by_client(self):
        state = await self.prepare_cart()
        result = await self.call('POST', '/api/orders', {'request_key': 'tamper-test-001', 'cart_version': state['cart']['version'], 'address': 'Rua de Teste, 123', 'payment': 'card', 'total_cents': 1, 'price_cents': 1})
        self.assertEqual(result['orders'][0]['total_cents'], 3572)

    async def test_empty_cart_and_invalid_checkout_rejected(self):
        with self.assertRaises(APIError):
            await self.call('POST', '/api/orders', {'request_key': 'empty-cart-001', 'cart_version': 0, 'address': 'Rua de Teste, 123', 'payment': 'pix'})
        state = await self.prepare_cart()
        base = {'request_key': 'invalid-checkout', 'cart_version': state['cart']['version'], 'address': 'Rua de Teste, 123', 'payment': 'pix'}
        for changes in ({'address': ''}, {'payment': 'bank-real'}, {'request_key': ''}):
            with self.assertRaises(APIError):
                await self.call('POST', '/api/orders', dict(base, **changes))

    async def test_changed_cart_version_prevents_stale_checkout(self):
        before = await self.prepare_cart()
        await self.call('PUT', '/api/cart/items/1', {'quantity': 3})
        with self.assertRaises(APIError) as error:
            await self.call('POST', '/api/orders', {'request_key': 'stale-checkout', 'cart_version': before['cart']['version'], 'address': 'Rua de Teste, 123', 'payment': 'pix'})
        self.assertEqual(error.exception.status, 409)
        after = await self.call('GET', '/api/state')
        self.assertEqual(after['orders'], [])
        self.assertEqual(after['cart']['items'][0]['quantity'], 3)

    async def test_favorites_are_saved_and_can_be_removed(self):
        state = await self.call('PUT', '/api/favorites/3')
        self.assertEqual(state['favorites'], [3])
        state = await self.call('DELETE', '/api/favorites/3')
        self.assertEqual(state['favorites'], [])

    async def test_order_and_favorites_are_isolated_between_clients(self):
        first = await self.order()
        await self.call('PUT', '/api/favorites/1')
        other = await self.service.create_session({'name': 'Outro Cliente'})
        state = await self.call('GET', '/api/state', token=other)
        self.assertEqual(state['orders'], [])
        self.assertEqual(state['favorites'], [])
        with self.assertRaises(APIError) as error:
            await self.call('POST', '/api/orders/' + first['created_order_id'] + '/advance', token=other)
        self.assertEqual(error.exception.status, 404)

    async def test_simulated_status_stops_at_delivered(self):
        state = await self.order()
        for _ in range(5):
            state = await self.call('POST', '/api/orders/' + state['orders'][0]['id'] + '/advance')
        self.assertEqual(state['orders'][0]['status'], 3)

    async def test_profile_is_saved(self):
        state = await self.call('PUT', '/api/profile', {'name': 'Cliente Editado', 'address': 'Rua Fictícia, 321'})
        self.assertEqual(state['user']['name'], 'Cliente Editado')
        self.assertEqual(state['user']['address'], 'Rua Fictícia, 321')

    async def test_feedback_requires_actual_fields_and_exports_only_own(self):
        with self.assertRaises(APIError):
            await self.call('POST', '/api/feedback', {})
        data = {'tester_name': 'Pessoa de Teste Técnico', 'tested_at': '2026-10-28', 'worked': 'Carrinho e pedido.', 'failed': 'Sem falha neste roteiro.', 'untested': 'Entrega real fora do escopo.'}
        result = await self.call('POST', '/api/feedback', data)
        rows = (await self.call('GET', '/api/feedback'))['feedback']
        self.assertEqual(rows[0]['id'], result['id'])
        other = await self.service.create_session({'name': 'Outro Cliente'})
        self.assertEqual((await self.call('GET', '/api/feedback', token=other))['feedback'], [])

    async def test_logout_invalidates_session(self):
        await self.call('DELETE', '/api/session')
        with self.assertRaises(APIError):
            await self.service.session(self.token)

    async def test_atomic_database_batch_rolls_back_on_failure(self):
        repo = SQLiteRepository(self.path)
        with self.assertRaises(sqlite3.IntegrityError):
            await repo.batch([('UPDATE users SET name=?', ('Changed',)), ('INSERT INTO cart_items VALUES(?,?,?)', ('nonexistent', 1, 2))])
        self.assertEqual((await self.call('GET', '/api/state'))['user']['name'], 'Cliente Teste')


class InputTests(unittest.TestCase):
    def test_cent_rounding(self):
        self.assertEqual(totals([{'price_cents': 1555, 'quantity': 1}], 'SWEET10')['discount_cents'], 156)

    def test_malformed_and_oversized_json(self):
        for raw in ('{broken', '[]', 'x' * 16385):
            with self.assertRaises(APIError):
                parse_body(raw)

    def test_foreign_origin_rejected(self):
        check_origin('https://sweetcup.example', 'https://sweetcup.example/api/orders')
        with self.assertRaises(APIError):
            check_origin('https://sweetcup.example.evil.test', 'https://sweetcup.example/api/orders')

    def test_cookie_flags(self):
        value = session_cookie('fake', True)
        for expected in ('HttpOnly', 'SameSite=Lax', 'Secure'):
            self.assertIn(expected, value)


if __name__ == '__main__':
    unittest.main(verbosity=2)

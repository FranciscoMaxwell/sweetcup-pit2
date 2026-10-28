"""Adaptador Cloudflare Workers Python. A lógica fica em service.py."""
import json
from urllib.parse import urlparse
from workers import WorkerEntrypoint, Response
from repository import D1Repository
from service import SweetCupService, APIError
from http_utils import session_token, session_cookie, parse_body, check_origin


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        path = urlparse(request.url).path
        if not path.startswith('/api/'):
            return await self.env.ASSETS.fetch(request)
        headers = {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'}
        try:
            if request.method != 'GET':
                check_origin(request.headers.get('Origin'), request.url)
            length = request.headers.get('Content-Length')
            if length and int(length) > 16384:
                raise APIError('Conteúdo muito grande.', 413)
            raw = await request.text()
            data = parse_body(raw)
            result, token = await SweetCupService(D1Repository(self.env.DB)).dispatch(request.method, path, data, session_token(request.headers.get('Cookie')))
            if token is not None:
                headers['Set-Cookie'] = session_cookie(token, urlparse(request.url).scheme == 'https')
            return Response(json.dumps(result, ensure_ascii=False), status=200, headers=headers)
        except APIError as e:
            return Response(json.dumps({'error': e.message}, ensure_ascii=False), status=e.status, headers=headers)
        except Exception as e:
            print('SweetCup API error:', type(e).__name__)
            return Response(json.dumps({'error': 'Não foi possível concluir. Tente novamente.'}), status=500, headers=headers)

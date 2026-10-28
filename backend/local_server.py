"""Servidor de demonstração local sem dependências externas. python -m backend.local_server"""
import asyncio
import json
import mimetypes
import os
import sqlite3
from contextlib import closing
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, unquote
from .repository import SQLiteRepository
from .service import SweetCupService, APIError
from .http_utils import session_token, session_cookie, parse_body, check_origin

ROOT = Path(__file__).resolve().parents[1]
DATABASE = Path(os.environ.get('SWEETCUP_DB', str(ROOT / 'data' / 'sweetcup.sqlite3')))


def initialize(path=DATABASE):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with closing(sqlite3.connect(path)) as conn:
        conn.executescript((ROOT / 'database' / '001_schema.sql').read_text(encoding='utf-8'))
        if 'ingredients_json' in [row[1] for row in conn.execute('PRAGMA table_info(products)')]:
            conn.execute('ALTER TABLE products DROP COLUMN ingredients_json')
        conn.executescript((ROOT / 'database' / '002_seed.sql').read_text(encoding='utf-8'))


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.handle_request()

    do_POST = do_PUT = do_DELETE = do_GET

    def handle_request(self):
        path = urlparse(self.path).path
        if not path.startswith('/api/'):
            if self.command != 'GET':
                return self.respond(405, {'error': 'Método não permitido.'})
            candidate = (ROOT / 'dist' / unquote(path).lstrip('/')).resolve()
            if not candidate.is_relative_to((ROOT / 'dist').resolve()):
                return self.respond(403, {'error': 'Acesso negado.'})
            if not candidate.is_file():
                candidate = ROOT / 'dist' / 'index.html'
            if not candidate.exists():
                return self.respond(503, {'error': 'Execute npm run build primeiro.'})
            content = candidate.read_bytes()
            self.send_response(200)
            self.send_header('Content-Type', mimetypes.guess_type(candidate)[0] or 'application/octet-stream')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return
        try:
            if self.command not in ('GET',):
                check_origin(self.headers.get('Origin'), 'http://' + self.headers.get('Host', '') + path)
            size = int(self.headers.get('Content-Length', '0'))
            if size < 0 or size > 16384:
                raise APIError('Conteúdo muito grande.', 413)
            data = parse_body(self.rfile.read(size))
            result, token = asyncio.run(SweetCupService(SQLiteRepository(DATABASE)).dispatch(self.command, path, data, session_token(self.headers.get('Cookie'))))
            self.respond(200, result, token)
        except APIError as e:
            self.respond(e.status, {'error': e.message})
        except Exception as e:
            print('Erro interno:', type(e).__name__, flush=True)
            self.respond(500, {'error': 'Não foi possível concluir. Tente novamente.'})

    def respond(self, status, payload, token=None):
        data = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        if token is not None:
            self.send_header('Set-Cookie', session_cookie(token))
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == '__main__':
    initialize()
    port = int(os.environ.get('PORT', '8787'))
    print(f'SweetCup: http://127.0.0.1:{port}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()

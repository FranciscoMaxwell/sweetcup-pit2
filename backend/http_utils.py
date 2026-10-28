import json
from http.cookies import SimpleCookie
from urllib.parse import urlparse
try:
    from .service import APIError
except ImportError:
    from service import APIError


def session_token(cookie):
    jar = SimpleCookie()
    try:
        jar.load(cookie or '')
        return jar['sweetcup_session'].value if 'sweetcup_session' in jar else None
    except Exception:
        return None


def session_cookie(token, secure=False):
    return 'sweetcup_session=' + token + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + ('1209600' if token else '0') + ('; Secure' if secure else '')


def parse_body(raw):
    if len(raw) > 16384:
        raise APIError('Conteúdo muito grande.', 413)
    try:
        data = json.loads(raw or '{}')
    except (ValueError, UnicodeDecodeError):
        raise APIError('Envie um JSON válido.')
    if not isinstance(data, dict):
        raise APIError('O conteúdo deve ser um objeto JSON.')
    return data


def check_origin(origin, url):
    if origin:
        incoming, target = urlparse(origin), urlparse(url)
        if incoming.scheme != target.scheme or incoming.netloc != target.netloc:
            raise APIError('Origem da solicitação não permitida.', 403)

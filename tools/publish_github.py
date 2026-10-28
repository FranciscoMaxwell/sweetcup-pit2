"""Cria ou confirma o repositório usando a credencial Git já autorizada. Não imprime tokens."""
import json
import os
import subprocess
import urllib.request
import urllib.error
from pathlib import Path

root = Path(__file__).resolve().parents[1]
env = dict(os.environ, GIT_TERMINAL_PROMPT='0', GCM_INTERACTIVE='never')
result = subprocess.run(['git', 'credential', 'fill'], input='protocol=https\nhost=github.com\n\n', text=True, capture_output=True, env=env, timeout=20)
fields = dict(line.split('=', 1) for line in result.stdout.splitlines() if '=' in line)
token = fields.get('password')
if not token:
    raise SystemExit('Credencial GitHub indisponível. Autentique pelo Git Credential Manager.')


def api(path, method='GET', payload=None):
    req = urllib.request.Request('https://api.github.com' + path, method=method,
                                 data=json.dumps(payload).encode() if payload is not None else None,
                                 headers={'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'SweetCup-PIT2'})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


user = api('/user')
if user['login'].lower() != 'franciscomaxwell':
    raise SystemExit('A credencial disponível não corresponde à conta solicitada.')
name = 'sweetcup-pit2'
try:
    repo = api('/repos/' + user['login'] + '/' + name)
    print('Repositório existente encontrado; nenhuma configuração foi alterada.')
except urllib.error.HTTPError as error:
    if error.code != 404:
        raise
    repo = api('/user/repos', 'POST', {'name': name, 'description': 'SweetCup — PIT II: loja acadêmica de cupcakes com React, Python e SQLite/Cloudflare D1. Pagamentos e entregas simulados.', 'private': False, 'auto_init': False})
    print('Repositório público criado.')
print(repo['html_url'])
config = root / 'TRABALHO DE PIT2' / 'DADOS_ENTREGA.json'
data = json.loads(config.read_text(encoding='utf-8'))
data['repository_url'] = repo['html_url']
config.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

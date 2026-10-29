"""Publica apenas evidências técnicas e dados fictícios, sem nomes das fichas."""
import html
import json
import re
import shutil
from pathlib import Path
from technical_cases import CASES, ORIGIN

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'TRABALHO DE PIT2'
PUBLIC = ROOT / 'public' / 'evidencias'
PUBLIC.mkdir(parents=True, exist_ok=True)
DATA = json.loads((OUT / 'DADOS_ENTREGA.json').read_text(encoding='utf-8'))
BASE = DATA['application_url'].rstrip('/')
REPO = DATA['repository_url'].rstrip('/')

STYLE = '''body{font:16px/1.65 system-ui,sans-serif;color:#32232b;background:#fff8f4;margin:0}main{max-width:900px;margin:auto;padding:30px 22px}h1{line-height:1.25}h2{font-size:20px}a{color:#922951;overflow-wrap:anywhere}section{background:white;border:1px solid #eddce2;border-radius:16px;padding:20px;margin:18px 0}.images{display:flex;flex-wrap:wrap;gap:18px}.images a{flex:1;min-width:230px}.images img{width:100%;max-height:650px;object-fit:contain;background:#fff5f7}small{display:block;color:#745760}li{margin:8px 0}'''


def page(title, body):
    return '<!doctype html><html lang="pt-BR"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + html.escape(title) + '</title><style>' + STYLE + '</style><main>' + body + '</main></html>'


for case in CASES:
    for name in case['screenshots']:
        shutil.copyfile(OUT / 'EVIDENCIAS' / name, PUBLIC / name)
shutil.copyfile(OUT / 'EVIDENCIAS/14_comparacao_prototipo_codigo.txt', PUBLIC / '14_comparacao_prototipo_codigo.txt')
for name in ['RESULTADO_INTERFACE.json', 'RESULTADO_PERFIL.json', 'RESULTADO_HTTP_PUBLICO.json']:
    shutil.copyfile(OUT / name, PUBLIC / name)
report = (OUT / 'RESULTADO_TESTES_BACKEND.txt').read_text(encoding='utf-8')
names = re.findall(r'^(test_\w+) \(', report, re.M)
assert len(names) == 25 and 'OK' in report
(PUBLIC / 'RESULTADO_TESTES_BACKEND.json').write_text(json.dumps({'origin': 'Resumo do relatório técnico original preservado na entrega', 'status': 'PASS', 'total': len(names), 'tests': names}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
index = ['<h1>SweetCup Evidências dos cinco testes</h1><p>Resultados e capturas da versão demonstrativa, organizados nas datas de referência fornecidas pelo aluno.</p><p><small>' + html.escape(ORIGIN) + '</small></p><ol>']
for i, case in enumerate(CASES, 1):
    body = '<p><a href="./">Todas as etapas</a> · <a href="/">Abrir a aplicação</a></p>'
    body += '<h1>Teste ' + str(i) + ' ' + html.escape(case['scenario']) + '</h1><p><b>Data de referência da etapa:</b> ' + case['reference_date'] + '</p><small>' + html.escape(ORIGIN) + '</small>'
    for key, title in [('worked', 'O que funcionou'), ('failed', 'Erro anterior e correção verificada'), ('untested', 'O que faltou implementar ou testar')]:
        body += '<section><h2>' + title + '</h2><p>' + html.escape(case[key]) + '</p></section>'
    body += '<h2>Capturas da versão corrigida</h2><div class="images">'
    for name in case['screenshots']:
        body += '<a href="' + name + '"><img src="' + name + '" alt="' + html.escape(name) + '"><span>' + name + '</span></a>'
    body += '</div><h2>Registros e comparação do protótipo</h2><ul>'
    for name in ['14_comparacao_prototipo_codigo.txt', 'RESULTADO_INTERFACE.json', 'RESULTADO_PERFIL.json', 'RESULTADO_HTTP_PUBLICO.json', 'RESULTADO_TESTES_BACKEND.json']:
        body += '<li><a href="' + name + '">' + name + '</a></li>'
    body += '<li><a href="' + REPO + '/tree/273393c">Código do protótipo preservado</a></li><li><a href="' + REPO + '/blob/main/tests/test_service.py">Código dos testes da versão corrigida</a></li></ul>'
    (PUBLIC / f'teste-{i}.html').write_text(page('SweetCup Teste ' + str(i), body), encoding='utf-8')
    index.append(f'<li><a href="teste-{i}.html">{case["reference_date"]} - {html.escape(case["scenario"])}</a></li>')
index.append('</ol><p><a href="' + BASE + '">Aplicação</a> · <a href="' + REPO + '">Repositório</a></p>')
(PUBLIC / 'index.html').write_text(page('SweetCup Evidências dos cinco testes', ''.join(index)), encoding='utf-8')
print('Site de evidências técnicas preparado em public/evidencias.')

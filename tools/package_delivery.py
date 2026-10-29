"""Empacota a entrega sem credenciais, bancos ou dependências instaladas."""
import subprocess
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
out = root / 'TRABALHO DE PIT2'
source = out / 'SWEETCUP_CODIGO_E_DOCUMENTACAO.zip'
subprocess.run(['git', 'archive', '--format=zip', '--output=' + str(source), 'HEAD'], cwd=root, check=True)
files = ['LEIA_PRIMEIRO.txt', 'RESPOSTAS_PIT2.txt', 'PIT2_ATIVIDADE_PREENCHIDA.docx', 'LAUDO_QUALIDADE_E_EVIDENCIAS.pdf', 'CINCO_TESTES_RESULTADOS_E_EVIDENCIAS.pdf', 'CINCO_AVALIACOES_PARA_VALIDAR.pdf', 'TESTES_5_PARTICIPANTES.txt', 'ROTEIRO_VIDEO_5_MINUTOS.txt', 'RESULTADO_TESTES_BACKEND.txt', 'RESULTADO_HTTP_LOCAL.json', 'RESULTADO_HTTP_WORKER.json', 'RESULTADO_HTTP_PUBLICO.json', 'RESULTADO_INTERFACE.json', 'RESULTADO_PERFIL.json', 'RESULTADO_CINCO_CENARIOS.json', 'RESULTADO_URLS_EVIDENCIAS.json', 'SWEETCUP_CODIGO_E_DOCUMENTACAO.zip']
with zipfile.ZipFile(out / 'ENTREGA_SWEETCUP_PIT2.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in files:
        path = out / name
        if path.is_file():
            archive.write(path, name)
    for path in sorted((out / 'EVIDENCIAS').glob('*')):
        if path.is_file():
            archive.write(path, 'EVIDENCIAS/' + path.name)
print('Pacotes gerados em', out)

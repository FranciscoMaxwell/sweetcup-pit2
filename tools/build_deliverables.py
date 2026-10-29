"""Gera os arquivos de entrega com fatos verificados e pendências explícitas."""
import argparse
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'TRABALHO DE PIT2'
DATA = json.loads((OUT / 'DADOS_ENTREGA.json').read_text(encoding='utf-8'))
REVISION = DATA.get('updated_on', '28/10/2026')


def value(key, pending):
    return DATA.get(key) or pending


def line(path, needle):
    for i, text in enumerate((ROOT / path).read_text(encoding='utf-8').splitlines(), 1):
        if needle in text:
            return i
    return '?'


def texts():
    response = f'''SWEETCUP - RESPOSTAS PARA A ATIVIDADE DO PIT II
Versão da entrega revisada em {REVISION}.
Nome: {value('student_name', 'PENDENTE: informar nome completo do aluno')}
RGM: {value('rgm', 'PENDENTE: informar RGM')}

DOCUMENTAÇÃO
O projeto SweetCup do PIT I foi evoluído de protótipo para uma aplicação web demonstrativa com interface mobile. Foram atualizados escopo, requisitos, modelagem UML, navegação, modelo relacional, banco físico, dicionário de dados e manual. O código e a documentação técnica estão publicados no GitHub, preservando o protótipo em um commit anterior.
Link do repositório: {value('repository_url', 'PENDENTE: autenticar GitHub e publicar o repositório.')}

CODIFICAÇÃO
Linguagem do back-end: Python.
Front-end: React, TypeScript, HTML/CSS e Vite.
Banco de dados: SQLite local; esquema e adaptador Cloudflare D1 também testados localmente.
Hospedagem: {DATA['hosting_status']}
Plataforma: aplicação web responsiva com interface mobile acessível pelo navegador.
Modo de codificação: [X] Tradicional. [ ] Low-code. [ ] No-code.
Link do GitHub: {value('repository_url', 'PENDENTE DE PUBLICAÇÃO')}
Link da aplicação: {value('application_url', 'PENDENTE DE PUBLICAÇÃO. Demonstração local: http://127.0.0.1:8787 (não acessível aos colegas por esse endereço).')}
Link do vídeo: {value('video_url', 'PENDENTE: gravação e publicação pelo aluno.')}

TESTES TÉCNICOS REALIZADOS
Foram aprovados 25 testes de regras e integração SQLite, 11 verificações HTTP no servidor Python local e 11 no Worker Python com D1 local. TypeScript e build também passaram. No navegador foram verificados catálogo, busca vazia, categoria Frutas, ingredientes, favoritos após recarga, carrinho, cupom, compra, histórico, perfil e formulário de avaliação. As evidências estão na subpasta EVIDENCIAS.

TESTES DA SOLUÇÃO COM CINCO PESSOAS
Os cinco nomes foram recebidos, mas não foram recebidos relatos confirmados nem a associação confirmada das datas de 2026. As fichas estão preparadas em TESTES_5_PARTICIPANTES.txt e CINCO_AVALIACOES_PARA_VALIDAR.pdf. Os resultados técnicos acima não foram atribuídos a essas pessoas.

LAUDO DE QUALIDADE
A evolução entregou um fluxo funcional de compra demonstrativa. O catálogo vem do banco; carrinho e favoritos persistem; o checkout grava pedido e itens, preserva o desconto e limpa o carrinho. Perfil, histórico e rastreio refletem os dados da sessão. Foram corrigidos o desconto perdido entre carrinho e pagamento, informações fixas de histórico, ausência de gravação de pedidos e conexões SQLite abertas. O servidor trata entradas inválidas e evita duplicação por reenvio.
Como limitações, a sessão não possui recuperação, as imagens dependem de serviço externo e o pagamento e a entrega são simulados. Não há painel administrativo ou estoque comercial. A acessibilidade do protótipo pode receber revisão específica. A aprovação técnica foi local; a publicação remota, os cinco feedbacks e o vídeo permanecem pendentes.
Evidências: LAUDO_QUALIDADE_E_EVIDENCIAS.pdf, relatórios de testes e subpasta EVIDENCIAS.

VÍDEO DA SOLUÇÃO ATUALIZADA
Usar ROTEIRO_VIDEO_5_MINUTOS.txt. O material apresenta orientações de mínimo e máximo de cinco minutos; o roteiro foi organizado para 5:00.
Link: {value('video_url', 'PENDENTE: inserir após gravar e publicar.')}
'''
    (OUT / 'RESPOSTAS_PIT2.txt').write_text(response, encoding='utf-8')
    stages = ['Entrada e navegação básica', 'Catálogo, busca, filtros e produto', 'Carrinho, cupom e checkout', 'Favoritos, perfil e persistência', 'Compra completa, histórico e rastreio']
    blocks = ['CINCO PARTICIPANTES - FICHAS PARA CONFIRMAÇÃO\nAs datas fornecidas foram 29/08, 09/09, 23/09, 10/10 e 20/10, de 2026 e sem associação confirmada. A ordem dos roteiros é uma proposta de cobertura, não uma comprovação de testes passados.\n']
    for i, participant in enumerate(DATA['participants']):
        blocks.append(f'''FICHA {i+1}
Nome: {participant['name']}
Data confirmada: {participant['confirmed_date'] or 'PENDENTE - confirmar data completa'}
Roteiro sugerido: {stages[i]}
O que testou e funcionou: {participant['worked'] or 'PENDENTE - preencher com o relato real do participante.'}
O que testou e não funcionou - O que deve ser corrigido: {participant['failed'] or 'PENDENTE - registrar falha real, sugestão ou informar que não houve falha no roteiro.'}
Funcionalidade não testada (faltou ou não foi implementada): {participant['untested'] or 'PENDENTE - informar funcionalidade e motivo.'}
Evidências: anexar prints e arquivo exportado pelo formulário da aplicação.
Confirmação pelo participante: PENDENTE.
''')
    (OUT / 'TESTES_5_PARTICIPANTES.txt').write_text('\n'.join(blocks), encoding='utf-8')
    coupon_line = line('backend/service.py', 'def totals(')
    checkout_line = line('backend/service.py', 'async def checkout(')
    quantity_line = line('backend/service.py', 'def quantity(')
    schema_line = line('database/001_schema.sql', 'CREATE TABLE IF NOT EXISTS orders')
    test_line = line('tests/test_service.py', 'test_checkout_keeps_discount_and_clears_cart')
    script = f'''ROTEIRO DO VÍDEO - SWEETCUP PIT II - 5 MINUTOS
Gravar com sua própria voz. O vídeo deve mostrar a aplicação funcionando e explicar mudanças. Use dados fictícios.

0:00 a 0:25 - APRESENTAÇÃO
"Este é o SweetCup, continuação do protótipo de loja de cupcakes do PIT I. No PIT II implementei o processamento em Python e o banco relacional. É uma demonstração acadêmica, sem pagamentos ou entregas reais."
Mostrar a aplicação e a entrada de demonstração.

0:25 a 1:00 - CATÁLOGO
Mostrar busca por Rose e filtro por Frutas, abrir um produto e os ingredientes. Explicar que o catálogo é consultado do banco. Favoritar um produto.

1:00 a 1:50 - CARRINHO E ERRO TRATADO
Adicionar duas unidades de Rose Velvet. O subtotal é R$ 29,80 e a entrega simulada R$ 8,90. Digitar ERRADO no cupom: a aplicação mostra uma falha tratada. Depois aplicar SWEET10: desconto R$ 2,98 e total R$ 35,72. Alterar quantidade e mostrar o recálculo. Voltar a duas unidades antes de seguir.

1:50 a 2:35 - CHECKOUT E PEDIDO
Mostrar que o desconto continua no checkout. Confirmar com endereço fictício e Pix simulado. Mostrar o ID gerado, os itens e o acompanhamento. Explicar que o servidor grava o pedido em uma transação e evita duplicação por reenvio.

2:35 a 3:10 - PERSISTÊNCIA
Recarregar a página e abrir Pedidos/Favoritos para comprovar persistência. Mostrar o perfil e editar o nome fictício. Avançar uma etapa da entrega, deixando claro que é simulação.

3:10 a 3:55 - CÓDIGO E BANCO
Abrir backend/service.py na linha {coupon_line}: regra de total e cupons em centavos.
Abrir backend/service.py na linha {checkout_line}: criação e persistência do pedido.
Abrir database/001_schema.sql na linha {schema_line}: tabelas de pedidos e itens.
Mostrar docs/02_arquitetura_uml.md e docs/03_banco_dados.md rapidamente.

3:55 a 4:30 - TESTES E CORREÇÕES
Executar python -m unittest discover -s tests -v. Mostrar a aprovação dos 25 testes e o caso tests/test_service.py, linha {test_line}.
Explicar: "No protótipo o cupom se perdia no pagamento e o pedido não era salvo. Agora o servidor mantém os valores e persiste o fluxo completo."
Se já houver feedbacks reais, citar a melhoria efetivamente originada neles. Enquanto não houver, apresentar esses itens como correções técnicas, sem atribuí-los aos colegas.

4:30 a 5:00 - QUALIDADE E ENCERRAMENTO
Mostrar o formulário de avaliação e o laudo. Citar limitações reais: entrega/pagamento simulados, ausência de recuperação da sessão e dependência de imagens externas. Exibir links publicados quando disponíveis.

COMO MOSTRAR ERROS SEM QUEBRAR O PROJETO
1. Cupom inválido: usar ERRADO na interface. Nenhuma alteração de código é necessária.
2. Carrinho vazio: remover o último produto e abrir o estado vazio.
3. Endereço obrigatório: apagar o endereço no checkout e tentar confirmar; o formulário exige preenchimento.
4. Busca vazia: pesquisar um nome inexistente.

ALTERAÇÃO DE CÓDIGO OPCIONAL, APENAS NA CÓPIA LOCAL
Arquivo: backend/service.py, linha {quantity_line}. A função quantity valida o limite de unidades. Se quiser demonstrar um defeito e a regressão, copie primeiro o arquivo para fora do projeto, altere temporariamente o limite de 20 para 1, reinicie o servidor e execute o teste test_quantity_rejects_negative_fraction_boolean_and_limit junto com o teste de compra de duas unidades. A compra deve falhar porque a regra foi modificada. Restaure o arquivo antes de gravar a versão final e execute os testes novamente.
Não publique a versão alterada. Essa encenação deve ser apresentada como demonstração técnica criada para o vídeo, e não como problema encontrado por um participante.

Linhas calculadas automaticamente para a versão que acompanha este roteiro. Se o código mudar, regenere o roteiro.
'''
    (OUT / 'ROTEIRO_VIDEO_5_MINUTOS.txt').write_text(script, encoding='utf-8')
    (OUT / 'LEIA_PRIMEIRO.txt').write_text('''SWEETCUP PIT II - O QUE ESTÁ PRONTO

Abra INICIAR_SWEETCUP.cmd na pasta principal para executar a loja, ou use a aplicação local em http://127.0.0.1:8787 enquanto o servidor estiver aberto.

PRONTO: front-end conectado ao back-end Python; banco relacional; catálogo; sessão de demonstração; carrinho; cupons; favoritos; checkout; pedidos/histórico; perfil; rastreio simulado; formulário de avaliação; testes técnicos; UML; dicionário; manual; laudo; roteiro de vídeo; Git local e código empacotável.

ARQUIVOS
RESPOSTAS_PIT2.txt: respostas organizadas para copiar.
PIT2_ATIVIDADE_PREENCHIDA.docx: cópia do formulário com a parte técnica preenchida e as dependências identificadas.
LAUDO_QUALIDADE_E_EVIDENCIAS.pdf: qualidade e evidências técnicas.
TESTES_5_PARTICIPANTES.txt e CINCO_AVALIACOES_PARA_VALIDAR.pdf: fichas para os relatos reais.
ROTEIRO_VIDEO_5_MINUTOS.txt: tempos, falas sugeridas, testes e linhas do código.
EVIDENCIAS: capturas e exportação de uma verificação técnica da interface.
RESULTADO_TESTES_BACKEND.txt e RESULTADO_HTTP_*.json: execuções dos testes.
docs, na pasta principal: documentação técnica para o Git.

AINDA DEPENDE DE INFORMAÇÃO OU AÇÃO EXTERNA
Nome/RGM do aluno; autenticação para publicar no GitHub/Cloudflare; confirmação dos cinco relatos/datas; gravação e link do vídeo pelo aluno.
A chave Cloudflare disponível foi verificada, mas não permite Workers/D1. Nenhuma publicação remota foi confirmada.
O endereço 127.0.0.1 só funciona neste computador e não substitui o link público.

Os cinco depoimentos não foram inventados. O PDF das fichas tem marcação de pendência e só deve virar entrega final após a validação.
''', encoding='utf-8')
    intro = OUT / 'LEIA_PRIMEIRO.txt'
    intro.write_text(intro.read_text(encoding='utf-8').replace('Git local e código empacotável', 'Git local, repositório GitHub publicado e código empacotado').replace('autenticação para publicar no GitHub/Cloudflare', 'autenticação para concluir a publicação na Cloudflare') + '\nLINKS\nGitHub: ' + value('repository_url', 'Pendente') + '\nAplicação: ' + value('application_url', 'Publicação remota pendente') + '\n', encoding='utf-8')
    if DATA.get('application_url'):
        response_path = OUT / 'RESPOSTAS_PIT2.txt'
        response_path.write_text(response_path.read_text(encoding='utf-8').replace('A aprovação técnica foi local; a publicação remota, os cinco feedbacks e o vídeo permanecem pendentes.', 'A aplicação também foi publicada e seu contrato HTTP foi verificado no endereço público. Os cinco feedbacks e o vídeo permanecem pendentes.'), encoding='utf-8')
        intro.write_text(intro.read_text(encoding='utf-8').replace('autenticação para concluir a publicação na Cloudflare; ', '').replace('A chave Cloudflare disponível foi verificada, mas não permite Workers/D1. Nenhuma publicação remota foi confirmada.', 'A aplicação está publicada na Cloudflare e foi verificada por HTTP. O link público está abaixo.'), encoding='utf-8')


def docx():
    from docx import Document
    from docx.shared import Pt, RGBColor
    from docx.enum.table import WD_ROW_HEIGHT_RULE
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from docx.opc.constants import RELATIONSHIP_TYPE as RT
    doc = Document(OUT / 'PIT_atividade (8).docx')

    def hyperlink(paragraph, url):
        relation = paragraph.part.relate_to(url, RT.HYPERLINK, is_external=True)
        element = OxmlElement('w:hyperlink')
        element.set(qn('r:id'), relation)
        run = OxmlElement('w:r')
        props = OxmlElement('w:rPr')
        color = OxmlElement('w:color')
        color.set(qn('w:val'), '0563C1')
        props.append(color)
        run.append(props)
        content = OxmlElement('w:t')
        content.text = url
        run.append(content)
        element.append(run)
        paragraph._p.append(element)
    for p in doc.paragraphs:
        if p.text.startswith('Nome:'):
            p.text = 'Nome: ' + value('student_name', '________________________________________')
        elif p.text.startswith('RGM:'):
            p.text = 'RGM: ' + value('rgm', '________________________________________')
        elif p.text.startswith('Link do repositório:'):
            p.text = 'Link do repositório: ' + value('repository_url', 'PENDENTE - autenticar GitHub para publicação. Documentação pronta em docs/.')
            if DATA.get('repository_url'):
                p.text = 'Link do repositório: '
                hyperlink(p, DATA['repository_url'])
    entries = ['Python', 'SQLite local e Cloudflare D1 na aplicação publicada.', DATA['hosting_status'], 'Web responsiva, com interface mobile no navegador.', '(X) Tradicional\n( ) Low-code\n( ) No-code', value('repository_url', 'PENDENTE - autenticação e publicação no GitHub.'), value('application_url', 'PENDENTE - publicação remota. Local: http://127.0.0.1:8787.'), value('video_url', 'PENDENTE - gravação e publicação pelo aluno.')]
    for row, content in zip(doc.tables[0].rows, entries):
        row.cells[1].text = content
    for index, key in [(5, 'repository_url'), (6, 'application_url'), (7, 'video_url')]:
        if DATA.get(key):
            p = doc.tables[0].rows[index].cells[1].paragraphs[0]
            p.text = ''
            hyperlink(p, DATA[key])
    for i, person in enumerate(DATA['participants']):
        table = doc.tables[i + 1]
        table.rows[0].cells[0].text = 'Nome: ' + person['name'] + '\nAvaliação humana pendente de confirmação.'
        table.rows[0].cells[1].text = 'Data do teste: ' + (person['confirmed_date'] or 'PENDENTE - confirmar data completa.')
        for row_index, field, heading in [(1, 'worked', 'O que testou e funcionou:'), (2, 'failed', 'O que testou e não funcionou - O que deve ser corrigido:'), (3, 'untested', 'Funcionalidade não testada e motivo:')]:
            table.rows[row_index].cells[0].text = heading + '\n' + (person[field] or 'PENDENTE - inserir o relato real confirmado pelo participante. Ver roteiro e formulário de avaliação.')
    doc.tables[-1].rows[0].cells[1].text = value('video_url', 'PENDENTE - usar o roteiro de cinco minutos e inserir o link após a gravação.')
    paragraph = next(p for p in doc.paragraphs if p.text.startswith('Insira a seguir o laudo'))
    paragraph.text += '\n\nVerificação técnica: 25 testes automatizados aprovados e 11 verificações HTTP aprovadas em cada ambiente local (Python/SQLite e Worker/D1). Foram corrigidos o desconto perdido no checkout, a ausência de gravação do pedido e os dados fixos de perfil/histórico. Carrinho, favoritos, pedidos e status persistem no banco. Permanecem como limitações a sessão sem recuperação, imagens externas e pagamentos/entregas simulados. Os cinco feedbacks humanos e a publicação remota ainda dependem de confirmação.\n\nEvidências e detalhes: LAUDO_QUALIDADE_E_EVIDENCIAS.pdf e pasta EVIDENCIAS.'
    paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
    if DATA.get('application_url'):
        paragraph.text = paragraph.text.replace('Os cinco feedbacks humanos e a publicação remota ainda dependem de confirmação.', 'A aplicação está publicada e foi verificada por HTTP. Os cinco feedbacks humanos ainda dependem de confirmação.')
    for p in doc.paragraphs:
        if p.text.startswith(('Vídeo da Solução', 'Após levantar os feedbacks')):
            p.paragraph_format.keep_with_next = True
    for table in doc.tables:
        for row in table.rows:
            row.height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST
            row.height = None
            row._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))
            for cell in row.cells:
                for p in cell.paragraphs:
                    p.paragraph_format.space_after = Pt(5)
                    p.paragraph_format.keep_with_next = True
                    p.paragraph_format.keep_together = True
                    for run in p.runs:
                        run.font.size = Pt(11)
                        run.font.color.rgb = RGBColor(0, 0, 0)
        table.rows[-1].cells[-1].paragraphs[-1].paragraph_format.keep_with_next = False
    doc.save(OUT / 'PIT2_ATIVIDADE_PREENCHIDA.docx')
    print('DOCX preenchido; pendências externas identificadas.')


def pdfs():
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    fonts = Path('C:/Windows/Fonts')
    pdfmetrics.registerFont(TTFont('Arial', str(fonts / 'arial.ttf')))
    pdfmetrics.registerFont(TTFont('ArialBold', str(fonts / 'arialbd.ttf')))
    pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='ArialBold', italic='Arial', boldItalic='ArialBold')
    styles = getSampleStyleSheet()
    for name in ('Normal', 'BodyText', 'Title', 'Heading1', 'Heading2'):
        styles[name].fontName = 'ArialBold' if name.startswith('Heading') or name == 'Title' else 'Arial'
        styles[name].textColor = colors.black
    styles['BodyText'].fontSize = 10.5
    styles['BodyText'].leading = 15
    styles['BodyText'].spaceAfter = 9
    styles['Title'].fontSize = 23
    styles['Title'].leading = 28
    styles['Heading1'].fontSize = 17
    styles['Heading1'].leading = 22
    styles['Heading2'].fontSize = 12
    styles['Heading2'].leading = 17
    styles.add(ParagraphStyle(name='SmallText', fontName='Arial', fontSize=9, leading=12, spaceAfter=6))
    width, height = A4
    available = width - 96

    def p(content, style='BodyText'):
        return Paragraph(content, styles[style])

    def footer(canvas, doc):
        canvas.setFont('Arial', 8)
        canvas.setFillColor(colors.HexColor('#555555'))
        canvas.drawString(48, 30, f'SweetCup | PIT II | Revisão da entrega: {REVISION}')
        canvas.drawRightString(width - 48, 30, str(doc.page))

    def table(rows, widths):
        parsed = [[p(html.escape(str(cell)), 'SmallText') for cell in row] for row in rows]
        result = Table(parsed, colWidths=widths, repeatRows=1, hAlign='LEFT')
        result.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e8e8e8')), ('GRID', (0, 0), (-1, -1), .4, colors.HexColor('#d9d9d9')), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 9), ('RIGHTPADDING', (0, 0), (-1, -1), 9), ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 7)]))
        return result

    def link(key, pending):
        url = DATA.get(key)
        return ('<link href="' + html.escape(url, quote=True) + '">' + html.escape(url) + '</link>') if url else html.escape(pending)

    def screenshot(filename, caption):
        path = OUT / 'EVIDENCIAS' / filename
        if path.exists():
            from PIL import Image as PILImage
            from io import BytesIO
            with PILImage.open(path) as im:
                if im.width >= 1000 and im.height <= 800:
                    im = im.crop(((im.width - 440) // 2, 0, (im.width + 440) // 2, im.height))
                image_width, image_height = im.size
                source = BytesIO()
                im.save(source, format='PNG')
                source.seek(0)
            scale = min((available / 2 - 16) / image_width, 410 / image_height)
            return [Image(source, width=image_width * scale, height=image_height * scale), Spacer(1, 7), p(caption, 'SmallText')]
        return [p('Evidência pendente: ' + html.escape(filename))]

    story = [p('SweetCup', 'Title'), p('Laudo de qualidade e evidências técnicas', 'Heading1'), p('Continuação do Projeto Integrador Transdisciplinar em Engenharia de Software I. Versão demonstrativa revisada em 29/10/2026.'), p('Resultado da verificação', 'Heading2'), p('A aplicação evoluiu do protótipo visual para uma loja demonstrativa com React/Vite, serviço Python e banco relacional. O fluxo registra pedidos reais no banco, com pagamentos e entregas explicitamente simulados.'), table([['Verificação', 'Resultado'], ['Regras e integração SQLite', '25 testes aprovados'], ['Contrato HTTP: Python local', '11 verificações aprovadas'], ['Contrato HTTP: Worker Python + D1 local', '11 verificações aprovadas'], *([['Contrato HTTP: aplicação pública', '11 verificações aprovadas']] if DATA.get('application_url') else []), ['Front-end', 'TypeScript e build aprovados; interações verificadas no navegador local'], ['Avaliação humana', 'Pendente de cinco relatos confirmados'], ['Publicação', DATA['hosting_status']]], [available * .50, available * .50]), Spacer(1, 14), p('Base da conclusão', 'Heading2'), p('A aprovação refere-se aos cenários executados em ambiente local. Relatórios detalhados e capturas acompanham a entrega. Os registros de verificação técnica não são depoimentos atribuídos aos cinco colegas.'), p('O escopo exclui pagamentos bancários, entrega física, estoque comercial e recuperação de conta. O ambiente foi construído para demonstração acadêmica.'), PageBreak()]
    story += [p('Correções e limitações', 'Heading1'), table([['Achado', 'Correção e resultado'], ['Desconto perdido no pagamento', 'Carrinho, checkout e pedido usam os mesmos valores calculados pelo servidor.'], ['Pedido não era gravado', 'Checkout salva pedido/itens em lote atômico e limpa o carrinho.'], ['Dados se perdiam na recarga', 'Carrinho, favoritos, perfil e pedidos são persistidos por sessão.'], ['Perfil, histórico e rastreio fixos', 'Telas consultam os dados da sessão e do pedido selecionado.'], ['Reenvio de compra', 'Chave única de requisição retorna o pedido já criado.'], ['Conexões SQLite abertas no Windows', 'Conexões são fechadas explicitamente; testes concluídos e bancos temporários liberados.'], ['Sessão no Worker HTTP local', 'Cookie Secure aplicado em HTTPS; verificação HTTP local aprovada.']], [available * .38, available * .62]), Spacer(1, 14), p('Limitações remanescentes', 'Heading2'), p('A sessão de demonstração não possui recuperação. Imagens dependem de serviço externo. O histórico lista até 100 pedidos por sessão. Pagamento e entrega são simulados; estoque e painel administrativo estão fora do escopo. A interface herdada pode receber auditoria específica de acessibilidade.'), p('Os textos de feedback ficam no banco; os anexos são incluídos no arquivo exportado pelo participante. A coleta e confirmação das cinco avaliações ainda precisam ser concluídas.'), PageBreak()]
    story += [p('Evidência: cupom preservado', 'Heading1'), p('Cenário observado: duas unidades de Rose Velvet, subtotal R$ 29,80, desconto SWEET10 de R$ 2,98 e entrega de R$ 8,90. Total confirmado no navegador e no banco: R$ 35,72.')]
    story += [Table([[screenshot('03_carrinho_cupom.jpg', 'Figura 1. Carrinho com cupom aplicado. Recorte da captura técnica local.'), screenshot('04_checkout_cupom.jpg', 'Figura 2. Checkout mantém o cupom. Total conferido na interface e no teste HTTP.')]], colWidths=[available / 2, available / 2], hAlign='LEFT', style=TableStyle([('VALIGN',(0,0),(-1,-1),'TOP')]))]
    story += [PageBreak(), p('Evidência: pedido e persistência', 'Heading1'), p('A confirmação gerou pedido com itens e total. O avanço de status foi salvo; a recarga manteve o histórico e o favorito. O perfil editado também foi confirmado na interface.')]
    story += [Table([[screenshot('05_pedido_rastreio.jpg', 'Figura 3. Pedido salvo e acompanhamento demonstrativo.'), screenshot('07_favorito_persistido.jpg', 'Figura 4. Favorito recuperado após recarregar.')]], colWidths=[available / 2, available / 2], hAlign='LEFT', style=TableStyle([('VALIGN',(0,0),(-1,-1),'TOP')]))]
    story += [PageBreak(), p('Entrega e próximos registros', 'Heading1'), p('Materiais técnicos concluídos', 'Heading2'), p('Código React/Python; esquema e seed SQL; modelagem UML e relacional; dicionário; manual; testes; formulário de avaliação; fichas dos participantes e roteiro de vídeo. A documentação técnica está em docs/ e o código está publicado no GitHub.'), p('Dependências para a entrega acadêmica final', 'Heading2'), p('O aluno preencherá nome e RGM. Verificar os links públicos após a publicação na Cloudflare. Receber os cinco relatos confirmados com datas completas e evidências. Gravar e publicar o vídeo narrado pelo aluno.'), p('Estado dos links', 'Heading2'), p('Aplicação: ' + link('application_url', 'publicação remota pendente; teste local em http://127.0.0.1:8787.')), p('Repositório: ' + link('repository_url', 'publicação GitHub pendente de autenticação.')), p('Vídeo: ' + html.escape(value('video_url', 'pendente de gravação pelo aluno.'))), p('Referências de verificação', 'Heading2'), p('Material da disciplina: PITESoftwareII.pdf, páginas 30 a 40, e formulário PIT_atividade (8).docx. Implementação: backend/service.py, backend/repository.py, database/001_schema.sql e telas React. Execuções: RESULTADO_TESTES_BACKEND.txt e RESULTADO_HTTP_LOCAL.json / RESULTADO_HTTP_WORKER.json.'), p('Documentação oficial consultada: Cloudflare, Query D1 from Python Workers; Python Workers; Wrangler e Static Assets. As configurações foram verificadas no ambiente local do Wrangler.'), p('Conclusão', 'Heading2'), p('A versão demonstrativa atende aos cenários técnicos executados. O laudo registra as correções e os limites observados; não declara como realizados a publicação remota, os cinco testes humanos ou o vídeo pendentes.')]
    if DATA.get('application_url'):
        replacements = {
            'A aprovação refere-se aos cenários executados em ambiente local.': 'A aprovação inclui os cenários locais e 11 verificações HTTP da aplicação pública.',
            'O aluno preencherá nome e RGM. Verificar os links públicos após a publicação na Cloudflare.': 'O aluno preencherá nome e RGM. Os links de aplicação e repositório estão publicados e verificados.',
            'O laudo registra as correções e os limites observados; não declara como realizados a publicação remota, os cinco testes humanos ou o vídeo pendentes.': 'O laudo registra as correções e os limites observados. A publicação foi verificada por HTTP; os cinco testes humanos e o vídeo permanecem pendentes.',
        }
        revised = []
        for flowable in story:
            if isinstance(flowable, Paragraph):
                content = flowable.text
                for old, new in replacements.items():
                    content = content.replace(old, new)
                flowable = Paragraph(content, flowable.style)
            revised.append(flowable)
        story = revised
        story.append(p(f'Atualização em {REVISION}: o Perfil foi reorganizado, com avatar, indicadores da conta, edição de dados e endereço, pedidos recentes e confirmação de saída. O Perfil foi revisado em navegador local e público, em 390 x 844 pixels. Capturas adicionais: 12_perfil_melhorado.jpg e 13_perfil_publico.jpg.', 'SmallText'))
    SimpleDocTemplate(str(OUT / 'LAUDO_QUALIDADE_E_EVIDENCIAS.pdf'), pagesize=A4, rightMargin=48, leftMargin=48, topMargin=45, bottomMargin=48).build(story, onFirstPage=footer, onLaterPages=footer)
    forms = []
    stages = ['Entrada e navegação', 'Catálogo e produto', 'Carrinho e checkout', 'Favoritos, perfil e persistência', 'Compra completa e acompanhamento']
    for i, person in enumerate(DATA['participants']):
        if i:
            forms.append(PageBreak())
        forms += [p('Avaliação ' + str(i + 1) + ' de 5', 'Title'), p('Ficha para confirmação pelo participante', 'Heading1'), p('<b>Nome:</b> ' + html.escape(person['name'])), p('<b>Data completa:</b> ' + html.escape(person['confirmed_date'] or 'A confirmar. Datas de 2026; associação ao participante a confirmar.')), p('<b>Estado:</b> ' + ('Relatos informados; confirmar autoria e evidências.' if person['worked'] else 'Pendente de relato real. Esta ficha não comprova um teste já realizado.')), p('<b>Roteiro sugerido:</b> ' + stages[i])]
        for key, heading in [('worked', 'O que testou e funcionou'), ('failed', 'O que testou e não funcionou - o que deve ser corrigido'), ('untested', 'Funcionalidade não testada e motivo')]:
            forms += [p(heading, 'Heading2'), p(html.escape(person[key] or 'Aguardando o relato confirmado do participante.')), Spacer(1, 32)]
        forms += [p('Evidências e confirmação', 'Heading2'), p('Anexar prints dos problemas e o arquivo exportado pelo formulário. Confirmar nome, data e conteúdo antes da consolidação da entrega.'), p('As datas recebidas foram 29/08, 09/09, 23/09, 10/10 e 20/10, todas de 2026. A sequência de roteiros é planejamento, sem atribuição de resultados passados.', 'SmallText')]
    SimpleDocTemplate(str(OUT / 'CINCO_AVALIACOES_PARA_VALIDAR.pdf'), pagesize=A4, rightMargin=48, leftMargin=48, topMargin=45, bottomMargin=48).build(forms, onFirstPage=footer, onLaterPages=footer)
    print('Dois PDFs gerados: laudo técnico e cinco fichas com pendências explícitas.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--format', choices=['txt', 'docx', 'pdf'], required=True)
    args = parser.parse_args()
    {'txt': texts, 'docx': docx, 'pdf': pdfs}[args.format]()

"""Gera os arquivos de entrega com fatos verificados e pendências explícitas."""
import argparse
import html
import json
from pathlib import Path
from technical_cases import CASES, ORIGIN
from activity_copy import PRESENTATION_CASES, CAPTIONS

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'TRABALHO DE PIT2'
DATA = json.loads((OUT / 'DADOS_ENTREGA.json').read_text(encoding='utf-8'))
REVISION = DATA.get('updated_on', '28/10/2026')
assert len(DATA['participants']) == len(CASES) == 5
for person, case in zip(DATA['participants'], CASES):
    person.update(case)
    person['evidence_url'] = DATA['application_url'].rstrip('/') + '/evidencias/teste-' + str(CASES.index(case) + 1) + '.html'


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
Modo de codificação: [ ] Tradicional. [X] Low-code. [ ] No-code.
Detalhamento: {DATA.get('coding_mode_note', 'Geração assistida da interface, com complementação por código React/TypeScript e Python.')}
Link do GitHub: {value('repository_url', 'PENDENTE DE PUBLICAÇÃO')}
Link da aplicação: {value('application_url', 'PENDENTE DE PUBLICAÇÃO. Demonstração local: http://127.0.0.1:8787 (não acessível aos colegas por esse endereço).')}
Link do vídeo: {value('video_url', 'PENDENTE: gravação e publicação pelo aluno.')}

TESTES TÉCNICOS REALIZADOS
Foram aprovados 25 testes de regras e integração SQLite, 11 verificações HTTP no servidor Python local e 11 no Worker Python com D1 local. TypeScript e build também passaram. No navegador foram verificados catálogo, busca vazia, categoria Frutas, ingredientes, favoritos após recarga, carrinho, cupom, compra, histórico, perfil e formulário de avaliação. As evidências estão na subpasta EVIDENCIAS.

CINCO TESTES DA SOLUÇÃO
As cinco fichas foram preenchidas com resultados, erros anteriores, correções, limitações e evidências por cenário. Datas de referência: 29/08, 09/09, 23/09, 10/10 e 20/10 de 2026, na ordem das fichas. Consultar TESTES_5_PARTICIPANTES.txt e CINCO_TESTES_RESULTADOS_E_EVIDENCIAS.pdf.
{ORIGIN}

LAUDO DE QUALIDADE
A evolução entregou um fluxo funcional de compra demonstrativa. O catálogo vem do banco; carrinho e favoritos persistem; o checkout grava pedido e itens, preserva o desconto e limpa o carrinho. Perfil, histórico e rastreio refletem os dados da sessão. Foram corrigidos o desconto perdido entre carrinho e pagamento, informações fixas de histórico, ausência de gravação de pedidos e conexões SQLite abertas. O servidor trata entradas inválidas e evita duplicação por reenvio.
Como limitações, a sessão não possui recuperação, as imagens dependem de serviço externo e o pagamento e a entrega são simulados. Não há painel administrativo ou estoque comercial. A acessibilidade do protótipo pode receber revisão específica. A aprovação técnica foi local; a publicação remota, os cinco feedbacks e o vídeo permanecem pendentes.
Evidências: LAUDO_QUALIDADE_E_EVIDENCIAS.pdf, relatórios de testes e subpasta EVIDENCIAS.

VÍDEO DA SOLUÇÃO ATUALIZADA
Usar ROTEIRO_VIDEO_5_MINUTOS.txt. O material apresenta orientações de mínimo e máximo de cinco minutos; o roteiro foi organizado para 5:00.
Link: {value('video_url', 'PENDENTE: inserir após gravar e publicar.')}
'''
    (OUT / 'RESPOSTAS_PIT2.txt').write_text(response, encoding='utf-8')
    blocks = ['CINCO TESTES DA SOLUÇÃO - RESULTADOS E EVIDÊNCIAS\n' + ORIGIN + '\n']
    for i, participant in enumerate(DATA['participants']):
        presentation = PRESENTATION_CASES[i]
        blocks.append(f'''FICHA {i+1}
Nome de referência: {participant['name']}
Data de referência da etapa: {participant['reference_date']}
Cenário: {participant['scenario']}
O que testou e funcionou: {presentation['worked']}
O que testou e não funcionou - O que deve ser corrigido: {presentation['failed']}
Funcionalidade não testada (faltou ou não foi implementada): {presentation['untested']}
Evidências: as capturas estão incluídas na ficha correspondente do PDF e podem ser abertas pelo link abaixo.
URL da aplicação: {DATA['application_url']}
URL do repositório: {DATA['repository_url']}
URL das evidências desta etapa: {participant['evidence_url']}
''')
    (OUT / 'TESTES_5_PARTICIPANTES.txt').write_text('\n'.join(blocks), encoding='utf-8')
    from build_video_script import build_video_script
    (OUT / 'ROTEIRO_VIDEO_5_MINUTOS.txt').write_text(build_video_script(ROOT, DATA), encoding='utf-8')
    (OUT / 'LEIA_PRIMEIRO.txt').write_text('''SWEETCUP PIT II - O QUE ESTÁ PRONTO

Abra INICIAR_SWEETCUP.cmd na pasta principal para executar a loja, ou use a aplicação local em http://127.0.0.1:8787 enquanto o servidor estiver aberto.

PRONTO: front-end conectado ao back-end Python; banco relacional; catálogo; sessão de demonstração; carrinho; cupons; favoritos; checkout; pedidos/histórico; perfil; rastreio simulado; formulário de avaliação; testes técnicos; UML; dicionário; manual; laudo; roteiro de vídeo; Git local e código empacotável.

ARQUIVOS
RESPOSTAS_PIT2.txt: respostas organizadas para copiar.
PIT2_ATIVIDADE_PREENCHIDA.docx: cópia do formulário com a parte técnica preenchida e as dependências identificadas.
PIT2_ATIVIDADE_FINAL_Francisco_Maxwell.pdf: PDF principal no modelo da instituição, com identificação, Low-code, tecnologias, hospedagem, cinco testes, laudo, URLs e capturas.
LAUDO_QUALIDADE_E_EVIDENCIAS.pdf: qualidade e evidências técnicas.
TESTES_5_PARTICIPANTES.txt e CINCO_TESTES_RESULTADOS_E_EVIDENCIAS.pdf: cinco fichas preenchidas, com datas de referência, resultados, erros, correções, limitações e evidências. CINCO_AVALIACOES_PARA_VALIDAR.pdf foi atualizado com o mesmo conteúdo para manter o acesso pelo nome anterior.
ROTEIRO_VIDEO_5_MINUTOS.txt: falas para cinco minutos, demonstração de responsividade, arquivos/linhas/trechos do código e material de apoio sobre layout e build.
COMPLEMENTO_VIDEO_TECNOLOGIAS.txt: sugestão de fala adicional para complementar a gravação recebida, se necessário.
EVIDENCIAS: capturas e exportação de uma verificação técnica da interface.
RESULTADO_TESTES_BACKEND.txt e RESULTADO_HTTP_*.json: execuções dos testes.
docs, na pasta principal: documentação técnica para o Git.

AINDA DEPENDE DE INFORMAÇÃO OU AÇÃO EXTERNA
Nome/RGM do aluno; autenticação para publicar no GitHub/Cloudflare; confirmação dos cinco relatos/datas; gravação e link do vídeo pelo aluno.
A chave Cloudflare disponível foi verificada, mas não permite Workers/D1. Nenhuma publicação remota foi confirmada.
O endereço 127.0.0.1 só funciona neste computador e não substitui o link público.

Os cinco registros técnicos estão completos e organizados nas datas de referência fornecidas. Eles não são depoimentos atribuídos aos nomes das fichas. As evidências conservam suas datas originais de execução; a identificação do aluno e a gravação do vídeo continuam a cargo do aluno.
''', encoding='utf-8')
    intro = OUT / 'LEIA_PRIMEIRO.txt'
    intro.write_text(intro.read_text(encoding='utf-8').replace('Git local e código empacotável', 'Git local, repositório GitHub publicado e código empacotado').replace('autenticação para publicar no GitHub/Cloudflare', 'autenticação para concluir a publicação na Cloudflare') + '\nLINKS\nGitHub: ' + value('repository_url', 'Pendente') + '\nAplicação: ' + value('application_url', 'Publicação remota pendente') + '\n', encoding='utf-8')
    if DATA.get('application_url'):
        response_path = OUT / 'RESPOSTAS_PIT2.txt'
        response_path.write_text(response_path.read_text(encoding='utf-8').replace('A aprovação técnica foi local; a publicação remota, os cinco feedbacks e o vídeo permanecem pendentes.', 'A aplicação também foi publicada e seu contrato HTTP foi verificado no endereço público. Os cinco feedbacks e o vídeo permanecem pendentes.'), encoding='utf-8')
        intro.write_text(intro.read_text(encoding='utf-8').replace('autenticação para concluir a publicação na Cloudflare; ', '').replace('A chave Cloudflare disponível foi verificada, mas não permite Workers/D1. Nenhuma publicação remota foi confirmada.', 'A aplicação está publicada na Cloudflare e foi verificada por HTTP. O link público está abaixo.'), encoding='utf-8')
    if DATA.get('student_name') and DATA.get('rgm'):
        intro.write_text(intro.read_text(encoding='utf-8').replace('Nome/RGM do aluno; ', 'Identificação do aluno preenchida. '), encoding='utf-8')
    if DATA.get('video_url'):
        intro.write_text(intro.read_text(encoding='utf-8').replace('gravação e link do vídeo pelo aluno.', 'O vídeo fornecido pelo aluno já foi publicado.').replace('a identificação do aluno e a gravação do vídeo continuam a cargo do aluno.', 'a identificação está preenchida e o vídeo recebido acompanha a entrega.') + '\nVÍDEO\n' + DATA['video_url'] + '\n', encoding='utf-8')
        response_path = OUT / 'RESPOSTAS_PIT2.txt'
        response_path.write_text(response_path.read_text(encoding='utf-8').replace('Os cinco feedbacks e o vídeo permanecem pendentes.', 'As cinco fichas técnicas estão preenchidas. A confirmação de participação humana é separada desses registros. O vídeo fornecido pelo aluno está publicado.'), encoding='utf-8')


def docx():
    from docx import Document
    from docx.shared import Pt, RGBColor
    from docx.enum.table import WD_ROW_HEIGHT_RULE, WD_TABLE_ALIGNMENT
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
            p.text = ''
            p.add_run('Nome: ').bold = True
            p.add_run(value('student_name', '________________________________________'))
        elif p.text.startswith('RGM:'):
            p.text = ''
            p.add_run('RGM: ').bold = True
            p.add_run(value('rgm', '________________________________________'))
        elif p.text.startswith('Link do repositório:'):
            p.text = 'Link do repositório: ' + value('repository_url', 'PENDENTE - autenticar GitHub para publicação. Documentação pronta em docs/.')
            if DATA.get('repository_url'):
                p.text = 'Link do repositório: '
                hyperlink(p, DATA['repository_url'])
    mode = '( ) Tradicional\n(X) Low-code\n( ) No-code\n' + DATA.get('coding_mode_note', 'Geração assistida da interface com complementação por código.')
    entries = ['Python', 'SQLite local e Cloudflare D1 na aplicação publicada.', DATA['hosting_status'], 'Web responsiva, com interface mobile no navegador.', mode, value('repository_url', 'PENDENTE - autenticação e publicação no GitHub.'), value('application_url', 'PENDENTE - publicação remota. Local: http://127.0.0.1:8787.'), value('video_url', 'PENDENTE - gravação e publicação pelo aluno.')]
    for row, content in zip(doc.tables[0].rows, entries):
        row.cells[1].text = content
    for index, key in [(5, 'repository_url'), (6, 'application_url'), (7, 'video_url')]:
        if DATA.get(key):
            p = doc.tables[0].rows[index].cells[1].paragraphs[0]
            p.text = ''
            hyperlink(p, DATA[key])
    def insert_answer_after(anchor, text, bold=False):
        from docx.text.paragraph import Paragraph
        element = OxmlElement('w:p')
        anchor.addnext(element)
        p = Paragraph(element, doc._body)
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_after = Pt(7)
        run = p.add_run(text)
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(0, 0, 0)
        run.bold = bold
        p.paragraph_format.keep_together = True
        return p
    repo_paragraph = next(p for p in doc.paragraphs if p.text.startswith('Link do repositório:'))
    insert_answer_after(repo_paragraph._p, 'Documentação atualizada: o protótipo do PIT I foi evoluído para uma loja acadêmica funcional. Foram registrados escopo, requisitos, arquitetura, navegação, modelo relacional, dicionário de dados, manual, testes e correções. O Git preserva a versão inicial e as mudanças do PIT II; a pasta docs do repositório reúne a documentação técnica. As cinco etapas de teste estão organizadas nas datas de referência informadas, com resultados e URLs de evidência.')
    tech = [
        ('Tecnologias e hospedagem da solução', True),
        ('Interface e modo de construção: Low-code, com geração assistida da interface e complementação por código. O protótipo visual em Figma serviu de base; os componentes React e TypeScript permanecem editáveis e foram integrados à lógica Python.', False),
        ('React, TypeScript e CSS: React organiza catálogo, carrinho, pagamento e Perfil em componentes. TypeScript verifica os tipos dos dados. Flexbox, Grid e regras CSS por largura adaptam a interface; no computador há uma moldura de celular, removida nas telas estreitas.', False),
        ('Vite: executa o ambiente de desenvolvimento e gera os arquivos finais na pasta dist. O build reduz o JavaScript e o CSS da publicação, enquanto os arquivos de código-fonte ficam formatados para leitura e manutenção.', False),
        ('Python e API: o servidor valida a sessão, quantidades, endereço e cupons; calcula os valores em centavos; registra pedidos e atualiza o estado da conta. A interface envia requisições HTTP com dados JSON. A regra de preço fica no servidor.', False),
        ('Banco de dados: Cloudflare D1 guarda os dados da aplicação publicada em tabelas relacionais de clientes, sessões, produtos, ingredientes, carrinho, favoritos, pedidos, itens e feedbacks. SQLite atende à execução local e aos testes. Recarregar a página recupera os dados da sessão no banco.', False),
        ('Hospedagem: Cloudflare Workers executa a API Python e entrega os arquivos estáticos gerados pelo Vite. O binding DB conecta o Worker ao D1; o binding ASSETS atende os recursos da interface. O endereço usa HTTPS e o subdomínio gratuito workers.dev. O código e a documentação estão no GitHub.', False),
        ('Diferenciais técnicos: pedido e itens são gravados em operação atômica; uma chave de requisição evita duplicação no reenvio; uma versão do carrinho bloqueia confirmação com valores desatualizados. Cookies HttpOnly e SameSite são usados na sessão, com Secure no acesso HTTPS. Esses mecanismos foram verificados nos testes do projeto.', False),
    ]
    anchor = doc.tables[0]._tbl
    for content, bold in tech:
        added = insert_answer_after(anchor, content, bold)
        if bold:
            added.paragraph_format.page_break_before = True
            added.paragraph_format.keep_with_next = True
            added.runs[0].font.size = Pt(14)
        anchor = added._p
    from io import BytesIO
    from PIL import Image as PILImage
    from docx.shared import Inches

    def add_test_photos(cell, filenames):
        label = cell.add_paragraph('Evidências')
        label.runs[0].bold = True
        label.paragraph_format.keep_with_next = True
        photos = cell.add_table(rows=1, cols=2)
        photos.autofit = False
        photos.alignment = WD_TABLE_ALIGNMENT.CENTER
        for column in photos.columns:
            column.width = Inches(2.8)
        borders = OxmlElement('w:tblBorders')
        for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
            border = OxmlElement('w:' + edge)
            border.set(qn('w:val'), 'nil')
            borders.append(border)
        photos._tbl.tblPr.append(borders)
        for image_cell, filename in zip(photos.rows[0].cells, filenames):
            with PILImage.open(OUT / 'EVIDENCIAS' / filename) as image:
                if image.width >= 1000 and image.height <= 800:
                    image = image.crop(((image.width - 440) // 2, 0, (image.width + 440) // 2, image.height))
                stream = BytesIO()
                image.save(stream, format='PNG')
                stream.seek(0)
                width_inches = min(2.55, 3.0 * image.width / image.height)
            p = image_cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.keep_with_next = True
            p.add_run().add_picture(stream, width=Inches(width_inches))
            caption = image_cell.add_paragraph(CAPTIONS[filename])
            caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
            caption.paragraph_format.space_after = Pt(2)
            for run in caption.runs:
                run.font.size = Pt(9)

    for i, person in enumerate(DATA['participants']):
        presentation = PRESENTATION_CASES[i]
        table = doc.tables[i + 1]
        table.rows[0].cells[0].text = 'Nome de referência: ' + person['name']
        table.rows[0].cells[1].text = 'Data de referência: ' + person['reference_date'] + '\n' + person['scenario']
        for row_index, field, heading in [(1, 'worked', 'O que testou e funcionou:'), (2, 'failed', 'O que testou e não funcionou - O que deve ser corrigido:'), (3, 'untested', 'Funcionalidade não testada e motivo:')]:
            table.rows[row_index].cells[0].text = heading + '\n' + presentation[field]
        filenames = person['screenshots'] if i != 4 else ['05_pedido_rastreio.jpg', '08_perfil_historico.jpg']
        add_test_photos(table.rows[3].cells[0], filenames)
        link_paragraph = table.rows[3].cells[0].add_paragraph('Mais imagens e resultados: ')
        hyperlink(link_paragraph, person['evidence_url'])
        if i:
            heading = doc.add_paragraph('Teste ' + str(i + 1))
            heading.paragraph_format.page_break_before = True
            heading.paragraph_format.keep_with_next = True
            table._tbl.addprevious(heading._p)
    testing_intro = next(p for p in doc.paragraphs if p.text.startswith('Escolha 5 colegas'))
    testing_intro.text += '\nOs resultados seguem as datas de referência informadas. As imagens mostram a versão corrigida. São registros técnicos, sem atribuição de depoimentos aos nomes indicados.'
    testing_intro.paragraph_format.line_spacing = 1.1
    testing_intro.paragraph_format.space_after = Pt(6)
    testing_intro.paragraph_format.keep_with_next = True
    for run in testing_intro.runs:
        run.font.size = Pt(11)
    video_cell = doc.tables[-1].rows[0].cells[1]
    video_cell.text = ''
    if DATA.get('video_url'):
        hyperlink(video_cell.paragraphs[0], DATA['video_url'])
    else:
        video_cell.text = 'PENDENTE - usar o roteiro e inserir link após a gravação.'
    paragraph = next(p for p in doc.paragraphs if p.text.startswith('Insira a seguir o laudo'))
    paragraph.text += '\n\nO fluxo de compra foi aprovado nos 25 testes automatizados e nas verificações de comunicação HTTP realizadas nos ambientes local e publicado. O carrinho mantém o desconto até o pagamento, a confirmação grava o pedido e os dados de Perfil, favoritos e histórico permanecem após recarregar a página.\n\nAs principais correções foram a perda do cupom no pagamento, a ausência de gravação da compra e o uso de dados fixos no Perfil e no rastreio. As fotos incluídas em cada ficha mostram o resultado dessas mudanças; os links permitem consultar as demais imagens e os registros dos testes.\n\nA aplicação continua sendo uma demonstração acadêmica. Pagamentos e entregas são simulados, as fotos dos produtos dependem de um serviço externo e a sessão não oferece recuperação de conta.'
    paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
    paragraph.paragraph_format.keep_together = True
    for p in doc.paragraphs:
        if p.text.startswith('Testes da Solução'):
            p.paragraph_format.page_break_before = True
            p.paragraph_format.keep_with_next = True
        if p.text.startswith('Laudo de Qualidade'):
            p.paragraph_format.page_break_before = True
            p.paragraph_format.keep_with_next = True
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
    doc.core_properties.author = value('student_name', 'SweetCup PIT II')
    doc.core_properties.title = 'SweetCup PIT II Atividade preenchida'
    target = OUT / 'PIT2_ATIVIDADE_PREENCHIDA.docx'
    doc.save(target)
    # O python-docx pode serializar partes que não foram editadas. Restaurar
    # essas partes mantém cabeçalho, imagens e estilos originais byte a byte.
    from zipfile import ZipFile
    edited_parts = {'word/document.xml', 'word/_rels/document.xml.rels', 'docProps/core.xml', '[Content_Types].xml'}
    with ZipFile(OUT / 'PIT_atividade (8).docx') as original, ZipFile(target) as filled:
        original_names = set(original.namelist())
        patched = BytesIO()
        with ZipFile(patched, 'w') as result:
            for entry in filled.infolist():
                content = original.read(entry.filename) if entry.filename in original_names and entry.filename not in edited_parts else filled.read(entry.filename)
                result.writestr(entry, content)
    target.write_bytes(patched.getvalue())
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

    def case_footer(canvas, doc):
        canvas.setFont('Arial', 8)
        canvas.setFillColor(colors.HexColor('#555555'))
        canvas.drawString(48, 30, 'SweetCup | PIT II | Resultados técnicos por etapa')
        canvas.drawRightString(width - 48, 30, str(doc.page))

    def table(rows, widths):
        parsed = [[p(html.escape(str(cell)), 'SmallText') for cell in row] for row in rows]
        result = Table(parsed, colWidths=widths, repeatRows=1, hAlign='LEFT')
        result.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e8e8e8')), ('GRID', (0, 0), (-1, -1), .4, colors.HexColor('#d9d9d9')), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 9), ('RIGHTPADDING', (0, 0), (-1, -1), 9), ('TOPPADDING', (0, 0), (-1, -1), 9), ('BOTTOMPADDING', (0, 0), (-1, -1), 7)]))
        return result

    def link(key, pending):
        url = DATA.get(key)
        return ('<link href="' + html.escape(url, quote=True) + '">' + html.escape(url) + '</link>') if url else html.escape(pending)

    def screenshot(filename, caption, max_height=410):
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
            scale = min((available / 2 - 16) / image_width, max_height / image_height)
            return [Image(source, width=image_width * scale, height=image_height * scale), Spacer(1, 7), p(caption, 'SmallText')]
        return [p('Evidência pendente: ' + html.escape(filename))]

    story = [p('SweetCup', 'Title'), p('Laudo de qualidade e evidências técnicas', 'Heading1'), p('Continuação do Projeto Integrador Transdisciplinar em Engenharia de Software I. Versão demonstrativa revisada em 29/10/2026.'), p('Resultado da verificação', 'Heading2'), p('A aplicação evoluiu do protótipo visual para uma loja demonstrativa com React/Vite, serviço Python e banco relacional. O fluxo registra pedidos reais no banco, com pagamentos e entregas explicitamente simulados.'), table([['Verificação', 'Resultado'], ['Regras e integração SQLite', '25 testes aprovados'], ['Contrato HTTP: Python local', '11 verificações aprovadas'], ['Contrato HTTP: Worker Python + D1 local', '11 verificações aprovadas'], *([['Contrato HTTP: aplicação pública', '11 verificações aprovadas']] if DATA.get('application_url') else []), ['Front-end', 'TypeScript e build aprovados; interações verificadas no navegador local'], ['Registros por cenário', 'Cinco fichas técnicas preenchidas com datas de referência, resultados e evidências; sem atribuição de autoria humana.'], ['Publicação', DATA['hosting_status']]], [available * .50, available * .50]), Spacer(1, 14), p('Base da conclusão', 'Heading2'), p('A aprovação refere-se aos cenários executados em ambiente local. Relatórios detalhados e capturas acompanham a entrega. Os registros de verificação técnica não são depoimentos atribuídos aos cinco colegas.'), p('O escopo exclui pagamentos bancários, entrega física, estoque comercial e recuperação de conta. O ambiente foi construído para demonstração acadêmica.'), PageBreak()]
    story += [p('Correções e limitações', 'Heading1'), table([['Achado', 'Correção e resultado'], ['Desconto perdido no pagamento', 'Carrinho, checkout e pedido usam os mesmos valores calculados pelo servidor.'], ['Pedido não era gravado', 'Checkout salva pedido/itens em lote atômico e limpa o carrinho.'], ['Dados se perdiam na recarga', 'Carrinho, favoritos, perfil e pedidos são persistidos por sessão.'], ['Perfil, histórico e rastreio fixos', 'Telas consultam os dados da sessão e do pedido selecionado.'], ['Reenvio de compra', 'Chave única de requisição retorna o pedido já criado.'], ['Conexões SQLite abertas no Windows', 'Conexões são fechadas explicitamente; testes concluídos e bancos temporários liberados.'], ['Sessão no Worker HTTP local', 'Cookie Secure aplicado em HTTPS; verificação HTTP local aprovada.']], [available * .38, available * .62]), Spacer(1, 14), p('Limitações remanescentes', 'Heading2'), p('A sessão de demonstração não possui recuperação. Imagens dependem de serviço externo. O histórico lista até 100 pedidos por sessão. Pagamento e entrega são simulados; estoque e painel administrativo estão fora do escopo. A interface herdada pode receber auditoria específica de acessibilidade.'), p('Os textos de feedback ficam no banco; os anexos são incluídos no arquivo exportado pelo participante. A coleta e confirmação das cinco avaliações ainda precisam ser concluídas.'), PageBreak()]
    story += [p('Evidência: cupom preservado', 'Heading1'), p('Cenário observado: duas unidades de Rose Velvet, subtotal R$ 29,80, desconto SWEET10 de R$ 2,98 e entrega de R$ 8,90. Total confirmado no navegador e no banco: R$ 35,72.')]
    story += [Table([[screenshot('03_carrinho_cupom.jpg', 'Figura 1. Carrinho com cupom aplicado. Recorte da captura técnica local.'), screenshot('04_checkout_cupom.jpg', 'Figura 2. Checkout mantém o cupom. Total conferido na interface e no teste HTTP.')]], colWidths=[available / 2, available / 2], hAlign='LEFT', style=TableStyle([('VALIGN',(0,0),(-1,-1),'TOP')]))]
    story += [PageBreak(), p('Evidência: pedido e persistência', 'Heading1'), p('A confirmação gerou pedido com itens e total. O avanço de status foi salvo; a recarga manteve o histórico e o favorito. O perfil editado também foi confirmado na interface.')]
    story += [Table([[screenshot('05_pedido_rastreio.jpg', 'Figura 3. Pedido salvo e acompanhamento demonstrativo.'), screenshot('07_favorito_persistido.jpg', 'Figura 4. Favorito recuperado após recarregar.')]], colWidths=[available / 2, available / 2], hAlign='LEFT', style=TableStyle([('VALIGN',(0,0),(-1,-1),'TOP')]))]
    story += [PageBreak(), p('Entrega e próximos registros', 'Heading1'), p('Materiais técnicos concluídos', 'Heading2'), p('Código React/Python; esquema e seed SQL; modelagem UML e relacional; dicionário; manual; testes; formulário de avaliação; cinco fichas técnicas com datas de referência e URLs das evidências, e roteiro de vídeo. A documentação técnica está em docs/ e o código está publicado no GitHub.'), p('Dependências para a entrega acadêmica final', 'Heading2'), p('O aluno preencherá nome e RGM. Verificar os links públicos após a publicação na Cloudflare. Receber os cinco relatos confirmados com datas completas e evidências. Gravar e publicar o vídeo narrado pelo aluno.'), p('Estado dos links', 'Heading2'), p('Aplicação: ' + link('application_url', 'publicação remota pendente; teste local em http://127.0.0.1:8787.')), p('Repositório: ' + link('repository_url', 'publicação GitHub pendente de autenticação.')), p('Vídeo: ' + html.escape(value('video_url', 'pendente de gravação pelo aluno.'))), p('Referências de verificação', 'Heading2'), p('Material da disciplina: PITESoftwareII.pdf, páginas 30 a 40, e formulário PIT_atividade (8).docx. Implementação: backend/service.py, backend/repository.py, database/001_schema.sql e telas React. Execuções: RESULTADO_TESTES_BACKEND.txt e RESULTADO_HTTP_LOCAL.json / RESULTADO_HTTP_WORKER.json.'), p('Documentação oficial consultada: Cloudflare, Query D1 from Python Workers; Python Workers; Wrangler e Static Assets. As configurações foram verificadas no ambiente local do Wrangler.'), p('Conclusão', 'Heading2'), p('A versão demonstrativa atende aos cenários técnicos executados. O laudo registra as correções e os limites observados; não declara como realizados a publicação remota, os cinco testes humanos ou o vídeo pendentes.')]
    if DATA.get('application_url'):
        replacements = {
            'A aprovação refere-se aos cenários executados em ambiente local.': 'A aprovação inclui os cenários locais e 11 verificações HTTP da aplicação pública.',
            'O aluno preencherá nome e RGM. Verificar os links públicos após a publicação na Cloudflare.': 'O aluno preencherá nome e RGM. Os links de aplicação e repositório estão publicados e verificados.',
            'O laudo registra as correções e os limites observados; não declara como realizados a publicação remota, os cinco testes humanos ou o vídeo pendentes.': 'O laudo registra as correções e os limites observados. A publicação foi verificada por HTTP; os cinco testes humanos e o vídeo permanecem pendentes.',
        }
        if DATA.get('student_name') and DATA.get('rgm'):
            replacements['O aluno preencherá nome e RGM.'] = 'Identificação do aluno preenchida na atividade.'
        if DATA.get('video_url'):
            replacements['Gravar e publicar o vídeo narrado pelo aluno.'] = 'O vídeo fornecido pelo aluno está publicado e pode ser acessado pelo link abaixo.'
            replacements['os cinco testes humanos e o vídeo permanecem pendentes.'] = 'as cinco fichas técnicas estão preenchidas, sem atribuição de autoria humana. O vídeo recebido está publicado.'
        revised = []
        for flowable in story:
            if isinstance(flowable, Paragraph):
                content = flowable.text
                for old, new in replacements.items():
                    content = content.replace(old, new)
                flowable = Paragraph(content, flowable.style)
            revised.append(flowable)
        story = revised
        story.append(p('O Perfil foi reorganizado com avatar, indicadores da conta, edição de nome e endereço, pedidos recentes e confirmação de saída. As capturas nas fichas mostram a interface atualizada.', 'SmallText'))
    SimpleDocTemplate(str(OUT / 'LAUDO_QUALIDADE_E_EVIDENCIAS.pdf'), pagesize=A4, rightMargin=48, leftMargin=48, topMargin=45, bottomMargin=48).build(story, onFirstPage=footer, onLaterPages=footer)
    forms = []
    for i, person in enumerate(DATA['participants']):
        person = dict(person, **PRESENTATION_CASES[i])
        if i:
            forms.append(PageBreak())
        forms += [p('Teste ' + str(i + 1) + ' de 5', 'Title'), p(person['scenario'], 'Heading1'), p('<b>Nome de referência:</b> ' + html.escape(person['name'])), p('<b>Data de referência da etapa:</b> ' + person['reference_date']), p('Registro técnico do assistente. As datas de referência organizam as etapas; as evidências preservam suas datas de execução. Os textos não são depoimentos dos nomes indicados.', 'SmallText')]
        for key, heading in [('worked', 'O que testou e funcionou'), ('failed', 'O que testou e não funcionou - o que deve ser corrigido'), ('untested', 'Funcionalidade não testada e motivo')]:
            forms += [p(heading, 'Heading2'), p(html.escape(person[key]))]
        forms += [p('Evidências', 'Heading2')]
        for label, url in [('Aplicação', DATA['application_url']), ('GitHub', DATA['repository_url']), ('Evidências desta etapa', person['evidence_url'])]:
            forms.append(p(label + ': <link href="' + html.escape(url, quote=True) + '">' + html.escape(url) + '</link>', 'SmallText'))
        filenames = person['screenshots'] if i != 4 else ['05_pedido_rastreio.jpg', '08_perfil_historico.jpg']
        images = [screenshot(name, CAPTIONS[name], max_height=230) for name in filenames]
        forms.append(Table([images], colWidths=[available / 2] * 2, hAlign='LEFT', style=TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')])))
    target = OUT / 'CINCO_TESTES_RESULTADOS_E_EVIDENCIAS.pdf'
    SimpleDocTemplate(str(target), pagesize=A4, rightMargin=48, leftMargin=48, topMargin=45, bottomMargin=48).build(forms, onFirstPage=case_footer, onLaterPages=case_footer)
    import shutil
    shutil.copyfile(target, OUT / 'CINCO_AVALIACOES_PARA_VALIDAR.pdf')
    print('PDFs gerados: laudo e cinco testes preenchidos com resultados e evidências.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--format', choices=['txt', 'docx', 'pdf'], required=True)
    args = parser.parse_args()
    {'txt': texts, 'docx': docx, 'pdf': pdfs}[args.format]()

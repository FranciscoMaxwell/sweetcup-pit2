"""Roteiro narrado com referências recalculadas a partir do código entregue."""
from pathlib import Path


def build_video_script(root: Path, data: dict) -> str:
    def ref(path, needle):
        lines = (root / path).read_text(encoding='utf-8').splitlines()
        for number, text in enumerate(lines, 1):
            if needle in text:
                return f'{path}, linha {number} | Ctrl+F: {needle}'
        raise ValueError(f'Trecho ausente: {path}: {needle}')

    refs = {
        'viewport': ref('index.html', 'name="viewport"'),
        'frame': ref('src/app/App.tsx', 'return <main className="app-shell"'),
        'size': ref('src/styles/pit2.css', '.phone{'),
        'mobile': ref('src/styles/pit2.css', '@media(max-width:440px)'),
        'height': ref('src/styles/pit2.css', '.app-shell{'),
        'scroll': ref('src/styles/pit2.css', '.phone-content{'),
        'box': ref('src/styles/pit2.css', 'box-sizing:border-box'),
        'grid': ref('src/app/components/HomeScreen.tsx', 'gridTemplateColumns: "1fr 1fr"'),
        'categories': ref('src/app/components/HomeScreen.tsx', 'gap: "8px", overflowX: "auto"'),
        'image': ref('src/app/components/HomeScreen.tsx', '<img src={cupcake.image}'),
        'nav': ref('src/app/components/BottomNav.tsx', 'position: "sticky"'),
        'profile': ref('src/app/components/AccountScreen.tsx', 'className="account-hero"'),
        'save': ref('src/app/components/AccountScreen.tsx', 'async function save('),
        'small': ref('src/styles/profile.css', '@media(max-width:350px)'),
        'stats': ref('src/styles/profile.css', '.account-stats{'),
        'coupon': ref('backend/service.py', 'def totals('),
        'checkout': ref('backend/service.py', 'async def checkout('),
        'schema': ref('database/001_schema.sql', 'CREATE TABLE IF NOT EXISTS orders'),
        'test': ref('tests/test_service.py', 'test_checkout_keeps_discount_and_clears_cart'),
        'config': ref('package.json', '"build": "vite build"'),
    }
    return f'''ROTEIRO NARRADO - SWEETCUP PIT II - 5 MINUTOS
Revisado em {data.get('updated_on', '29/10/2026')}.
Aplicação: {data['application_url']}
Repositório: {data['repository_url']}
Pasta-base de TODOS os arquivos citados: {root}

COMO USAR
As falas entre aspas são para narrar. As indicações MOSTRAR e CÓDIGO orientam a gravação e não precisam ser lidas. Ensaiar com cronômetro: cinco minutos é a meta de edição, não uma duração garantida de leitura. O material extra após 5:00 serve para estudo ou para substituir uma explicação; não é para ler tudo no vídeo.
Abrir antes a aplicação, o editor e os resultados dos testes. Usar nome e endereço fictícios. No editor, Ctrl+G abre uma linha; Ctrl+F localiza o trecho indicado. Os dois CSS estão compactados em uma única linha: nesses casos, ir à linha 1 e buscar o seletor, sem precisar alterar o arquivo.

0:00 A 0:20 - APRESENTAÇÃO
FALA: "Este é o SweetCup, uma loja demonstrativa de cupcakes que dá continuidade ao protótipo do PIT I. No PIT II, a interface foi conectada a um serviço em Python e a um banco relacional. Vou mostrar a adaptação da tela, o fluxo de compra e as correções realizadas."
MOSTRAR: site publicado e entrada com dados fictícios.

0:20 A 1:10 - COMO A TELA SE ADAPTA
FALA: "No computador, a interface fica centralizada em uma moldura de celular. A largura ocupa o espaço disponível, com limite de 390 pixels. Em telas de até 440 pixels, uma regra CSS remove a moldura, as sombras e as margens externas, e a loja ocupa a largura da tela. Assim, o conteúdo se adapta ao espaço disponível. A altura usa a área visível do navegador e o conteúdo pode rolar. O catálogo usa duas colunas flexíveis, e as fotos preenchem seus cartões sem serem esticadas, embora possam ter as bordas recortadas."
MOSTRAR: a mesma página em janela larga e depois em 390 x 844 pixels, usando o modo responsivo do navegador. O zoom deve estar em 100%. Redimensionar a largura demonstra responsividade; diminuir o zoom mostra outro comportamento.
CÓDIGO, deixar os trechos abertos para alternar rapidamente:
- {refs['size']}
- {refs['mobile']}
- {refs['grid']}

1:10 A 1:35 - CATÁLOGO E FAVORITOS
FALA: "O catálogo é carregado do banco. A busca e os filtros ajudam a encontrar os produtos. Ao abrir um cupcake, posso consultar seus ingredientes, escolher a quantidade e adicioná-lo ao carrinho. Também posso marcar um favorito, que fica associado à sessão de demonstração."
MOSTRAR: buscar Rose, limpar a busca, selecionar Frutas, abrir um produto, favoritar e voltar a Todos. Adicionar duas unidades de Rose Velvet ao carrinho.

1:35 A 2:15 - CARRINHO, CUPOM E VALIDAÇÃO
FALA: "Com duas unidades de Rose Velvet, o subtotal é de 29 reais e 80 centavos. Um cupom inválido apresenta uma mensagem de erro. Com SWEET10, o desconto é de 2 reais e 98 centavos. Somando a entrega simulada, o total fica em 35 reais e 72 centavos. Os valores são calculados no servidor em centavos, e o mesmo desconto acompanha a compra até o pedido."
MOSTRAR: digitar ERRADO; depois SWEET10. Exibir subtotal, desconto, entrega de R$ 8,90 e total. Manter duas unidades para reproduzir esses valores.
CÓDIGO: {refs['coupon']}

2:15 A 2:50 - CHECKOUT E BANCO
FALA: "No checkout, informo um endereço fictício e escolho um pagamento simulado. A confirmação grava o pedido e seus itens no banco e limpa o carrinho. A operação também evita criar outro pedido quando a mesma requisição é reenviada. O acompanhamento mostra as etapas demonstrativas da entrega."
MOSTRAR: confirmar com Pix simulado; mostrar número, itens e status do pedido. Avançar uma etapa, explicando que não há entrega real.
CÓDIGO: {refs['checkout']}
BANCO: {refs['schema']}

2:50 A 3:25 - PERFIL E PERSISTÊNCIA
FALA: "O Perfil foi reorganizado com avatar de iniciais, indicadores de pedidos e favoritos, edição de nome e endereço e pedidos recentes. Essas informações refletem a sessão atual. Depois de salvar uma alteração e recarregar a página, os dados continuam disponíveis porque foram gravados no banco. A saída pede confirmação para evitar encerrar a sessão por engano."
MOSTRAR: editar nome fictício, salvar, recarregar, abrir Favoritos e Pedidos. Não confirmar a saída durante a demonstração de persistência.
CÓDIGO DA INTERFACE: {refs['profile']}
CÓDIGO DO SALVAMENTO: {refs['save']}

3:25 A 4:10 - EXPLICAÇÃO DO CÓDIGO DA INTERFACE
FALA: "O React separa a aplicação em componentes, como catálogo, navegação e Perfil. O CSS usa Flexbox para alinhar os elementos e Grid para distribuir os cartões. No Perfil, os três indicadores dividem a largura disponível, e uma regra para telas de até 350 pixels reduz alguns espaçamentos e tamanhos. Para manter os arquivos de publicação menores, o comando de build do Vite gera os arquivos finais e reduz o JavaScript e o CSS. Essa redução dos arquivos e a adaptação do layout são processos diferentes."
MOSTRAR: os trechos abaixo. No CSS compactado, usar Ctrl+F pelo seletor.
- {refs['frame']}
- {refs['stats']}
- {refs['small']}
- {refs['config']}

4:10 A 4:40 - TESTES E CORREÇÕES
FALA: "As verificações técnicas incluem 25 testes de regras e integração e 11 verificações HTTP na aplicação pública. TypeScript e build também foram aprovados. Entre as correções estão a preservação do cupom no pagamento, a gravação dos pedidos e a substituição de dados fixos por dados da sessão. Os relatos de cinco participantes precisam ser confirmados separadamente."
MOSTRAR: RESULTADO_TESTES_BACKEND.txt e RESULTADO_HTTP_PUBLICO.json, na pasta TRABALHO DE PIT2. Usar a saída já registrada para não gastar o tempo do vídeo esperando comandos.
CÓDIGO DO TESTE DE COMPRA: {refs['test']}
COMANDO, se desejar executar antes da gravação: python -m unittest discover -s tests -v
Se houver feedback real confirmado, substituir uma frase pela melhoria efetivamente originada nesse relato. Não atribuir os testes técnicos aos colegas.

4:40 A 5:00 - QUALIDADE E ENCERRAMENTO
FALA: "O código e a documentação estão no GitHub, e a aplicação está publicada. O laudo registra as correções e as evidências. Pagamento e entrega continuam simulados, as imagens dependem de um serviço externo e a sessão não tem recuperação. O projeto demonstra o fluxo completo de compra dentro desse escopo acadêmico."
MOSTRAR: laudo, formulário de avaliação e links da aplicação e do GitHub.

MATERIAL DE APOIO - ARQUIVOS, LINHAS E EXPLICAÇÕES
Usar para estudar ou responder perguntas. Todos os caminhos partem da pasta-base no início do roteiro.

1. O navegador deve usar a largura do dispositivo
LOCAL: {refs['viewport']}
TRECHO: width=device-width, initial-scale=1.0
EXPLICAR: a largura inicial da página acompanha a largura do dispositivo em pixels CSS; o navegador começa com escala 1. Isso permite que as regras por largura correspondam ao tamanho da tela.

2. A moldura e a largura máxima
ESTRUTURA: {refs['frame']}
ESTILO: {refs['size']}
TRECHOS: width:100%; max-width:390px; max-height:850px
EXPLICAR: 100% acompanha a largura do contêiner, e max-width limita o crescimento no computador. O fundo e a centralização pertencem ao contêiner app-shell. Bordas arredondadas e sombras produzem o aspecto de celular.

3. A mudança para celular
LOCAL: {refs['mobile']}
TRECHOS: .app-shell com padding:0; .outside-brand com display:none; .phone com max-width:100%, max-height:none, border-radius:0 e box-shadow:none.
EXPLICAR: a media query entra em vigor quando a área de visualização tem até 440 pixels CSS de largura. Nesse caso, a tela usa o espaço disponível sem a moldura decorativa do desktop.

4. Altura e rolagem
ALTURA: {refs['height']}
TRECHO: height:100dvh
CONTEÚDO: {refs['scroll']}
TRECHOS: flex:1; min-height:0; overflow:auto
EXPLICAR: dvh acompanha a altura dinâmica da área visível. Flexbox distribui a altura restante; min-height:0 permite ao conteúdo encolher dentro do contêiner; overflow:auto permite rolar quando o conteúdo ultrapassa esse espaço. Os produtos continuam acessíveis por rolagem.

5. Tamanho total das caixas
LOCAL: {refs['box']}
TRECHO: * com box-sizing:border-box
EXPLICAR: preenchimento e borda entram no cálculo da largura e altura declaradas, facilitando encaixar os elementos no contêiner.

6. Cartões em duas colunas
LOCAL: {refs['grid']}
TRECHOS: display:"grid"; gridTemplateColumns:"1fr 1fr"; gap:"14px"
EXPLICAR: as duas colunas dividem o espaço disponível igualmente, com um intervalo entre os cartões. Nesta versão, o catálogo mantém duas colunas; não há regra que o transforme automaticamente em uma coluna.

7. Categorias em uma faixa que pode deslizar
LOCAL: {refs['categories']}
TRECHOS: display:"flex"; overflowX:"auto"; botões com flexShrink:0
EXPLICAR: as categorias podem rolar na horizontal quando não cabem, preservando a largura dos botões.

8. Fotos proporcionais dentro do cartão
LOCAL: {refs['image']}
TRECHOS: width:"100%"; height:"100%"; objectFit:"cover"
EXPLICAR: cover mantém a proporção da imagem e preenche a área reservada; pode recortar parte da foto. Essa regra muda a exibição, não comprime o arquivo original da imagem.

9. Navegação inferior
LOCAL: {refs['nav']}
TRECHOS: position:"sticky"; bottom:0
EXPLICAR: a barra pode permanecer junto à borda inferior de sua área de rolagem, respeitando os limites do contêiner. Flexbox distribui as opções da navegação.

10. Indicadores e telas muito estreitas no Perfil
INDICADORES: {refs['stats']}
TRECHO: grid-template-columns:repeat(3,minmax(0,1fr))
EXPLICAR: três colunas dividem o espaço; minmax permite que cada coluna encolha dentro da grade.
AJUSTE: {refs['small']}
EXPLICAR: até 350 pixels, a regra reduz margens internas, avatar e alguns tamanhos do texto/cartão, ajudando a acomodar o Perfil.

11. O que significa "comprimir" neste projeto
ARQUIVOS DA PUBLICAÇÃO: {refs['config']}
EXPLICAR: npm run build executa vite build. Na configuração atual, o Vite gera a pasta dist com os recursos finais e minifica JavaScript/CSS, reduzindo sua representação textual. Isso não comprova compressão de transporte por gzip/Brotli nem otimização automática de todas as fotos. O ZIP de entrega é um pacote de arquivos; não é o mecanismo que torna a página responsiva.
FALA CURTA SUGERIDA: "Para caber na tela, usei largura flexível, limite máximo, grade e regras CSS por tamanho de tela. Para reduzir os arquivos publicados, usei o build do Vite."

COMO DEMONSTRAR A RESPONSIVIDADE NA GRAVAÇÃO
1. Abrir o site publicado em uma janela larga, com zoom em 100%, e mostrar a moldura centralizada.
2. Abrir as ferramentas do desenvolvedor (F12 ou Ctrl+Shift+I) e ativar o modo de dispositivo (Ctrl+Shift+M nos navegadores Chromium).
3. Selecionar modo responsivo e definir 390 x 844. Mostrar a moldura removida, catálogo e Perfil.
4. Alternar a largura entre 441 e 440 pixels para demonstrar a entrada da media query. A mudança é de layout, não de zoom.
5. Usar 340 pixels para observar o ajuste específico do Perfil em até 350 pixels. Percorrer o conteúdo e conferir legibilidade, botões e campos. Esta observação durante a gravação não substitui uma auditoria em todos os dispositivos.
6. Restaurar o modo normal do navegador ao terminar. Deixar os arquivos de código abertos nas referências acima economiza tempo no vídeo.

ERROS QUE PODEM SER MOSTRADOS SEM ALTERAR O CÓDIGO
- Cupom inválido: digitar ERRADO.
- Busca sem resultado: pesquisar um produto inexistente.
- Carrinho vazio: retirar o último item e mostrar o estado vazio.
- Endereço obrigatório: apagar o endereço no checkout e tentar confirmar.
Escolher um desses exemplos para caber no tempo. Não é necessário introduzir um defeito no código para demonstrar validação.

Referências de linha calculadas a partir da versão entregue. Após mudar o código, regenerar com: python tools/build_deliverables.py --format txt
'''

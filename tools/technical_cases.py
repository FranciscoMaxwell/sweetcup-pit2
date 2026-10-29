"""Resultados técnicos por etapa; datas de referência fornecidas pelo aluno."""

CASES = [
    {
        'reference_date': '29/08/2026',
        'scenario': 'Entrada e navegação básica',
        'worked': 'A entrada de demonstração abre uma sessão e carrega o catálogo com oito produtos. A navegação permite acessar Início, Favoritos, Carrinho, Pedidos e Perfil. A interface foi conferida em 390 x 844 pixels; o conteúdo permanece acessível por rolagem.',
        'failed': 'No protótipo, a navegação era apenas visual e não havia sessão persistida no servidor. A correção conectou a entrada à API Python e ao banco. Na versão final, criação de sessão, rejeição de sessão inválida e encerramento de acesso passaram nos testes. Não foi registrada nova falha nesses cenários.',
        'untested': 'Não foram implementados login por senha, recuperação de conta ou sincronização entre dispositivos. A entrada é uma sessão de demonstração; apagar o cookie ou encerrar a sessão impede recuperar o acesso anterior. Também não foi realizada auditoria completa de acessibilidade em vários dispositivos.',
        'evidence': 'EVIDENCIAS/01_catalogo.jpg e 11_mobile_390x844.jpg; RESULTADO_INTERFACE.json, itens de entrada e revisão mobile; RESULTADO_HTTP_PUBLICO.json, sessão e logout; RESULTADO_TESTES_BACKEND.txt, test_unknown_or_expired_session_rejected e test_logout_invalidates_session. Comparação do protótipo: EVIDENCIAS/14_comparacao_prototipo_codigo.txt, seção 1.',
        'screenshots': ['01_catalogo.jpg', '11_mobile_390x844.jpg'],
    },
    {
        'reference_date': '09/09/2026',
        'scenario': 'Catálogo, busca, filtros e produto',
        'worked': 'O catálogo apresenta os produtos consultados do banco. A categoria Frutas mostra Strawberry Kiss e Lemon Zest; a busca por nome inexistente apresenta o estado vazio. A tela de Strawberry Kiss exibe seus ingredientes. É possível abrir um produto e adicioná-lo aos favoritos.',
        'failed': 'No protótipo, o catálogo era uma lista fixa no código da interface, sem consulta ao banco. Essa limitação foi corrigida com a API e as tabelas de produtos e ingredientes. A consulta de oito produtos passou no teste automatizado; busca, filtro e ingredientes foram conferidos no navegador. Não foi registrada falha funcional nesses passos da versão final.',
        'untested': 'Não há painel para cadastrar produtos, editar preços ou administrar estoque. As fotos dependem de um serviço externo; disponibilidade offline e indisponibilidade desse provedor não foram ensaiadas. Os números de avaliações dos produtos são dados demonstrativos, sem envio de avaliações comerciais.',
        'evidence': 'EVIDENCIAS/01_catalogo.jpg, 02_busca_vazia.jpg e 06_produto_ingredientes.jpg; RESULTADO_INTERFACE.json, categoria Frutas e ingredientes; RESULTADO_TESTES_BACKEND.txt, test_catalog_has_eight_seeded_products; RESULTADO_HTTP_PUBLICO.json, catálogo com oito produtos. Comparação: EVIDENCIAS/14_comparacao_prototipo_codigo.txt, seção 2.',
        'screenshots': ['02_busca_vazia.jpg', '06_produto_ingredientes.jpg'],
    },
    {
        'reference_date': '23/09/2026',
        'scenario': 'Carrinho, cupom e checkout',
        'worked': 'Duas unidades de Rose Velvet geram subtotal de R$ 29,80. O cupom SWEET10 desconta R$ 2,98; com entrega simulada de R$ 8,90, o total é R$ 35,72 no carrinho, checkout e pedido. Alterar a quantidade recalcula o desconto. Cupom inválido é rejeitado sem mudar o orçamento anterior.',
        'failed': 'O pagamento do protótipo somava subtotal e entrega sem receber o desconto aplicado no carrinho. A correção centralizou o cálculo em centavos no servidor e preservou o cupom na compra. Os testes de recálculo, cupom inválido e checkout passaram. Endereço vazio, quantidade inválida e carrinho vazio recebem erro tratado, em vez de gerar pedido inválido.',
        'untested': 'Não há cobrança bancária, QR Code Pix real ou autorização de cartão. As formas de pagamento são simuladas e não permitem validar uma transação financeira. O frete é demonstrativo, sem cálculo por CEP ou integração com transportadora.',
        'evidence': 'EVIDENCIAS/03_carrinho_cupom.jpg e 04_checkout_cupom.jpg; RESULTADO_TESTES_BACKEND.txt, test_coupon_recalculates_when_quantity_changes, test_invalid_coupon_does_not_change_previous_quote e test_checkout_keeps_discount_and_clears_cart; RESULTADO_HTTP_PUBLICO.json, total e pedido com desconto. Comparação: EVIDENCIAS/14_comparacao_prototipo_codigo.txt, seção 3.',
        'screenshots': ['03_carrinho_cupom.jpg', '04_checkout_cupom.jpg'],
    },
    {
        'reference_date': '10/10/2026',
        'scenario': 'Favoritos, Perfil e persistência',
        'worked': 'O favorito permanece após recarregar. O Perfil permite salvar nome e endereço fictícios e recuperá-los na recarga. Os indicadores usam os pedidos e favoritos da sessão; um pedido recente abre seu acompanhamento correto. Cancelar a confirmação de saída mantém a sessão ativa.',
        'failed': 'O Perfil do protótipo mostrava nome, endereço e histórico fixos, e o botão Editar não tinha ação de salvamento. A correção passou a consultar a sessão e gravar as alterações no banco; foram acrescentados avatar de iniciais, indicadores reais, pedidos recentes e confirmação de saída. A persistência e os atalhos foram aprovados nas verificações de interface.',
        'untested': 'Não foram implementados envio de foto, alteração de senha, programa de pontos, notificações ou recuperação da sessão. O avatar usa iniciais. A verificação do Perfil não representa teste completo de teclado, leitor de tela ou todos os tamanhos de dispositivo.',
        'evidence': 'EVIDENCIAS/07_favorito_persistido.jpg, 08_perfil_historico.jpg, 12_perfil_melhorado.jpg e 13_perfil_publico.jpg; RESULTADO_PERFIL.json, edição, recarga, atalhos e saída; RESULTADO_TESTES_BACKEND.txt, test_profile_is_saved e test_favorites_are_saved_and_can_be_removed. Comparação: EVIDENCIAS/14_comparacao_prototipo_codigo.txt, seção 4.',
        'screenshots': ['07_favorito_persistido.jpg', '12_perfil_melhorado.jpg'],
    },
    {
        'reference_date': '20/10/2026',
        'scenario': 'Compra completa, histórico e rastreio',
        'worked': 'A confirmação gera identificador, grava pedido e itens e esvazia o carrinho. O pedido permanece no histórico após recarregar. Avançar o acompanhamento salva o novo status; o fluxo termina em Entregue. Reenviar a mesma requisição retorna o pedido existente, sem duplicá-lo. Pedidos de sessões diferentes ficam separados.',
        'failed': 'No protótipo, confirmar a compra apenas mudava de tela; o rastreio tinha número fixo e avançava por temporizador. A correção grava a compra em transação e carrega os dados do pedido selecionado; o avanço agora é uma simulação explícita e persistida. Os testes de duplicidade, isolamento e limite do status passaram. Não foi registrada nova falha nesse fluxo final.',
        'untested': 'Não há localização de entregador, rastreamento por GPS, cancelamento, estorno ou entrega física. O histórico carrega até 100 pedidos por sessão; não foram realizados testes de carga nem ensaios com grande volume. Os anexos da avaliação ficam no arquivo exportado, sem armazenamento próprio no servidor.',
        'evidence': 'EVIDENCIAS/05_pedido_rastreio.jpg e 09_avaliacao_registrada.jpg; RESULTADO_HTTP_PUBLICO.json, pedido, reenvio e status; RESULTADO_TESTES_BACKEND.txt, test_repeated_purchase_request_creates_one_order, test_order_and_favorites_are_isolated_between_clients e test_simulated_status_stops_at_delivered. Comparação: EVIDENCIAS/14_comparacao_prototipo_codigo.txt, seção 5.',
        'screenshots': ['05_pedido_rastreio.jpg', '09_avaliacao_registrada.jpg'],
    },
]

ORIGIN = ('Resultados da verificação técnica do assistente, organizados nas cinco etapas e datas de referência informadas pelo aluno. '
          'Os nomes são referências das fichas; os textos não são depoimentos atribuídos a essas pessoas. '
          'As datas das etapas não alteram os registros originais de execução das evidências.')

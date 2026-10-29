"""Texto de apresentação das fichas, com as mesmas observações do registro técnico."""

PRESENTATION_CASES = [
    {
        'worked': 'A entrada carregou o catálogo com oito produtos. Foi possível acessar Início, Favoritos, Carrinho, Pedidos e Perfil. A tela também se ajustou ao formato de celular, mantendo o conteúdo acessível pela rolagem.',
        'failed': 'Na primeira versão, a navegação não estava ligada a uma sessão no servidor. A entrada passou a usar a API Python e o banco de dados. Os testes confirmaram a criação da sessão e o encerramento do acesso ao sair.',
        'untested': 'A aplicação não oferece senha, recuperação de conta ou sincronização entre dispositivos. A revisão completa de acessibilidade ainda não foi realizada.',
    },
    {
        'worked': 'A busca e os filtros localizaram os produtos. A categoria Frutas apresentou Strawberry Kiss e Lemon Zest. Uma busca sem correspondência mostrou a mensagem de resultado vazio, e a tela do produto exibiu seus ingredientes.',
        'failed': 'O catálogo inicial era uma lista fixa na interface. Ele foi ligado ao banco de dados, e os produtos passaram a ser carregados pela API. A consulta dos oito produtos, a busca e a exibição dos ingredientes foram verificadas.',
        'untested': 'Ainda não há painel para cadastrar produtos, alterar preços ou controlar estoque. As fotos dependem de um serviço externo, e o funcionamento sem internet não foi testado.',
    },
    {
        'worked': 'Duas unidades de Rose Velvet somaram R$ 29,80. Com o cupom SWEET10 e a entrega simulada de R$ 8,90, o total ficou em R$ 35,72 no carrinho, no pagamento e no pedido. Alterar a quantidade também recalculou o desconto.',
        'failed': 'O desconto do carrinho se perdia ao abrir o pagamento. O cálculo foi centralizado no servidor, em centavos, e o cupom passou a acompanhar o pedido. Cupons e quantidades inválidos foram rejeitados sem concluir uma compra incorreta.',
        'untested': 'Pagamento e frete são simulados. Não há cobrança bancária, Pix real, autorização de cartão ou cálculo de entrega por CEP.',
    },
    {
        'worked': 'O favorito continuou salvo depois de recarregar a página. Foi possível editar nome e endereço no Perfil, recuperar essas informações e abrir o pedido correto pelo histórico. Cancelar a saída manteve a sessão ativa.',
        'failed': 'O Perfil mostrava dados e pedidos fixos, e o botão Editar não salvava alterações. A tela passou a consultar os dados da sessão e a gravar as mudanças no banco, com indicadores de pedidos e favoritos e confirmação antes de sair.',
        'untested': 'Não há envio de foto, alteração de senha, programa de pontos ou notificações. O avatar usa as iniciais do nome; a recuperação da sessão também não foi implementada.',
    },
    {
        'worked': 'A compra gerou um número de pedido, salvou os itens e esvaziou o carrinho. O histórico permaneceu após a recarga, e a mudança de etapa da entrega foi salva. Reenviar a mesma compra não criou outro pedido.',
        'failed': 'Antes, confirmar a compra apenas abria uma tela de rastreio com número fixo e avanço automático. A correção passou a gravar a compra e mostrar o pedido selecionado. As etapas agora são avançadas como simulação e ficam registradas no banco.',
        'untested': 'Não há localização de entregador, cancelamento, estorno ou entrega física. O histórico mostra até 100 pedidos por sessão, e não foram feitos testes com grande volume de acessos.',
    },
]

CAPTIONS = {
    '01_catalogo.jpg': 'Catálogo no computador.',
    '11_mobile_390x844.jpg': 'Catálogo na tela de celular.',
    '02_busca_vazia.jpg': 'Busca sem produtos correspondentes.',
    '06_produto_ingredientes.jpg': 'Informações e ingredientes do produto.',
    '03_carrinho_cupom.jpg': 'Carrinho com o desconto aplicado.',
    '04_checkout_cupom.jpg': 'Pagamento mantendo o mesmo cupom.',
    '07_favorito_persistido.jpg': 'Favorito recuperado após a recarga.',
    '12_perfil_melhorado.jpg': 'Perfil com edição de nome e endereço.',
    '05_pedido_rastreio.jpg': 'Pedido salvo e etapas da entrega.',
    '08_perfil_historico.jpg': 'Pedido disponível no histórico.',
    '09_avaliacao_registrada.jpg': 'Formulário de avaliação da aplicação.',
    '13_perfil_publico.jpg': 'Perfil na aplicação publicada.',
}

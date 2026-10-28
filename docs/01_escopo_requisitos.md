# SweetCup — evolução do PIT I para o PIT II

A SweetCup permite demonstrar a compra de cupcakes pelo navegador com uma interface adaptada ao celular. A versão do PIT I era um protótipo visual; o PIT II acrescenta processamento em Python, persistência relacional e verificação dos fluxos.

O público da demonstração é formado pelo aluno, tutor e cinco avaliadores. Os produtos, avaliações de produtos, clientes e endereços usados na apresentação são fictícios. A aplicação não cobra dinheiro e não aciona entregadores.

## Requisitos funcionais

| ID | Comportamento | Verificação |
|---|---|---|
| RF01 | Criar sessão de cliente de demonstração no servidor | Entrada, cookie e acesso à API |
| RF02 | Consultar catálogo do banco | Oito produtos no catálogo |
| RF03 | Buscar por nome e filtrar por categoria | Navegador: busca, categoria e resultado vazio |
| RF04 | Abrir produto, descrição e ingredientes | Navegador: detalhes e abas |
| RF05 | Adicionar, alterar e remover produtos do carrinho | Quantidades entre 1 e 20; zero remove |
| RF06 | Aplicar e remover SWEET10/PROMO20 | Total em centavos calculado no servidor |
| RF07 | Salvar e remover favoritos | Reconsulta e recarga |
| RF08 | Finalizar pedido demonstrativo | Pedido e itens persistidos; carrinho esvaziado |
| RF09 | Consultar histórico e pedido selecionado | Apenas pedidos da própria sessão |
| RF10 | Avançar entrega simulada | Recebido, preparo, saída, entregue |
| RF11 | Editar nome e endereço fictícios | Perfil persistido |
| RF12 | Registrar avaliação e exportar com prints opcionais | Formulário e arquivo JSON |
| RF13 | Encerrar sessão | Cookie removido e acesso invalidado |

## Requisitos de qualidade

Valores monetários são armazenados em centavos. O servidor consulta os preços cadastrados; preços enviados pelo cliente não definem o valor do pedido. O cupom incide sobre os produtos e a entrega demonstrativa custa R$ 8,90 quando há itens. O arredondamento do desconto é feito ao centavo mais próximo, com meio centavo arredondado para cima.

Pedidos são gravados em lote atômico com seus itens. Uma chave por tentativa de compra impede duplicação por reenvio. Uma versão do carrinho impede finalizar com uma composição que mudou desde a conferência dos valores.

Cada sessão acessa os próprios dados. O cookie é HttpOnly e SameSite=Lax, com Secure em HTTPS e validade de 14 dias. Requisições de escrita com Origin de outro site são rejeitadas. As consultas SQL recebem parâmetros. Mensagens de falha são exibidas sem revelar consultas ou credenciais.

A interface oferece foco visível, campos rotulados, feedback de gravação, estados vazios e layout responsivo. A implementação não equivale a uma certificação de acessibilidade; o protótipo herdado ainda pode receber melhorias de contraste e navegação por teclado.

## Limites assumidos

Não há Google Auth, recuperação de conta, painel administrativo, estoque comercial, pagamento bancário, emissão fiscal, mensagens de e-mail ou geolocalização de entregador. Sair da sessão e entrar novamente cria outro cliente de demonstração. Produtos entram por seed SQL.

O histórico carrega até 100 pedidos por sessão. Os textos das avaliações ficam no banco; prints ficam no arquivo exportado pelo participante e devem ser entregues ao aluno. A demonstração não pretende operar como loja comercial.

## Critérios de entrega

A entrega técnica inclui código, esquema e seed SQL, modelos, dicionário, manual, testes e laudo. A entrega acadêmica completa ainda precisa dos dados de identificação do aluno, dos links efetivamente publicados, de cinco feedbacks confirmados e do vídeo narrado pelo aluno.

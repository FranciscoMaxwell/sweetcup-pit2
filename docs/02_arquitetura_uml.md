# Arquitetura e modelagem da SweetCup

## Separação de responsabilidades

As telas React representam a apresentação. `App.tsx` coordena navegação e estado retornado pela API; `api.ts` concentra as requisições. No servidor, `service.py` reúne os controladores e regras do domínio. `repository.py` executa SQL usando SQLite local ou o binding D1 na Cloudflare. `local_server.py` e `entry.py` adaptam HTTP aos mesmos controladores.

Essa organização aplica separação inspirada em MVC em uma aplicação web: apresentação no React, controle no serviço Python e modelo relacional/repositório. Não se afirma que o React, isoladamente, seja um framework MVC.

```mermaid
flowchart LR
  A[Cliente no navegador] --> B[React e Vite]
  B -->|HTTP JSON e cookie| C[Controladores Python]
  C --> D[Repositório SQL]
  D --> E[(SQLite local ou Cloudflare D1)]
```

## Casos de uso

O ator cliente de demonstração pode entrar, consultar produtos, pesquisar, filtrar, favoritar, montar carrinho, aplicar cupom, finalizar pedido, acompanhar pedidos, editar perfil, avaliar a aplicação e sair. Finalizar pedido inclui validar carrinho, calcular valores, salvar pedido/itens e limpar o carrinho. A entrega é avançada explicitamente como simulação.

```mermaid
flowchart TD
  C[Cliente de demonstração] --> S[Entrar na sessão]
  S --> P[Consultar e selecionar produto]
  P --> F[Favoritar]
  P --> A[Adicionar ao carrinho]
  A --> Q[Alterar quantidade e aplicar cupom]
  Q --> O[Confirmar pedido simulado]
  O --> H[Consultar histórico e acompanhamento]
  S --> E[Editar perfil]
  S --> V[Avaliar a aplicação]
  S --> L[Sair]
```

## Classes do domínio

```mermaid
classDiagram
  class Cliente {
    string id
    string nome
    string endereco
  }
  class Produto {
    int id
    string nome
    int precoCentavos
  }
  class Carrinho {
    string cupom
    int versao
    calcularTotais()
  }
  class ItemCarrinho {
    int quantidade
  }
  class Pedido {
    string id
    int status
    int totalCentavos
    confirmar()
    avancarSimulacao()
  }
  class ItemPedido {
    string nomeHistorico
    int precoHistoricoCentavos
    int quantidade
  }
  Cliente "1" --> "1" Carrinho
  Carrinho "1" *-- "0..*" ItemCarrinho
  Produto "1" --> "0..*" ItemCarrinho
  Cliente "1" --> "0..*" Pedido
  Pedido "1" *-- "1..*" ItemPedido
  Produto "1" --> "0..*" ItemPedido
```

## Sequência da compra

```mermaid
sequenceDiagram
  actor Cliente
  participant Tela as Checkout React
  participant API as Serviço Python
  participant Banco as Banco SQL
  Cliente->>Tela: Confirmar compra simulada
  Tela->>API: Endereço, pagamento, versão e chave
  API->>Banco: Validar sessão e buscar carrinho/preços
  Banco-->>API: Itens, cupom e versão
  API->>API: Validar e calcular valores em centavos
  API->>Banco: Lote atômico: pedido, itens e limpeza
  Banco-->>API: Confirmação
  API-->>Tela: Estado atualizado e ID do pedido
  Tela-->>Cliente: Pedido salvo e acompanhamento
```

Se o carrinho mudou, o servidor retorna 409 e a interface recarrega os valores. Se a chave já corresponde a um pedido do cliente, o servidor retorna esse pedido. Falhas no lote não deixam pedido parcialmente gravado.

## Estados do pedido

```mermaid
stateDiagram-v2
  [*] --> Recebido
  Recebido --> EmPreparo: simular próxima etapa
  EmPreparo --> SaiuParaEntrega: simular próxima etapa
  SaiuParaEntrega --> Entregue: simular próxima etapa
  Entregue --> [*]
```

## Navegação atualizada

A entrada inicia a sessão e abre o catálogo. A navegação inferior oferece Início, Favoritos, Carrinho, Pedidos e Perfil. Produto abre o carrinho; carrinho abre pagamento; pagamento cria o pedido e abre acompanhamento. Perfil abre avaliações e histórico. Os mapas e wireframes originais permanecem acessíveis como referência do PIT I; os fluxos do PIT II são documentados aqui.

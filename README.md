
# SweetCup — PIT II

Loja acadêmica de cupcakes com interface mobile React/Vite, back-end Python e banco relacional. Evolução do protótipo do PIT I. Compras, pagamentos, avaliações de produtos e entregas são demonstrativos.

Aplicação publicada: [sweetcupcrazy.maxwellgodhero.workers.dev](https://sweetcupcrazy.maxwellgodhero.workers.dev). Consulte também [publicação e verificação](docs/07_publicacao.md).

Resultados por etapa e capturas: [evidências dos cinco testes](https://sweetcupcrazy.maxwellgodhero.workers.dev/evidencias/index.html). As etapas usam as cinco datas de referência fornecidas pelo aluno; os registros de execução preservam suas datas originais. Os textos são verificações técnicas.

## Executar

```powershell
npm ci
npm run build
python -m backend.local_server
```

Abra [a aplicação local](http://127.0.0.1:8787) ou use `INICIAR_SWEETCUP.cmd`. O servidor local não depende de pacotes externos Python. Para desenvolvimento da interface, mantenha o servidor aberto e execute `npm run dev`.

## Funcionalidades

Sessão de demonstração, catálogo consultado do banco, busca/categorias, produtos/ingredientes, carrinho persistente, cupons, favoritos, checkout, pedidos e histórico, avanço explícito de entrega simulada, edição de perfil e formulário de avaliação com exportação dos relatos e prints opcionais.

## Verificação

```powershell
python -m unittest discover -s tests -v
python tests/http_smoke.py http://127.0.0.1:8787
npm run typecheck
npm run build
```

Os testes técnicos não representam avaliações dos cinco colegas. As avaliações humanas e o vídeo devem ser realizados pelos participantes e pelo aluno.

## Documentação

- [Escopo e requisitos](docs/01_escopo_requisitos.md)
- [Arquitetura, UML e navegação](docs/02_arquitetura_uml.md)
- [Modelo e dicionário do banco](docs/03_banco_dados.md)
- [Manual e publicação](docs/04_manual.md)
- [Testes, correções e limitações](docs/05_testes_e_qualidade.md)

`database/` contém esquema e seed. `backend/` contém o serviço e adaptadores SQLite/D1. `src/` contém a apresentação. Credenciais, bancos locais, conversas e avaliações pessoais ficam fora do Git.

## Cloudflare

O Worker Python e o D1 podem ser executados com `npm run db:local` e `npm run dev:cloudflare`. Para publicar, é necessário autenticar a conta, criar o D1 e preencher seu identificador em `wrangler.jsonc`. O identificador atual corresponde ao banco da demonstração; para usar outra conta, crie seu próprio banco. Veja o manual antes de publicar.

Design original: [SweetCup no Figma](https://www.figma.com/design/6MG9pEsjSXgevw0vehVpz3/SweetCup-mobile-app-design). O histórico Git preserva a versão anterior à evolução do PIT II.

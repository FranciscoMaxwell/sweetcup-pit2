# Manual de execução e uso

## Executar no computador

Requisitos: Node.js 22 ou compatível e Python 3.12 ou superior. O back-end local usa somente a biblioteca padrão do Python.

```powershell
npm ci
npm run typecheck
npm run build
python -m backend.local_server
```

Abra `http://127.0.0.1:8787`. O primeiro início cria o banco e insere os produtos. Para desenvolver a interface com atualização automática, deixe o back-end aberto e execute `npm run dev` em outro terminal. O Vite encaminha `/api` ao servidor Python.

O arquivo `INICIAR_SWEETCUP.cmd` também compila a interface e inicia o back-end. Ele abre uma janela de terminal para acompanhar o servidor; feche-a quando não precisar mais da aplicação.

## Usar a loja

1. Digite um nome fictício e entre como cliente de demonstração.
2. Busque cupcakes ou selecione uma categoria. Abra um produto e confira descrição/ingredientes.
3. Escolha a quantidade e adicione ao carrinho. O limite é 20 unidades por produto.
4. No carrinho, altere quantidades ou remova itens. Aplique SWEET10 (10%) ou PROMO20 (20%).
5. Continue para o pagamento, confira os valores e informe um endereço fictício.
6. Escolha Pix, cartão ou dinheiro demonstrativos e confirme. Não são solicitados dados bancários.
7. O pedido salvo aparece em Pedidos. O botão de simulação avança o status até Entregue.
8. Recarregue a página: a sessão e os dados continuam no banco. Perfil permite editar dados fictícios e abrir pedidos anteriores.
9. Em Perfil, abra Avaliar a SweetCup. Preencha os campos, anexe prints opcionais e exporte o arquivo para entregar ao aluno.

Ao sair, o servidor invalida a sessão. A próxima entrada cria outro cliente; a demonstração não oferece recuperação da conta anterior. Para manter o histórico durante a apresentação, recarregue a página sem sair.

## Testes técnicos

```powershell
python -m unittest discover -s tests -v
python tests/http_smoke.py http://127.0.0.1:8787
npm run typecheck
npm run build
```

Os testes de unidade/integração usam bancos temporários separados. O smoke HTTP cria um cliente fictício e um pedido no servidor escolhido. Os registros são técnicos e não representam avaliações dos cinco participantes.

## Executar no ambiente local da Cloudflare

```powershell
npm run db:local
npm run dev:cloudflare
```

Esse ambiente usa Workers Python e D1 local. O banco do servidor Python é separado do banco do Wrangler. Para verificar o contrato HTTP nesse ambiente, use a URL exibida pelo Wrangler no script `tests/http_smoke.py`.

## Publicar na Cloudflare

```powershell
npx wrangler login
npx wrangler d1 create sweetcup-pit2
```

Copie o `database_id` retornado para `wrangler.jsonc`, mantendo o binding DB. Em seguida:

```powershell
npx wrangler d1 execute sweetcup-pit2 --remote --file=database/001_schema.sql
npx wrangler d1 execute sweetcup-pit2 --remote --file=database/002_seed.sql
npm run deploy:cloudflare
```

Configure o subdomínio desejado como Custom Domain do Worker no domínio da sua conta. O domínio, Workers e D1 precisam estar acessíveis pela credencial utilizada. O token local verificado durante o trabalho não tinha essas permissões. Nenhuma chave deve entrar no código ou no Git.

O arquivo de configuração inclui `disable_python_external_sdk` para usar o SDK interno compatível com o código sem instalar pacotes Python externos. Essa configuração foi executada no Wrangler local; o status da publicação remota deve ser verificado separadamente.

## Publicar o código

O Git local preserva o protótipo do PIT I em um commit anterior às mudanças. Após criar um repositório GitHub vazio na conta do aluno, adicione o remoto e envie a branch conforme as instruções do GitHub. Não publique o banco local, tokens ou avaliações pessoais. A documentação técnica em `docs/` já está organizada para o repositório.

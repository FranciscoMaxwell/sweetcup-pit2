# Publicação da SweetCup

A aplicação demonstrativa está disponível em [sweetcup.modern-believer.com](https://sweetcup.modern-believer.com). O código e a documentação estão em [FranciscoMaxwell/sweetcup-pit2](https://github.com/FranciscoMaxwell/sweetcup-pit2).

A hospedagem utiliza Cloudflare Workers com Python, arquivos estáticos do Vite e banco D1. O mesmo Worker também possui o endereço alternativo [sweetcup-pit2.maxwellgodhero.workers.dev](https://sweetcup-pit2.maxwellgodhero.workers.dev). O subdomínio usa o domínio da conta do aluno; o aplicativo não depende de um servidor aberto no computador para funcionar publicamente.

## Verificação em 28/10/2026

A página inicial respondeu HTTP 200. O roteiro `tests/http_smoke.py` aprovou 11 verificações no endereço público: saúde, sessão/catálogo, carrinho, cotação com cupom, favorito, pedido, reenvio sem duplicação, avanço de status, perfil, quantidade inválida e logout. Os dados usados foram fictícios.

O cliente de teste identifica-se como `SweetCup-PIT2-Test/1.0`. Essa identificação segue a [orientação oficial da Cloudflare para clientes HTTP](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/); o agente padrão do urllib recebeu o erro 1010. Nenhuma configuração de segurança do domínio foi alterada para esse teste.

A revisão visual e de interação foi realizada localmente, incluindo tamanho de celular de 390 x 844. A revisão visual pública não foi concluída: o controle de computador encerrou a sessão por não conseguir identificar a URL do navegador com segurança. Isso não impede os testes de API executados no endereço publicado.

## Entrega acadêmica

O aluno preencherá nome e RGM. Os cinco participantes ainda precisam confirmar seus relatos, datas e evidências; as datas informadas pertencem a 2026. O vídeo narrado será gravado pelo aluno usando o roteiro preparado. Os testes técnicos não são atribuídos aos participantes.

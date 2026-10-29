# Publicação da SweetCup

A aplicação demonstrativa está disponível em [sweetcupcrazy.maxwellgodhero.workers.dev](https://sweetcupcrazy.maxwellgodhero.workers.dev). O código e a documentação estão em [FranciscoMaxwell/sweetcup-pit2](https://github.com/FranciscoMaxwell/sweetcup-pit2).

A hospedagem utiliza Cloudflare Workers com Python, arquivos estáticos do Vite e banco D1. O endereço usa a hospedagem gratuita da Cloudflare e não inclui o domínio da loja real; o aplicativo não depende de um servidor aberto no computador para funcionar publicamente.

## Verificações da publicação

A nova publicação e o Perfil foram verificados em 29/10/2026. A página inicial respondeu HTTP 200. O roteiro `tests/http_smoke.py` aprovou 11 verificações no endereço público: saúde, sessão/catálogo, carrinho, cotação com cupom, favorito, pedido, reenvio sem duplicação, avanço de status, perfil, quantidade inválida e logout. Os dados usados foram fictícios.

O cliente de teste identifica-se como `SweetCup-PIT2-Test/1.0`. Essa identificação segue a [orientação oficial da Cloudflare para clientes HTTP](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/); o agente padrão do urllib recebeu o erro 1010. Nenhuma configuração de segurança do domínio foi alterada para esse teste.

A revisão visual e de interação foi realizada localmente, incluindo tamanho de celular de 390 x 844. O Perfil atualizado também foi verificado visualmente no novo endereço público, incluindo os estados iniciais e a entrada de demonstração.

## Entrega acadêmica

A identificação do aluno foi preenchida na entrega local. As cinco fichas técnicas usam as datas de referência informadas, de 2026, e não são depoimentos atribuídos aos participantes. O [vídeo fornecido pelo aluno está publicado](https://sweetcupcrazy.maxwellgodhero.workers.dev/video/index.html), com duração de 3 minutos e 22 segundos. O arquivo original foi preservado; há um roteiro local de complemento para chegar a cinco minutos, se necessário.

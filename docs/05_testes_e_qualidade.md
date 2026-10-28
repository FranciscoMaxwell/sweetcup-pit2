# Verificação técnica e qualidade

Os resultados técnicos são gerados por execução em 28/10/2026. Eles não substituem os cinco feedbacks humanos exigidos no PIT II.

## Testes automatizados

`tests/test_service.py` cobre 25 cenários de regras e integração SQLite: catálogo, sessão inválida/expirada, persistência, limites de quantidade, remoção, produto inexistente, cupons, checkout, idempotência, preço adulterado pelo cliente, carrinho vazio, versão desatualizada, favoritos, isolamento, status, perfil, feedback, logout, rollback, centavos, JSON e origem HTTP.

`tests/http_smoke.py` verifica 11 pontos do contrato HTTP. Foi executado contra o servidor Python local e contra o Worker Python com D1 local. Os relatórios detalhados ficam na pasta de entrega.

O front-end é verificado por TypeScript, build e testes de interação no navegador. O laudo e o registro de evidências da entrega informam os cenários realmente executados.

## Problemas corrigidos

| Problema | Correção | Verificação |
|---|---|---|
| Cupom ficava no carrinho e desaparecia no pagamento | Uma cotação calculada no servidor alimenta carrinho, checkout e pedido | 2 Rose Velvet + SWEET10 = R$ 35,72 nas três etapas |
| Carrinho/favoritos eram estados apenas do React | Persistência em tabelas ligadas à sessão | Reconsulta e recarga |
| Confirmar pagamento apenas abria rastreio | Pedido e itens reais no banco, com pagamento simulado | Checkout e histórico |
| Perfil e histórico tinham valores fixos | Perfil editável e consultas da sessão | Testes API e navegador |
| Rastreio não correspondia ao pedido criado | Status persistente por pedido e botão explícito de simulação | Avanço e recarga |
| Banner prometia 30% sem regra implementada | Banner informa PROMO20, compatível com o cupom existente | Conferência de interface e regras |
| Conexões SQLite ficavam abertas após a transação | Fechamento explícito das conexões | Testes no Windows e limpeza dos bancos temporários |
| Cookie Secure impedia testes do Worker local em HTTP | Secure aplicado quando a requisição usa HTTPS | Smoke HTTP no Worker local |

## Limitações a relatar

O ambiente usa clientes de demonstração, sem recuperação de conta. As imagens dependem de serviço externo. Não há estoque comercial, gateway bancário, entregador real ou painel administrativo. O histórico limita a consulta aos 100 pedidos mais recentes. Os mapas visuais originais representam a fase de protótipo; os fluxos atualizados estão na documentação do PIT II. A acessibilidade pode ser aprofundada com auditoria específica.

No formulário de avaliação, anexos permanecem no arquivo exportado pelo navegador; os textos ficam no banco. O aluno deve recolher esses arquivos e confirmar nome/data/resultados de cada participante antes de consolidar o PDF final das cinco opiniões.

O aceite técnico local não confirma hospedagem pública nem aprovação pelo tutor. Esses estados devem ser registrados com suas evidências próprias.

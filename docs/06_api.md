# API HTTP

As rotas usam JSON e cookie de sessão da própria origem. Erros retornam `{"error":"mensagem"}` com HTTP 400, 401, 403, 404, 409, 413 ou 500 conforme o caso. A API não usa credenciais de serviços financeiros.

| Método e rota | Entrada | Resultado |
|---|---|---|
| GET /api/health | Sem sessão | Saúde do serviço/banco |
| GET /api/products | Sem sessão | Catálogo e ingredientes |
| POST /api/session | name fictício | Nova sessão HttpOnly e estado inicial |
| GET /api/state | Cookie | Perfil, catálogo, carrinho/cotação, favoritos e pedidos próprios |
| DELETE /api/session | Cookie | Revogação da sessão e expiração do cookie |
| PUT /api/profile | name, address | Perfil atualizado |
| PUT /api/cart/items/:id | quantity inteiro, 0 a 20 | Zero remove; demais valores definem a quantidade |
| PUT /api/cart/coupon | coupon vazio, SWEET10 ou PROMO20 | Cotação recalculada |
| PUT /api/favorites/:id | Cookie | Salva favorito |
| DELETE /api/favorites/:id | Cookie | Remove favorito |
| POST /api/orders | address, payment, cart_version, request_key | Pedido persistido e novo estado com created_order_id |
| POST /api/orders/:id/advance | Cookie | Avança status de pedido próprio até 3 |
| POST /api/feedback | tester_name, tested_at, worked, failed, untested | Avaliação de texto salva, com ID |
| GET /api/feedback | Cookie | Avaliações da própria sessão |

As mutações de carrinho, perfil, favoritos e status retornam o estado atualizado. O checkout aceita payment como pix, card ou cash, sempre simulados. A cotação é calculada no servidor a partir dos preços persistidos. request_key deve ter de 8 a 80 caracteres; seu reenvio retorna o pedido existente. cart_version deve corresponder à versão atual, caso contrário o servidor responde 409.

O corpo tem limite de 16 KB. Cada relato de avaliação admite de 3 a 2.000 caracteres; a data deve existir e não estar no futuro. Prints opcionais são adicionados no navegador ao arquivo exportado, não são enviados a essa API. O servidor local aceita somente GET para arquivos estáticos e valida que o caminho permaneça em dist/.

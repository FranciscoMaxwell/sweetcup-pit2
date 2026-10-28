import { useState } from "react";
import { AppScreen, CartItem, Cupcake } from "../App";
import { BottomNav } from "./BottomNav";

interface Props {
  navigate: (s: AppScreen) => void;
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  addToCart: (c: Cupcake, q: number) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  cartCount: number;
  cartTotal: number;
  cupcakes: Cupcake[];
}

export function CartScreen({ navigate, cart, setCart, cartCount, cartTotal }: Props) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const delivery = cart.length > 0 ? 8.90 : 0;
  const total = cartTotal - discount + delivery;

  const updateQty = (id: number, delta: number) => {
    setCart(
      cart
        .map((item) => item.cupcake.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SWEET10") {
      setDiscount(cartTotal * 0.1);
      setCouponMsg("Cupom aplicado! 10% de desconto 🎉");
    } else if (coupon.toUpperCase() === "PROMO20") {
      setDiscount(cartTotal * 0.2);
      setCouponMsg("Cupom aplicado! 20% de desconto 🎉");
    } else if (coupon) {
      setCouponMsg("Cupom inválido :(");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#FFF8F0", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "16px 20px 14px", display: "flex", alignItems: "center", gap: "14px", borderBottom: "1px solid #F5E6EE" }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#2D1B12" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#2D1B12", flex: 1 }}>Meu Carrinho</h2>
        <span style={{ color: "#C4A882", fontSize: "14px" }}>{cartCount} {cartCount === 1 ? "item" : "itens"}</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {cart.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: "16px" }}>
            <span style={{ fontSize: "60px" }}>🛍️</span>
            <h3 style={{ margin: 0, color: "#2D1B12", fontSize: "20px" }}>Carrinho vazio</h3>
            <p style={{ margin: 0, color: "#C4A882", fontSize: "14px", textAlign: "center" }}>Adicione cupcakes deliciosos ao seu carrinho</p>
            <button
              onClick={() => navigate("home")}
              style={{ background: "linear-gradient(135deg, #E8648C, #c2185b)", border: "none", color: "#fff", borderRadius: "16px", padding: "14px 32px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}
            >
              Explorar cupcakes
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {cart.map((item) => (
                <div
                  key={item.cupcake.id}
                  style={{
                    background: "#fff", borderRadius: "18px", padding: "14px",
                    display: "flex", gap: "14px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ width: "80px", height: "80px", borderRadius: "14px", overflow: "hidden", flexShrink: 0 }}>
                    <img src={item.cupcake.image} alt={item.cupcake.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: 700, color: "#2D1B12" }}>{item.cupcake.name}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#C4A882" }}>{item.cupcake.category}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#E8648C" }}>
                        R$ {(item.cupcake.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <button
                          onClick={() => updateQty(item.cupcake.id, -1)}
                          style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid #E8648C", background: "transparent", color: "#E8648C", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#2D1B12", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.cupcake.id, 1)}
                          style={{ width: "28px", height: "28px", borderRadius: "50%", border: "none", background: "#E8648C", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div style={{ padding: "0 20px 16px" }}>
              <div style={{ background: "#fff", borderRadius: "18px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <p style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 700, color: "#2D1B12" }}>🎟️ Cupom de desconto</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    value={coupon}
                    onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(""); setDiscount(0); }}
                    placeholder="Ex: SWEET10"
                    style={{ flex: 1, padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #F5E6EE", background: "#FFF8F0", fontSize: "14px", color: "#2D1B12", outline: "none" }}
                  />
                  <button
                    onClick={applyCoupon}
                    style={{ padding: "11px 18px", borderRadius: "12px", border: "none", background: "#E8648C", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Aplicar
                  </button>
                </div>
                {couponMsg && (
                  <p style={{ margin: "8px 0 0", fontSize: "12px", color: couponMsg.includes("inválido") ? "#d4183d" : "#34C759" }}>{couponMsg}</p>
                )}
                <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#C4A882" }}>Tente: SWEET10 ou PROMO20</p>
              </div>
            </div>

            {/* Summary */}
            <div style={{ padding: "0 20px 16px" }}>
              <div style={{ background: "#fff", borderRadius: "18px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <p style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: 700, color: "#2D1B12" }}>Resumo do pedido</p>
                {[
                  ["Subtotal", `R$ ${cartTotal.toFixed(2).replace(".", ",")}`],
                  discount > 0 ? ["Desconto", `- R$ ${discount.toFixed(2).replace(".", ",")}`] : null,
                  ["Entrega", `R$ ${delivery.toFixed(2).replace(".", ",")}`],
                ].filter(Boolean).map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "14px", color: "#8B5E3C" }}>{row![0]}</span>
                    <span style={{ fontSize: "14px", color: row![0] === "Desconto" ? "#34C759" : "#2D1B12", fontWeight: 500 }}>{row![1]}</span>
                  </div>
                ))}
                <div style={{ height: "1px", background: "#F5E6EE", margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "#2D1B12" }}>Total</span>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#E8648C" }}>R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>

            {/* Checkout button */}
            <div style={{ padding: "0 20px 24px" }}>
              <button
                onClick={() => navigate("payment")}
                style={{
                  width: "100%", padding: "18px", borderRadius: "16px", border: "none",
                  background: "linear-gradient(135deg, #E8648C, #c2185b)",
                  color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(232,100,140,0.4)",
                }}
              >
                Finalizar pedido · R$ {total.toFixed(2).replace(".", ",")}
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav navigate={navigate} active="cart" cartCount={cartCount} />
    </div>
  );
}

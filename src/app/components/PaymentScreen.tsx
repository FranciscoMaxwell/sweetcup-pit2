import { useState } from "react";
import { AppScreen } from "../App";

interface Props {
  navigate: (s: AppScreen) => void;
  cartTotal: number;
}

export function PaymentScreen({ navigate, cartTotal }: Props) {
  const [method, setMethod] = useState<"card" | "pix" | "cash">("card");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const delivery = 8.90;
  const total = cartTotal + delivery;

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#FFF8F0", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "16px 20px 14px", display: "flex", alignItems: "center", gap: "14px", borderBottom: "1px solid #F5E6EE" }}>
        <button onClick={() => navigate("cart")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#2D1B12" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#2D1B12" }}>Pagamento</h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {/* Payment methods */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 700, color: "#2D1B12" }}>Forma de pagamento</p>
          <div style={{ display: "flex", gap: "10px" }}>
            {([
              ["card", "💳", "Cartão"],
              ["pix", "📱", "PIX"],
              ["cash", "💵", "Dinheiro"],
            ] as const).map(([m, icon, label]) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                style={{
                  flex: 1, padding: "12px 8px", borderRadius: "14px",
                  border: `2px solid ${method === m ? "#E8648C" : "#F5E6EE"}`,
                  background: method === m ? "#FFF0F5" : "#fff",
                  cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "22px" }}>{icon}</span>
                <span style={{ fontSize: "11px", fontWeight: method === m ? 700 : 400, color: method === m ? "#E8648C" : "#8B5E3C" }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card form */}
        {method === "card" && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
            {/* Visual card */}
            <div
              style={{
                background: "linear-gradient(135deg, #c2185b 0%, #E8648C 50%, #f48fb1 100%)",
                borderRadius: "16px", padding: "20px", marginBottom: "20px",
                boxShadow: "0 8px 24px rgba(232,100,140,0.4)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>SweetPay</p>
                <div style={{ display: "flex", gap: "-8px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.6)", marginLeft: "-10px" }} />
                </div>
              </div>
              <p style={{ margin: "0 0 16px", color: "#fff", fontSize: "16px", letterSpacing: "3px", fontFamily: "monospace" }}>
                {cardNum || "•••• •••• •••• ••••"}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.7)", fontSize: "10px" }}>TITULAR</p>
                  <p style={{ margin: 0, color: "#fff", fontSize: "13px", fontWeight: 600 }}>{cardName || "SEU NOME"}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 2px", color: "rgba(255,255,255,0.7)", fontSize: "10px" }}>VALIDADE</p>
                  <p style={{ margin: 0, color: "#fff", fontSize: "13px", fontWeight: 600 }}>{expiry || "MM/AA"}</p>
                </div>
              </div>
            </div>

            {/* Fields */}
            {[
              { label: "Número do cartão", value: cardNum, setter: (v: string) => setCardNum(formatCard(v)), placeholder: "0000 0000 0000 0000" },
              { label: "Nome do titular", value: cardName, setter: (v: string) => setCardName(v.toUpperCase()), placeholder: "COMO NO CARTÃO" },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label} style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8B5E3C", marginBottom: "6px" }}>{label}</label>
                <input
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #F5E6EE", background: "#FFF8F0", fontSize: "14px", color: "#2D1B12", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { label: "Validade", value: expiry, setter: (v: string) => setExpiry(formatExpiry(v)), placeholder: "MM/AA" },
                { label: "CVV", value: cvv, setter: (v: string) => setCvv(v.replace(/\D/g, "").slice(0, 3)), placeholder: "•••" },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label} style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8B5E3C", marginBottom: "6px" }}>{label}</label>
                  <input
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #F5E6EE", background: "#FFF8F0", fontSize: "14px", color: "#2D1B12", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PIX */}
        {method === "pix" && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px", textAlign: "center" }}>
            <div style={{ width: "140px", height: "140px", background: "#F5E6EE", borderRadius: "16px", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100px", height: "100px", background: "#2D1B12", borderRadius: "8px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "3px", padding: "10px" }}>
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} style={{ background: Math.random() > 0.5 ? "#fff" : "#2D1B12", borderRadius: "1px" }} />
                ))}
              </div>
            </div>
            <p style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: 700, color: "#2D1B12" }}>Escaneie o QR Code</p>
            <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#8B5E3C" }}>Ou use a chave PIX abaixo</p>
            <div style={{ background: "#FFF8F0", borderRadius: "12px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#2D1B12", fontFamily: "monospace" }}>sweetcup@pix.com.br</span>
              <button style={{ background: "#E8648C", border: "none", color: "#fff", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>Copiar</button>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#C4A882" }}>⏱ Válido por 30 minutos</p>
          </div>
        )}

        {/* Cash */}
        {method === "cash" && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
            <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#8B5E3C" }}>💵 Pagamento na entrega. Informe o valor que você vai pagar:</p>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#8B5E3C", marginBottom: "6px" }}>Troco para</label>
            <input placeholder="Ex: R$ 50,00" style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #F5E6EE", background: "#FFF8F0", fontSize: "14px", color: "#2D1B12", outline: "none", boxSizing: "border-box" }} />
          </div>
        )}

        {/* Delivery address */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#2D1B12" }}>📍 Endereço de entrega</p>
            <button style={{ background: "none", border: "none", color: "#E8648C", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>Alterar</button>
          </div>
          <div style={{ background: "#FFF8F0", borderRadius: "12px", padding: "12px" }}>
            <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, color: "#2D1B12" }}>Rua das Flores, 123 - Apto 45</p>
            <p style={{ margin: 0, fontSize: "13px", color: "#8B5E3C" }}>Jardim Rosa · São Paulo, SP · 01234-567</p>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
          <p style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: 700, color: "#2D1B12" }}>Resumo do pedido</p>
          {[
            ["Subtotal", `R$ ${cartTotal.toFixed(2).replace(".", ",")}`],
            ["Entrega", `R$ ${delivery.toFixed(2).replace(".", ",")}`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", color: "#8B5E3C" }}>{k}</span>
              <span style={{ fontSize: "14px", color: "#2D1B12" }}>{v}</span>
            </div>
          ))}
          <div style={{ height: "1px", background: "#F5E6EE", margin: "12px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#2D1B12" }}>Total</span>
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#E8648C" }}>R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={() => navigate("tracking")}
          style={{
            width: "100%", padding: "18px", borderRadius: "16px", border: "none",
            background: "linear-gradient(135deg, #E8648C, #c2185b)",
            color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 6px 20px rgba(232,100,140,0.4)", marginBottom: "24px",
          }}
        >
          Confirmar pagamento · R$ {total.toFixed(2).replace(".", ",")}
        </button>
      </div>
    </div>
  );
}

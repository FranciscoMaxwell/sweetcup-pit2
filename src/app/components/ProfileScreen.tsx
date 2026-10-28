import { AppScreen } from "../App";
import { BottomNav } from "./BottomNav";

interface Props {
  navigate: (s: AppScreen) => void;
}

const ORDERS = [
  { id: "#SC-4872", date: "23 Mai 2026", items: "Rose Velvet x2, Golden Dream x1", total: "R$ 46,70", status: "Entregue" },
  { id: "#SC-4801", date: "18 Mai 2026", items: "Chocolate Noir x3", total: "R$ 47,70", status: "Entregue" },
  { id: "#SC-4756", date: "10 Mai 2026", items: "Pearl Dream x1, Lemon Zest x2", total: "R$ 44,90", status: "Entregue" },
];

const MENU_ITEMS = [
  { icon: "📦", label: "Meus pedidos", sub: "3 pedidos realizados", action: "tracking" as AppScreen },
  { icon: "📍", label: "Endereços", sub: "Rua das Flores, 123", action: null },
  { icon: "💳", label: "Métodos de pagamento", sub: "Cartão final 4872", action: null },
  { icon: "🔔", label: "Notificações", sub: "Promoções e novidades", action: null },
  { icon: "⭐", label: "Programa de pontos", sub: "1.240 pontos acumulados", action: null },
  { icon: "❓", label: "Ajuda & Suporte", sub: "FAQ e atendimento", action: null },
  { icon: "⚙️", label: "Configurações", sub: "Privacidade e segurança", action: null },
];

export function ProfileScreen({ navigate }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#FFF8F0", minHeight: "100%" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #c2185b 0%, #E8648C 100%)",
          padding: "20px 20px 40px", position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", right: "30px", bottom: "-30px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#fff", fontSize: "20px", fontWeight: 700 }}>Meu Perfil</h2>
          <button style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "10px", padding: "8px 12px", color: "#fff", fontSize: "13px", cursor: "pointer" }}>
            Editar
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,255,255,0.5)" }}>
              <img
                src="https://images.unsplash.com/photo-1502597276204-a3833c063739?w=150&q=80"
                alt="User"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ position: "absolute", bottom: "0", right: "0", width: "22px", height: "22px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>
              📷
            </div>
          </div>
          <div>
            <h3 style={{ margin: "0 0 3px", color: "#fff", fontSize: "20px", fontWeight: 700 }}>Ana Clara Santos</h3>
            <p style={{ margin: "0 0 6px", color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>anaclarasantos@email.com</p>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "10px", padding: "3px 10px", display: "inline-block" }}>
              <span style={{ color: "#fff", fontSize: "11px" }}>⭐ Cliente Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ margin: "-20px 20px 0", background: "#fff", borderRadius: "20px", padding: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-around", marginBottom: "16px" }}>
        {[
          ["23", "Pedidos"],
          ["1.240", "Pontos"],
          ["8", "Favoritos"],
        ].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 2px", fontSize: "22px", fontWeight: 800, color: "#E8648C" }}>{val}</p>
            <p style={{ margin: 0, fontSize: "11px", color: "#8B5E3C" }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {/* Recent orders */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#2D1B12" }}>Pedidos recentes</p>
            <button onClick={() => navigate("tracking")} style={{ background: "none", border: "none", color: "#E8648C", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>Ver todos</button>
          </div>
          {ORDERS.map((o) => (
            <div
              key={o.id}
              style={{ background: "#fff", borderRadius: "16px", padding: "14px", marginBottom: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#2D1B12" }}>{o.id}</span>
                <span style={{ background: "#E8F5E9", color: "#34C759", fontSize: "11px", fontWeight: 600, borderRadius: "8px", padding: "2px 8px" }}>{o.status}</span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#8B5E3C" }}>{o.items}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#C4A882" }}>{o.date}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#E8648C" }}>{o.total}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          {MENU_ITEMS.map((item, i) => (
            <button
              key={item.label}
              onClick={() => item.action && navigate(item.action)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 12px", background: "none", border: "none", cursor: "pointer",
                borderBottom: i < MENU_ITEMS.length - 1 ? "1px solid #F5E6EE" : "none",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "22px", width: "32px", textAlign: "center" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 600, color: "#2D1B12" }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#C4A882" }}>{item.sub}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          style={{
            width: "100%", padding: "16px", borderRadius: "16px", border: "2px solid #FFE8EF",
            background: "#fff", color: "#E8648C", fontSize: "15px", fontWeight: 700,
            cursor: "pointer", marginBottom: "24px",
          }}
        >
          Sair da conta
        </button>
      </div>

      <BottomNav navigate={navigate} active="profile" cartCount={0} />
    </div>
  );
}

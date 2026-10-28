import { AppScreen } from "../App";

interface Props {
  navigate: (s: AppScreen) => void;
}

const BRANCHES = [
  {
    label: "Produtos", icon: "🧁", color: "#E8648C", angle: -90,
    items: ["Catálogo", "Categorias", "Busca", "Detalhes", "Avaliações", "Ingredientes"],
    screen: "home" as AppScreen,
  },
  {
    label: "Carrinho", icon: "🛒", color: "#c2185b", angle: -30,
    items: ["Itens", "Quantidades", "Cupom", "Subtotal", "Checkout"],
    screen: "cart" as AppScreen,
  },
  {
    label: "Pagamento", icon: "💳", color: "#ad1457", angle: 30,
    items: ["Cartão crédito", "PIX", "Dinheiro", "Endereço", "Confirmação"],
    screen: "payment" as AppScreen,
  },
  {
    label: "Entrega", icon: "🛵", color: "#880e4f", angle: 90,
    items: ["Rastreamento", "Timeline", "Mapa", "Status", "Notificações"],
    screen: "tracking" as AppScreen,
  },
  {
    label: "Perfil", icon: "👤", color: "#6a1b9a", angle: 150,
    items: ["Dados", "Histórico", "Endereços", "Pagamentos", "Config."],
    screen: "profile" as AppScreen,
  },
  {
    label: "Promoções", icon: "🎉", color: "#4a148c", angle: 210,
    items: ["Banners", "Descontos", "Cupons", "Programa pontos", "Favoritos"],
    screen: "favorites" as AppScreen,
  },
];

const DEG = Math.PI / 180;
const CENTER_X = 160;
const CENTER_Y = 160;
const INNER_R = 44;
const BRANCH_R = 100;
const ITEM_R = 150;

export function ConceptualMap({ navigate }: Props) {
  return (
    <div style={{ background: "#FFF8F0", minHeight: "100%", padding: "16px 16px 24px" }}>
      <div style={{ marginBottom: "12px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: "#2D1B12" }}>Mapa Conceitual</h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#8B5E3C" }}>Organização das funcionalidades do SweetCup</p>
      </div>

      <div style={{ background: "#fff", borderRadius: "20px", padding: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: "12px" }}>
        <svg viewBox="0 0 320 320" width="100%" style={{ display: "block" }}>
          <defs>
            {BRANCHES.map((b) => (
              <radialGradient key={b.label} id={`grad-${b.label}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={b.color} stopOpacity="1" />
                <stop offset="100%" stopColor={b.color} stopOpacity="0.7" />
              </radialGradient>
            ))}
          </defs>

          {/* Outer decorative ring */}
          <circle cx={CENTER_X} cy={CENTER_Y} r="155" fill="none" stroke="#F5E6EE" strokeWidth="1" />
          <circle cx={CENTER_X} cy={CENTER_Y} r="140" fill="none" stroke="#FFE8EF" strokeWidth="0.5" />

          {/* Branch spokes and nodes */}
          {BRANCHES.map((branch) => {
            const rad = branch.angle * DEG;
            const bx = CENTER_X + Math.cos(rad) * BRANCH_R;
            const by = CENTER_Y + Math.sin(rad) * BRANCH_R;

            return (
              <g key={branch.label}>
                {/* Spoke from center to branch */}
                <line
                  x1={CENTER_X + Math.cos(rad) * INNER_R}
                  y1={CENTER_Y + Math.sin(rad) * INNER_R}
                  x2={CENTER_X + Math.cos(rad) * (BRANCH_R - 22)}
                  y2={CENTER_Y + Math.sin(rad) * (BRANCH_R - 22)}
                  stroke={branch.color}
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {/* Item lines */}
                {branch.items.slice(0, 4).map((item, i) => {
                  const spread = 28;
                  const off = (i - (Math.min(branch.items.length, 4) - 1) / 2) * spread;
                  const perpRad = rad + Math.PI / 2;
                  const ix = bx + Math.cos(rad) * 36 + Math.cos(perpRad) * off;
                  const iy = by + Math.sin(rad) * 36 + Math.sin(perpRad) * off;
                  return (
                    <g key={item}>
                      <line
                        x1={bx + Math.cos(rad) * 22}
                        y1={by + Math.sin(rad) * 22}
                        x2={ix}
                        y2={iy}
                        stroke={branch.color}
                        strokeWidth="0.8"
                        opacity="0.5"
                      />
                      <rect
                        x={ix - 18} y={iy - 7} width="36" height="14" rx="7"
                        fill={branch.color} opacity="0.12"
                      />
                      <text
                        x={ix} y={iy + 3.5}
                        textAnchor="middle" fontSize="6.5"
                        fill={branch.color} fontWeight="500"
                      >
                        {item}
                      </text>
                    </g>
                  );
                })}

                {/* Branch node */}
                <circle cx={bx} cy={by} r="22" fill={`url(#grad-${branch.label})`} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))" }} />
                <text x={bx} y={by - 4} textAnchor="middle" fontSize="14">{branch.icon}</text>
                <text x={bx} y={by + 10} textAnchor="middle" fontSize="7" fontWeight="700" fill="white">{branch.label}</text>

                {/* Click overlay */}
                <circle cx={bx} cy={by} r="22" fill="transparent" style={{ cursor: "pointer" }} onClick={() => navigate(branch.screen)} />
              </g>
            );
          })}

          {/* Center node */}
          <circle cx={CENTER_X} cy={CENTER_Y} r={INNER_R} fill="url(#grad-Produtos)" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))" }} />
          <circle cx={CENTER_X} cy={CENTER_Y} r={INNER_R} fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
          <text x={CENTER_X} y={CENTER_Y - 10} textAnchor="middle" fontSize="22">🧁</text>
          <text x={CENTER_X} y={CENTER_Y + 6} textAnchor="middle" fontSize="11" fontWeight="800" fill="white">Sweet</text>
          <text x={CENTER_X} y={CENTER_Y + 18} textAnchor="middle" fontSize="11" fontWeight="800" fill="white">Cup</text>
          <circle cx={CENTER_X} cy={CENTER_Y} r={INNER_R} fill="transparent" style={{ cursor: "pointer" }} onClick={() => navigate("home")} />
        </svg>
      </div>

      {/* Branch details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {BRANCHES.map((branch) => (
          <button
            key={branch.label}
            onClick={() => navigate(branch.screen)}
            style={{
              background: "#fff", borderRadius: "16px", padding: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1.5px solid ${branch.color}20`,
              cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: branch.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                {branch.icon}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#2D1B12" }}>{branch.label}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {branch.items.map((item) => (
                <span
                  key={item}
                  style={{
                    fontSize: "10px", padding: "2px 7px", borderRadius: "8px",
                    background: `${branch.color}15`, color: branch.color, fontWeight: 500,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* App description */}
      <div style={{ marginTop: "12px", background: "linear-gradient(135deg, #c2185b, #E8648C)", borderRadius: "16px", padding: "16px" }}>
        <p style={{ margin: "0 0 6px", color: "#fff", fontSize: "14px", fontWeight: 700 }}>SweetCup — Visão Geral</p>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: "12px", lineHeight: 1.6 }}>
          Aplicativo mobile de delivery de cupcakes gourmet com catálogo de produtos, sistema de carrinho e pagamento, rastreamento de pedidos em tempo real e perfil personalizado do usuário.
        </p>
      </div>
    </div>
  );
}

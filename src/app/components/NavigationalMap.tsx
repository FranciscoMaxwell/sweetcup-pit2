import { AppScreen } from "../App";

interface Props {
  navigate: (s: AppScreen) => void;
}

interface NodeDef {
  id: AppScreen;
  label: string;
  x: number;
  y: number;
  color: string;
  icon: string;
}

const NODES: NodeDef[] = [
  { id: "splash",    label: "Splash",     x: 155, y: 20,  color: "#c2185b", icon: "🧁" },
  { id: "home",      label: "Início",     x: 155, y: 100, color: "#E8648C", icon: "🏠" },
  { id: "product",   label: "Produto",    x: 60,  y: 185, color: "#E8648C", icon: "🛍️" },
  { id: "favorites", label: "Favoritos",  x: 255, y: 185, color: "#e91e63", icon: "❤️" },
  { id: "cart",      label: "Carrinho",   x: 60,  y: 275, color: "#c2185b", icon: "🛒" },
  { id: "profile",   label: "Perfil",     x: 255, y: 275, color: "#ad1457", icon: "👤" },
  { id: "payment",   label: "Pagamento",  x: 60,  y: 365, color: "#880e4f", icon: "💳" },
  { id: "tracking",  label: "Rastreio",   x: 155, y: 455, color: "#7b1fa2", icon: "📍" },
];

type Edge = [AppScreen, AppScreen, string?];

const EDGES: Edge[] = [
  ["splash",   "home",      "Entrar"],
  ["home",     "product",   "Selecionar"],
  ["home",     "favorites", "Favoritos"],
  ["home",     "cart",      "Carrinho"],
  ["home",     "profile",   "Perfil"],
  ["product",  "cart",      "Add ao carrinho"],
  ["product",  "favorites", "Favoritar"],
  ["cart",     "payment",   "Finalizar"],
  ["payment",  "tracking",  "Confirmar"],
  ["tracking", "home",      "Voltar"],
];

const NODE_W = 76;
const NODE_H = 34;

function getCenter(node: NodeDef) {
  return { cx: node.x + NODE_W / 2, cy: node.y + NODE_H / 2 };
}

function getEdgePoints(from: NodeDef, to: NodeDef) {
  const fc = getCenter(from);
  const tc = getCenter(to);
  const dx = tc.cx - fc.cx;
  const dy = tc.cy - fc.cy;
  const angle = Math.atan2(dy, dx);
  const halfW = NODE_W / 2;
  const halfH = NODE_H / 2;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  let sx: number, sy: number, ex: number, ey: number;
  if (absDx * halfH > absDy * halfW) {
    sx = fc.cx + Math.sign(dx) * halfW;
    sy = fc.cy + Math.sign(dx) * dy / absDx * halfW;
    ex = tc.cx - Math.sign(dx) * halfW;
    ey = tc.cy - Math.sign(dx) * dy / absDx * halfW;
  } else {
    sx = fc.cx + Math.sign(dy) * dx / absDy * halfH;
    sy = fc.cy + Math.sign(dy) * halfH;
    ex = tc.cx - Math.sign(dy) * dx / absDy * halfH;
    ey = tc.cy - Math.sign(dy) * halfH;
  }
  return { sx, sy, ex, ey, angle };
}

export function NavigationalMap({ navigate }: Props) {
  const SVG_W = 350;
  const SVG_H = 510;

  return (
    <div style={{ background: "#FFF8F0", minHeight: "100%", padding: "16px 16px 24px" }}>
      <div style={{ marginBottom: "12px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: "#2D1B12" }}>Mapa Navegacional</h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#8B5E3C" }}>Fluxo de navegação entre as telas — clique nos nós</p>
      </div>

      <div
        style={{
          background: "#fff", borderRadius: "20px", padding: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflowX: "auto",
        }}
      >
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: "block", margin: "0 auto" }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#C4A882" />
            </marker>
            <marker id="arrow-highlight" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#E8648C" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map(([fromId, toId, label], i) => {
            const from = NODES.find((n) => n.id === fromId)!;
            const to = NODES.find((n) => n.id === toId)!;
            const { sx, sy, ex, ey } = getEdgePoints(from, to);
            const mx = (sx + ex) / 2;
            const my = (sy + ey) / 2;
            return (
              <g key={i}>
                <line
                  x1={sx} y1={sy} x2={ex} y2={ey}
                  stroke="#E8D5DE" strokeWidth="1.5"
                  markerEnd="url(#arrow)"
                  strokeDasharray={fromId === "tracking" && toId === "home" ? "5 3" : undefined}
                />
                {label && (
                  <text
                    x={mx} y={my - 3}
                    textAnchor="middle"
                    fontSize="7"
                    fill="#8B5E3C"
                    style={{ pointerEvents: "none" }}
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => (
            <g
              key={node.id}
              onClick={() => navigate(node.id)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={node.x} y={node.y}
                width={NODE_W} height={NODE_H}
                rx="10"
                fill={node.color}
                style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))" }}
              />
              <text
                x={node.x + NODE_W / 2}
                y={node.y + NODE_H / 2 - 4}
                textAnchor="middle"
                fontSize="12"
                fill="white"
              >
                {node.icon}
              </text>
              <text
                x={node.x + NODE_W / 2}
                y={node.y + NODE_H / 2 + 9}
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="600"
                fill="white"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ marginTop: "12px", background: "#fff", borderRadius: "16px", padding: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <p style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 700, color: "#2D1B12" }}>Fluxos principais</p>
        {[
          { flow: "Splash → Início → Produto → Carrinho → Pagamento → Rastreio", label: "Jornada de compra completa" },
          { flow: "Início → Favoritos → Produto → Carrinho", label: "Compra via favoritos" },
          { flow: "Início → Perfil → Pedidos → Rastreio", label: "Acompanhamento de pedidos" },
        ].map(({ flow, label }) => (
          <div key={label} style={{ marginBottom: "10px" }}>
            <p style={{ margin: "0 0 3px", fontSize: "12px", fontWeight: 600, color: "#E8648C" }}>{label}</p>
            <p style={{ margin: 0, fontSize: "11px", color: "#8B5E3C", lineHeight: 1.5 }}>{flow}</p>
          </div>
        ))}
      </div>

      {/* Connection table */}
      <div style={{ marginTop: "12px", background: "#fff", borderRadius: "16px", padding: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <p style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 700, color: "#2D1B12" }}>Conexões</p>
        {EDGES.map(([from, to, label], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 0", borderBottom: i < EDGES.length - 1 ? "1px solid #F5E6EE" : "none" }}>
            <span style={{ fontSize: "11px", color: "#2D1B12", fontWeight: 600, minWidth: "60px" }}>{NODES.find((n) => n.id === from)?.label}</span>
            <svg width="20" height="10"><path d="M0 5 L16 5 M12 1 L16 5 L12 9" stroke="#E8648C" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
            <span style={{ fontSize: "11px", color: "#2D1B12", fontWeight: 600, minWidth: "60px" }}>{NODES.find((n) => n.id === to)?.label}</span>
            {label && <span style={{ fontSize: "10px", color: "#C4A882" }}>({label})</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

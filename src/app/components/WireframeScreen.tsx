import { AppScreen } from "../App";

interface Props {
  navigate: (s: AppScreen) => void;
}

function WF({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1.5px solid #C4A882", borderRadius: "10px", overflow: "hidden",
        background: "#fff", cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.2s",
      }}
    >
      <div style={{ background: "#F5E6EE", padding: "4px 8px", borderBottom: "1px solid #C4A882" }}>
        <span style={{ fontSize: "9px", fontWeight: 700, color: "#8B5E3C", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ padding: "6px" }}>{children}</div>
    </div>
  );
}

function Box({ w = "100%", h = 8, color = "#E8D5DE", r = 3, style = {} }: { w?: string | number; h?: number; color?: string; r?: number; style?: React.CSSProperties }) {
  return <div style={{ width: w, height: h, background: color, borderRadius: r, marginBottom: 3, ...style }} />;
}

function Img({ h = 40, color = "#F0D8E0" }: { h?: number; color?: string }) {
  return (
    <div style={{ width: "100%", height: h, background: color, borderRadius: 4, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "20px", height: "14px", border: "1.5px solid #C4A882", borderRadius: 2, position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "#C4A882", borderRadius: "0 0 1px 1px" }} />
        <div style={{ position: "absolute", top: "2px", right: "2px", width: "6px", height: "6px", borderRadius: "50%", background: "#C4A882" }} />
      </div>
    </div>
  );
}

function Row({ children, gap = 3, style = {} }: { children: React.ReactNode; gap?: number; style?: React.CSSProperties }) {
  return <div style={{ display: "flex", gap, marginBottom: 3, ...style }}>{children}</div>;
}

export function WireframeScreen({ navigate }: Props) {
  const screens: { key: AppScreen; label: string; content: React.ReactNode }[] = [
    {
      key: "splash", label: "1. Splash",
      content: (
        <div style={{ background: "#F5E6EE", padding: 8, borderRadius: 4, textAlign: "center", height: 90, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#C4A882", margin: "0 auto 4px" }} />
            <Box w="60%" h={6} color="#C4A882" style={{ margin: "0 auto 3px" }} />
            <Box w="40%" h={4} color="#D8B8C8" style={{ margin: "0 auto 6px" }} />
          </div>
          <div>
            <Box h={8} color="#E8648C" style={{ borderRadius: 4 }} />
            <Box h={6} color="transparent" style={{ border: "1px solid #C4A882", borderRadius: 4 }} />
          </div>
        </div>
      ),
    },
    {
      key: "home", label: "2. Home",
      content: (
        <div style={{ height: 90, display: "flex", flexDirection: "column", gap: 2 }}>
          <Row>
            <div style={{ flex: 1 }}>
              <Box h={4} w="70%" />
              <Box h={5} />
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#E8D5DE" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#E8D5DE" }} />
            </div>
          </Row>
          <Box h={6} color="#F5E6EE" r={4} />
          <Box h={20} color="#F0D8E0" r={4} />
          <Row gap={2}>
            {[1, 2, 3].map((i) => <Box key={i} w="30%" h={5} color="#E8D5DE" r={8} />)}
          </Row>
          <Row gap={2}>
            {[1, 2].map((i) => (
              <div key={i} style={{ flex: 1, background: "#F5E6EE", borderRadius: 4, height: 20 }}>
                <div style={{ height: "60%", background: "#E8D5DE", borderRadius: "4px 4px 0 0" }} />
              </div>
            ))}
          </Row>
          <Box h={6} color="#E8D5DE" r={2} />
        </div>
      ),
    },
    {
      key: "product", label: "3. Produto",
      content: (
        <div style={{ height: 90, display: "flex", flexDirection: "column", gap: 2 }}>
          <Img h={35} />
          <Row>
            <Box w="60%" h={6} />
            <Box w="25%" h={6} color="#E8648C" />
          </Row>
          <Box h={4} w="80%" color="#E8D5DE" />
          <Row gap={2}>
            <Box h={5} w="50%" color="#E8648C" />
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#E8D5DE" }} />
              <Box w="12px" h={6} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#E8648C" }} />
            </div>
          </Row>
          <Row gap={2}>
            {["Desc", "Ingr", "Aval"].map((t) => <Box key={t} w="30%" h={4} color="#E8D5DE" r={2} />)}
          </Row>
          <Box h={8} color="#E8648C" r={4} />
        </div>
      ),
    },
    {
      key: "cart", label: "4. Carrinho",
      content: (
        <div style={{ height: 90, display: "flex", flexDirection: "column", gap: 2 }}>
          <Row>
            <div style={{ width: 10, height: 10, background: "#E8D5DE", borderRadius: "50%" }} />
            <Box h={5} w="60%" />
          </Row>
          {[1, 2].map((i) => (
            <div key={i} style={{ background: "#F5E6EE", borderRadius: 4, padding: 4, display: "flex", gap: 4 }}>
              <div style={{ width: 22, height: 22, background: "#E8D5DE", borderRadius: 3 }} />
              <div style={{ flex: 1 }}>
                <Box h={4} w="70%" />
                <Row gap={2}><Box w="40%" h={4} color="#E8648C" /><div style={{ display: "flex", gap: 2 }}>{[1, 2, 3].map((j) => <div key={j} style={{ width: 8, height: 8, background: j === 2 ? "#E8648C" : "#E8D5DE", borderRadius: "50%" }} />)}</div></Row>
              </div>
            </div>
          ))}
          <Row gap={2}>
            <Box h={6} color="#F5E6EE" />
            <Box w="30%" h={6} color="#E8648C" r={4} />
          </Row>
          <Box h={8} color="#E8648C" r={4} />
        </div>
      ),
    },
    {
      key: "payment", label: "5. Pagamento",
      content: (
        <div style={{ height: 90, display: "flex", flexDirection: "column", gap: 2 }}>
          <Row gap={2}>
            {[1, 2, 3].map((i) => <div key={i} style={{ flex: 1, background: i === 1 ? "#E8648C" : "#F5E6EE", borderRadius: 4, height: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}><div style={{ width: 10, height: 8, background: i === 1 ? "rgba(255,255,255,0.6)" : "#E8D5DE", borderRadius: 2 }} /><div style={{ width: "80%", height: 3, background: i === 1 ? "rgba(255,255,255,0.5)" : "#E8D5DE", borderRadius: 2 }} /></div>)}
          </Row>
          <div style={{ background: "linear-gradient(135deg, #c2185b, #E8648C)", borderRadius: 4, padding: 5, height: 26 }}>
            <Box h={3} w="60%" color="rgba(255,255,255,0.5)" />
            <Box h={4} color="rgba(255,255,255,0.4)" />
          </div>
          <Row gap={2}><Box h={5} /><Box h={5} /></Row>
          <Box h={5} color="#F5E6EE" />
          <Box h={5} color="#F5E6EE" />
          <Box h={8} color="#E8648C" r={4} />
        </div>
      ),
    },
    {
      key: "tracking", label: "6. Rastreio",
      content: (
        <div style={{ height: 90, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ background: "#F0D8E0", borderRadius: 4, padding: 5, height: 22 }}>
            <Box h={4} w="50%" color="#E8648C" />
            <Box h={3} w="70%" color="#D8B8C8" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <Row key={i} gap={3} style={{ alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: i <= 2 ? "#E8648C" : "#E8D5DE", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Box h={4} w={i <= 2 ? "80%" : "60%"} color={i <= 2 ? "#C4A882" : "#E8D5DE"} />
              </div>
            </Row>
          ))}
          <div style={{ background: "#E8F0E8", borderRadius: 4, height: 22 }}>
            <Box h={22} color="#E8F0E8" style={{ borderRadius: 4 }} />
          </div>
        </div>
      ),
    },
    {
      key: "profile", label: "7. Perfil",
      content: (
        <div style={{ height: 90, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ background: "#F0D8E0", borderRadius: 4, padding: 5, display: "flex", gap: 5 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#C4A882" }} />
            <div style={{ flex: 1 }}>
              <Box h={4} w="60%" color="#E8648C" />
              <Box h={3} w="80%" color="#D8B8C8" />
            </div>
          </div>
          <Row gap={2} style={{ justifyContent: "space-around" }}>
            {[1, 2, 3].map((i) => <div key={i} style={{ flex: 1, background: "#F5E6EE", borderRadius: 4, height: 14, padding: 3 }}><Box h={4} color="#E8648C" /><Box h={3} w="80%" color="#E8D5DE" /></div>)}
          </Row>
          {[1, 2, 3, 4].map((i) => (
            <Row key={i} gap={3}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F0D8E0" }} />
              <Box h={4} />
            </Row>
          ))}
        </div>
      ),
    },
    {
      key: "favorites", label: "8. Favoritos",
      content: (
        <div style={{ height: 90, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box h={5} />
          <div style={{ background: "#F0D8E0", borderRadius: 4, height: 28, position: "relative" }}>
            <Box h={28} color="#E8D5DE" style={{ borderRadius: 4 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 4, display: "flex", justifyContent: "space-between" }}>
              <Box w="50%" h={4} color="rgba(0,0,0,0.2)" />
              <Box w="20%" h={6} color="#E8648C" r={3} />
            </div>
          </div>
          <Row gap={2}>
            {[1, 2].map((i) => (
              <div key={i} style={{ flex: 1, background: "#F5E6EE", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: 20, background: "#E8D5DE" }} />
                <div style={{ padding: 3 }}><Box h={3} /><Box h={3} w="60%" /></div>
              </div>
            ))}
          </Row>
          <Box h={6} color="#E8D5DE" r={2} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ background: "#FFF8F0", minHeight: "100%", padding: "16px 16px 24px" }}>
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: "#2D1B12" }}>Wireframes</h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#8B5E3C" }}>Estrutura simplificada de cada tela — clique para navegar</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {screens.map(({ key, label, content }) => (
          <WF key={key} label={label} onClick={() => navigate(key)}>
            {content}
          </WF>
        ))}
      </div>

      <div style={{ marginTop: "16px", background: "#fff", borderRadius: "16px", padding: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 700, color: "#2D1B12" }}>Legenda</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {[
            { color: "#E8648C", label: "Elemento primário/CTA" },
            { color: "#E8D5DE", label: "Elementos de conteúdo" },
            { color: "#F0D8E0", label: "Áreas de imagem" },
            { color: "#F5E6EE", label: "Containers/cards" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: color, flexShrink: 0 }} />
              <span style={{ fontSize: "10px", color: "#8B5E3C" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { AppScreen } from "../App";

interface Props {
  navigate: (s: AppScreen) => void;
}

export function SplashScreen({ navigate }: Props) {
  return (
    <div
      style={{
        width: "100%", height: "100%", minHeight: "750px",
        background: "linear-gradient(165deg, #c2185b 0%, #e8648c 35%, #f48fb1 70%, #fce4ec 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "space-between", padding: "60px 32px 52px", position: "relative", overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", top: "60px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: "100px", left: "-50px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", bottom: "-40px", left: "40px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", top: "200px", left: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

      {/* Top area */}
      <div />

      {/* Center logo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", zIndex: 1 }}>
        {/* Cupcake icon */}
        <div
          style={{
            width: "120px", height: "120px", borderRadius: "50%",
            background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            {/* Cupcake wrapper */}
            <path d="M18 34 L22 56 L42 56 L46 34 Z" fill="rgba(255,255,255,0.9)" />
            <path d="M20 34 L22 56 L42 56 L44 34 Z" fill="rgba(255,255,255,0.7)" />
            {/* Lines on wrapper */}
            <line x1="26" y1="34" x2="24" y2="56" stroke="rgba(194,24,91,0.4)" strokeWidth="1.5" />
            <line x1="32" y1="34" x2="32" y2="56" stroke="rgba(194,24,91,0.4)" strokeWidth="1.5" />
            <line x1="38" y1="34" x2="40" y2="56" stroke="rgba(194,24,91,0.4)" strokeWidth="1.5" />
            {/* Frosting */}
            <path d="M14 34 C14 34 16 22 20 20 C22 19 24 20 26 18 C28 16 28 12 32 10 C36 12 36 16 38 18 C40 20 42 19 44 20 C48 22 50 34 50 34 Z" fill="rgba(255,255,255,0.95)" />
            <path d="M18 34 C18 34 20 26 22 24 C24 22 25 23 27 21 C29 19 29 15 32 14 C35 15 35 19 37 21 C39 23 40 22 42 24 C44 26 46 34 46 34 Z" fill="rgba(255,255,255,0.6)" />
            {/* Cherry on top */}
            <circle cx="32" cy="9" r="4" fill="#e8648c" />
            <line x1="32" y1="9" x2="32" y2="5" stroke="#8B5E3C" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Brand name */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: "44px", fontWeight: 800, letterSpacing: "-1px", margin: 0, textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}>
            SweetCup
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", margin: "8px 0 0", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 400 }}>
            Gourmet Cupcakes
          </p>
        </div>

        {/* Tagline */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)", borderRadius: "24px",
            padding: "10px 24px", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "13px", margin: 0, textAlign: "center", letterSpacing: "0.5px" }}>
            ✨ Momentos doces feitos com amor ✨
          </p>
        </div>

        {/* Cupcake image banner */}
        <div
          style={{
            width: "260px", height: "160px", borderRadius: "24px", overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1551500693-f3e9e7842948?w=500&q=80"
            alt="Cupcakes gourmet"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", zIndex: 1, width: "100%" }}>
        <button
          onClick={() => navigate("home")}
          style={{
            width: "100%", padding: "18px", borderRadius: "16px", border: "none",
            background: "#fff", color: "#E8648C", fontSize: "17px", fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.3px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          Entrar
        </button>
        <button
          style={{
            background: "transparent", border: "2px solid rgba(255,255,255,0.5)",
            color: "#fff", borderRadius: "16px", padding: "14px", width: "100%",
            fontSize: "15px", fontWeight: 500, cursor: "pointer",
          }}
        >
          Criar conta
        </button>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", margin: 0 }}>
          Ao entrar, você concorda com os termos de uso
        </p>
      </div>
    </div>
  );
}

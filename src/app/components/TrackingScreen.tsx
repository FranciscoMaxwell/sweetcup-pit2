import { useState, useEffect } from "react";
import { AppScreen } from "../App";
import { BottomNav } from "./BottomNav";

interface Props {
  navigate: (s: AppScreen) => void;
}

const STEPS = [
  { id: 0, label: "Pedido recebido", desc: "Seu pedido foi confirmado com sucesso", icon: "✅", time: "14:32" },
  { id: 1, label: "Em preparo", desc: "Nossos confeiteiros estão preparando seu pedido", icon: "👨‍🍳", time: "14:45" },
  { id: 2, label: "Saiu para entrega", desc: "Seu pedido está a caminho!", icon: "🛵", time: "15:10" },
  { id: 3, label: "Entregue", desc: "Aproveite seus cupcakes! 🎉", icon: "🏠", time: "~15:40" },
];

export function TrackingScreen({ navigate }: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#FFF8F0", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "16px 20px 14px", display: "flex", alignItems: "center", gap: "14px", borderBottom: "1px solid #F5E6EE" }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#2D1B12" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#2D1B12" }}>Rastrear pedido</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#C4A882" }}>Pedido #SC-20240523-4872</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Status banner */}
        <div style={{ padding: "16px 20px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #c2185b, #E8648C)",
              borderRadius: "20px", padding: "20px", position: "relative", overflow: "hidden",
              boxShadow: "0 6px 20px rgba(232,100,140,0.35)",
            }}
          >
            <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>Status atual</p>
            <p style={{ margin: "0 0 8px", color: "#fff", fontSize: "20px", fontWeight: 800 }}>
              {STEPS[currentStep].icon} {STEPS[currentStep].label}
            </p>
            <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>{STEPS[currentStep].desc}</p>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "10px", padding: "8px 14px", display: "inline-block" }}>
              <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>
                ⏱ Previsão: {currentStep < 3 ? "~30-45 minutos" : "Entregue!"}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 700, color: "#2D1B12" }}>Acompanhamento</p>
            {STEPS.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              return (
                <div key={step.id} style={{ display: "flex", gap: "16px", position: "relative" }}>
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div
                      style={{
                        position: "absolute", left: "19px", top: "40px",
                        width: "2px", height: "52px",
                        background: i < currentStep ? "#E8648C" : "#F5E6EE",
                        transition: "background 0.5s",
                      }}
                    />
                  )}
                  {/* Icon */}
                  <div
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                      background: done ? (active ? "#E8648C" : "#FFE8EF") : "#F5F5F5",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: active ? "3px solid #c2185b" : "2px solid transparent",
                      boxShadow: active ? "0 0 0 4px rgba(232,100,140,0.2)" : "none",
                      transition: "all 0.5s",
                      fontSize: "18px",
                    }}
                  >
                    {done ? step.icon : <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#D0D0D0" }} />}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <p style={{ margin: "0 0 3px", fontSize: "15px", fontWeight: done ? 700 : 400, color: done ? "#2D1B12" : "#C4A882" }}>
                        {step.label}
                      </p>
                      <span style={{ fontSize: "12px", color: done ? "#E8648C" : "#C4A882" }}>{step.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: done ? "#8B5E3C" : "#C4A882" }}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map illustration */}
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: 700, color: "#2D1B12" }}>📍 Localização em tempo real</p>
            <div
              style={{
                height: "180px", borderRadius: "14px", overflow: "hidden",
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)",
                position: "relative",
              }}
            >
              {/* Mock map grid */}
              <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
                {[40, 80, 120, 160].map((y) => (
                  <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                ))}
                {[50, 100, 150, 200, 250, 300, 350].map((x) => (
                  <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                ))}
                {/* Roads */}
                <rect x="0" y="70" width="400" height="16" fill="rgba(255,255,255,0.7)" />
                <rect x="120" y="0" width="16" height="200" fill="rgba(255,255,255,0.7)" />
                <rect x="250" y="0" width="16" height="200" fill="rgba(255,255,255,0.7)" />
                {/* Blocks */}
                <rect x="10" y="10" width="100" height="50" rx="4" fill="rgba(255,255,255,0.4)" />
                <rect x="145" y="10" width="90" height="50" rx="4" fill="rgba(255,255,255,0.4)" />
                <rect x="280" y="10" width="100" height="50" rx="4" fill="rgba(255,255,255,0.4)" />
                <rect x="10" y="95" width="100" height="50" rx="4" fill="rgba(255,255,255,0.4)" />
                <rect x="145" y="95" width="90" height="50" rx="4" fill="rgba(255,255,255,0.4)" />
                <rect x="280" y="95" width="100" height="50" rx="4" fill="rgba(255,255,255,0.4)" />
                <rect x="10" y="155" width="100" height="30" rx="4" fill="rgba(255,255,255,0.4)" />
                <rect x="145" y="155" width="90" height="30" rx="4" fill="rgba(255,255,255,0.4)" />
                {/* Store pin */}
                <circle cx="60" cy="35" r="12" fill="#E8648C" />
                <text x="60" y="40" textAnchor="middle" fontSize="14" fill="white">🧁</text>
                {/* Delivery scooter */}
                <circle cx="200" cy="80" r="14" fill="#c2185b" />
                <text x="200" y="85" textAnchor="middle" fontSize="14" fill="white">🛵</text>
                {/* Destination pin */}
                <circle cx="310" cy="120" r="12" fill="#2D1B12" />
                <text x="310" y="125" textAnchor="middle" fontSize="12" fill="white">🏠</text>
                {/* Route */}
                <path d="M60 47 L60 70 L200 70 L200 66 L310 66 L310 108" stroke="#E8648C" strokeWidth="2.5" fill="none" strokeDasharray="6 4" />
              </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "12px" }}>
              {[["🧁", "SweetCup"], ["🛵", "Entregador"], ["🏠", "Sua casa"]].map(([icon, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "14px" }}>{icon}</span>
                  <span style={{ fontSize: "11px", color: "#8B5E3C" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order details */}
        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ margin: "0 0 10px", fontSize: "15px", fontWeight: 700, color: "#2D1B12" }}>Detalhes do pedido</p>
            {[
              ["Número", "#SC-20240523-4872"],
              ["Data", "23/05/2026 · 14:32"],
              ["Entregador", "Carlos Silva ⭐ 4.9"],
              ["Endereço", "Rua das Flores, 123"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F5E6EE" }}>
                <span style={{ fontSize: "13px", color: "#8B5E3C" }}>{k}</span>
                <span style={{ fontSize: "13px", color: "#2D1B12", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav navigate={navigate} active="tracking" cartCount={0} />
    </div>
  );
}

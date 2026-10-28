import { AppScreen } from "../App";

interface Props {
  navigate: (s: AppScreen) => void;
  active: AppScreen;
  cartCount: number;
}

const navItems = [
  {
    key: "home" as AppScreen,
    label: "Início",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3L21 12" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" strokeLinecap="round" />
        <path d="M5 10V20C5 20.55 5.45 21 6 21H10V16H14V21H18C18.55 21 19 20.55 19 20V10" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "favorites" as AppScreen,
    label: "Favoritos",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#E8648C" : "none"}>
        <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "cart" as AppScreen,
    label: "Carrinho",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" />
        <line x1="3" y1="6" x2="21" y2="6" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" />
        <path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "tracking" as AppScreen,
    label: "Pedidos",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" />
        <line x1="7" y1="8" x2="17" y2="8" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" strokeLinecap="round" />
        <line x1="7" y1="12" x2="17" y2="12" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" strokeLinecap="round" />
        <line x1="7" y1="16" x2="13" y2="16" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "profile" as AppScreen,
    label: "Perfil",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" />
        <path d="M4 20C4 16.69 7.13 14 12 14C16.87 14 20 16.69 20 20" stroke={active ? "#E8648C" : "#C4A882"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function BottomNav({ navigate, active, cartCount }: Props) {
  return (
    <div
      style={{
        position: "sticky", bottom: 0, left: 0, right: 0,
        background: "#fff", borderTop: "1px solid #F5E6EE",
        display: "flex", alignItems: "center", justifyContent: "space-around",
        padding: "8px 0 16px", zIndex: 100,
        boxShadow: "0 -4px 20px rgba(232,100,140,0.08)",
      }}
    >
      {navItems.map((item) => {
        const isActive = active === item.key;
        const isCart = item.key === "cart";
        return (
          <button
            key={item.key}
            onClick={() => navigate(item.key)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "3px", background: "transparent", border: "none", cursor: "pointer",
              position: "relative", padding: "4px 8px",
            }}
          >
            {isCart && cartCount > 0 && (
              <span
                style={{
                  position: "absolute", top: "0", right: "2px",
                  background: "#E8648C", color: "#fff", fontSize: "9px", fontWeight: 700,
                  borderRadius: "50%", width: "16px", height: "16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
            {item.icon(isActive)}
            <span style={{ fontSize: "10px", color: isActive ? "#E8648C" : "#C4A882", fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{ position: "absolute", bottom: "-8px", width: "4px", height: "4px", borderRadius: "50%", background: "#E8648C" }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

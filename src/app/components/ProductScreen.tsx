import { useState } from "react";
import { AppScreen, Cupcake, CartItem } from "../App";
import { BottomNav } from "./BottomNav";

interface Props {
  navigate: (s: AppScreen) => void;
  cupcake: Cupcake;
  cupcakes: Cupcake[];
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  addToCart: (c: Cupcake, q: number) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  cartCount: number;
  cartTotal: number;
}

const REVIEWS = [
  { name: "Ana Clara", rating: 5, comment: "Simplesmente divino! O melhor cupcake que já comi.", avatar: "AC" },
  { name: "Mariana S.", rating: 5, comment: "Apresentação impecável e sabor incrível. Super recomendo!", avatar: "MS" },
  { name: "Paulo R.", rating: 4, comment: "Muito gostoso, chegou fresquinho e bem embalado.", avatar: "PR" },
];

export function ProductScreen({ navigate, cupcake, favorites, toggleFavorite, addToCart, cartCount }: Props) {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "ingr" | "rev">("desc");
  const [added, setAdded] = useState(false);
  const isFav = favorites.includes(cupcake.id);

  const handleAdd = () => {
    addToCart(cupcake, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#FFF8F0", minHeight: "100%" }}>
      {/* Hero image */}
      <div style={{ position: "relative", height: "280px", flexShrink: 0 }}>
        <img src={cupcake.image} alt={cupcake.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)" }} />

        {/* Top controls */}
        <div style={{ position: "absolute", top: "16px", left: "16px", right: "16px", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => navigate("home")}
            style={{ background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="#2D1B12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => toggleFavorite(cupcake.id)}
              style={{ background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontSize: "18px", backdropFilter: "blur(10px)" }}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
            <button
              onClick={() => navigate("cart")}
              style={{ position: "relative", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" stroke="#E8648C" strokeWidth="2" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="#E8648C" strokeWidth="2" />
                <path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10" stroke="#E8648C" strokeWidth="2" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#E8648C", color: "#fff", fontSize: "9px", fontWeight: 700, borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category badge */}
        <div style={{ position: "absolute", bottom: "16px", left: "16px", background: "#E8648C", borderRadius: "12px", padding: "4px 12px" }}>
          <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>{cupcake.category}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, background: "#fff", borderRadius: "24px 24px 0 0", marginTop: "-20px", padding: "24px 20px 0", overflowY: "auto" }}>
        {/* Name & Rating */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#2D1B12", flex: 1 }}>{cupcake.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#FFF8F0", borderRadius: "10px", padding: "4px 10px" }}>
            <span style={{ fontSize: "14px" }}>⭐</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#E8648C" }}>{cupcake.rating}</span>
          </div>
        </div>

        <p style={{ margin: "0 0 4px", color: "#C4A882", fontSize: "13px" }}>
          ⭐ {cupcake.rating} · {cupcake.reviews} avaliações
        </p>

        {/* Price & Quantity */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", marginBottom: "20px" }}>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: "12px", color: "#C4A882" }}>Preço</p>
            <p style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#E8648C" }}>
              R$ {(cupcake.price * qty).toFixed(2).replace(".", ",")}
            </p>
            {qty > 1 && (
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#C4A882" }}>
                R$ {cupcake.price.toFixed(2).replace(".", ",")} / un.
              </p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#FFF8F0", borderRadius: "14px", padding: "8px 16px" }}>
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{ width: "30px", height: "30px", borderRadius: "50%", border: "none", background: qty === 1 ? "#F0E0E8" : "#E8648C", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
            >
              −
            </button>
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#2D1B12", minWidth: "24px", textAlign: "center" }}>{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              style={{ width: "30px", height: "30px", borderRadius: "50%", border: "none", background: "#E8648C", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
            >
              +
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #F5E6EE", marginBottom: "16px" }}>
          {([["desc", "Descrição"], ["ingr", "Ingredientes"], ["rev", "Avaliações"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1, padding: "10px 0", background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: tab === key ? 700 : 400,
                color: tab === key ? "#E8648C" : "#C4A882",
                borderBottom: `2px solid ${tab === key ? "#E8648C" : "transparent"}`,
                marginBottom: "-2px",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "desc" && (
          <p style={{ margin: "0 0 20px", color: "#8B5E3C", fontSize: "14px", lineHeight: 1.6 }}>{cupcake.description}</p>
        )}

        {tab === "ingr" && (
          <div style={{ marginBottom: "20px" }}>
            {cupcake.ingredients.map((ing, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: i < cupcake.ingredients.length - 1 ? "1px solid #F5E6EE" : "none" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E8648C", flexShrink: 0 }} />
                <span style={{ fontSize: "14px", color: "#2D1B12" }}>{ing}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "rev" && (
          <div style={{ marginBottom: "20px" }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ marginBottom: "16px", padding: "14px", background: "#FFF8F0", borderRadius: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#E8648C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>{r.avatar}</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#2D1B12" }}>{r.name}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#E8648C" }}>{"⭐".repeat(r.rating)}</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#8B5E3C", lineHeight: 1.5 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add to cart */}
        <div style={{ padding: "16px 0 24px" }}>
          <button
            onClick={handleAdd}
            style={{
              width: "100%", padding: "18px", borderRadius: "16px", border: "none",
              background: added ? "#34C759" : "linear-gradient(135deg, #E8648C, #c2185b)",
              color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer",
              boxShadow: `0 6px 20px rgba(${added ? "52,199,89" : "232,100,140"},0.4)`,
              transition: "all 0.3s",
            }}
          >
            {added ? "✓ Adicionado ao carrinho!" : `Adicionar ao carrinho · R$ ${(cupcake.price * qty).toFixed(2).replace(".", ",")}`}
          </button>
        </div>
      </div>

      <BottomNav navigate={navigate} active="home" cartCount={cartCount} />
    </div>
  );
}

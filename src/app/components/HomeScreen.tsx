import { useState } from "react";
import { AppScreen, Cupcake, CartItem } from "../App";
import { BottomNav } from "./BottomNav";

interface Props {
  navigate: (s: AppScreen) => void;
  cupcakes: Cupcake[];
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  addToCart: (c: Cupcake, q: number) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  cartCount: number;
  cartTotal: number;
  onSelect: (c: Cupcake) => void;
}

const CATEGORIES = ["Todos", "Clássicos", "Premium", "Chocolates", "Frutas", "Especiais"];

const BANNER_COLOR = "linear-gradient(135deg, #c2185b 0%, #e8648c 100%)";

export function HomeScreen({ navigate, cupcakes, favorites, toggleFavorite, cartCount, onSelect }: Props) {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = cupcakes.filter((c) => {
    const matchCat = activeCategory === "Todos" || c.category === activeCategory;
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const popular = cupcakes.filter((c) => c.rating >= 4.8).slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#FFF8F0", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "16px 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: "13px", color: "#C4A882", fontWeight: 400 }}>Bom dia! 👋</p>
            <h2 style={{ margin: "2px 0 0", color: "#2D1B12", fontWeight: 700, fontSize: "20px" }}>O que você deseja?</h2>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => navigate("cart")}
              style={{ position: "relative", background: "#FFF8F0", border: "none", width: "40px", height: "40px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
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
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: BANNER_COLOR, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <img src="https://images.unsplash.com/photo-1502597276204-a3833c063739?w=80&q=80" alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div
          style={{
            marginTop: "14px", background: "#FFF8F0", borderRadius: "14px",
            display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px",
            border: "1.5px solid #F5E6EE",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#C4A882" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="#C4A882" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            aria-label="Buscar cupcakes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cupcakes..."
            style={{ flex: 1, border: "none", background: "transparent", fontSize: "14px", color: "#2D1B12", outline: "none" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4A882", fontSize: "16px" }}>✕</button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        {/* Promotional Banner */}
        {!searchQuery && (
          <div style={{ padding: "0 20px 16px" }}>
            <div
              style={{
                borderRadius: "20px", overflow: "hidden", position: "relative",
                background: BANNER_COLOR, height: "150px",
                boxShadow: "0 6px 24px rgba(232,100,140,0.35)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1551500693-f3e9e7842948?w=600&q=80"
                alt="Banner"
                style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "55%", objectFit: "cover", opacity: 0.7 }}
              />
              <div style={{ position: "absolute", inset: 0, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "20px", padding: "3px 10px", width: "fit-content", marginBottom: "8px" }}>
                  <span style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>🎉 Oferta especial</span>
                </div>
                <h3 style={{ color: "#fff", margin: 0, fontWeight: 800, fontSize: "20px", lineHeight: 1.2 }}>20% de desconto<br />com PROMO20</h3>
                <p style={{ color: "rgba(255,255,255,0.85)", margin: "6px 0 12px", fontSize: "12px" }}>Aplique no carrinho · Demonstração</p>
                <button
                  onClick={() => setActiveCategory("Premium")}
                  style={{
                    background: "#fff", color: "#E8648C", border: "none",
                    borderRadius: "10px", padding: "7px 16px", fontSize: "12px", fontWeight: 700,
                    cursor: "pointer", width: "fit-content",
                  }}
                >
                  Ver agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div style={{ padding: "0 20px 14px" }}>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, padding: "7px 16px", borderRadius: "20px", border: "none",
                  cursor: "pointer", fontSize: "13px",
                  background: activeCategory === cat ? "#E8648C" : "#fff",
                  color: activeCategory === cat ? "#fff" : "#8B5E3C",
                  fontWeight: activeCategory === cat ? 700 : 400,
                  boxShadow: activeCategory === cat ? "0 3px 12px rgba(232,100,140,0.4)" : "0 1px 4px rgba(0,0,0,0.08)",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Popular cupcakes */}
        {!searchQuery && activeCategory === "Todos" && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px 12px" }}>
              <h3 style={{ margin: 0, color: "#2D1B12", fontSize: "17px", fontWeight: 700 }}>Mais Populares</h3>
              <a href="#catalog-grid" style={{ color: "#ad2857", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>Ver todos</a>
            </div>
            <div style={{ display: "flex", gap: "14px", overflowX: "auto", padding: "0 20px", scrollbarWidth: "none" }}>
              {popular.map((c) => (
                <PopularCard key={c.id} cupcake={c} isFav={favorites.includes(c.id)} onToggleFav={() => toggleFavorite(c.id)} onPress={() => onSelect(c)} />
              ))}
            </div>
          </div>
        )}

        {/* Section title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px 12px" }}>
          <h3 style={{ margin: 0, color: "#2D1B12", fontSize: "17px", fontWeight: 700 }}>
            {searchQuery ? `Resultados para "${searchQuery}"` : activeCategory === "Todos" ? "Destaques da Semana" : activeCategory}
          </h3>
          <span style={{ color: "#C4A882", fontSize: "13px" }}>{filtered.length} itens</span>
        </div>

        {/* Grid */}
        <div id="catalog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", padding: "0 20px" }}>
          {filtered.map((c) => (
            <CupcakeCard key={c.id} cupcake={c} isFav={favorites.includes(c.id)} onToggleFav={() => toggleFavorite(c.id)} onPress={() => onSelect(c)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#C4A882" }}>
            <p style={{ fontSize: "40px", margin: "0 0 8px" }}>🧁</p>
            <p style={{ margin: 0, fontWeight: 500 }}>Nenhum cupcake encontrado</p>
          </div>
        )}

        <div style={{ height: "16px" }} />
      </div>

      <BottomNav navigate={navigate} active="home" cartCount={cartCount} />
    </div>
  );
}

function PopularCard({ cupcake, isFav, onToggleFav, onPress }: { cupcake: Cupcake; isFav: boolean; onToggleFav: () => void; onPress: () => void }) {
  return (
    <div
      onClick={onPress}
      style={{
        flexShrink: 0, width: "140px", borderRadius: "18px", background: "#fff",
        overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", height: "110px" }}>
        <img src={cupcake.image} alt={cupcake.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <span style={{ fontSize: "14px" }}>{isFav ? "❤️" : "🤍"}</span>
        </button>
        <div style={{ position: "absolute", bottom: "6px", left: "6px", background: "rgba(0,0,0,0.5)", borderRadius: "10px", padding: "2px 6px" }}>
          <span style={{ color: "#fff", fontSize: "10px" }}>⭐ {cupcake.rating}</span>
        </div>
      </div>
      <div style={{ padding: "10px" }}>
        <p style={{ margin: "0 0 2px", fontSize: "12px", fontWeight: 700, color: "#2D1B12", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cupcake.name}</p>
        <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#E8648C" }}>R$ {cupcake.price.toFixed(2).replace(".", ",")}</p>
      </div>
    </div>
  );
}

function CupcakeCard({ cupcake, isFav, onToggleFav, onPress }: { cupcake: Cupcake; isFav: boolean; onToggleFav: () => void; onPress: () => void }) {
  return (
    <div
      onClick={onPress}
      style={{
        borderRadius: "18px", background: "#fff", overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)", cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", height: "130px" }}>
        <img src={cupcake.image} alt={cupcake.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <span style={{ fontSize: "14px" }}>{isFav ? "❤️" : "🤍"}</span>
        </button>
        <div style={{ position: "absolute", top: "8px", left: "8px", background: "#E8648C", borderRadius: "10px", padding: "2px 8px" }}>
          <span style={{ color: "#fff", fontSize: "9px", fontWeight: 700 }}>{cupcake.category}</span>
        </div>
      </div>
      <div style={{ padding: "10px" }}>
        <p style={{ margin: "0 0 3px", fontSize: "13px", fontWeight: 700, color: "#2D1B12" }}>{cupcake.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", color: "#E8648C" }}>⭐ {cupcake.rating}</span>
          <span style={{ fontSize: "10px", color: "#C4A882" }}>({cupcake.reviews})</span>
        </div>
        <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#E8648C" }}>R$ {cupcake.price.toFixed(2).replace(".", ",")}</p>
      </div>
    </div>
  );
}

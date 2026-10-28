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

export function FavoritesScreen({ navigate, cupcakes, favorites, toggleFavorite, addToCart, cartCount, onSelect }: Props) {
  const favCupcakes = cupcakes.filter((c) => favorites.includes(c.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#FFF8F0", minHeight: "100%" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "16px 20px 14px", borderBottom: "1px solid #F5E6EE" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#2D1B12" }}>❤️ Favoritos</h2>
          <span style={{ color: "#C4A882", fontSize: "14px" }}>{favCupcakes.length} {favCupcakes.length === 1 ? "item" : "itens"}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {favCupcakes.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: "16px", textAlign: "center" }}>
            <span style={{ fontSize: "60px" }}>🤍</span>
            <h3 style={{ margin: 0, color: "#2D1B12", fontSize: "20px" }}>Nenhum favorito</h3>
            <p style={{ margin: 0, color: "#C4A882", fontSize: "14px" }}>Explore nossos cupcakes e adicione seus favoritos</p>
            <button
              onClick={() => navigate("home")}
              style={{
                background: "linear-gradient(135deg, #E8648C, #c2185b)", border: "none",
                color: "#fff", borderRadius: "16px", padding: "14px 32px",
                fontSize: "15px", fontWeight: 700, cursor: "pointer",
              }}
            >
              Explorar cupcakes
            </button>
          </div>
        ) : (
          <>
            {/* Featured favorite */}
            {favCupcakes.length > 0 && (
              <div
                onClick={() => onSelect(favCupcakes[0])}
                style={{
                  borderRadius: "20px", overflow: "hidden", marginBottom: "16px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)", cursor: "pointer", position: "relative",
                }}
              >
                <div style={{ height: "180px", position: "relative" }}>
                  <img src={favCupcakes[0].image} alt={favCupcakes[0].name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", top: "12px", left: "12px", background: "#E8648C", borderRadius: "10px", padding: "4px 12px" }}>
                    <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700 }}>⭐ Top Favorito</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(favCupcakes[0].id); }}
                    style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px" }}
                  >
                    ❤️
                  </button>
                  <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <p style={{ margin: "0 0 2px", color: "#fff", fontSize: "18px", fontWeight: 800 }}>{favCupcakes[0].name}</p>
                        <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>⭐ {favCupcakes[0].rating} · {favCupcakes[0].reviews} avaliações</p>
                      </div>
                      <p style={{ margin: 0, color: "#fff", fontSize: "20px", fontWeight: 800 }}>R$ {favCupcakes[0].price.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                </div>
                <div style={{ background: "#fff", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#8B5E3C", flex: 1, marginRight: "12px" }}>{favCupcakes[0].description.slice(0, 60)}...</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(favCupcakes[0], 1); }}
                    style={{ background: "linear-gradient(135deg, #E8648C, #c2185b)", border: "none", color: "#fff", borderRadius: "12px", padding: "8px 16px", fontSize: "13px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
                  >
                    + Carrinho
                  </button>
                </div>
              </div>
            )}

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {favCupcakes.slice(1).map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelect(c)}
                  style={{
                    borderRadius: "18px", background: "#fff", overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)", cursor: "pointer",
                  }}
                >
                  <div style={{ position: "relative", height: "130px" }}>
                    <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(c.id); }}
                      style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      ❤️
                    </button>
                    <div style={{ position: "absolute", bottom: "6px", left: "6px", background: "rgba(0,0,0,0.5)", borderRadius: "8px", padding: "2px 6px" }}>
                      <span style={{ color: "#fff", fontSize: "10px" }}>⭐ {c.rating}</span>
                    </div>
                  </div>
                  <div style={{ padding: "10px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: "#2D1B12" }}>{c.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#E8648C" }}>R$ {c.price.toFixed(2).replace(".", ",")}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(c, 1); }}
                        style={{ background: "#E8648C", border: "none", borderRadius: "8px", padding: "5px 10px", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: "16px" }} />
          </>
        )}
      </div>

      <BottomNav navigate={navigate} active="favorites" cartCount={cartCount} />
    </div>
  );
}

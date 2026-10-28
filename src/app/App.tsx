import { useState } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ProductScreen } from "./components/ProductScreen";
import { CartScreen } from "./components/CartScreen";
import { PaymentScreen } from "./components/PaymentScreen";
import { TrackingScreen } from "./components/TrackingScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { FavoritesScreen } from "./components/FavoritesScreen";
import { WireframeScreen } from "./components/WireframeScreen";
import { NavigationalMap } from "./components/NavigationalMap";
import { ConceptualMap } from "./components/ConceptualMap";

export type AppScreen =
  | "splash" | "home" | "product" | "cart" | "payment"
  | "tracking" | "profile" | "favorites" | "wireframe" | "navmap" | "conceptmap";

export interface Cupcake {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  ingredients: string[];
}

export interface CartItem {
  cupcake: Cupcake;
  quantity: number;
}

export const CUPCAKES: Cupcake[] = [
  {
    id: 1, name: "Rose Velvet", price: 14.90,
    description: "Red velvet com cobertura de cream cheese e pétalas de rosa comestíveis. Uma experiência única de sabor e sofisticação.",
    image: "https://images.unsplash.com/photo-1723476338868-4488ddc9124a?w=400&q=80",
    rating: 4.9, reviews: 248, category: "Clássicos",
    ingredients: ["Farinha de trigo", "Açúcar refinado", "Manteiga", "Cream cheese", "Extrato de baunilha", "Pétalas de rosa"],
  },
  {
    id: 2, name: "Golden Dream", price: 16.90,
    description: "Baunilha com cobertura de buttercream dourado e folha de ouro comestível. O luxo em cada mordida.",
    image: "https://images.unsplash.com/photo-1723638002276-0d2165b07fbc?w=400&q=80",
    rating: 4.8, reviews: 183, category: "Premium",
    ingredients: ["Farinha", "Açúcar", "Baunilha", "Manteiga", "Creme de leite", "Folha de ouro"],
  },
  {
    id: 3, name: "Chocolate Noir", price: 15.90,
    description: "Chocolate belga com ganache escuro e raspas de cacau 70%. Intensidade e sofisticação.",
    image: "https://images.unsplash.com/photo-1426869884541-df7117556757?w=400&q=80",
    rating: 4.9, reviews: 312, category: "Chocolates",
    ingredients: ["Cacau belga 70%", "Farinha", "Manteiga", "Açúcar mascavo", "Ganache noir"],
  },
  {
    id: 4, name: "Strawberry Kiss", price: 13.90,
    description: "Morango fresco com chantilly artesanal e frutas frescas. Leveza e frescor.",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400&q=80",
    rating: 4.7, reviews: 196, category: "Frutas",
    ingredients: ["Morango fresco", "Farinha", "Chantilly", "Açúcar", "Essência de baunilha"],
  },
  {
    id: 5, name: "Caramel Bliss", price: 15.50,
    description: "Caramelo salgado com buttercream e flor de sal. Perfeito equilíbrio entre doce e salgado.",
    image: "https://images.unsplash.com/photo-1565498253128-c06e0488ddee?w=400&q=80",
    rating: 4.8, reviews: 167, category: "Especiais",
    ingredients: ["Caramelo artesanal", "Flor de sal", "Manteiga", "Farinha", "Açúcar mascavo"],
  },
  {
    id: 6, name: "Lemon Zest", price: 13.50,
    description: "Limão siciliano com merengue italiano flambado. Acidez equilibrada e suavidade.",
    image: "https://images.unsplash.com/photo-1572978577765-462b91a7f9e1?w=400&q=80",
    rating: 4.6, reviews: 141, category: "Frutas",
    ingredients: ["Limão siciliano", "Merengue italiano", "Farinha", "Manteiga", "Açúcar"],
  },
  {
    id: 7, name: "Rainbow Sprinkle", price: 12.90,
    description: "Confete colorido com buttercream arco-íris. Alegria e cor em cada detalhe.",
    image: "https://images.unsplash.com/photo-1611692276815-cd6efa0b2dac?w=400&q=80",
    rating: 4.5, reviews: 98, category: "Clássicos",
    ingredients: ["Confete colorido", "Buttercream", "Farinha", "Açúcar", "Corantes naturais"],
  },
  {
    id: 8, name: "Pearl Dream", price: 17.90,
    description: "Coco com cobertura branca perolada e cristais de açúcar. Elegância e delicadeza.",
    image: "https://images.unsplash.com/photo-1723638002949-9ef46fddc729?w=400&q=80",
    rating: 4.9, reviews: 221, category: "Premium",
    ingredients: ["Coco ralado", "Cream cheese", "Farinha", "Manteiga", "Pérolas de açúcar"],
  },
];

const SCREEN_LABELS: { key: AppScreen; label: string }[] = [
  { key: "splash", label: "Splash" },
  { key: "home", label: "Início" },
  { key: "product", label: "Produto" },
  { key: "cart", label: "Carrinho" },
  { key: "payment", label: "Pagamento" },
  { key: "tracking", label: "Rastreio" },
  { key: "profile", label: "Perfil" },
  { key: "favorites", label: "Favoritos" },
  { key: "wireframe", label: "Wireframe" },
  { key: "navmap", label: "Nav. Map" },
  { key: "conceptmap", label: "Conceitual" },
];

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [selectedCupcake, setSelectedCupcake] = useState<Cupcake>(CUPCAKES[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([1, 3, 5, 8]);

  const navigate = (s: AppScreen) => setScreen(s);

  const addToCart = (cupcake: Cupcake, qty: number) => {
    setCart((prev) => {
      const found = prev.find((i) => i.cupcake.id === cupcake.id);
      if (found) return prev.map((i) => i.cupcake.id === cupcake.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { cupcake, quantity: qty }];
    });
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.cupcake.price * i.quantity, 0);

  const commonProps = { navigate, cupcakes: CUPCAKES, cart, setCart, addToCart, favorites, toggleFavorite, cartCount, cartTotal };

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <SplashScreen navigate={navigate} />;
      case "home": return <HomeScreen {...commonProps} onSelect={(c) => { setSelectedCupcake(c); navigate("product"); }} />;
      case "product": return <ProductScreen {...commonProps} cupcake={selectedCupcake} />;
      case "cart": return <CartScreen {...commonProps} />;
      case "payment": return <PaymentScreen navigate={navigate} cartTotal={cartTotal} />;
      case "tracking": return <TrackingScreen navigate={navigate} />;
      case "profile": return <ProfileScreen navigate={navigate} />;
      case "favorites": return <FavoritesScreen {...commonProps} onSelect={(c) => { setSelectedCupcake(c); navigate("product"); }} />;
      case "wireframe": return <WireframeScreen navigate={navigate} />;
      case "navmap": return <NavigationalMap navigate={navigate} />;
      case "conceptmap": return <ConceptualMap navigate={navigate} />;
    }
  };

  const isSplash = screen === "splash";
  const statusColor = isSplash ? "#fff" : "#1a1a1a";

  return (
    <div
      style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-start", overflow: "hidden",
        background: "linear-gradient(160deg, #fce4ec 0%, #f8bbd0 45%, #fce4ec 100%)",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}
    >
      {/* Screen selector tabs */}
      <div
        style={{
          width: "100%", maxWidth: "500px", padding: "10px 12px 8px",
          display: "flex", gap: "6px", overflowX: "auto", flexShrink: 0,
          scrollbarWidth: "none",
        }}
      >
        {SCREEN_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => navigate(key)}
            style={{
              flexShrink: 0, padding: "5px 13px", borderRadius: "20px",
              fontSize: "11px", border: "none", cursor: "pointer",
              background: screen === key ? "#E8648C" : "rgba(255,255,255,0.8)",
              color: screen === key ? "#fff" : "#8B5E3C",
              fontWeight: screen === key ? 700 : 400,
              boxShadow: screen === key ? "0 2px 10px rgba(232,100,140,0.5)" : "0 1px 3px rgba(0,0,0,0.1)",
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Phone mockup */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", width: "100%", padding: "0 12px 12px", minHeight: 0 }}>
        <div
          style={{
            position: "relative", display: "flex", flexDirection: "column",
            width: "100%", maxWidth: "390px", height: "100%", maxHeight: "812px",
            borderRadius: "44px", background: "#fff",
            boxShadow: "0 0 0 8px #1c1c1e, 0 0 0 10px #3a3a3c, 0 30px 90px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          {/* Status bar */}
          <div
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 24px 0", flexShrink: 0,
              background: isSplash ? "transparent" : "#fff",
              position: isSplash ? "absolute" : "relative",
              top: isSplash ? 0 : undefined, left: 0, right: 0, zIndex: 10,
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 700, color: statusColor }}>9:41</span>
            <div style={{ width: "120px", height: "34px", background: "#1c1c1e", borderRadius: "18px", marginTop: "-14px" }} />
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <rect x="0" y="4" width="3" height="8" rx="0.5" fill={statusColor} />
                <rect x="4.3" y="2.5" width="3" height="9.5" rx="0.5" fill={statusColor} />
                <rect x="8.6" y="1" width="3" height="11" rx="0.5" fill={statusColor} />
                <rect x="12.9" y="0" width="3" height="12" rx="0.5" fill={statusColor} opacity="0.3" />
              </svg>
              <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                <path d="M7.5 3C9.6 3 11.5 3.9 12.9 5.4L14.1 4.2C12.4 2.4 10.1 1.3 7.5 1.3C4.9 1.3 2.6 2.4 0.9 4.2L2.1 5.4C3.5 3.9 5.4 3 7.5 3Z" fill={statusColor} />
                <path d="M7.5 5.8C8.9 5.8 10.1 6.4 11 7.3L12.2 6.1C11 4.9 9.3 4.1 7.5 4.1C5.7 4.1 4 4.9 2.8 6.1L4 7.3C4.9 6.4 6.1 5.8 7.5 5.8Z" fill={statusColor} />
                <circle cx="7.5" cy="10.5" r="1.5" fill={statusColor} />
              </svg>
              <div style={{ width: "24px", height: "12px", border: `2px solid ${statusColor}`, borderRadius: "3px", padding: "1px", position: "relative" }}>
                <div style={{ position: "absolute", right: "-4px", top: "2.5px", width: "3px", height: "7px", background: statusColor, borderRadius: "0 2px 2px 0" }} />
                <div style={{ width: "100%", height: "100%", background: "#34C759", borderRadius: "1px" }} />
              </div>
            </div>
          </div>

          {/* Screen content */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none" }}>
            {renderScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}

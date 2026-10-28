import { useEffect, useRef, useState } from 'react';
import { api, ApiError, type AppState } from './api';
import { HomeScreen } from './components/HomeScreen';
import { ProductScreen } from './components/ProductScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { WireframeScreen } from './components/WireframeScreen';
import { NavigationalMap } from './components/NavigationalMap';
import { ConceptualMap } from './components/ConceptualMap';
import { LoginScreen, LiveCartScreen, LivePaymentScreen, LiveTrackingScreen, LiveProfileScreen, FeedbackScreen } from './components/CommerceScreens';
import '../styles/pit2.css';

export type AppScreen = 'splash' | 'home' | 'product' | 'cart' | 'payment' | 'tracking' | 'profile' | 'favorites' | 'wireframe' | 'navmap' | 'conceptmap' | 'feedback';
export interface Cupcake { id: number; name: string; price: number; price_cents: number; description: string; image: string; rating: number; reviews: number; category: string; ingredients: string[] }
export interface CartItem { cupcake: Cupcake; quantity: number }

export default function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [selected, setSelected] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<AppState>('/state').then(s => { setState(s); setScreen('home'); }).catch(e => {
      if (!(e instanceof ApiError && e.status === 401)) setError('Não foi possível conectar ao servidor. Confira se o back-end está em execução e recarregue a página.');
    }).finally(() => setLoading(false));
  }, []);
  useEffect(() => { content.current?.scrollTo({ top: 0 }); }, [screen]);

  const navigate = (s: AppScreen) => { setError(''); setScreen(s); };
  const mutate = async (path: string, method = 'POST', body?: unknown): Promise<AppState | null> => {
    if (lock.current) return null;
    lock.current = true; setBusy(true); setError('');
    try {
      const next = await api<AppState>(path, method, body);
      setState(next); return next;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível concluir a ação.');
      if (e instanceof ApiError && e.status === 401) { setState(null); setScreen('splash'); }
      if (e instanceof ApiError && e.status === 409) {
        try { setState(await api<AppState>('/state')); } catch { /* A mensagem original permanece visível. */ }
      }
      return null;
    } finally { lock.current = false; setBusy(false); }
  };

  const enter = async (name: string) => { if (await mutate('/session', 'POST', { name })) navigate('home'); };
  const logout = async () => {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    try { await api('/session', 'DELETE'); setState(null); setSelectedOrder(null); navigate('splash'); }
    catch (e) { setError((e as Error).message); }
    finally { lock.current = false; setBusy(false); }
  };

  const cart: CartItem[] = state?.cart.items.map(i => ({ cupcake: state.products.find(p => p.id === i.id)!, quantity: i.quantity })) || [];
  const addToCart = async (cupcake: Cupcake, qty: number): Promise<boolean> => {
    const old = state?.cart.items.find(i => i.id === cupcake.id)?.quantity || 0;
    if (old + qty > 20) { setError('O limite da demonstração é 20 unidades por produto.'); return false; }
    return !!await mutate(`/cart/items/${cupcake.id}`, 'PUT', { quantity: old + qty });
  };
  const setCart = (next: CartItem[]) => {
    const changed = cart.find(item => next.find(n => n.cupcake.id === item.cupcake.id)?.quantity !== item.quantity);
    if (changed) void mutate(`/cart/items/${changed.cupcake.id}`, 'PUT', { quantity: next.find(n => n.cupcake.id === changed.cupcake.id)?.quantity || 0 });
  };
  const toggleFavorite = (id: number) => { void mutate(`/favorites/${id}`, state?.favorites.includes(id) ? 'DELETE' : 'PUT'); };
  const onSelect = (c: Cupcake) => { setSelected(c.id); navigate('product'); };

  const renderScreen = () => {
    if (loading) return <div className="empty" role="status"><span>🧁</span><p>Preparando sua SweetCup…</p></div>;
    if (!state) return <LoginScreen onEnter={name => void enter(name)} busy={busy} />;
    const common = { navigate, cupcakes: state.products, cart, setCart, addToCart, favorites: state.favorites, toggleFavorite, cartCount: cart.reduce((n, i) => n + i.quantity, 0), cartTotal: state.cart.subtotal_cents / 100 };
    const live = { state, navigate, mutate, busy };
    switch (screen) {
      case 'product': return <ProductScreen key={selected} {...common} cupcake={state.products.find(p => p.id === selected) || state.products[0]} />;
      case 'cart': return <LiveCartScreen {...live} />;
      case 'payment': return <LivePaymentScreen {...live} onOrder={id => { setSelectedOrder(id); navigate('tracking'); }} />;
      case 'tracking': return <LiveTrackingScreen {...live} selected={selectedOrder} select={setSelectedOrder} />;
      case 'profile': return <LiveProfileScreen {...live} logout={() => void logout()} openOrder={id => { setSelectedOrder(id); navigate('tracking'); }} />;
      case 'favorites': return <FavoritesScreen {...common} onSelect={onSelect} />;
      case 'feedback': return <FeedbackScreen navigate={navigate} />;
      case 'wireframe': return <WireframeScreen navigate={navigate} />;
      case 'navmap': return <NavigationalMap navigate={navigate} />;
      case 'conceptmap': return <ConceptualMap navigate={navigate} />;
      default: return <><HomeScreen {...common} onSelect={onSelect} /><div className="design-tools"><button onClick={() => navigate('wireframe')}>Wireframes do PIT I</button><button onClick={() => navigate('navmap')}>Mapa navegacional</button><button onClick={() => navigate('conceptmap')}>Mapa conceitual</button></div></>;
    }
  };

  return <main className="app-shell"><div className="outside-brand"><strong>🧁 SweetCup</strong><span>PIT II · Loja demonstrativa</span></div><div className="phone">
    <div className="status-bar"><span>SweetCup</span><span>● ● ● ▰</span></div>
    <div className="demo-strip">Projeto acadêmico · Compras, pagamentos e entregas simulados</div>
    {error && <div role="alert" className="app-error"><span>{error}</span><button aria-label="Fechar mensagem" onClick={() => setError('')}>✕</button></div>}
    {busy && <div role="status" className="saving">Salvando no servidor…</div>}
    <div className="phone-content" ref={content} aria-busy={busy}>{renderScreen()}</div>
  </div></main>;
}

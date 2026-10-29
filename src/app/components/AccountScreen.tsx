import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Heart, LogOut, MapPin, MessageCircle, Package, Pencil, ShieldCheck, ShoppingBag, Sparkles, Truck, UserRound, X } from 'lucide-react';
import type { AppScreen } from '../App';
import { dateTime, money, type AppState, type Order } from '../api';
import { BottomNav } from './BottomNav';
import '../../styles/profile.css';

type Props = {
  state: AppState;
  navigate: (screen: AppScreen) => void;
  mutate: (path: string, method?: string, body?: unknown) => Promise<AppState | null>;
  busy: boolean;
  logout: () => void;
  openOrder: (id: string) => void;
};

const STATUS = ['Recebido', 'Em preparo', 'Saiu para entrega', 'Entregue'];

export function LiveProfileScreen({ state, navigate, mutate, busy, logout, openOrder }: Props) {
  const [editing, setEditing] = useState<'name' | 'address' | null>(null);
  const [name, setName] = useState(state.user.name);
  const [address, setAddress] = useState(state.user.address);
  const [notice, setNotice] = useState('');
  const [confirmExit, setConfirmExit] = useState(false);
  const initials = state.user.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toLocaleUpperCase('pt-BR');
  const activeOrders = state.orders.filter(order => order.status < 3);
  const cartCount = state.cart.items.reduce((count, item) => count + item.quantity, 0);
  const joined = new Date(state.user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'America/Fortaleza' });

  function edit(section: 'name' | 'address') {
    setName(state.user.name);
    setAddress(state.user.address);
    setNotice('');
    setConfirmExit(false);
    setEditing(section);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = await mutate('/profile', 'PUT', { name, address });
    if (next) {
      setName(next.user.name);
      setAddress(next.user.address);
      setEditing(null);
      setNotice('Pronto! Seus dados foram atualizados.');
    }
  }

  function showActiveOrders() {
    if (activeOrders[0]) openOrder(activeOrders[0].id);
    else navigate('tracking');
  }

  return <section className="commerce-screen account-screen">
    <header className="account-header">
      <button className="account-icon-button" aria-label="Voltar ao início" onClick={() => navigate('home')}><ArrowLeft size={20} aria-hidden="true" /></button>
      <h1>Meu perfil</h1>
      <span className="account-header-brand"><span aria-hidden="true">🧁</span> SweetCup</span>
    </header>

    <div className="account-body">
      <section className="account-hero" aria-label="Resumo do perfil">
        <Sparkles className="account-hero-sparkles" size={84} strokeWidth={.8} aria-hidden="true" />
        <span className="account-hero-kicker">SEU CANTINHO DOCE</span>
        <div className="account-identity">
          <div className="account-avatar" aria-hidden="true">{initials}</div>
          <div className="account-identity-copy"><h2>{state.user.name}</h2><p>Por aqui desde {joined}</p></div>
          <button className="account-edit-hero" aria-label="Editar nome do perfil" onClick={() => edit('name')} disabled={busy}><Pencil size={17} aria-hidden="true" /></button>
        </div>
        <span className="account-demo-pill"><ShieldCheck size={13} aria-hidden="true" /> Conta de demonstração</span>
      </section>

      <div className="account-stats" aria-label="Sua atividade na SweetCup">
        <button onClick={() => navigate('tracking')}><span className="account-stat-icon"><ShoppingBag size={19} aria-hidden="true" /></span><strong>{state.orders.length}</strong><span>Pedidos</span></button>
        <button onClick={() => navigate('favorites')}><span className="account-stat-icon"><Heart size={19} aria-hidden="true" /></span><strong>{state.favorites.length}</strong><span>Favoritos</span></button>
        <button onClick={showActiveOrders}><span className="account-stat-icon"><Truck size={19} aria-hidden="true" /></span><strong>{activeOrders.length}</strong><span>Em andamento</span></button>
      </div>

      {notice && <div className="account-success" role="status"><Check size={17} aria-hidden="true" /><span>{notice}</span><button aria-label="Fechar confirmação" onClick={() => setNotice('')}><X size={15} aria-hidden="true" /></button></div>}

      {editing && <form className="account-editor" aria-labelledby="account-editor-title" onSubmit={save}>
        <div className="account-section-heading"><h2 id="account-editor-title">{editing === 'name' ? 'Seu nome, do seu jeito' : 'Onde chega a doçura?'}</h2><button type="button" className="account-icon-button" aria-label="Cancelar edição" onClick={() => setEditing(null)} disabled={busy}><X size={18} aria-hidden="true" /></button></div>
        {editing === 'name' ? <><label htmlFor="profile-name">Nome de exibição</label><input autoFocus id="profile-name" autoComplete="off" value={name} onChange={event => setName(event.target.value)} minLength={2} maxLength={80} required disabled={busy} /></> : <><label htmlFor="profile-address">Endereço de entrega</label><textarea autoFocus id="profile-address" value={address} onChange={event => setAddress(event.target.value)} maxLength={200} rows={3} disabled={busy} placeholder="Rua, número, bairro e cidade" /></>}
        <p className="account-helper">Use dados fictícios para experimentar a loja. Nenhuma entrega real é realizada.</p>
        <div className="account-editor-actions"><button type="button" className="account-cancel" onClick={() => setEditing(null)} disabled={busy}>Cancelar</button><button className="primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar alterações'}</button></div>
      </form>}

      <section aria-labelledby="account-details-title"><div className="account-section-heading"><h2 id="account-details-title">Minha conta</h2></div>
        <div className="account-menu">
          <button className="account-menu-row" onClick={() => edit('name')} disabled={busy}><span className="account-menu-icon"><UserRound size={20} aria-hidden="true" /></span><span className="account-menu-copy"><strong>Meus dados</strong><span>{state.user.name}</span></span><ChevronRight size={17} aria-hidden="true" /></button>
          <button className="account-menu-row" onClick={() => edit('address')} disabled={busy}><span className="account-menu-icon"><MapPin size={20} aria-hidden="true" /></span><span className="account-menu-copy"><strong>{state.user.address ? 'Endereço de entrega' : 'Adicionar endereço'}</strong><span>{state.user.address || 'Deixe tudo pronto para seu próximo pedido'}</span></span><ChevronRight size={17} aria-hidden="true" /></button>
        </div>
      </section>

      <section aria-labelledby="account-orders-title"><div className="account-section-heading"><h2 id="account-orders-title">Pedidos recentes</h2>{state.orders.length > 0 && <button className="account-section-link" onClick={() => navigate('tracking')}>Ver todos <ArrowRight size={13} aria-hidden="true" /></button>}</div>
        {state.orders.length ? <div className="account-recent-orders">{state.orders.slice(0, 3).map(order => <RecentOrder key={order.id} order={order} state={state} onOpen={() => openOrder(order.id)} />)}</div> : <div className="account-empty-orders"><span className="account-empty-icon"><Package size={29} strokeWidth={1.5} aria-hidden="true" /></span><h3>Seu primeiro momento doce</h3><p>Seus pedidos e o acompanhamento ficam aqui.<br />Que tal escolher um cupcake?</p><button onClick={() => navigate('home')}>Explorar cupcakes <ArrowRight size={15} aria-hidden="true" /></button></div>}
      </section>

      <button className="account-feedback" onClick={() => navigate('feedback')}><span className="account-feedback-icon"><MessageCircle size={24} strokeWidth={1.7} aria-hidden="true" /></span><span><strong>Sua opinião adoça a SweetCup</strong><span>Conte como foi sua experiência.</span></span><ChevronRight size={18} aria-hidden="true" /></button>

      <details className="account-about"><summary><ShieldCheck size={15} aria-hidden="true" /> Sobre sua conta de demonstração</summary><p>Sua sessão fica salva neste navegador por até 14 dias. Ao sair, a próxima entrada cria outra conta de demonstração. Os pedidos não são cobrados e não há recuperação da sessão anterior.</p></details>

      {confirmExit ? <div className="account-exit-confirm" role="group" aria-label="Confirmar saída da conta"><strong>Deseja encerrar esta sessão?</strong><p>Na próxima entrada, você começará com uma nova conta de demonstração.</p><div><button onClick={() => setConfirmExit(false)} disabled={busy}>Continuar na conta</button><button className="account-exit-final" onClick={logout} disabled={busy}>Sair agora</button></div></div> : <button className="account-logout" onClick={() => { setEditing(null); setConfirmExit(true); }} disabled={busy}><LogOut size={17} aria-hidden="true" /> Sair da conta</button>}

      <footer className="account-footer"><span aria-hidden="true">🧁</span><span>Feito para deixar seu dia mais doce.</span><span className="account-footer-brand">SweetCup · Projeto acadêmico</span></footer>
    </div>
    <BottomNav navigate={navigate} active="profile" cartCount={cartCount} />
  </section>;
}

function RecentOrder({ order, state, onOpen }: { order: Order; state: AppState; onOpen: () => void }) {
  const first = order.items[0];
  const product = state.products.find(item => item.id === first?.product_id);
  const quantity = order.items.reduce((total, item) => total + item.quantity, 0);
  return <button className="account-order" onClick={onOpen} aria-label={`Abrir pedido ${order.id}, ${STATUS[order.status]}, ${money(order.total_cents)}`}>
    {product ? <img src={product.image} alt="" loading="lazy" /> : <span className="account-order-fallback"><Package size={24} aria-hidden="true" /></span>}
    <span className="account-order-content"><span className="account-order-top"><strong>{first?.product_name || 'Seu pedido'}{order.items.length > 1 && ` + ${order.items.length - 1}`}</strong><span className={`account-order-status ${order.status === 3 ? 'is-delivered' : ''}`}>{STATUS[order.status]}</span></span><span className="account-order-meta">{dateTime(order.created_at)} · {quantity} {quantity === 1 ? 'item' : 'itens'}</span><span className="account-order-bottom"><span>#{order.id.replace(/^SC-/, '')}</span><strong>{money(order.total_cents)}</strong></span></span>
    <ChevronRight size={15} aria-hidden="true" />
  </button>;
}

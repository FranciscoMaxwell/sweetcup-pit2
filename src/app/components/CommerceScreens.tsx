import { useState } from 'react';
import type { AppScreen } from '../App';
import { api, dateTime, money, type AppState, type Order, type Quote } from '../api';
import { BottomNav } from './BottomNav';

type Props = { state: AppState; navigate: (screen: AppScreen) => void; mutate: (path: string, method?: string, body?: unknown) => Promise<AppState | null>; busy: boolean };
const STEPS = ['Recebido', 'Em preparo', 'Saiu para entrega', 'Entregue'];

function Header({ title, navigate }: { title: string; navigate: Props['navigate'] }) {
  return <header className="screen-header"><button aria-label="Voltar ao início" className="icon-btn" onClick={() => navigate('home')}>←</button><h1>{title}</h1></header>;
}

function Totals({ quote }: { quote: Quote }) {
  return <dl className="totals"><div><dt>Subtotal</dt><dd>{money(quote.subtotal_cents)}</dd></div>
    {quote.discount_cents > 0 && <div><dt>Desconto</dt><dd>− {money(quote.discount_cents)}</dd></div>}
    <div><dt>Entrega simulada</dt><dd>{money(quote.delivery_cents)}</dd></div>
    <div className="grand-total"><dt>Total</dt><dd>{money(quote.total_cents)}</dd></div></dl>;
}

export function LoginScreen({ onEnter, busy }: { onEnter: (name: string) => void; busy: boolean }) {
  const [name, setName] = useState('Cliente de demonstração');
  return <div className="login-screen"><span className="brand-icon" aria-hidden="true">🧁</span><h1>SweetCup</h1><p className="brand-sub">GOURMET CUPCAKES</p>
    <p>Um momento doce começa aqui.</p><img className="login-image" src="https://images.unsplash.com/photo-1426869884541-df7117556757?w=500&q=80" alt="Cupcakes com cobertura de chocolate" />
    <form onSubmit={e => { e.preventDefault(); onEnter(name); }}><label htmlFor="demo-name">Como podemos chamar você?</label><input id="demo-name" value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={80} autoComplete="off" />
      <button className="primary light" disabled={busy}>{busy ? 'Entrando…' : 'Entrar como cliente de demonstração'}</button></form>
    <p className="login-note">Use um nome fictício. Sua sessão fica neste navegador por até 14 dias. Nenhuma compra ou cobrança real é realizada.</p></div>;
}

export function LiveCartScreen({ state, navigate, mutate, busy }: Props) {
  const [coupon, setCoupon] = useState(state.cart.coupon);
  const [message, setMessage] = useState('');
  const count = state.cart.items.reduce((n, i) => n + i.quantity, 0);
  return <section className="commerce-screen"><Header title="Meu carrinho" navigate={navigate} /><div className="screen-body">
    {!count ? <div className="empty"><span>🛍️</span><h2>Seu carrinho está vazio</h2><p>Escolha seu próximo momento doce.</p><button className="primary" onClick={() => navigate('home')}>Explorar cupcakes</button></div> : <>
      {state.cart.items.map(item => { const p = state.products.find(p => p.id === item.id)!; return <article className="cart-row card" key={item.id}>
        <img src={p.image} alt={item.name} /><div><h2>{item.name}</h2><p>{money(item.price_cents)}</p><div className="quantity"><button aria-label={`Diminuir ${item.name}`} disabled={busy} onClick={() => void mutate(`/cart/items/${item.id}`, 'PUT', { quantity: item.quantity - 1 })}>−</button><output aria-label={`Quantidade de ${item.name}`}>{item.quantity}</output><button aria-label={`Aumentar ${item.name}`} disabled={busy || item.quantity >= 20} onClick={() => void mutate(`/cart/items/${item.id}`, 'PUT', { quantity: item.quantity + 1 })}>+</button><button className="text-btn" aria-label={`Remover ${item.name}`} disabled={busy} onClick={() => void mutate(`/cart/items/${item.id}`, 'PUT', { quantity: 0 })}>Remover</button></div></div>
      </article>; })}
      <form className="card" onSubmit={async e => { e.preventDefault(); const result = await mutate('/cart/coupon', 'PUT', { coupon }); setMessage(result ? (result.cart.coupon ? 'Cupom aplicado. O desconto acompanha o pedido.' : 'Cupom removido.') : 'O cupom não foi aplicado. Confira a mensagem acima.'); }}>
        <label htmlFor="coupon">Cupom de desconto</label><div className="input-row"><input id="coupon" placeholder="SWEET10 ou PROMO20" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} maxLength={20} /><button className="secondary" disabled={busy}>Aplicar</button></div>
        <p className="muted">SWEET10: 10% · PROMO20: 20%. Deixe vazio para remover.</p>{message && <p role="status">{message}</p>}{state.cart.coupon && <p>Cupom ativo: <strong>{state.cart.coupon}</strong></p>}
      </form><div className="card"><Totals quote={state.cart} /><button className="primary" disabled={busy} onClick={() => navigate('payment')}>Continuar para pagamento</button></div></>}
  </div><BottomNav navigate={navigate} active="cart" cartCount={count} /></section>;
}

export function LivePaymentScreen({ state, navigate, mutate, busy, onOrder }: Props & { onOrder: (id: string) => void }) {
  const [address, setAddress] = useState(state.user.address || 'Rua dos Cupcakes, 123, Centro');
  const [payment, setPayment] = useState('pix');
  const [key] = useState(() => crypto.randomUUID());
  if (!state.cart.items.length) return <section className="commerce-screen"><Header title="Pagamento" navigate={navigate} /><div className="screen-body empty"><h2>Seu carrinho está vazio</h2><button className="primary" onClick={() => navigate('home')}>Escolher cupcakes</button></div></section>;
  return <section className="commerce-screen"><Header title="Pagamento" navigate={navigate} /><form className="screen-body" onSubmit={async e => { e.preventDefault(); const result = await mutate('/orders', 'POST', { payment, address, cart_version: state.cart.version, request_key: key }); if (result?.created_order_id) onOrder(result.created_order_id); }}>
    <p className="notice">Compra de demonstração. Não informe dados de cartão ou dados pessoais reais.</p>
    <div className="card"><label htmlFor="address">Endereço fictício de entrega</label><textarea id="address" required minLength={8} maxLength={200} value={address} onChange={e => setAddress(e.target.value)} />
      <fieldset className="payment-options"><legend>Forma de pagamento simulada</legend>{[['pix', '📱 Pix'], ['card', '💳 Cartão'], ['cash', '💵 Dinheiro']].map(([value, label]) => <label key={value} className={payment === value ? 'selected' : ''}><input type="radio" name="payment" value={value} checked={payment === value} onChange={() => setPayment(value)} />{label}</label>)}</fieldset>
      <p className="muted">A aprovação é simulada. Não há QR Code bancário nem cobrança.</p></div>
    <div className="card">{state.cart.coupon && <p>Cupom mantido: <strong>{state.cart.coupon}</strong></p>}<Totals quote={state.cart} /><button className="primary" disabled={busy}>{busy ? 'Salvando pedido…' : `Confirmar pedido simulado · ${money(state.cart.total_cents)}`}</button></div>
    <button className="text-btn" type="button" onClick={() => navigate('cart')}>Voltar ao carrinho</button>
  </form></section>;
}

export function LiveTrackingScreen({ state, navigate, mutate, busy, selected, select }: Props & { selected: string | null; select: (id: string) => void }) {
  const order = state.orders.find(o => o.id === selected) || state.orders[0];
  return <section className="commerce-screen"><Header title="Meus pedidos" navigate={navigate} /><div className="screen-body">
    {!order ? <div className="empty"><span>📦</span><h2>Ainda não há pedidos</h2><p>Os pedidos concluídos aparecerão aqui.</p><button className="primary" onClick={() => navigate('home')}>Explorar cupcakes</button></div> : <>
      <label htmlFor="order-select">Pedido</label><select id="order-select" value={order.id} onChange={e => select(e.target.value)}>{state.orders.map(o => <option value={o.id} key={o.id}>{o.id} · {dateTime(o.created_at)}</option>)}</select>
      <div className="order-banner"><p>Pedido salvo com sucesso</p><h2>{order.id}</h2><strong>{STEPS[order.status]}</strong><p>{dateTime(order.created_at)}</p></div>
      <div className="card"><h2>Acompanhamento simulado</h2><ol className="timeline">{STEPS.map((step, i) => <li key={step} className={i <= order.status ? 'done' : ''}><span aria-hidden="true">{i <= order.status ? '✓' : '○'}</span>{step}{i === order.status && <small> Status atual</small>}</li>)}</ol>
        <p className="muted">Sem integração com entregadores. Use o botão para demonstrar a próxima etapa.</p><button className="secondary" disabled={busy || order.status === 3} onClick={() => void mutate(`/orders/${order.id}/advance`, 'POST', {})}>{order.status === 3 ? 'Entrega demonstrativa concluída' : 'Simular próxima etapa'}</button></div>
      <OrderDetails order={order} />
    </>}
  </div><BottomNav navigate={navigate} active="tracking" cartCount={state.cart.items.reduce((n, i) => n + i.quantity, 0)} /></section>;
}

function OrderDetails({ order }: { order: Order }) {
  return <div className="card"><h2>Detalhes do pedido</h2>{order.items.map(item => <p className="order-line" key={item.product_id}><span>{item.quantity} × {item.product_name}</span><strong>{money(item.price_cents * item.quantity)}</strong></p>)}<p className="muted">Entrega: {order.address}</p><p className="muted">Pagamento simulado: {({ pix: 'Pix', card: 'Cartão', cash: 'Dinheiro' })[order.payment]}</p>{order.coupon && <p>Cupom: {order.coupon}</p>}<Totals quote={order} /></div>;
}

export function LiveProfileScreen({ state, navigate, mutate, busy, logout, openOrder }: Props & { logout: () => void; openOrder: (id: string) => void }) {
  const [name, setName] = useState(state.user.name);
  const [address, setAddress] = useState(state.user.address);
  const [saved, setSaved] = useState(false);
  return <section className="commerce-screen"><Header title="Meu perfil" navigate={navigate} /><div className="screen-body"><div className="profile-banner"><span>🧁</span><h2>{state.user.name}</h2><p>Cliente de demonstração</p><div className="profile-stats"><span><strong>{state.orders.length}</strong> pedidos</span><span><strong>{state.favorites.length}</strong> favoritos</span></div></div>
    <form className="card" onSubmit={async e => { e.preventDefault(); setSaved(!!await mutate('/profile', 'PUT', { name, address })); }}><h2>Dados de demonstração</h2><label htmlFor="profile-name">Nome fictício</label><input id="profile-name" value={name} onChange={e => { setName(e.target.value); setSaved(false); }} minLength={2} maxLength={80} required /><label htmlFor="profile-address">Endereço fictício</label><textarea id="profile-address" value={address} onChange={e => { setAddress(e.target.value); setSaved(false); }} maxLength={200} /><button className="primary" disabled={busy}>Salvar perfil</button>{saved && <p role="status">Perfil salvo no banco de dados.</p>}</form>
    <div className="card"><h2>Histórico</h2>{!state.orders.length ? <p className="muted">Seus pedidos aparecerão aqui.</p> : state.orders.map(o => <button key={o.id} className="history-row" onClick={() => openOrder(o.id)}><span>{o.id}<small>{dateTime(o.created_at)} · {STEPS[o.status]}</small></span><strong>{money(o.total_cents)}</strong></button>)}</div>
    <button className="secondary" onClick={() => navigate('feedback')}>Avaliar a SweetCup</button><button className="text-btn" disabled={busy} onClick={logout}>Sair da sessão de demonstração</button><p className="muted">Ao sair, a próxima entrada cria outro cliente fictício. Esta demonstração não possui recuperação de conta.</p>
  </div><BottomNav navigate={navigate} active="profile" cartCount={state.cart.items.reduce((n, i) => n + i.quantity, 0)} /></section>;
}

export function FeedbackScreen({ navigate }: { navigate: Props['navigate'] }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [evidence, setEvidence] = useState<{ name: string; data: string }[]>([]);
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [download, setDownload] = useState('');
  return <section className="commerce-screen"><Header title="Avaliação do aplicativo" navigate={navigate} /><form className="screen-body" onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); const form = new FormData(e.currentTarget); const data = Object.fromEntries(form.entries()); try { const result = await api<{id:string}>('/feedback', 'POST', data); const exported = { ...data, id: result.id, evidence, origin: 'Preenchimento pelo participante', version: 'PIT2-v1' }; setRecord(exported); setDownload('data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exported, null, 2))); setSent(true); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }}>
    <p>Registre apenas o que você testou. O professor pede resultados, problemas e funcionalidades não testadas.</p><p className="muted">O texto é salvo no servidor. Os prints são incluídos no arquivo exportado; envie esse arquivo ao aluno responsável.</p>
    <div className="card"><label htmlFor="tester">Nome de quem testou</label><input id="tester" name="tester_name" required minLength={2} maxLength={100} /><label htmlFor="test-date">Data do teste</label><input id="test-date" name="tested_at" type="date" required max={new Date().toLocaleDateString('en-CA', { timeZone: 'America/Fortaleza' })} />
    {[['worked', 'O que testou e funcionou'], ['failed', 'O que testou e não funcionou / o que deve ser corrigido'], ['untested', 'Funcionalidade não testada e motivo']].map(([key,label]) => <div key={key}><label htmlFor={key}>{label}</label><textarea id={key} name={key} required minLength={3} maxLength={2000} rows={4} /></div>)}
    <label htmlFor="evidence">Prints de problemas (opcional, até 3 imagens de 2 MB)</label><input id="evidence" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={async e => { const files = Array.from(e.target.files || []); if (files.length > 3 || files.some(f => f.size > 2 * 1024 * 1024 || !['image/png','image/jpeg','image/webp'].includes(f.type))) { setError('Selecione até 3 imagens PNG, JPEG ou WebP de até 2 MB cada.'); e.target.value = ''; setEvidence([]); return; } const images = await Promise.all(files.map(file => new Promise<{name:string;data:string}>((resolve,reject) => { const r = new FileReader(); r.onload = () => resolve({name:file.name,data:String(r.result)}); r.onerror=reject; r.readAsDataURL(file); }))); setEvidence(images); }} />
    <button className="primary" disabled={busy || sent}>{busy ? 'Salvando…' : sent ? 'Avaliação registrada' : 'Registrar avaliação'}</button>{error && <p role="alert" className="error-text">{error}</p>}
    {sent && record && <><p role="status">Avaliação registrada. Baixe o arquivo com seus prints para entregar ao responsável pelo trabalho.</p><a className="secondary download-link" href={download} download="avaliacao-sweetcup.json">Baixar avaliação e prints</a></>}
    </div></form></section>;
}

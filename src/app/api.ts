import type { Cupcake } from './App';

export type User = { id: string; name: string; address: string; created_at: string };
export type Quote = { subtotal_cents: number; discount_cents: number; delivery_cents: number; total_cents: number };
export type Cart = Quote & { items: { id: number; name: string; price_cents: number; quantity: number }[]; coupon: string; version: number };
export type Order = Quote & { id: string; created_at: string; status: number; address: string; payment: string; coupon: string; items: { product_id: number; product_name: string; price_cents: number; quantity: number }[] };
export type AppState = { user: User; products: Cupcake[]; cart: Cart; favorites: number[]; orders: Order[]; created_order_id?: string };
export const money = (cents: number) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const dateTime = (value: string) => new Date(value).toLocaleString('pt-BR', { timeZone: 'America/Fortaleza', dateStyle: 'short', timeStyle: 'short' });

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch('/api' + path, {
    method, credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.error || 'Não foi possível acessar o servidor.', response.status);
  return payload as T;
}

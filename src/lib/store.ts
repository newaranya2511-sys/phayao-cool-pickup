import { useSyncExternalStore } from "react";
import { INITIAL_STOCK } from "./pricing";

export type PaymentMethod = "promptpay" | "slip";
export type OrderStatus = "ready" | "picked_up";

export interface Order {
  code: string;
  qty: number;
  unitPrice: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  buyerName: string;
  buyerPhone: string;
  createdAt: number;
  paidAt: number;
  pickedUpAt?: number;
}

export interface Profile {
  name: string;
  shop: string;
  phone: string;
}

export interface AppState {
  hydrated: boolean;
  stock: number;
  orders: Order[];
  profile: Profile;
  staffMode: boolean;
}

const KEY = "aircharng-phayao:v1";

const initialState: AppState = {
  hydrated: false,
  stock: INITIAL_STOCK,
  orders: [],
  profile: { name: "", shop: "", phone: "" },
  staffMode: false,
};

let state: AppState = initialState;
let loaded = false;
const listeners = new Set<() => void>();

function load(): AppState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...initialState, hydrated: true };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...initialState,
      ...parsed,
      profile: { ...initialState.profile, ...parsed.profile },
      hydrated: true,
    };
  } catch {
    return { ...initialState, hydrated: true };
  }
}

function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    state = load();
    loaded = true;
  }
}

function persist() {
  const { hydrated: _h, ...rest } = state;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    /* storage full or blocked: keep in memory */
  }
}

function setState(updater: (s: AppState) => AppState) {
  ensureLoaded();
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureLoaded();
      return state;
    },
    () => initialState,
  );
}

export function newOrderCode(existing: Order[]): string {
  let code = "";
  do {
    code = `PY-${Math.floor(10000 + Math.random() * 90000)}`;
  } while (existing.some((o) => o.code === code));
  return code;
}

export class OutOfStockError extends Error {
  constructor(public available: number) {
    super("out_of_stock");
  }
}

/** Payment confirmed: lock the units out of warehouse stock and issue the pickup pass. */
export function confirmPaidOrder(order: Omit<Order, "status" | "paidAt">): Order {
  ensureLoaded();
  if (order.qty > state.stock) throw new OutOfStockError(state.stock);
  const paid: Order = { ...order, status: "ready", paidAt: Date.now() };
  setState((s) => ({ ...s, stock: s.stock - order.qty, orders: [paid, ...s.orders] }));
  return paid;
}

export function markPickedUp(code: string) {
  setState((s) => ({
    ...s,
    orders: s.orders.map((o) =>
      o.code === code ? { ...o, status: "picked_up", pickedUpAt: Date.now() } : o,
    ),
  }));
}

export function saveProfile(profile: Profile) {
  setState((s) => ({ ...s, profile }));
}

export function setStaffMode(on: boolean) {
  setState((s) => ({ ...s, staffMode: on }));
}

export function resetTestData() {
  setState((s) => ({ ...s, stock: INITIAL_STOCK, orders: [] }));
}

/* ---------- Shareable pass (for a driver's phone without the order) ---------- */

export type SharedPass = Pick<
  Order,
  "code" | "qty" | "status" | "buyerName" | "buyerPhone" | "paidAt"
>;

export function encodeSharedPass(o: Order): string {
  const data: SharedPass = {
    code: o.code,
    qty: o.qty,
    status: o.status,
    buyerName: o.buyerName,
    buyerPhone: o.buyerPhone,
    paidAt: o.paidAt,
  };
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSharedPass(d: string): SharedPass | null {
  try {
    const bin = atob(d.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes)) as SharedPass;
    if (typeof data.code !== "string" || typeof data.qty !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

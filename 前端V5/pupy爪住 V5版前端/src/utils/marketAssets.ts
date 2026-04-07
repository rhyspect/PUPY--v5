export type MarketAssetKind = 'shopping' | 'booking';

export interface MarketCartItem {
  productId: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  sellerName: string;
  category?: string | null;
  type?: string | null;
  addedAt: string;
}

export interface MarketOrderItem {
  productId: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface MarketOrder {
  id: string;
  kind: MarketAssetKind;
  title: string;
  image: string;
  sellerName: string;
  status: string;
  total: number;
  quantity: number;
  createdAt: string;
  appointmentSlot?: string;
  note?: string;
  items?: MarketOrderItem[];
}

export const MARKET_ASSET_EVENT = 'pupy-market-assets-updated';
const CART_STORAGE_KEY = 'pupy_market_cart';
const ORDER_STORAGE_KEY = 'pupy_market_orders';

function readJsonArray<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

function writeJsonArray<T>(key: string, value: T[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(MARKET_ASSET_EVENT));
}

export function loadMarketCart() {
  return readJsonArray<MarketCartItem>(CART_STORAGE_KEY);
}

export function saveMarketCart(items: MarketCartItem[]) {
  writeJsonArray(CART_STORAGE_KEY, items);
}

export function loadMarketOrders() {
  return readJsonArray<MarketOrder>(ORDER_STORAGE_KEY);
}

export function saveMarketOrders(items: MarketOrder[]) {
  writeJsonArray(ORDER_STORAGE_KEY, items);
}

export function addMarketCartItem(nextItem: MarketCartItem) {
  const items = loadMarketCart();
  const existing = items.find((item) => item.productId === nextItem.productId);
  const nextItems = existing
    ? items.map((item) =>
        item.productId === nextItem.productId
          ? { ...item, quantity: item.quantity + nextItem.quantity, addedAt: nextItem.addedAt }
          : item,
      )
    : [nextItem, ...items];
  saveMarketCart(nextItems);
  return nextItems;
}

export function upsertMarketCartItem(productId: string, quantity: number) {
  const nextItems = loadMarketCart()
    .map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
    .filter((item) => item.quantity > 0);
  saveMarketCart(nextItems);
  return nextItems;
}

export function removeMarketCartItem(productId: string) {
  const nextItems = loadMarketCart().filter((item) => item.productId !== productId);
  saveMarketCart(nextItems);
  return nextItems;
}

export function createMarketOrder(order: Omit<MarketOrder, 'id' | 'createdAt'>) {
  const nextOrder: MarketOrder = {
    ...order,
    id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const nextOrders = [nextOrder, ...loadMarketOrders()];
  saveMarketOrders(nextOrders);
  return nextOrder;
}

export function formatAssetPrice(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '待确认';
  return `¥${value.toFixed(0)}`;
}

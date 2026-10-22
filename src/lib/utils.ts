import type { CartItem } from "./types";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const FREE_SHIPPING_THRESHOLD = 20000; // ₹20,000
export const STANDARD_SHIPPING_FEE = 499; // ₹499
export const EXPRESS_SHIPPING_FEE = 1499; // ₹1,499
export const PROMO_CODES: Record<string, number> = { STREET10: 0.1 };

/* ---------- Pure cart logic (unit-tested) ---------- */

export function cartKey(item: Pick<CartItem, "productSlug" | "size" | "color">): string {
  return `${item.productSlug}__${item.size}__${item.color}`;
}

export function addToCart(items: CartItem[], newItem: CartItem): CartItem[] {
  const key = cartKey(newItem);
  const existing = items.find((i) => cartKey(i) === key);
  if (existing) {
    return items.map((i) =>
      cartKey(i) === key ? { ...i, qty: Math.min(i.qty + newItem.qty, 99) } : i,
    );
  }
  return [...items, { ...newItem, qty: Math.max(1, Math.min(newItem.qty, 99)) }];
}

export function updateQty(items: CartItem[], key: string, qty: number): CartItem[] {
  if (qty <= 0) return items.filter((i) => cartKey(i) !== key);
  return items.map((i) => (cartKey(i) === key ? { ...i, qty: Math.min(qty, 99) } : i));
}

export function removeFromCart(items: CartItem[], key: string): CartItem[] {
  return items.filter((i) => cartKey(i) !== key);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function applyPromo(subtotal: number, code?: string | null): { discount: number; valid: boolean } {
  if (!code) return { discount: 0, valid: false };
  const rate = PROMO_CODES[code.trim().toUpperCase()];
  if (!rate) return { discount: 0, valid: false };
  return { discount: Math.round(subtotal * rate * 100) / 100, valid: true };
}

export function shippingFor(subtotalAfterDiscount: number): number {
  if (subtotalAfterDiscount <= 0) return 0;
  return subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

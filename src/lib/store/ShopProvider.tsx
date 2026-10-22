"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem, Product } from "../types";
import { addToCart, cartCount, cartSubtotal, removeFromCart, updateQty, cartKey } from "../utils";

interface ShopState {
  cart: CartItem[];
  wishlist: string[]; // product slugs
  cartOpen: boolean;
  searchOpen: boolean;
  toast: string | null;
  addItem: (product: Product, size: string, color: string, qty?: number) => void;
  updateItemQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  subtotal: number;
  count: number;
}

const ShopContext = createContext<ShopState | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCart(load<CartItem[]>("streetcreed-cart", []));
    setWishlist(load<string[]>("streetcreed-wishlist", []));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("streetcreed-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("streetcreed-wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const addItem = useCallback(
    (product: Product, size: string, color: string, qty = 1) => {
      setCart((prev) =>
        addToCart(prev, {
          productSlug: product.slug,
          name: product.name,
          image: product.images[0],
          price: product.price,
          size,
          color,
          qty,
        }),
      );
      showToast(`Added to bag — ${product.name}`);
      setCartOpen(true);
    },
    [showToast],
  );

  const updateItemQty = useCallback((key: string, qty: number) => {
    setCart((prev) => updateQty(prev, key, qty));
  }, []);

  const removeItem = useCallback((key: string) => {
    setCart((prev) => removeFromCart(prev, key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (slug: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(slug);
        showToast(exists ? "Removed from wishlist" : "Saved to wishlist");
        return exists ? prev.filter((s) => s !== slug) : [...prev, slug];
      });
    },
    [showToast],
  );

  const isWishlisted = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const value = useMemo<ShopState>(
    () => ({
      cart,
      wishlist,
      cartOpen,
      searchOpen,
      toast,
      addItem,
      updateItemQty,
      removeItem,
      clearCart,
      toggleWishlist,
      isWishlisted,
      setCartOpen,
      setSearchOpen,
      subtotal: cartSubtotal(cart),
      count: cartCount(cart),
    }),
    [cart, wishlist, cartOpen, searchOpen, toast, addItem, updateItemQty, removeItem, clearCart, toggleWishlist, isWishlisted],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-6 z-[90] animate-fade-up bg-ink px-5 py-3.5 text-sm text-paper shadow-xl"
        >
          {toast}
        </div>
      )}
    </ShopContext.Provider>
  );
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

export { cartKey };

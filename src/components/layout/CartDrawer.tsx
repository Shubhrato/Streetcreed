"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useShop } from "@/lib/store/ShopProvider";
import { FREE_SHIPPING_THRESHOLD, cartKey, formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateItemQty, removeItem, subtotal, count } = useShop();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    if (cartOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const away = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button aria-label="Close bag" className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-[2px]" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-drawer-in flex-col bg-paper shadow-2xl">
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl">Your Bag {count > 0 && <span className="text-base text-mist">({count})</span>}</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close" className="flex h-10 w-10 items-center justify-center text-xl leading-none hover:text-accent">×</button>
        </header>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-display text-3xl">Your bag is empty</p>
            <p className="mt-3 text-sm text-ink-soft">Beautiful things take a moment to choose. Start with our bestsellers.</p>
            <Link href="/shop" onClick={() => setCartOpen(false)} className="mt-6 bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4">
              <p className="text-xs text-ink-soft">
                {away > 0 ? <>You are <strong>{formatPrice(away)}</strong> away from complimentary shipping</> : <>Complimentary shipping unlocked</>}
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded bg-linen">
                <div className="h-full bg-accent transition-all duration-500 ease-expo" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6" role="list">
              {cart.map((item) => {
                const key = cartKey(item);
                return (
                  <li key={key} className="flex gap-4 py-5">
                    <div className="relative h-24 w-[72px] shrink-0 overflow-hidden bg-bone">
                      <Image src={item.image} alt="" fill sizes="72px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">{item.name}</p>
                        <p className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.qty)}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-mist">Size {item.size} · {item.color}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center border border-line">
                          <button aria-label="Decrease quantity" className="flex h-8 w-8 items-center justify-center hover:bg-bone" onClick={() => updateItemQty(key, item.qty - 1)}>−</button>
                          <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{item.qty}</span>
                          <button aria-label="Increase quantity" className="flex h-8 w-8 items-center justify-center hover:bg-bone" onClick={() => updateItemQty(key, item.qty + 1)}>+</button>
                        </div>
                        <button className="text-xs text-mist underline underline-offset-2 hover:text-error" onClick={() => removeItem(key)}>Remove</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <footer className="border-t border-line px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Subtotal</span>
                <span className="text-lg font-semibold tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-mist">Shipping and taxes calculated at checkout.</p>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="mt-4 block bg-ink py-4 text-center text-[11px] font-semibold uppercase tracking-eyebrow text-paper transition-colors hover:bg-accent-deep">
                Proceed to checkout
              </Link>
              <Link href="/cart" onClick={() => setCartOpen(false)} className="mt-2 block py-2 text-center text-sm underline underline-offset-4 hover:text-accent">
                View bag
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

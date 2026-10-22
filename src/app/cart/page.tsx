"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useShop } from "@/lib/store/ShopProvider";
import { FREE_SHIPPING_THRESHOLD, applyPromo, cartKey, formatPrice, shippingFor } from "@/lib/utils";

export default function CartPage() {
  const { cart, updateItemQty, removeItem, subtotal } = useShop();
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [promoMsg, setPromoMsg] = useState("");

  const { discount, valid } = applyPromo(subtotal, applied);
  const shipping = shippingFor(subtotal - discount);
  const total = subtotal - discount + shipping;

  function applyCode(e: React.FormEvent) {
    e.preventDefault();
    const result = applyPromo(subtotal, promo);
    if (result.valid) {
      setApplied(promo.trim().toUpperCase());
      setPromoMsg("Code applied — 10% off.");
    } else {
      setApplied(null);
      setPromoMsg("That code is not valid. Try STREET10.");
    }
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-24 text-center lg:px-12">
        <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">Your bag</p>
        <h1 className="mt-3 font-display text-5xl">Beautifully empty</h1>
        <p className="mx-auto mt-4 max-w-sm text-ink-soft">Your bag is waiting for its first piece. Start with the pieces our clients re-order most.</p>
        <Link href="/shop" className="mt-8 inline-block bg-ink px-9 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
      <h1 className="font-display text-5xl leading-[1.02]">Your bag</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-line border-y border-line" role="list">
          {cart.map((item) => {
            const key = cartKey(item);
            return (
              <li key={key} className="flex gap-5 py-6">
                <Link href={`/product/${item.productSlug}`} className="relative h-32 w-24 shrink-0 overflow-hidden bg-bone">
                  <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/product/${item.productSlug}`} className="font-medium leading-snug hover:text-accent">{item.name}</Link>
                      <p className="mt-1 text-sm text-mist">Size {item.size} · {item.color}</p>
                    </div>
                    <p className="font-medium tabular-nums">{formatPrice(item.price * item.qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center border border-line">
                      <button aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center hover:bg-bone" onClick={() => updateItemQty(key, item.qty - 1)}>−</button>
                      <span className="w-9 text-center text-sm tabular-nums" aria-live="polite">{item.qty}</span>
                      <button aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center hover:bg-bone" onClick={() => updateItemQty(key, item.qty + 1)}>+</button>
                    </div>
                    <button className="text-sm text-mist underline underline-offset-2 hover:text-error" onClick={() => removeItem(key)}>Remove</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit border border-line bg-bone/50 p-6 lg:sticky lg:top-28" aria-label="Order summary">
          <h2 className="font-display text-2xl">Summary</h2>
          <form onSubmit={applyCode} className="mt-5">
            <label htmlFor="promo" className="text-[11px] font-semibold uppercase tracking-eyebrow">Promo code</label>
            <div className="mt-2 flex">
              <input id="promo" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="STREET10" className="w-full border border-line bg-white px-3 py-3 text-sm uppercase" />
              <button type="submit" className="shrink-0 border border-ink bg-ink px-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper">Apply</button>
            </div>
            {promoMsg && <p className={`mt-2 text-sm ${valid && applied ? "text-success" : "text-error"}`} role="status">{promoMsg}</p>}
          </form>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-success"><dt>Discount ({applied})</dt><dd className="tabular-nums">−{formatPrice(discount)}</dd></div>}
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="tabular-nums">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
            </div>
            {shipping > 0 && <p className="text-xs text-mist">Add {formatPrice(FREE_SHIPPING_THRESHOLD - (subtotal - discount))} more for complimentary shipping.</p>}
            <div className="flex justify-between border-t border-line pt-4 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatPrice(total)}</dd></div>
          </dl>
          <Link href="/checkout" className="mt-6 block bg-ink py-4 text-center text-[11px] font-semibold uppercase tracking-eyebrow text-paper transition-colors hover:bg-accent-deep">Checkout</Link>
          <Link href="/shop" className="mt-3 block py-1 text-center text-sm underline underline-offset-4 hover:text-accent">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}

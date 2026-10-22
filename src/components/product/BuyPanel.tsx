"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useShop } from "@/lib/store/ShopProvider";
import { cn } from "@/lib/utils";

export default function BuyPanel({ product }: { product: Product }) {
  const { addItem, toggleWishlist, isWishlisted } = useShop();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState<string | null>("details");
  const wishlisted = isWishlisted(product.slug);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (!size) {
      setError("Please select a size first");
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setError("");
    addItem(product, size, color, qty);
  }

  const sections = [
    { id: "details", title: "Details", body: product.details.join(" · ") },
    { id: "fabric", title: "Fabric & care", body: product.fabric },
    { id: "shipping", title: "Shipping & returns", body: "Complimentary carbon-neutral shipping over ₹20,000 (otherwise ₹499). Express available at checkout. 60-day returns, free lifetime repairs in our ateliers." },
  ];

  return (
    <div>
      <div id="size-selector">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow">
            Size {size && <span className="ml-2 text-accent">— {size}</span>}
          </p>
          <button type="button" className="text-xs text-mist underline underline-offset-2 hover:text-accent">Size guide</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Select size">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setSize(s); setError(""); }}
              aria-pressed={size === s}
              className={cn(
                "min-w-[52px] border px-4 py-3 text-sm transition-all duration-200",
                size === s ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-error" role="alert">{error}</p>}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="mt-2 text-sm font-medium text-error">Only {product.stock} left in stock</p>
        )}
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-eyebrow">Colour — {color}</p>
        <div className="mt-3 flex gap-2.5" role="group" aria-label="Select colour">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              aria-label={`Colour ${c.name}`}
              aria-pressed={color === c.name}
              onClick={() => setColor(c.name)}
              className={cn("h-10 w-10 rounded-full border-2 transition-transform hover:scale-110", color === c.name ? "border-ink" : "border-line")}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <div className="flex items-center border border-line" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" className="flex h-[52px] w-11 items-center justify-center hover:bg-bone" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
          <button type="button" aria-label="Increase quantity" className="flex h-[52px] w-11 items-center justify-center hover:bg-bone" onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 bg-ink py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-mist"
        >
          {outOfStock ? "Sold out" : "Add to bag"}
        </button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className={cn("flex w-[52px] items-center justify-center border transition-colors", wishlisted ? "border-error bg-error/5" : "border-line hover:border-ink")}
        >
          <svg viewBox="0 0 24 24" className={cn("h-5 w-5", wishlisted ? "fill-error stroke-error" : "fill-none stroke-ink")} strokeWidth="1.8" aria-hidden="true">
            <path d="M12 20.7C6.4 17 3 13.6 3 9.9 3 7.2 5 5 7.7 5c1.7 0 3.3.9 4.3 2.4C13 5.9 14.6 5 16.3 5 19 5 21 7.2 21 9.9c0 3.7-3.4 7.1-9 10.8z" />
          </svg>
        </button>
      </div>

      <ul className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] font-medium uppercase tracking-wide text-ink-soft">
        <li className="border border-line px-2 py-3">Free ship ₹20,000+</li>
        <li className="border border-line px-2 py-3">60-day returns</li>
        <li className="border border-line px-2 py-3">Lifetime repairs</li>
      </ul>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {sections.map((s) => (
          <div key={s.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold"
              aria-expanded={openSection === s.id}
              onClick={() => setOpenSection(openSection === s.id ? null : s.id)}
            >
              {s.title}
              <span aria-hidden="true" className={cn("transition-transform duration-300", openSection === s.id && "rotate-45")}>+</span>
            </button>
            {openSection === s.id && <p className="pb-5 text-sm leading-relaxed text-ink-soft animate-fade-in">{s.body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

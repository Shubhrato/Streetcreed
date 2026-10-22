"use client";

import Link from "next/link";
import { products } from "@/lib/data/catalog";
import { useShop } from "@/lib/store/ShopProvider";
import ProductGrid from "@/components/product/ProductGrid";

export default function WishlistPage() {
  const { wishlist } = useShop();
  const items = products.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">Saved pieces</p>
      <h1 className="mt-3 font-display text-5xl leading-[1.02]">Your wishlist</h1>
      <p className="mt-3 text-ink-soft">{items.length} {items.length === 1 ? "piece" : "pieces"} saved for later.</p>
      <div className="mt-12">
        {items.length > 0 ? (
          <ProductGrid products={items} />
        ) : (
          <div className="border border-line bg-bone/50 px-6 py-20 text-center">
            <p className="font-display text-3xl">Nothing saved yet</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">Tap the heart on any piece to keep it here while you decide.</p>
            <Link href="/shop" className="mt-6 inline-block bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">Discover pieces</Link>
          </div>
        )}
      </div>
    </div>
  );
}

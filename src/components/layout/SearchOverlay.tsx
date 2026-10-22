"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/lib/data/catalog";
import { useShop } from "@/lib/store/ShopProvider";
import { formatPrice } from "@/lib/utils";

const TRENDING = ["overcoat", "silk", "merino", "linen", "cashmere", "oxford"];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[85] overflow-y-auto bg-paper animate-fade-in" role="dialog" aria-modal="true" aria-label="Search">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-8">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">Search STREETCREED</p>
          <button onClick={() => setSearchOpen(false)} aria-label="Close search" className="flex h-11 w-11 items-center justify-center text-2xl leading-none hover:text-accent">×</button>
        </div>
        <form action="/search" onSubmit={() => setSearchOpen(false)}>
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input
            id="site-search"
            ref={inputRef}
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “cashmere” or “slip dress”"
            className="mt-4 w-full border-b-2 border-ink bg-transparent pb-4 font-display text-3xl outline-none placeholder:text-mist md:text-4xl"
            autoComplete="off"
          />
        </form>

        {query.trim() === "" ? (
          <div className="mt-10">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-mist">Trending now</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <button key={t} onClick={() => setQuery(t)} className="rounded-full border border-line px-4 py-2 text-sm capitalize transition-colors hover:border-ink hover:bg-bone">
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="mt-10 text-ink-soft">No pieces match “{query}”. Try a fabric, a category, or a silhouette.</p>
        ) : (
          <ul className="mt-10 divide-y divide-line" role="list">
            {results.map((p) => (
              <li key={p.slug}>
                <Link href={`/product/${p.slug}`} onClick={() => setSearchOpen(false)} className="flex items-center gap-4 py-4 transition-colors hover:bg-bone/60">
                  <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-bone">
                    <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-eyebrow text-mist">{p.category}</span>
                    <span className="block font-medium">{p.name}</span>
                  </span>
                  <span className="font-medium tabular-nums">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {results.length > 0 && (
          <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => setSearchOpen(false)} className="mt-8 inline-block text-sm font-medium underline underline-offset-4 hover:text-accent">
            See all results →
          </Link>
        )}
      </div>
    </div>
  );
}

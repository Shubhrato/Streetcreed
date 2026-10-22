import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import { searchProducts } from "@/lib/services/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = { ...pageMetadata("Search", "Search the STREETCREED collection.", "/search"), robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = await searchProducts(q);
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">Search</p>
      <h1 className="mt-3 font-display text-5xl leading-[1.02]">
        {q ? <>Results for “{q}”</> : "Search the collection"}
      </h1>
      <p className="mt-3 text-ink-soft">{results.length} {results.length === 1 ? "piece" : "pieces"} found</p>
      <form action="/search" className="mt-8 flex max-w-lg" role="search">
        <label htmlFor="q" className="sr-only">Search products</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search coats, silk, merino…" className="w-full border border-line bg-white px-4 py-3.5 text-sm" />
        <button type="submit" className="shrink-0 bg-ink px-6 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">Search</button>
      </form>
      <div className="mt-12">
        {results.length > 0 ? (
          <ProductGrid products={results} priorityFirst />
        ) : (
          <div className="border border-line bg-bone/50 px-6 py-16 text-center">
            <p className="font-display text-3xl">No matches for “{q}”</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">Try a fabric (silk, merino, linen), a category (coats, dresses), or browse everything.</p>
            <Link href="/shop" className="mt-6 inline-block bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">Browse the collection</Link>
          </div>
        )}
      </div>
    </div>
  );
}

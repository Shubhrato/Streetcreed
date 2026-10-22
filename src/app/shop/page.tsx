import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { FilterRail, SortSelect } from "@/components/shop/ShopControls";
import { allCategories, allColors, allSizes, getProducts } from "@/lib/services/products";
import { pageMetadata } from "@/lib/seo";
import type { Gender, SortKey } from "@/lib/types";

export const metadata: Metadata = pageMetadata("Shop all", "Shop the full STREETCREED collection — coats, dresses, tailoring, knitwear and essentials in natural fibres.", "/shop");

interface SearchParams { [key: string]: string | string[] | undefined }
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const list = (v: string | string[] | undefined) => (one(v)?.split(",").filter(Boolean) ?? []);

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const gender = (one(sp.gender) as Gender | "all" | undefined) ?? "all";
  const items = await getProducts({
    gender,
    categories: list(sp.cat),
    sizes: list(sp.size),
    colors: list(sp.color),
    maxPrice: one(sp.max) ? Number(one(sp.max)) : undefined,
    inStockOnly: one(sp.stock) === "1",
    sort: (one(sp.sort) as SortKey) || "featured",
  });

  const title = gender === "women" ? "Women" : gender === "men" ? "Men" : "Shop all";

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-xs text-mist">
        <Link href="/" className="hover:text-accent">Home</Link> <span aria-hidden="true">/</span> <span className="text-ink">{title}</span>
      </nav>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl leading-[1.02] md:text-6xl">{title}</h1>
          <p className="mt-3 text-ink-soft">{items.length} {items.length === 1 ? "piece" : "pieces"} — natural fibres, considered cuts.</p>
        </div>
        <div className="flex gap-2" role="tablist" aria-label="Gender">
          {(["all", "women", "men"] as const).map((g) => (
            <Link
              key={g}
              href={g === "all" ? "/shop" : `/shop?gender=${g}`}
              aria-current={gender === g ? "page" : undefined}
              className={`border px-4 py-2.5 text-sm capitalize transition-colors ${gender === g ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink"}`}
            >
              {g}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <Suspense fallback={<div className="h-40 animate-pulse bg-bone" aria-hidden="true" />}>
            <FilterRail categories={allCategories()} sizes={allSizes()} colors={allColors()} />
          </Suspense>
        </aside>
        <section aria-label="Products">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-mist" aria-live="polite">{items.length} results</p>
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>
          <ProductGrid products={items} priorityFirst />
        </section>
      </div>
    </div>
  );
}

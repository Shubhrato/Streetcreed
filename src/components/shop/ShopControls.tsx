"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { SortKey } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top rated" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = (params.get("sort") as SortKey) || "featured";
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-mist">Sort</span>
      <select
        value={current}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          next.set("sort", e.target.value);
          router.push(`${pathname}?${next.toString()}`, { scroll: false });
        }}
        className="border border-line bg-white px-3 py-2.5 text-sm"
        aria-label="Sort products"
      >
        {SORTS.map((s) => (
          <option key={s.key} value={s.key}>{s.label}</option>
        ))}
      </select>
    </label>
  );
}

export function FilterRail({
  categories,
  sizes,
  colors,
}: {
  categories: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getList = (key: string) => (params.get(key)?.split(",").filter(Boolean) ?? []);

  function toggleList(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    const list = getList(key);
    const updated = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    if (updated.length) next.set(key, updated.join(","));
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function clearAll() {
    const next = new URLSearchParams();
    const gender = params.get("gender");
    if (gender) next.set("gender", gender);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const activeCount =
    getList("cat").length + getList("size").length + getList("color").length + (params.get("max") ? 1 : 0) + (params.get("stock") ? 1 : 0);

  const body = (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink">Category</legend>
        <ul className="mt-4 space-y-2.5">
          {categories.map((c) => (
            <li key={c}>
              <label className="flex cursor-pointer items-center gap-3 text-sm hover:text-accent">
                <input type="checkbox" className="h-4 w-4 accent-[#6E4F2A]" checked={getList("cat").includes(c)} onChange={() => toggleList("cat", c)} />
                {c}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink">Size</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = getList("size").includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleList("size", s)}
                aria-pressed={active}
                className={cn("min-w-[44px] border px-3 py-2 text-sm transition-colors", active ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink")}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink">Colour</legend>
        <ul className="mt-4 space-y-2.5">
          {colors.map((c) => (
            <li key={c.name}>
              <label className="flex cursor-pointer items-center gap-3 text-sm hover:text-accent">
                <input type="checkbox" className="h-4 w-4 accent-[#6E4F2A]" checked={getList("color").includes(c.name)} onChange={() => toggleList("color", c.name)} />
                <span className="h-4 w-4 rounded-full border border-line" style={{ backgroundColor: c.hex }} aria-hidden="true" />
                {c.name}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink">Max price</legend>
        <input
          type="range"
          min={1000}
          max={70000}
          step={500}
          defaultValue={params.get("max") || 70000}
          onChange={(e) => setParam("max", e.target.value === "70000" ? null : e.target.value)}
          className="mt-4 w-full accent-[#6E4F2A]"
          aria-label="Maximum price"
        />
        <p className="mt-1 text-sm text-mist">Up to {formatPrice(Number(params.get("max") || 70000))}</p>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-[#6E4F2A]" checked={params.get("stock") === "1"} onChange={(e) => setParam("stock", e.target.checked ? "1" : null)} />
        In stock only
      </label>

      {activeCount > 0 && (
        <button type="button" onClick={clearAll} className="text-sm font-medium text-error underline underline-offset-4">
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="w-full border border-line bg-white px-4 py-3 text-sm font-medium lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-expanded={mobileOpen}
      >
        Filters {activeCount > 0 && `(${activeCount})`}
      </button>
      <div className="hidden lg:block">{body}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button aria-label="Close filters" className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 max-h-[85vh] w-full overflow-y-auto bg-paper p-6 animate-fade-up">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-2xl">Filters</p>
              <button onClick={() => setMobileOpen(false)} aria-label="Close" className="flex h-10 w-10 items-center justify-center text-2xl">×</button>
            </div>
            {body}
            <button onClick={() => setMobileOpen(false)} className="mt-8 w-full bg-ink py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper">
              Show results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services/products";
import type { Gender, SortKey } from "@/lib/types";

// GET /api/products?gender=women&sort=price-asc&max=300&q=silk
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const list = (key: string) => sp.get(key)?.split(",").filter(Boolean);
  const items = await getProducts({
    gender: (sp.get("gender") as Gender | "all") || "all",
    query: sp.get("q") || undefined,
    categories: list("cat"),
    sizes: list("size"),
    colors: list("color"),
    maxPrice: sp.get("max") ? Number(sp.get("max")) : undefined,
    inStockOnly: sp.get("stock") === "1",
    sort: (sp.get("sort") as SortKey) || "featured",
  });
  return NextResponse.json(
    { count: items.length, products: items },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}

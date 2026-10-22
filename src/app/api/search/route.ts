import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/services/products";
import { searchQuerySchema } from "@/lib/validation";

// GET /api/search?q=merino — validated, length-capped query.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const parsed = searchQuerySchema.safeParse({ q });
  if (!parsed.success) {
    return NextResponse.json({ count: 0, products: [] });
  }
  const items = await searchProducts(parsed.data.q);
  return NextResponse.json({ count: items.length, products: items });
}

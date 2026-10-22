import { collections, products } from "../data/catalog";
import type { Collection, Product, ProductFilters } from "../types";

/**
 * Service layer over the catalog. Today it reads realistic mock data;
 * swap the internals for Prisma queries (see prisma/schema.prisma) without
 * changing any call sites — pages and API routes only use these functions.
 */

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let list = [...products];

  if (filters.gender && filters.gender !== "all") {
    list = list.filter((p) => p.gender === filters.gender || p.gender === "unisex");
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  if (filters.categories?.length) {
    list = list.filter((p) => filters.categories!.includes(p.category));
  }
  if (filters.sizes?.length) {
    list = list.filter((p) => p.sizes.some((s) => filters.sizes!.includes(s)));
  }
  if (filters.colors?.length) {
    list = list.filter((p) => p.colors.some((c) => filters.colors!.includes(c.name)));
  }
  if (typeof filters.maxPrice === "number") {
    list = list.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.inStockOnly) {
    list = list.filter((p) => p.stock > 0);
  }

  switch (filters.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    default:
      list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  }
  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return collections.find((c) => c.slug === slug) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return products
    .filter((p) => p.slug !== product.slug && (p.category === product.category || p.collectionSlug === product.collectionSlug))
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  return getProducts({ query });
}

export function allCategories(): string[] {
  return [...new Set(products.map((p) => p.category))].sort();
}

export function allSizes(): string[] {
  const order = ["XS", "S", "M", "L", "XL", "XXL", "One Size", "36", "37", "38", "39", "40", "41"];
  const set = new Set(products.flatMap((p) => p.sizes));
  return order.filter((s) => set.has(s));
}

export function allColors(): { name: string; hex: string }[] {
  const map = new Map<string, string>();
  products.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)));
  return [...map.entries()].map(([name, hex]) => ({ name, hex })).sort((a, b) => a.name.localeCompare(b.name));
}

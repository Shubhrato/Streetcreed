export type Gender = "women" | "men" | "unisex";

export interface Product {
  slug: string;
  name: string;
  category: string; // e.g. "Coats", "Dresses"
  gender: Gender;
  price: number; // INR
  compareAt?: number;
  rating: number; // 0–5
  reviews: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: [string, string]; // [model shot, flat/detail shot]
  badge?: "New" | "Bestseller" | "Low stock" | "Back in stock";
  stock: number;
  description: string;
  details: string[];
  fabric: string;
  collectionSlug: string;
  createdAt: string; // ISO — drives "Newest" sort
  featured?: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  gender: Gender | "all";
}

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
}

export interface CartItem {
  productSlug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
  total: number;
  items: { name: string; qty: number }[];
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

export interface ProductFilters {
  query?: string;
  gender?: Gender | "all";
  categories?: string[];
  sizes?: string[];
  colors?: string[]; // color names
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: SortKey;
}

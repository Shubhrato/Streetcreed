import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import Reveal from "../common/Reveal";

export default function ProductGrid({ products, priorityFirst = false }: { products: Product[]; priorityFirst?: boolean }) {
  if (products.length === 0) {
    return (
      <div className="border border-line bg-bone/50 px-6 py-20 text-center">
        <p className="font-display text-3xl">Nothing matches, for now</p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink-soft">
          Try removing a filter or two — or browse the full collection, new pieces arrive weekly.
        </p>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4" role="list">
      {products.map((p, i) => (
        <Reveal as="li" key={p.slug} delay={(i % 4) * 60}>
          <ProductCard product={p} priority={priorityFirst && i < 4} />
        </Reveal>
      ))}
    </ul>
  );
}

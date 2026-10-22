"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { useShop } from "@/lib/store/ShopProvider";
import Stars from "../common/Stars";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { toggleWishlist, isWishlisted, addItem } = useShop();
  const wishlisted = isWishlisted(product.slug);
  const [first] = product.images;

  return (
    <article className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-bone">
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="block h-full w-full">
          <Image
            src={first}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.05]"
          />
        </Link>

        {product.badge && (
          <span
            className={cn(
              "absolute left-3 top-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-eyebrow",
              product.badge === "Low stock" ? "bg-error text-white" : "bg-paper/95 text-ink",
            )}
          >
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper/95 shadow-sm transition-transform duration-200 hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            className={cn("h-[18px] w-[18px] transition-colors", wishlisted ? "fill-error stroke-error" : "fill-none stroke-ink")}
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M12 20.7C6.4 17 3 13.6 3 9.9 3 7.2 5 5 7.7 5c1.7 0 3.3.9 4.3 2.4C13 5.9 14.6 5 16.3 5 19 5 21 7.2 21 9.9c0 3.7-3.4 7.1-9 10.8z" />
          </svg>
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-expo group-hover:translate-y-0">
          <button
            type="button"
            onClick={() => addItem(product, product.sizes[Math.min(1, product.sizes.length - 1)], product.colors[0].name)}
            className="w-full bg-ink/95 py-3.5 text-[11px] font-semibold uppercase tracking-eyebrow text-paper backdrop-blur transition-colors hover:bg-accent-deep"
          >
            Quick add — {product.sizes[Math.min(1, product.sizes.length - 1)]}
          </button>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-eyebrow text-mist">{product.category}</p>
        <Link href={`/product/${product.slug}`} className="mt-1 block font-medium leading-snug hover:text-accent">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <Stars rating={product.rating} />
          <span className="text-xs text-mist">({product.reviews})</span>
        </div>
        <p className="mt-1.5 flex items-baseline gap-2">
          <span className={cn("font-medium tabular-nums", product.compareAt ? "text-error" : undefined)}>
            {formatPrice(product.price)}
          </span>
          {product.compareAt && (
            <span className="text-sm tabular-nums text-mist line-through">{formatPrice(product.compareAt)}</span>
          )}
        </p>
      </div>
    </article>
  );
}

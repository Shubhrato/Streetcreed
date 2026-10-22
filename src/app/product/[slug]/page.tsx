import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/data/catalog";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/products";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/seo";
import BuyPanel from "@/components/product/BuyPanel";
import ProductGrid from "@/components/product/ProductGrid";
import SectionHeading from "@/components/common/SectionHeading";
import Stars from "@/components/common/Stars";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${SITE.name}`,
    description: p.description,
    alternates: { canonical: `${SITE.url}/product/${slug}` },
    openGraph: { title: `${p.name} — ${SITE.name}`, description: p.description, images: [p.images[0]], type: "website" },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category,
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE.url}/product/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-xs text-mist">
        <Link href="/" className="hover:text-accent">Home</Link> <span aria-hidden="true">/</span>{" "}
        <Link href="/shop" className="hover:text-accent">Shop</Link> <span aria-hidden="true">/</span>{" "}
        <Link href={`/shop?cat=${encodeURIComponent(product.category)}`} className="hover:text-accent">{product.category}</Link>{" "}
        <span aria-hidden="true">/</span> <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {product.images.map((src, i) => (
            <div key={i} className={`relative aspect-[3/4] overflow-hidden bg-bone ${i === 0 ? "sm:col-span-2 aspect-[4/3] sm:aspect-[16/11]" : ""}`}>
              <Image src={src} alt={i === 0 ? product.name : `${product.name} — detail view`} fill priority={i === 0} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              {i === 0 && product.badge && (
                <span className="absolute left-4 top-4 bg-paper/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-eyebrow">{product.badge}</span>
              )}
            </div>
          ))}
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <Stars rating={product.rating} className="h-4 w-4" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-mist">· {product.reviews} reviews</span>
          </div>
          <p className="mt-5 flex items-baseline gap-3">
            <span className={`text-2xl font-semibold tabular-nums ${product.compareAt ? "text-error" : ""}`}>{formatPrice(product.price)}</span>
            {product.compareAt && <span className="text-lg tabular-nums text-mist line-through">{formatPrice(product.compareAt)}</span>}
          </p>
          <p className="mt-2 text-xs text-mist">Cost per wear over 10 years: {formatPrice(product.price / 120)} — built to be worn weekly, for a decade.</p>
          <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>
          <div className="mt-8">
            <BuyPanel product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="related-h">
          <SectionHeading eyebrow="Complete the look" title="You may also consider" href="/shop" linkLabel="Shop all" />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import { collections, products } from "@/lib/data/catalog";
import { getCollectionBySlug } from "@/lib/services/products";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCollectionBySlug(slug);
  if (!c) return {};
  return pageMetadata(c.name, c.tagline, `/collections/${slug}`);
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();
  const items = products.filter((p) => p.collectionSlug === slug);

  return (
    <>
      <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-ink text-paper">
        <Image src={collection.image} alt="" fill priority sizes="100vw" className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-14 pt-32 lg:px-12">
          <nav aria-label="Breadcrumb" className="text-xs text-paper/70">
            <Link href="/" className="hover:text-paper">Home</Link> <span aria-hidden="true">/</span> <Link href="/shop" className="hover:text-paper">Shop</Link> <span aria-hidden="true">/</span> <span>{collection.name}</span>
          </nav>
          <h1 className="mt-4 font-display text-5xl leading-[1.02] md:text-7xl">{collection.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-paper/85">{collection.tagline}</p>
        </div>
      </section>
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-12">
        <p className="mb-8 text-sm text-mist">{items.length} pieces in this collection</p>
        <Suspense fallback={null}>
          <ProductGrid products={items} priorityFirst />
        </Suspense>
      </div>
    </>
  );
}

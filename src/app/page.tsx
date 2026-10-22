import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { collections, editorialImage, heroImage, journalPosts, products } from "@/lib/data/catalog";
import ProductGrid from "@/components/product/ProductGrid";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import NewsletterForm from "@/components/layout/NewsletterForm";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
};

const VALUES = ["Considered design", "Natural fibres", "Made to last a decade", "Carbon-neutral delivery", "60-day returns"];

export default function HomePage() {
  const bestsellers = products.filter((p) => p.badge === "Bestseller" || p.featured).slice(0, 4);
  const newArrivals = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-ink text-paper">
        <Image
          src={heroImage}
          alt="Editorial fashion portrait from the STREETCREED Autumn collection"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-20 pt-40 lg:px-12">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/70">Autumn — Winter 2026</p>
            <h1 className="mt-5 max-w-3xl font-display text-6xl font-medium leading-[1.02] md:text-7xl lg:text-[86px]">
              Quiet luxury, worn loudly by no one.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/85">
              Tailoring, silk and cashmere cut for the next decade — not the next trend cycle.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/shop?gender=women" className="bg-paper px-9 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-ink transition-colors hover:bg-bone">
                Shop women
              </Link>
              <Link href="/shop?gender=men" className="border border-paper/70 px-9 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper transition-colors hover:bg-paper hover:text-ink">
                Shop men
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- VALUES MARQUEE ---------- */}
      <div className="overflow-hidden border-b border-line bg-bone py-4" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-0 hover:[animation-play-state:paused]">
          {[...VALUES, ...VALUES].map((v, i) => (
            <span key={i} className="flex items-center gap-8 pr-8 text-[12px] font-semibold uppercase tracking-eyebrow text-ink-soft">
              {v} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- COLLECTIONS (asymmetric editorial) ---------- */}
      <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-28" aria-labelledby="collections-h">
        <SectionHeading eyebrow="Curated for the season" title="The collections" href="/shop" linkLabel="Shop everything" />
        <div className="grid gap-6 md:grid-cols-12">
          {collections.slice(0, 2).map((c, i) => (
            <Reveal key={c.slug} className={i === 0 ? "md:col-span-7" : "md:col-span-5"} delay={i * 80}>
              <Link href={`/collections/${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-bone md:aspect-auto md:h-[520px]">
                <Image src={c.image} alt={c.name} fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.05]" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden="true" />
                <span className="absolute bottom-0 left-0 p-7 text-paper">
                  <span className="block font-display text-3xl md:text-4xl">{c.name}</span>
                  <span className="mt-2 block max-w-sm text-sm text-paper/85">{c.tagline}</span>
                  <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-eyebrow underline underline-offset-4">Explore →</span>
                </span>
              </Link>
            </Reveal>
          ))}
          {collections.slice(2).map((c, i) => (
            <Reveal key={c.slug} className="md:col-span-6" delay={i * 80}>
              <Link href={`/collections/${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-bone md:aspect-auto md:h-[420px]">
                <Image src={c.image} alt={c.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.05]" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden="true" />
                <span className="absolute bottom-0 left-0 p-7 text-paper">
                  <span className="block font-display text-3xl md:text-4xl">{c.name}</span>
                  <span className="mt-2 block max-w-sm text-sm text-paper/85">{c.tagline}</span>
                  <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-eyebrow underline underline-offset-4">Explore →</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- BESTSELLERS ---------- */}
      <section className="bg-bone/60" aria-labelledby="best-h">
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-28">
          <SectionHeading eyebrow="Most loved" title="Bestsellers" href="/shop?sort=rating" linkLabel="View all" />
          <ProductGrid products={bestsellers} priorityFirst />
        </div>
      </section>

      {/* ---------- EDITORIAL BANNER ---------- */}
      <section className="relative overflow-hidden bg-ink text-paper" aria-labelledby="story-h">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-20 lg:grid-cols-12 lg:px-12 lg:py-28">
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={editorialImage} alt="Inside the STREETCREED atelier — garments in natural fibres" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={120}>
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/60">The STREETCREED standard</p>
            <h2 id="story-h" className="mt-4 font-display text-4xl leading-[1.08] md:text-5xl">
              We count wears, not seasons.
            </h2>
            <p className="mt-5 leading-relaxed text-paper/80">
              Every STREETCREED piece is costed per wear over ten years, cut from natural fibres, and repaired free for
              life in our ateliers. If it cannot survive a decade of Sundays, it does not carry the name.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["92% natural or recycled fibres", "Free lifetime repairs", "Transparent cost-per-wear on every product"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="text-accent" aria-hidden="true">✦</span> {t}
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-10 inline-block bg-paper px-9 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-ink transition-colors hover:bg-bone">
              Our story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- NEW ARRIVALS ---------- */}
      <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-28" aria-labelledby="new-h">
        <SectionHeading eyebrow="Just landed" title="New arrivals" href="/shop?sort=newest" linkLabel="See the latest" />
        <ProductGrid products={newArrivals} />
      </section>

      {/* ---------- JOURNAL ---------- */}
      <section className="border-t border-line bg-bone/60" aria-labelledby="journal-h">
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-28">
          <SectionHeading eyebrow="From the journal" title="Notes on dressing well" href="/journal" linkLabel="All stories" />
          <div className="grid gap-8 md:grid-cols-3">
            {journalPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 80}>
                <article>
                  <Link href="/journal" className="group block">
                    <span className="relative block aspect-[4/3] overflow-hidden bg-bone">
                      <Image src={post.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.05]" />
                    </span>
                    <p className="mt-5 text-[11px] font-semibold uppercase tracking-eyebrow text-mist">
                      {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {post.readTime} read
                    </p>
                    <h3 className="mt-2 font-display text-2xl leading-snug group-hover:text-accent">{post.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- NEWSLETTER ---------- */}
      <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-24" aria-labelledby="nl-h">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">The house letter</p>
          <h2 id="nl-h" className="mt-3 font-display text-4xl leading-[1.05] md:text-5xl">First looks, private sales, no noise</h2>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">One letter a week. Early access to new collections and 10% off your first order.</p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}

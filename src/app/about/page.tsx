import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import { editorialImage } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("About", "The STREETCREED story — considered clothing made to be worn for a decade.", "/about");

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16 lg:py-24">
      <Reveal>
        <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">Our story</p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-6xl">A house built on fewer, better things.</h1>
      </Reveal>
      <Reveal delay={100}>
        <div className="relative mt-12 aspect-[16/9] overflow-hidden bg-bone">
          <Image src={editorialImage} alt="Inside the STREETCREED atelier" fill sizes="(max-width: 1100px) 100vw, 1100px" className="object-cover" />
        </div>
      </Reveal>
      <div className="prose-like mt-12 grid gap-10 text-lg leading-relaxed text-ink-soft md:grid-cols-2">
        <p>STREETCREED began with a frustration: closets full of clothing, nothing made to last. We started cutting coats from double-faced Italian wool, shirts from Portuguese oxford, knitwear from seam-free merino — and refused to release anything we would not repair for free, forever.</p>
        <p>Today the house makes two considered collections a year, plus a permanent Essentials line that never changes except to improve. No seasonal churn, no artificial scarcity — just garments costed per wear over ten years and built to deserve them.</p>
      </div>
      <div className="mt-16 grid gap-4 text-center sm:grid-cols-3">
        {[
          { n: "92%", l: "Natural or recycled fibres" },
          { n: "10 yrs", l: "Designed lifespan, minimum" },
          { n: "Free", l: "Lifetime repairs, always" },
        ].map((s) => (
          <div key={s.l} className="border border-line bg-bone/50 px-6 py-10">
            <p className="font-display text-5xl">{s.n}</p>
            <p className="mt-2 text-sm text-ink-soft">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link href="/shop" className="inline-block bg-ink px-9 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">Shop the collection</Link>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/common/Reveal";
import { journalPosts } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Journal", "Notes on dressing well — fabric guides, capsule wardrobes and the craft behind STREETCREED.", "/journal");

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">The journal</p>
      <h1 className="mt-3 font-display text-5xl leading-[1.02] md:text-6xl">Notes on dressing well</h1>
      <div className="mt-14 grid gap-10 md:grid-cols-3">
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
                <h2 className="mt-2 font-display text-3xl leading-snug group-hover:text-accent">{post.title}</h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{post.excerpt}</p>
                <span className="mt-4 inline-block text-sm font-medium underline underline-offset-4">Read the story →</span>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

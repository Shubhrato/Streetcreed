"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-28 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-error">Something slipped a stitch</p>
      <h1 className="mt-4 font-display text-5xl leading-[1.05]">We could not load this page</h1>
      <p className="mx-auto mt-5 max-w-md text-ink-soft">A temporary error on our side. Try again — if it keeps happening, the atelier would like to know.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">Try again</button>
        <Link href="/" className="border border-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-eyebrow hover:bg-bone">Back home</Link>
      </div>
    </div>
  );
}

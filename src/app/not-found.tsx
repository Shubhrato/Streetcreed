import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-28 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">404</p>
      <h1 className="mt-4 font-display text-6xl leading-[1.02]">This page has left the collection</h1>
      <p className="mx-auto mt-5 max-w-md text-ink-soft">The piece you are looking for may have sold out or moved. The current collection is waiting.</p>
      <Link href="/shop" className="mt-9 inline-block bg-ink px-9 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">Shop the collection</Link>
    </div>
  );
}

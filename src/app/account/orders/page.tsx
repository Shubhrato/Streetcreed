import type { Metadata } from "next";
import Link from "next/link";
import { mockOrders } from "@/lib/data/catalog";
import { pageMetadata } from "@/lib/seo";
import { cn, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { ...pageMetadata("Your orders", "Track your STREETCREED orders.", "/account/orders"), robots: { index: false } };

const STATUS_CLS: Record<string, string> = {
  Processing: "bg-bone text-ink",
  Shipped: "bg-accent text-paper",
  Delivered: "bg-success text-paper",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-12 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-xs text-mist">
        <Link href="/account" className="hover:text-accent">Account</Link> <span aria-hidden="true">/</span> <span className="text-ink">Orders</span>
      </nav>
      <h1 className="mt-4 font-display text-5xl leading-[1.02]">Your orders</h1>
      <div className="mt-10 space-y-6">
        {mockOrders.map((o) => (
          <article key={o.id} className="border border-line">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bone/60 px-6 py-4">
              <div>
                <p className="font-semibold">{o.id}</p>
                <p className="text-xs text-mist">Placed {new Date(o.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
              <span className={cn("px-3 py-1.5 text-[11px] font-semibold uppercase tracking-eyebrow", STATUS_CLS[o.status])}>{o.status}</span>
            </header>
            <ul className="divide-y divide-line px-6" role="list">
              {o.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between py-4 text-sm">
                  <span>{item.name}</span>
                  <span className="text-mist">Qty {item.qty}</span>
                </li>
              ))}
            </ul>
            <footer className="flex items-center justify-between border-t border-line px-6 py-4">
              <span className="text-sm text-ink-soft">Total</span>
              <span className="font-semibold tabular-nums">{formatPrice(o.total)}</span>
            </footer>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-mist">Demo data — connect Prisma + your order service to show live orders here.</p>
    </div>
  );
}

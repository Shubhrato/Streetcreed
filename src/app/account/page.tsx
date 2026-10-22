import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { mockOrders } from "@/lib/data/catalog";
import { getSession } from "@/lib/auth";
import { pageMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/utils";
import SignOutButton from "@/components/common/SignOutButton";

export const metadata: Metadata = { ...pageMetadata("Your account", "Your STREETCREED account — orders, wishlist and settings.", "/account"), robots: { index: false } };

/**
 * Protected page — middleware has already verified the session before this
 * renders; the identity shown here comes from that verified server-side
 * session only. There is deliberately no user-id anywhere in the URL.
 */
export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/account");
  const latest = mockOrders[0];
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">Members area</p>
      <h1 className="mt-3 font-display text-5xl leading-[1.02]">Your account</h1>
      <p className="mt-3 text-ink-soft">Welcome back, {session.name.split(" ")[0]}. Here is everything happening with your pieces.</p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <section className="border border-line bg-bone/50 p-7" aria-labelledby="acc-orders">
          <h2 id="acc-orders" className="text-[11px] font-semibold uppercase tracking-eyebrow text-mist">Latest order</h2>
          {latest ? (
            <>
              <p className="mt-4 font-display text-3xl">{latest.id}</p>
              <p className="mt-2 text-sm text-ink-soft">{latest.status} · {formatPrice(latest.total)}</p>
              <Link href="/account/orders" className="mt-5 inline-block text-sm font-medium underline underline-offset-4 hover:text-accent">View all orders →</Link>
            </>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">No orders yet.</p>
          )}
        </section>
        <section className="border border-line bg-bone/50 p-7" aria-labelledby="acc-wish">
          <h2 id="acc-wish" className="text-[11px] font-semibold uppercase tracking-eyebrow text-mist">Wishlist</h2>
          <p className="mt-4 font-display text-3xl">Saved pieces</p>
          <p className="mt-2 text-sm text-ink-soft">Your shortlist, kept across visits on this device.</p>
          <Link href="/wishlist" className="mt-5 inline-block text-sm font-medium underline underline-offset-4 hover:text-accent">Open wishlist →</Link>
        </section>
        <section className="border border-line bg-bone/50 p-7" aria-labelledby="acc-repairs">
          <h2 id="acc-repairs" className="text-[11px] font-semibold uppercase tracking-eyebrow text-mist">Atelier repairs</h2>
          <p className="mt-4 font-display text-3xl">Free, for life</p>
          <p className="mt-2 text-sm text-ink-soft">Loose button, tired seam, worn heel — send any STREETCREED piece back and we restore it.</p>
          <Link href="/contact" className="mt-5 inline-block text-sm font-medium underline underline-offset-4 hover:text-accent">Book a repair →</Link>
        </section>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="border border-line p-7" aria-labelledby="acc-profile">
          <h2 id="acc-profile" className="font-display text-2xl">Profile</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between border-b border-line pb-3"><dt className="text-mist">Name</dt><dd className="font-medium">{session.name}</dd></div>
            <div className="flex justify-between border-b border-line pb-3"><dt className="text-mist">Email</dt><dd className="font-medium">{session.email}</dd></div>
            <div className="flex justify-between border-b border-line pb-3"><dt className="text-mist">Account type</dt><dd className="font-medium">{session.role === "ADMIN" ? "Administrator" : "Member"}</dd></div>
            <div className="flex justify-between"><dt className="text-mist">House letter</dt><dd className="font-medium text-success">Subscribed</dd></div>
          </dl>
          <div className="mt-6">
            <SignOutButton />
          </div>
        </section>
        <section className="border border-line p-7" aria-labelledby="acc-help">
          <h2 id="acc-help" className="font-display text-2xl">Need a hand?</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link href="/account/orders" className="underline underline-offset-4 hover:text-accent">Track or return an order</Link></li>
            <li><Link href="/contact" className="underline underline-offset-4 hover:text-accent">Talk to the atelier</Link></li>
            <li><Link href="/shop" className="underline underline-offset-4 hover:text-accent">Continue shopping</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Women", href: "/shop?gender=women" },
      { label: "Men", href: "/shop?gender=men" },
      { label: "The Autumn Edit", href: "/collections/autumn-edit" },
      { label: "Evening", href: "/collections/evening" },
      { label: "Essentials", href: "/collections/essentials" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Your account", href: "/account" },
      { label: "Orders", href: "/account/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Your bag", href: "/cart" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-5 lg:px-12 lg:py-20">
        <div className="lg:col-span-2">
          <p className="font-display text-3xl font-semibold tracking-[0.22em]">STREETCREED</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
            Considered clothing, made to be worn for a decade. Join the house letter for early access to collections,
            private sales and stories from the atelier.
          </p>
          <div className="mt-6">
            <NewsletterForm dark />
          </div>
        </div>
        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/50">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-paper/85 transition-colors hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-paper/50 lg:px-12">
          <p>© {new Date().getFullYear()} STREETCREED. All rights reserved.</p>
          <p>Designed in the atelier · Shipped worldwide · Carbon-neutral delivery</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useShop } from "@/lib/store/ShopProvider";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Women", href: "/shop?gender=women" },
  { label: "Men", href: "/shop?gender=men" },
  { label: "Collections", href: "/collections/autumn-edit" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
];

const MESSAGES = [
  "Complimentary shipping on orders over ₹20,000",
  "The Autumn Edit has arrived",
  "Extended returns — 60 days, always",
];

function Icon({ d, label }: { d: string; label: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.7" role="img" aria-label={label}>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const { count, wishlist, setCartOpen, setSearchOpen } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % MESSAGES.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="bg-ink text-paper">
        <p className="mx-auto max-w-[1440px] px-6 py-2 text-center text-[11px] font-medium uppercase tracking-eyebrow" aria-live="polite">
          {MESSAGES[msgIndex]}
        </p>
      </div>
      <header
        className={cn(
          "sticky top-0 z-[70] transition-all duration-300 ease-expo",
          scrolled ? "border-b border-line bg-paper/95 shadow-[0_1px_0_rgba(20,19,16,0.04)] backdrop-blur" : "bg-paper",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-6 lg:px-12">
          <button
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon d="M4 7h16M4 12h16M4 17h16" label="Menu" />
          </button>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV.slice(0, 3).map((item) => (
              <Link key={item.label} href={item.href} className="text-[13px] font-medium uppercase tracking-[0.08em] transition-colors hover:text-accent">
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-display text-[28px] font-semibold tracking-[0.22em]" aria-label="STREETCREED home">
            STREETCREED
          </Link>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <nav aria-label="Secondary" className="mr-2 hidden items-center gap-8 lg:flex">
              {NAV.slice(3).map((item) => (
                <Link key={item.label} href={item.href} className="text-[13px] font-medium uppercase tracking-[0.08em] transition-colors hover:text-accent">
                  {item.label}
                </Link>
              ))}
            </nav>
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="flex h-11 w-11 items-center justify-center transition-colors hover:text-accent">
              <Icon d="M21 21l-4.3-4.3M11 19a8 8 0 110-16 8 8 0 010 16z" label="Search" />
            </button>
            <Link href="/account" aria-label="Account" className="hidden h-11 w-11 items-center justify-center transition-colors hover:text-accent sm:flex">
              <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" label="Account" />
            </Link>
            <Link href="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`} className="relative hidden h-11 w-11 items-center justify-center transition-colors hover:text-accent sm:flex">
              <Icon d="M12 20.7C6.4 17 3 13.6 3 9.9 3 7.2 5 5 7.7 5c1.7 0 3.3.9 4.3 2.4C13 5.9 14.6 5 16.3 5 19 5 21 7.2 21 9.9c0 3.7-3.4 7.1-9 10.8z" label="Wishlist" />
              {wishlist.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-paper">{wishlist.length}</span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} aria-label={`Bag, ${count} items`} className="relative flex h-11 w-11 items-center justify-center transition-colors hover:text-accent">
              <Icon d="M6 8h15l-1.5 9h-12L6 8zM6 8a6 6 0 1112 0" label="Bag" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-paper">{count}</span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav aria-label="Mobile" className="animate-fade-in border-t border-line bg-paper px-6 py-4 lg:hidden">
            <ul className="space-y-1">
              {[...NAV, { label: "Wishlist", href: "/wishlist" }, { label: "Account", href: "/account" }].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="block py-2.5 font-display text-2xl">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}

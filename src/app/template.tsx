"use client";

import { usePathname } from "next/navigation";

/** Subtle route-change transition (MASTER.md §6) — content settles 8px. */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-fade-up" style={{ animationDuration: "0.45s" }}>
      {children}
    </div>
  );
}

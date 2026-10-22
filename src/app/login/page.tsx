import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm from "@/components/common/AuthForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = { ...pageMetadata("Sign in", "Sign in to your STREETCREED account.", "/login"), robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16 lg:py-24">
      <p className="text-center text-[11px] font-semibold uppercase tracking-eyebrow text-accent">Members</p>
      <h1 className="mt-3 text-center font-display text-5xl">Sign in</h1>
      <p className="mt-3 text-center text-ink-soft">Access your orders, wishlist and atelier repairs.</p>
      <div className="mt-10">
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}

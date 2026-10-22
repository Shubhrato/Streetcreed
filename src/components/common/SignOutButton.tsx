"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Signs out via the server route, which destroys the session cookie. */
export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="border border-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-eyebrow transition-colors hover:bg-bone disabled:opacity-60"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

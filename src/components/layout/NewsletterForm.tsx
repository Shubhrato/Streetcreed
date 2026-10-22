"use client";

import { useState } from "react";
import { newsletterSchema } from "@/lib/validation";

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setState("error");
      setMessage(parsed.error.issues[0]?.message ?? "Enter a valid email");
      return;
    }
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
      setMessage("Welcome to the house. Your first letter arrives this week.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Something went wrong — please try again.");
    }
  }

  if (state === "done") {
    return <p className={dark ? "text-paper" : "text-success"} role="status">{message}</p>;
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex max-w-md">
        <label htmlFor={dark ? "nl-dark" : "nl-light"} className="sr-only">Email address</label>
        <input
          id={dark ? "nl-dark" : "nl-light"}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-invalid={state === "error"}
          className={
            dark
              ? "w-full border border-paper/30 bg-transparent px-4 py-3.5 text-sm text-paper placeholder:text-paper/50"
              : "w-full border border-line bg-white px-4 py-3.5 text-sm placeholder:text-mist"
          }
        />
        <button type="submit" className={dark ? "shrink-0 bg-paper px-6 text-[11px] font-semibold uppercase tracking-eyebrow text-ink hover:bg-bone" : "shrink-0 bg-ink px-6 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep"}>
          Join
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-sm text-error" role="alert">{message}</p>}
    </form>
  );
}

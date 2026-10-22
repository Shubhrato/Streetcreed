"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
      setError("Please add your name, a valid email, and a message of at least a sentence.");
      return;
    }
    setError("");
    setSent(true);
  }

  const cls = "w-full border border-line bg-white px-4 py-3.5 text-sm outline-none placeholder:text-mist focus:border-ink";

  return (
    <div className="mx-auto max-w-[800px] px-6 py-16 lg:py-24">
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">Contact</p>
      <h1 className="mt-3 font-display text-5xl leading-[1.02]">Talk to the atelier</h1>
      <p className="mt-4 text-ink-soft">Sizing advice, repairs, order questions — a human replies within one business day.</p>
      {sent ? (
        <div className="mt-10 border border-line bg-bone/50 p-8 text-center" role="status">
          <p className="font-display text-3xl">Message received</p>
          <p className="mt-2 text-sm text-ink-soft">Thank you — we will write back within one business day.</p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-10 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-eyebrow">Name</label>
              <input id="c-name" name="name" autoComplete="name" className={cls} />
            </div>
            <div>
              <label htmlFor="c-email" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-eyebrow">Email</label>
              <input id="c-email" name="email" type="email" autoComplete="email" className={cls} />
            </div>
          </div>
          <div>
            <label htmlFor="c-topic" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-eyebrow">Topic</label>
            <select id="c-topic" name="topic" className={cls} defaultValue="Order question">
              <option>Order question</option>
              <option>Sizing advice</option>
              <option>Book a repair</option>
              <option>Press & partnerships</option>
              <option>Something else</option>
            </select>
          </div>
          <div>
            <label htmlFor="c-msg" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-eyebrow">Message</label>
            <textarea id="c-msg" name="message" rows={6} className={cls} placeholder="How can we help?" />
          </div>
          {error && <p className="text-sm text-error" role="alert">{error}</p>}
          <button type="submit" className="bg-ink px-9 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">Send message</button>
        </form>
      )}
    </div>
  );
}

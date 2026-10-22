"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { loginSchema, registerSchema } from "@/lib/validation";

const inputCls = (err: boolean) =>
  `w-full border bg-white px-4 py-3.5 text-sm outline-none placeholder:text-mist ${err ? "border-error" : "border-line focus:border-ink"}`;

/**
 * Real authentication form — talks to /api/auth/login | /api/auth/register.
 * The server re-validates everything (zod), checks the password against the
 * bcrypt hash in the database, and sets a signed httpOnly session cookie.
 * Nothing about identity is ever taken from the client or the URL.
 */
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = mode === "login" ? loginSchema.safeParse(data) : registerSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const k = String(i.path[0]);
        if (!errs[k]) errs[k] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; field?: string };
      if (!res.ok) {
        if (json.field) {
          setErrors({ [json.field]: json.error || "Invalid value" });
        } else {
          setServerError(json.error || "Something went wrong — please try again.");
        }
        return;
      }
      const callback = searchParams.get("callbackUrl");
      const target = callback && callback.startsWith("/") && !callback.startsWith("//") ? callback : "/account";
      router.push(target);
      router.refresh();
    } catch {
      setServerError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {serverError && (
        <p className="border border-error/40 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
          {serverError}
        </p>
      )}
      {mode === "register" && (
        <div>
          <label htmlFor="name" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-eyebrow">Full name</label>
          <input id="name" name="name" autoComplete="name" className={inputCls(!!errors.name)} />
          {errors.name && <p className="mt-1.5 text-sm text-error" role="alert">{errors.name}</p>}
        </div>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-eyebrow">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputCls(!!errors.email)} />
        {errors.email && <p className="mt-1.5 text-sm text-error" role="alert">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-eyebrow">Password</label>
        <input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} className={inputCls(!!errors.password)} />
        {errors.password && <p className="mt-1.5 text-sm text-error" role="alert">{errors.password}</p>}
        {mode === "register" && <p className="mt-1.5 text-xs text-mist">At least 8 characters. Stored only as a bcrypt hash — never in plain text, never readable by anyone.</p>}
      </div>
      {mode === "register" && (
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-eyebrow">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" className={inputCls(!!errors.confirmPassword)} />
          {errors.confirmPassword && <p className="mt-1.5 text-sm text-error" role="alert">{errors.confirmPassword}</p>}
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-ink py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper transition-colors hover:bg-accent-deep disabled:opacity-60"
      >
        {submitting ? (mode === "login" ? "Signing in…" : "Creating your account…") : mode === "login" ? "Sign in" : "Create account"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        {mode === "login" ? (
          <>New to STREETCREED? <Link href="/register" className="font-medium underline underline-offset-4 hover:text-accent">Create an account</Link></>
        ) : (
          <>Already have an account? <Link href="/login" className="font-medium underline underline-offset-4 hover:text-accent">Sign in</Link></>
        )}
      </p>
    </form>
  );
}

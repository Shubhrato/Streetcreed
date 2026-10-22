"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useShop } from "@/lib/store/ShopProvider";
import { checkoutSchema } from "@/lib/validation";
import { EXPRESS_SHIPPING_FEE, applyPromo, cartKey, formatPrice, shippingFor } from "@/lib/utils";

type Errors = Partial<Record<string, string>>;

const inputCls = (hasError: boolean) =>
  `w-full border bg-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-mist ${
    hasError ? "border-error" : "border-line focus:border-ink"
  }`;

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-eyebrow">{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useShop();
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [errors, setErrors] = useState<Errors>({});
  const [order, setOrder] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const { discount } = applyPromo(subtotal, null);
  const standardShipping = shippingFor(subtotal - discount);
  const shipping = delivery === "express" ? EXPRESS_SHIPPING_FEE : standardShipping;
  const total = useMemo(() => subtotal - discount + shipping, [subtotal, discount, shipping]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = checkoutSchema.safeParse({ ...data, delivery });
    if (!parsed.success) {
      const errs: Errors = {};
      parsed.error.issues.forEach((i) => {
        const key = String(i.path[0]);
        if (!errs[key]) errs[key] = i.message;
      });
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    setPlacing(true);
    // Demo checkout: no real payment is processed. Wire Stripe here (see README).
    setTimeout(() => {
      setOrder(`AUR-${Math.floor(10000 + Math.random() * 89999)}`);
      clearCart();
      setPlacing(false);
      window.scrollTo({ top: 0 });
    }, 900);
  }

  if (order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-success">Order confirmed</p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05]">Thank you. It is on its way to being yours.</h1>
        <p className="mt-5 text-ink-soft">
          Order <strong className="text-ink">{order}</strong> — a confirmation letter is on its way to your inbox.
          Your pieces will be prepared in the atelier and shipped within 2 business days.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/account/orders" className="bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">
            Track your order
          </Link>
          <Link href="/shop" className="border border-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-eyebrow hover:bg-bone">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-5xl">Your bag is empty</h1>
        <p className="mt-4 text-ink-soft">Add a piece or two before checking out.</p>
        <Link href="/shop" className="mt-8 inline-block bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper hover:bg-accent-deep">
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12 lg:py-16">
      <h1 className="font-display text-5xl leading-[1.02]">Checkout</h1>
      <p className="mt-2 text-sm text-mist">Demo checkout — no real payment is processed. Card fields are validated locally only.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-10 grid items-start gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-12">
          <section aria-labelledby="co-contact">
            <h2 id="co-contact" className="font-display text-2xl">Contact</h2>
            <div className="mt-5">
              <Field label="Email address" error={errors.email}>
                <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputCls(!!errors.email)} />
              </Field>
            </div>
          </section>

          <section aria-labelledby="co-ship">
            <h2 id="co-ship" className="font-display text-2xl">Shipping address</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="First name" error={errors.firstName}>
                <input name="firstName" autoComplete="given-name" className={inputCls(!!errors.firstName)} />
              </Field>
              <Field label="Last name" error={errors.lastName}>
                <input name="lastName" autoComplete="family-name" className={inputCls(!!errors.lastName)} />
              </Field>
              <Field label="Street address" error={errors.address} className="sm:col-span-2">
                <input name="address" autoComplete="street-address" placeholder="123 Atelier Lane, Apt 4" className={inputCls(!!errors.address)} />
              </Field>
              <Field label="City" error={errors.city}>
                <input name="city" autoComplete="address-level2" className={inputCls(!!errors.city)} />
              </Field>
              <div className="grid grid-cols-2 gap-5">
                <Field label="Postal code" error={errors.postalCode}>
                  <input name="postalCode" autoComplete="postal-code" className={inputCls(!!errors.postalCode)} />
                </Field>
                <Field label="Country" error={errors.country}>
                  <input name="country" autoComplete="country-name" className={inputCls(!!errors.country)} />
                </Field>
              </div>
            </div>
          </section>

          <section aria-labelledby="co-delivery">
            <h2 id="co-delivery" className="font-display text-2xl">Delivery</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Delivery method">
              {(
                [
                  { key: "standard", title: "Standard", note: "3–5 business days", price: standardShipping === 0 ? "Complimentary" : formatPrice(standardShipping) },
                  { key: "express", title: "Express", note: "1–2 business days", price: formatPrice(EXPRESS_SHIPPING_FEE) },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  role="radio"
                  aria-checked={delivery === opt.key}
                  onClick={() => setDelivery(opt.key)}
                  className={`border p-5 text-left transition-colors ${delivery === opt.key ? "border-ink bg-bone" : "border-line bg-white hover:border-ink"}`}
                >
                  <span className="flex items-center justify-between font-medium">
                    {opt.title} <span className="tabular-nums">{opt.price}</span>
                  </span>
                  <span className="mt-1 block text-sm text-mist">{opt.note}</span>
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="co-pay">
            <h2 id="co-pay" className="font-display text-2xl">Payment</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Name on card" error={errors.cardName} className="sm:col-span-2">
                <input name="cardName" autoComplete="cc-name" className={inputCls(!!errors.cardName)} />
              </Field>
              <Field label="Card number" error={errors.cardNumber} className="sm:col-span-2">
                <input name="cardNumber" inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" className={inputCls(!!errors.cardNumber)} />
              </Field>
              <Field label="Expiry (MM/YY)" error={errors.cardExpiry}>
                <input name="cardExpiry" inputMode="numeric" autoComplete="cc-exp" placeholder="12/28" className={inputCls(!!errors.cardExpiry)} />
              </Field>
              <Field label="CVC" error={errors.cardCvc}>
                <input name="cardCvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" className={inputCls(!!errors.cardCvc)} />
              </Field>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-mist">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="1" /><path d="M8 10V7a4 4 0 118 0v3" /></svg>
              Payments are encrypted end-to-end. In production this form is replaced by Stripe Elements.
            </p>
          </section>
        </div>

        <aside className="border border-line bg-bone/50 p-6 lg:sticky lg:top-28" aria-label="Order summary">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-5 space-y-4" role="list">
            {cart.map((item) => (
              <li key={cartKey(item)} className="flex items-center gap-3">
                <span className="relative h-16 w-12 shrink-0 overflow-hidden bg-bone">
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                  <span className="absolute right-0 top-0 bg-ink px-1.5 text-[10px] font-bold text-paper">{item.qty}</span>
                </span>
                <span className="flex-1 text-sm">
                  <span className="block font-medium leading-snug">{item.name}</span>
                  <span className="text-mist">Size {item.size} · {item.color}</span>
                </span>
                <span className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd className="tabular-nums">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-4 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatPrice(total)}</dd></div>
          </dl>
          <button
            type="submit"
            disabled={placing}
            className="mt-6 w-full bg-ink py-4 text-[11px] font-semibold uppercase tracking-eyebrow text-paper transition-colors hover:bg-accent-deep disabled:opacity-60"
          >
            {placing ? "Placing your order…" : `Pay ${formatPrice(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-mist">By placing this order you agree to our terms. 60-day returns on everything.</p>
        </aside>
      </form>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatGBP, formatGBPWhole } from "@/lib/format";
import Reveal from "./Reveal";
import { BagIcon, LockIcon, OliveIcon } from "./icons";
import type { SiteSettings } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CheckoutClient({ settings }: { settings: SiteSettings }) {
  const { items, subtotal, total, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postcode: "",
    zone: "uk" as "uk" | "international",
  });

  const isInternational = form.zone === "international";
  const commerce = settings.commerce;
  const fee = isInternational ? commerce.internationalShippingFee : commerce.shippingFee;
  const freeThreshold = isInternational
    ? commerce.internationalFreeShippingThreshold
    : commerce.freeShippingThreshold;
  const zoneLabel = isInternational ? "International" : "UK";
  const shipping =
    subtotal === 0
      ? 0
      : freeThreshold > 0 && subtotal >= freeThreshold
        ? 0
        : fee;
  const grandTotal = total + shipping;
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stripeState, setStripeState] = useState<"success" | "cancelled" | null>(
    null,
  );

  // Handle Stripe's redirects back to this page: `?success=1` or `?cancelled=1`.
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("success") !== "1" && qs.get("cancelled") !== "1") return;
    // Mount-only initialisation from the URL, safe to set state here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStripeState(qs.get("success") === "1" ? "success" : "cancelled");
    if (qs.get("success") === "1") clearCart();
  }, [clearCart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      setError("Please complete your name, email and delivery address.");
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setBusy(true);
    const payload = {
      items: items.map((i) => ({
        name: i.name,
        price: i.price,
        qty: i.qty,
        variant: i.variant,
      })),
      zone: form.zone,
      name: form.name.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      postcode: form.postcode.trim(),
    };
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        fallback?: boolean;
        error?: string;
      };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (!res.ok || data.error) {
        setError(
          data.error ||
            "We couldn’t start the payment. Please try again in a moment.",
        );
        setBusy(false);
        return;
      }
      // No Stripe configured (`fallback`): record the order manually.
    } catch {
      setError(
        "We couldn’t reach the payment service. Please check your connection and try again.",
      );
      setBusy(false);
      return;
    }
    setPlaced(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setBusy(false);
  };

  if (stripeState === "cancelled") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <BagIcon className="h-16 w-16 text-steel" />
        <h1 className="mt-5 font-serif text-4xl text-navy sm:text-5xl">
          Checkout cancelled
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-navy/70">
          No payment was taken and your basket is still saved. You can return to
          your order whenever you’re ready.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/checkout"
            className="rounded-full bg-oxblood px-8 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood-deep"
          >
            Return to checkout
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-navy/20 px-8 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-navy transition hover:border-oxblood hover:text-oxblood"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (placed || stripeState === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <OliveIcon className="h-16 w-16 text-ochre" />
        <h1 className="mt-5 font-serif text-4xl text-navy sm:text-5xl">
          {stripeState === "success"
            ? "Grazie!"
            : `Grazie, ${form.name.split(" ")[0]}!`}
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-navy/70">
          {stripeState === "success"
            ? "Your payment was successful and your order is confirmed. We’ll be in touch within one working day to arrange delivery."
            : "Your order has been received. We’ll email you within one working day to confirm payment and arrange delivery."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-oxblood px-8 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood-deep"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="rounded-full border border-navy/25 px-8 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-navy transition hover:border-ochre hover:text-ochre"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <BagIcon className="h-14 w-14 text-ochre" />
        <h1 className="mt-4 font-serif text-4xl text-navy">Your cart is empty</h1>
        <p className="mt-3 text-sm text-steel">
          Add a few beautiful things before checking out.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-block rounded-full bg-navy px-8 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="border-b border-navy/10 bg-cream">
        <Reveal className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:py-16">
          <p className="eyebrow text-ochre">Almost there</p>
          <h1 className="mt-3 font-serif text-4xl text-navy sm:text-5xl">
            Checkout
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-10 lg:grid-cols-5"
        >
          {/* Delivery details */}
          <Reveal className="space-y-5 lg:col-span-3">
            <h2 className="font-serif text-2xl text-navy">Delivery details</h2>
            <div>
              <label
                htmlFor="co-zone"
                className="mb-2 block text-sm font-medium text-steel"
              >
                Delivery destination
              </label>
              <select
                id="co-zone"
                name="zone"
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value as "uk" | "international" })}
                className="w-full rounded-lg border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy focus:border-ochre focus:outline-none"
              >
                <option value="uk">United Kingdom</option>
                {commerce.internationalEnabled && (
                  <option value="international">International / Rest of world</option>
                )}
              </select>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="co-name"
                  className="mb-2 block text-sm font-medium text-steel"
                >
                  Full name
                </label>
                <input
                  id="co-name"
                  name="name"
                  autoComplete="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy focus:border-ochre focus:outline-none"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="co-email"
                  className="mb-2 block text-sm font-medium text-steel"
                >
                  Email
                </label>
                <input
                  id="co-email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy focus:border-ochre focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="co-address"
                className="mb-2 block text-sm font-medium text-steel"
              >
                Delivery address
              </label>
              <input
                id="co-address"
                name="address"
                autoComplete="street-address"
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-lg border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy focus:border-ochre focus:outline-none"
                placeholder="Street address"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="co-city"
                  className="mb-2 block text-sm font-medium text-steel"
                >
                  City
                </label>
                <input
                  id="co-city"
                  name="city"
                  autoComplete="address-level2"
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy focus:border-ochre focus:outline-none"
                  placeholder="Your city"
                />
              </div>
              <div>
                <label
                  htmlFor="co-postcode"
                  className="mb-2 block text-sm font-medium text-steel"
                >
                  Postcode
                </label>
                <input
                  id="co-postcode"
                  name="postcode"
                  autoComplete="postal-code"
                  type="text"
                  value={form.postcode}
                  onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                  className="w-full rounded-lg border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy focus:border-ochre focus:outline-none"
                  placeholder="e.g. SW1A 1AA"
                />
              </div>
            </div>
            {error && <p className="text-sm text-oxblood">{error}</p>}
          </Reveal>

          {/* Order summary */}
          <Reveal delay={120} className="lg:col-span-2">
            <h2 className="mb-5 font-serif text-2xl text-navy">Your order</h2>
            <div className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
              <ul className="divide-y divide-navy/10">
                {items.map((item) => (
                  <li key={item.key} className="flex items-center gap-4 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-navy/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-sm text-navy">
                        {item.name}
                      </p>
                      {item.variant && (
                        <p className="truncate text-[0.65rem] uppercase tracking-wide text-steel/70">
                          {item.variant}
                        </p>
                      )}
                      <p className="text-xs text-steel">Qty {item.qty}</p>
                    </div>
                    <p className="text-sm font-medium text-navy">
                      {formatGBP(item.price * item.qty)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2 border-t border-navy/10 pt-4 text-sm text-navy/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatGBP(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping · {zoneLabel}</span>
                  <span>{shipping === 0 ? "Free" : formatGBP(shipping)}</span>
                </div>
                {shipping > 0 && freeThreshold > 0 && (
                  <p className="text-xs text-steel">
                    Free {isInternational ? "international" : "UK"} delivery on orders over{" "}
                    {formatGBPWhole(freeThreshold)}
                  </p>
                )}
                <div className="flex justify-between border-t border-navy/10 pt-3 text-base font-semibold text-navy">
                  <span>Total</span>
                  <span>{formatGBP(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="mt-6 w-full rounded-full bg-oxblood px-6 py-4 text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-cream shadow-[0_14px_30px_rgb(107_15_26/0.3)] transition hover:bg-oxblood-deep disabled:opacity-60"
              >
                {busy ? "Opening secure checkout…" : "Place order"}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs leading-relaxed text-steel">
                <LockIcon className="h-3.5 w-3.5 shrink-0" />
                <span>Secure checkout</span>
              </p>
            </div>
          </Reveal>
        </form>
      </section>
    </>
  );
}

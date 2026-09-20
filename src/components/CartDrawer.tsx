"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { deliverySummary, formatGBP } from "@/lib/format";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import type { SiteSettings } from "@/lib/site";
import { OliveIcon } from "./icons";

export default function CartDrawer({ settings }: { settings: SiteSettings }) {
  const {
    items,
    isOpen,
    closeCart,
    updateQty,
    removeItem,
    subtotal,
    total,
  } = useCart();

  useEffect(() => {
    if (isOpen) lockScroll();
    else unlockScroll();
    return () => unlockScroll();
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-navy-deep/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream-soft shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy/10 px-6 py-5">
          <h2 className="brand-wordmark text-lg text-navy">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <OliveIcon className="h-14 w-14 text-ochre" />
            <p className="font-serif text-2xl italic text-navy">
              Your cart is empty
            </p>
            <p className="text-sm text-steel">
              House of Merola artwork,
              <br />
              made to order, awaits.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="rounded-full bg-navy px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-navy/10">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4 py-4">
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-navy/10"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={closeCart}
                          className="font-serif text-base leading-tight text-navy transition hover:text-ochre"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="text-steel/70 transition hover:text-oxblood"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          >
                            <path d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                      </div>
                      {item.variant && (
                        <p className="mt-0.5 text-[0.65rem] uppercase tracking-wide text-steel/70">
                          {item.variant}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs text-steel">
                        {formatGBP(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-navy/15">
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="px-2.5 py-1 text-navy transition hover:text-ochre"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-sm text-navy">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="px-2.5 py-1 text-navy transition hover:text-ochre"
                          >
                            +
                          </button>
                        </div>
                        <p className="ml-auto text-sm font-medium text-navy">
                          {formatGBP(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-navy/10 bg-cream px-6 py-5">
              <div className="space-y-1.5 text-sm text-navy/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatGBP(subtotal)}</span>
                </div>
                <div className="flex justify-between border-t border-navy/10 pt-2 text-base font-semibold text-navy">
                  <span>Total</span>
                  <span>{formatGBP(total)}</span>
                </div>
                <p className="pt-1 text-xs text-steel">
                  {deliverySummary(settings.commerce)}
                </p>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-oxblood px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood-deep"
              >
                Checkout
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

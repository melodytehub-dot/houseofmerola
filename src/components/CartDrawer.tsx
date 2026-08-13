"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatGBP } from "@/lib/format";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { OliveIcon } from "./icons";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQty,
    removeItem,
    subtotal,
    discountCode,
    discountPercent,
    discountAmount,
    total,
    applyDiscount,
    removeDiscount,
  } = useCart();

  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);

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

  const handleApplyCode = () => {
    if (applyDiscount(codeInput)) {
      setCodeError(false);
      setCodeInput("");
    } else {
      setCodeError(true);
    }
  };

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
              Hand-painted tiles and engraved studies await.
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
                  <li key={item.slug} className="flex gap-4 py-4">
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
                          onClick={() => removeItem(item.slug)}
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
                      <p className="mt-0.5 text-xs text-steel">
                        {formatGBP(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-navy/15">
                          <button
                            type="button"
                            onClick={() => updateQty(item.slug, item.qty - 1)}
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
                            onClick={() => updateQty(item.slug, item.qty + 1)}
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
              {/* Discount */}
              {discountCode ? (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-ochre/40 bg-ochre/10 px-4 py-2.5">
                  <p className="text-sm text-navy">
                    Code{" "}
                    <span className="font-semibold text-ochre">
                      {discountCode}
                    </span>{" "}
                    applied · −{discountPercent}%
                  </p>
                  <button
                    type="button"
                    onClick={removeDiscount}
                    className="text-xs text-steel underline transition hover:text-oxblood"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) => {
                        setCodeInput(e.target.value);
                        setCodeError(false);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                      placeholder="Discount code"
                      aria-label="Discount code"
                      className="min-w-0 flex-1 rounded-full border border-navy/15 bg-cream-soft px-4 py-2.5 text-sm text-navy placeholder:text-steel/60 focus:border-ochre focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCode}
                      className="rounded-full border border-navy px-5 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-navy transition hover:bg-navy hover:text-cream"
                    >
                      Apply
                    </button>
                  </div>
                  {codeError && (
                    <p className="mt-1.5 pl-4 text-xs text-oxblood">
                      That code isn’t valid. Please check and try again.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1.5 text-sm text-navy/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatGBP(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-ochre">
                    <span>Discount ({discountPercent}%)</span>
                    <span>−{formatGBP(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-navy/10 pt-2 text-base font-semibold text-navy">
                  <span>Total</span>
                  <span>{formatGBP(total)}</span>
                </div>
                <p className="pt-1 text-xs text-steel">
                  UK delivery from £3.95 · free over £50
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

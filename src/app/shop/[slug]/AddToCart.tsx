"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-8 flex flex-wrap items-stretch gap-4">
      <div className="flex items-center rounded-full border border-navy/20">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="px-5 py-3.5 text-lg text-navy transition hover:text-ochre"
        >
          −
        </button>
        <span className="min-w-8 text-center font-medium text-navy">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label="Increase quantity"
          className="px-5 py-3.5 text-lg text-navy transition hover:text-ochre"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          addItem(product, qty);
          openCart();
        }}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-oxblood px-8 py-3.5 text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-cream shadow-[0_14px_30px_rgb(107_15_26/0.3)] transition hover:bg-oxblood-deep"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 7h12l1.5 12.5a1 1 0 0 1-1 1.1H5.5a1 1 0 0 1-1-1.1L6 7Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
        </svg>
        Add to cart
      </button>
    </div>
  );
}

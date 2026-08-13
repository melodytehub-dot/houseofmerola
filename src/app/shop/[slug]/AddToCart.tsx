"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { BagIcon } from "@/components/icons";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-8 flex items-stretch gap-3">
      <div className="flex shrink-0 items-center rounded-full border border-navy/20">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="px-4 py-3.5 text-lg text-navy transition hover:text-ochre"
        >
          −
        </button>
        <span className="min-w-8 text-center font-medium text-navy">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label="Increase quantity"
          className="px-4 py-3.5 text-lg text-navy transition hover:text-ochre"
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
        className="flex min-w-0 flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-oxblood px-5 py-3.5 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_14px_30px_rgb(107_15_26/0.3)] transition hover:bg-oxblood-deep sm:px-8"
      >
        <BagIcon className="h-[15px] w-[15px] shrink-0" />
        <span className="truncate">Add to cart</span>
      </button>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { formatGBP } from "@/lib/format";
import { BagIcon } from "./icons";

interface OptionGroupProps {
  label: string;
  options: { label: string; priceDelta: number }[];
  active: number;
  onChange: (index: number) => void;
}

function OptionGroup({ label, options, active, onChange }: OptionGroupProps) {
  return (
    <div>
      <p className="mb-2 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isActive = index === active;
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(index)}
              className={`rounded-full border px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.12em] transition ${
                isActive
                  ? "border-navy bg-navy text-cream"
                  : "border-navy/20 text-navy hover:border-ochre hover:text-ochre"
              }`}
            >
              {option.label}
              {option.priceDelta > 0 && (
                <span className="ml-1 text-ochre">
                  +{formatGBP(option.priceDelta)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductConfigurator({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const materialOptions = product.materialOptions ?? [];
  const sizeOptions = product.sizeOptions ?? [];

  const [materialIdx, setMaterialIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const material = materialOptions.length ? materialOptions[materialIdx] : null;
  const size = sizeOptions.length ? sizeOptions[sizeIdx] : null;

  const price = useMemo(() => {
    let p = product.price;
    if (material) p += material.priceDelta;
    if (size) p += size.priceDelta;
    return p;
  }, [product.price, material, size]);

  const variantLabel = [material?.label, size?.label].filter(Boolean).join(" · ");

  return (
    <div className="mt-8 space-y-6 border-t border-navy/10 pt-6">
      {materialOptions.length > 1 && (
        <OptionGroup
          label="Material"
          options={materialOptions}
          active={materialIdx}
          onChange={setMaterialIdx}
        />
      )}
      {sizeOptions.length > 1 && (
        <OptionGroup
          label="Size"
          options={sizeOptions}
          active={sizeIdx}
          onChange={setSizeIdx}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-2xl font-medium text-navy">{formatGBP(price)}</p>
        {variantLabel && (
          <p className="text-[0.66rem] uppercase tracking-wide text-steel">
            {variantLabel}
          </p>
        )}
      </div>

      <div className="flex items-stretch gap-3">
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
            addItem(product, qty, {
              label: variantLabel || product.materials[0],
              price,
            });
            openCart();
          }}
          className="flex min-w-0 flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-oxblood px-5 py-3.5 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_14px_30px_rgb(107_15_26/0.3)] transition hover:bg-oxblood-deep sm:px-8"
        >
          <BagIcon className="h-[15px] w-[15px] shrink-0" />
          <span className="truncate">Add to cart</span>
        </button>
      </div>
    </div>
  );
}

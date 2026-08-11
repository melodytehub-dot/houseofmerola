"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getCollectionBySlug, type Product } from "@/lib/products";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [added, setAdded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const collection = getCollectionBySlug(product.collection);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !panel.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 animate-fade-in bg-navy-deep/85 backdrop-blur-sm" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative grid max-h-[92svh] w-full max-w-4xl animate-scale-in overflow-y-auto bg-cream-light shadow-2xl shadow-navy-deep/60 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-cream-dark/50 bg-cream/90 text-navy transition-all duration-300 hover:bg-navy hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M1 1L17 17M17 1L1 17" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative aspect-square bg-cream-dark/40 md:aspect-auto md:min-h-[560px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/35 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 flex items-center gap-2 bg-navy/80 px-4 py-2.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse-dot bg-ochre-light" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-ochre-light">
              Hand-painted &bull; One of a kind
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          {collection && (
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-oxblood">
              {collection.name}
            </p>
          )}
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-navy md:text-4xl">
            {product.name}
          </h2>
          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-12 bg-ochre/60" />
            <span className="text-sm text-ochre">&#10043;</span>
            <span className="h-px w-6 bg-ochre/60" />
          </div>
          <p className="mt-6 text-[15px] font-light leading-relaxed text-navy/70">
            {product.description}
          </p>

          <p className="mt-7 font-serif text-3xl font-semibold text-ochre-dark">
            &pound;{product.price.toFixed(2)}
          </p>

          <button
            type="button"
            onClick={() => setAdded(true)}
            className={`mt-8 w-full px-8 py-4 text-[11px] font-medium uppercase tracking-[0.3em] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre ${
              added
                ? "bg-oxblood text-cream"
                : "bg-navy text-cream hover:bg-navy-light"
            }`}
          >
            {added ? "Added to your collection" : "Add to Cart"}
          </button>

          {added && (
            <p className="mt-4 animate-fade-slide-up text-center text-xs leading-relaxed text-navy/60">
              This is a preview — orders are taken via{" "}
              <a
                href="mailto:hello@houseofmerola.com"
                className="text-oxblood underline underline-offset-2"
              >
                hello@houseofmerola.com
              </a>
              . Use code{" "}
              <span className="font-semibold tracking-[0.15em] text-oxblood">
                MEROLA10
              </span>{" "}
              for 10% off your first order.
            </p>
          )}

          <div className="mt-7 flex flex-col gap-2.5 border-t border-cream-dark/50 pt-6 text-[11px] font-light tracking-wide text-navy/50">
            <p className="flex items-center gap-2.5">
              <span className="h-px w-4 bg-ochre/50" />
              Handmade in small batches — dispatch in 3&ndash;5 days.
            </p>
            <p className="flex items-center gap-2.5">
              <span className="h-px w-4 bg-ochre/50" />
              Free delivery on orders over &pound;50.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

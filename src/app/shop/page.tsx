"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { collections, products } from "@/lib/products";

const tabs = [
  { slug: "all", name: "All pieces" },
  ...collections.map((collection) => ({
    slug: collection.slug,
    name: collection.name,
  })),
];

export default function ShopPage() {
  const [active, setActive] = useState("all");

  const visible = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.collection === active)),
    [active],
  );

  return (
    <>
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-navy/10 bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="eyebrow text-ochre">The Shop</p>
          <h1 className="mt-4 font-serif text-4xl text-navy sm:text-5xl lg:text-6xl">
            The Collection
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-navy/70">
            Every piece is made by hand — no two identical. Each tile is
            painted in the spirit of Sicilian majolica; each study board is
            drawn, painted and engraved in antique gold.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="sticky top-[calc(5.5rem)] z-20 border-b border-navy/10 bg-cream-soft/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-3 sm:px-6">
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setActive(tab.slug)}
              className={`rounded-full px-5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] transition ${
                active === tab.slug
                  ? "bg-navy text-cream"
                  : "border border-navy/15 text-navy hover:border-ochre hover:text-ochre"
              }`}
            >
              {tab.name}
            </button>
          ))}
          <span className="ml-2 hidden text-xs text-steel sm:inline">
            {visible.length} {visible.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {visible.length > 0 ? (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-navy/60">
            No pieces here yet — check back soon.
          </p>
        )}

        {/* Note */}
        <div className="mt-16 rounded-xl border border-navy/10 bg-cream-soft p-8 text-center">
          <p className="font-serif text-2xl italic text-navy">
            Looking for a specific piece?
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-steel">
            Commissioned tiles and bespoke study boards are always welcome — we
            would love to make something just for you.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import type { Collection, Product } from "@/lib/products";

export default function ShopGrid({
  products,
  collections,
}: {
  products: Product[];
  collections: Collection[];
}) {
  const tabs = [
    { slug: "all", name: "All pieces" },
    ...collections
      .filter((c) => products.some((p) => p.collection === c.slug))
      .map((c) => ({ slug: c.slug, name: c.name })),
  ];
  const [active, setActive] = useState("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? products
        : products.filter((p) => p.collection === active),
    [active, products],
  );

  const countFor = (slug: string) =>
    slug === "all"
      ? products.length
      : products.filter((p) => p.collection === slug).length;

  const collectionName = (slug: string) =>
    collections.find((c) => c.slug === slug)?.name;

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-[4.5rem] z-20 border-b border-navy/10 bg-cream-soft/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-7 gap-y-2 px-4 py-4 sm:px-6">
          {tabs.map((tab, i) => {
            const isActive = active === tab.slug;
            return (
              <span key={tab.slug} className="flex shrink-0 items-center gap-7">
                {i > 0 && (
                  <span className="block h-1.5 w-1.5 rotate-45 border border-ochre/60" aria-hidden="true" />
                )}
                <button
                  type="button"
                  onClick={() => setActive(tab.slug)}
                  aria-pressed={isActive}
                  className={`whitespace-nowrap pb-0.5 text-[0.72rem] font-medium tracking-[0.08em] transition ${
                    isActive
                      ? "text-oxblood underline decoration-oxblood decoration-2 underline-offset-8"
                      : "text-navy/60 hover:text-oxblood"
                  }`}
                >
                  {tab.name}{" "}
                  <span className="text-[0.62rem] tabular-nums text-steel/70">{countFor(tab.slug)}</span>
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {visible.length > 0 ? (
          <div className="product-grid">
            {visible.map((product, index) => (
              <Reveal
                key={product.slug}
                className="h-full"
                delay={Math.min(index, 5) * 70}
              >
                <ProductCard
                  product={product}
                  collectionName={collectionName(product.collection)}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-navy/60">
            No pieces here yet. Check back soon.
          </p>
        )}
      </section>
    </>
  );
}

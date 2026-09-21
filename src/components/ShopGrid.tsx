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
        <div className="mx-auto flex max-w-7xl items-center justify-start gap-7 overflow-x-auto px-4 py-4 sm:px-6 [scrollbar-width:none] lg:justify-center">
          {tabs.map((tab) => {
            const isActive = active === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActive(tab.slug)}
                aria-pressed={isActive}
                className={`relative shrink-0 whitespace-nowrap pb-1 text-[0.72rem] font-medium tracking-[0.08em] transition ${
                  isActive ? "text-navy" : "text-navy/55 hover:text-oxblood"
                }`}
              >
                {tab.name}
                <span className="ml-1.5 text-[0.62rem] tabular-nums text-steel/70">{countFor(tab.slug)}</span>
                <span
                  className={`absolute inset-x-0 -bottom-[1px] h-[2px] origin-left bg-oxblood transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
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

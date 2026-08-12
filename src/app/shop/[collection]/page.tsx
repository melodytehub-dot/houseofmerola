"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import {
  collections,
  getCollectionBySlug,
  getProductsByCollection,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Reveal from "@/components/Reveal";
import type { Product } from "@/lib/products";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: slug } = use(params);
  const collection = getCollectionBySlug(slug);
  const collectionProducts = getProductsByCollection(slug);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!collection) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-dusty-blue">
            Collection not found
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium text-navy">
            Collection not found
          </h1>
          <Link
            href="/shop"
            className="mt-8 inline-block border-b border-oxblood/50 pb-1 text-[11px] uppercase tracking-[0.3em] text-oxblood transition-colors hover:border-oxblood-dark hover:text-oxblood-dark"
          >
            Return to the shop
          </Link>
        </div>
      </div>
    );
  }

  const collectionIndex = collections.findIndex((c) => c.slug === slug);
  const otherCollections = collections.filter((c) => c.slug !== slug);

  return (
    <>
      {/* Banner */}
      <section className="relative h-[52vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={collection.bannerImage}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/85 to-navy-deep/90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-ochre-light">
            Collection 0{collectionIndex + 1}
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold uppercase leading-tight tracking-[0.08em] text-cream sm:text-5xl md:text-6xl">
            {collection.name}
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <span className="h-px w-12 bg-ochre/60" />
            <span className="text-ochre-light">&#10043;</span>
            <span className="h-px w-12 bg-ochre/60" />
          </div>
          <p className="mt-6 max-w-xl font-serif text-lg font-light italic text-cream/85 sm:text-xl">
            {collection.tagline}
          </p>
        </div>
      </section>

      {/* Intro + switcher */}
      <section className="border-b border-cream-dark/40 px-6 py-14">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mx-auto max-w-2xl text-center text-sm font-light leading-relaxed text-navy/65">
            {collection.description}
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {collections.map((col) => {
              const active = col.slug === slug;
              return (
                <Link
                  key={col.slug}
                  href={`/shop/${col.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`relative pb-1 text-[10px] font-medium uppercase tracking-[0.28em] transition-colors duration-300 ${
                    active
                      ? "text-oxblood after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-ochre"
                      : "text-dusty-blue hover:text-navy"
                  }`}
                >
                  {col.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="px-6 py-16 sm:py-20 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-dusty-blue">
            {collectionProducts.length}{" "}
            {collectionProducts.length === 1 ? "piece" : "pieces"} in this
            collection
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {collectionProducts.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 80}>
                <ProductCard
                  product={product}
                  onClick={setSelectedProduct}
                />
              </Reveal>
            ))}
          </div>
          {collectionProducts.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-serif text-3xl font-light italic text-navy/50">
                New pieces are on the easel — check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Continue exploring */}
      {otherCollections.length > 0 && (
        <section className="border-t border-cream-dark/40 bg-cream-dark/15 px-6 py-20 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-serif text-3xl font-medium text-navy sm:text-4xl">
                Continue exploring
              </h2>
              <Link
                href="/shop"
                className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-dusty-blue transition-colors hover:text-oxblood sm:block"
              >
                All collections &rarr;
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherCollections.map((col) => (
                <Link
                  key={col.slug}
                  href={`/shop/${col.slug}`}
                  className="group relative block h-60 overflow-hidden border border-cream-dark/60"
                >
                  <Image
                    src={col.bannerImage}
                    alt={col.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/70 to-navy-deep/40" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                    <span className="font-serif text-2xl font-medium text-cream">
                      {col.name}
                    </span>
                    <span className="text-ochre-light transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

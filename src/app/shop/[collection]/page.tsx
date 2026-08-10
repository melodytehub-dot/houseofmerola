"use client";

import Image from "next/image";
import { useState, use } from "react";
import {
  collections,
  getCollectionBySlug,
  getProductsByCollection,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import type { Product } from "@/lib/products";
import Link from "next/link";

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-navy mb-4">
            Collection Not Found
          </h1>
          <Link
            href="/"
            className="text-ochre hover:text-ochre-light text-sm tracking-widest uppercase"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Collection Banner */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
        <Image
          src={collection.bannerImage}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-ochre/80 text-xs tracking-[0.4em] uppercase font-medium mb-4 font-sans">
            Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-cream tracking-[0.08em] uppercase mb-4 drop-shadow-lg">
            {collection.name}
          </h1>
          <div className="w-20 h-px bg-ochre/50 mb-6" />
          <p className="font-serif text-lg sm:text-xl text-cream/80 italic font-light max-w-xl drop-shadow-md">
            {collection.tagline}
          </p>
        </div>
      </section>

      {/* Collection Description */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-navy/60 text-base leading-relaxed font-light">
            {collection.description}
          </p>
        </div>
      </section>

      {/* Other Collections */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {collections.map((col) => {
              const isActive = col.slug === slug;
              return (
                <Link
                  key={col.slug}
                  href={`/shop/${col.slug}`}
                  className={
                    "px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-medium transition-all duration-300 " +
                    (isActive
                      ? "bg-navy text-cream"
                      : "bg-cream-dark/50 text-navy/60 hover:bg-cream-dark hover:text-navy")
                  }
                >
                  {col.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {collectionProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
          {collectionProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-navy/40 font-serif text-2xl">
                More pieces coming soon...
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

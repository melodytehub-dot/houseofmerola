"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { collections, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import type { Product } from "@/lib/products";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  // Featured products - pick a curated selection
  const featured = [
    products.find((p) => p.id === "mediterranean-ape-truck")!,
    products.find((p) => p.id === "snakeology-sign")!,
    products.find((p) => p.id === "virgin-mary-blue-tile")!,
    products.find((p) => p.id === "phases-of-the-moon")!,
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="House of Merola"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-transparent to-navy/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="mb-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              className="text-ochre/80 mx-auto mb-4"
            >
              <path
                d="M12 2L15 8.5L22 9.5L17 14.5L18.5 22L12 18.5L5.5 22L7 14.5L2 9.5L9 8.5L12 2Z"
                fill="currentColor"
                opacity="0.8"
              />
            </svg>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-cream tracking-[0.12em] uppercase mb-4 drop-shadow-lg">
            House of Merola
          </h1>
          <div className="w-24 h-px bg-ochre/60 mb-6" />
          <p className="text-cream/80 text-xs sm:text-sm font-medium tracking-[0.4em] uppercase mb-10 font-sans">
            Arte &bull; Casa &bull; Mediterraneo
          </p>
          <p className="font-serif text-xl sm:text-2xl text-cream/90 italic font-light max-w-2xl mb-10 drop-shadow-md">
            Mediterranean soul. Botanical beauty.
            <br />
            Sacred tradition. Timeless curiosities.
          </p>
          <Link
            href="/shop/mediterranean-heritage"
            className="inline-block px-10 py-4 bg-oxblood hover:bg-oxblood-light text-cream text-xs sm:text-sm font-medium tracking-[0.3em] uppercase rounded-sm transition-all duration-500 hover:shadow-lg hover:shadow-oxblood/30"
          >
            Shop the Collection
          </Link>
        </div>
        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ochre/40 to-transparent" />
      </section>

      {/* Brand Statement */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px bg-ochre/40" />
            <span className="text-ochre text-lg">&#10043;</span>
            <div className="w-16 h-px bg-ochre/40" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-navy leading-tight mb-8">
            Where Mediterranean Tradition
            <br />
            Meets Artisan Craft
          </h2>
          <p className="text-navy/60 text-base sm:text-lg leading-relaxed font-light max-w-2xl mx-auto">
            Every piece in our collection is a love letter to the Mediterranean —
            hand-painted tiles that capture the warmth of Sicilian sunshine,
            engraved wood that tells stories of ancient botanical wisdom, and
            sacred art that carries centuries of devotion.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="px-4 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-dusty-blue text-xs tracking-[0.35em] uppercase font-medium mb-3">
              Our World
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy">
              Explore the Collections
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/shop/${col.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg"
              >
                <Image
                  src={col.bannerImage}
                  alt={col.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-cream leading-tight mb-2">
                    {col.name}
                  </h3>
                  <p className="text-cream/60 text-xs tracking-wider font-light line-clamp-2">
                    {col.tagline}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-ochre text-xs tracking-widest uppercase font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span>Explore</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 pb-20 sm:pb-28 bg-cream-dark/20">
        <div className="max-w-7xl mx-auto py-20 sm:py-28">
          <div className="text-center mb-14">
            <p className="text-dusty-blue text-xs tracking-[0.35em] uppercase font-medium mb-3">
              Handpicked
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mb-4">
              Featured Pieces
            </h2>
            <p className="text-navy/50 text-sm font-light max-w-lg mx-auto">
              A curated selection of our most beloved works — each one
              handcrafted with love and Mediterranean soul.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/shop/mediterranean-heritage"
              className="inline-block px-8 py-3.5 border-2 border-navy text-navy hover:bg-navy hover:text-cream text-xs tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-4 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-navy rounded-2xl p-10 sm:p-14">
            <p className="text-ochre text-xs tracking-[0.35em] uppercase font-medium mb-4">
              Stay Connected
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-cream mb-4">
              Join the House
            </h2>
            <p className="text-cream/50 text-sm font-light mb-8 max-w-md mx-auto">
              Be the first to discover new collections, exclusive offers, and
              receive a 10% welcome discount.
            </p>
            {subscribed ? (
              <div className="bg-cream/10 rounded-lg p-6">
                <p className="text-ochre font-serif text-2xl mb-2">
                  Benvenuto!
                </p>
                <p className="text-cream/70 text-sm">
                  Use code{" "}
                  <span className="text-ochre font-semibold tracking-wider">
                    MEROLA10
                  </span>{" "}
                  at checkout for 10% off.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-5 py-3.5 bg-cream/10 border border-cream/20 rounded-lg text-cream placeholder-cream/40 text-sm tracking-wide focus:outline-none focus:border-ochre/60 transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-oxblood hover:bg-oxblood-light text-cream text-sm font-medium tracking-widest uppercase rounded-lg transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
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

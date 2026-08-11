"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { collections, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import NewsletterForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";
import type { Product } from "@/lib/products";

const marqueePhrase = [
  "Arte",
  "Casa",
  "Mediterraneo",
  "Hand-painted tiles",
  "Botanical art",
  "Sacred tradition",
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const featured = [
    products.find((p) => p.id === "mediterranean-ape-truck"),
    products.find((p) => p.id === "snakeology-sign"),
    products.find((p) => p.id === "virgin-mary-blue-tile"),
    products.find((p) => p.id === "phases-of-the-moon"),
  ].filter((p): p is Product => Boolean(p));

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative h-[92svh] min-h-[560px] w-full overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="House of Merola — Mediterranean art and ceramics"
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/75 via-navy-deep/15 to-navy-deep/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p
            className="animate-fade-up text-[10px] font-medium uppercase tracking-[0.5em] text-cream/85 sm:text-xs"
            style={{ animationDelay: "150ms" }}
          >
            Arte &bull; Casa &bull; Mediterraneo
          </p>
          <h1
            className="animate-fade-up mt-6 font-serif text-[clamp(2.75rem,9vw,7rem)] font-semibold uppercase leading-[1.02] tracking-[0.1em] text-cream drop-shadow-lg"
            style={{ animationDelay: "300ms" }}
          >
            House of
            <br className="hidden sm:block" /> Merola
          </h1>
          <div
            className="animate-fade-up mt-8 flex items-center gap-4"
            style={{ animationDelay: "450ms" }}
          >
            <span className="h-px w-16 bg-ochre/70" />
            <span className="text-lg text-ochre-light">&#10043;</span>
            <span className="h-px w-16 bg-ochre/70" />
          </div>
          <p
            className="animate-fade-up mt-8 max-w-2xl font-serif text-lg font-light italic leading-relaxed text-cream/90 drop-shadow-md sm:text-2xl"
            style={{ animationDelay: "600ms" }}
          >
            Hand-painted tiles, engraved botanicals &amp; sacred art — crafted
            in the spirit of the Mediterranean.
          </p>
          <div
            className="animate-fade-up mt-12 flex flex-col items-center gap-4 sm:flex-row"
            style={{ animationDelay: "750ms" }}
          >
            <Link
              href="/shop"
              className="bg-oxblood px-10 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-cream transition-all duration-500 hover:bg-oxblood-dark hover:tracking-[0.34em]"
            >
              Explore the Collections
            </Link>
            <Link
              href="/about"
              className="border border-cream/50 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-cream transition-all duration-500 hover:bg-cream hover:text-navy"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.35em] text-cream/60">
            Scroll
          </span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-cream/70 to-transparent" />
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="overflow-hidden border-y border-ochre/30 bg-oxblood py-3.5">
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {marqueePhrase.map((word) => (
                <span
                  key={`${copy}-${word}`}
                  className="flex items-center text-[10px] font-medium uppercase tracking-[0.4em] text-cream/85"
                >
                  <span className="px-6">{word}</span>
                  <span className="text-ochre-light">&#10043;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= BRAND STATEMENT ================= */}
      <section className="px-6 py-24 sm:py-32 lg:px-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-dusty-blue">
            La Casa delle Meraviglie
          </p>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-[1.15] text-navy sm:text-5xl md:text-6xl">
            A love letter to the{" "}
            <em className="font-light italic text-oxblood">Mediterranean</em>,
            painted in clay &amp; gold
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-[15px] font-light leading-relaxed text-navy/65">
            House of Merola gathers hand-painted tiles, engraved botanicals and
            sacred art from the workshops of the Mediterranean. Each piece is
            made slowly, by hand, with the colours of old Sicilian tiles — deep
            navy, oxblood, ochre and warm cream — so that the sea, the sun and
            centuries of craft live on in your home.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="h-px w-14 bg-ochre/50" />
            <span className="text-ochre">&#10043;</span>
            <span className="h-px w-14 bg-ochre/50" />
          </div>
        </Reveal>
      </section>

      {/* ================= FEATURED PIECES ================= */}
      <section className="border-y border-cream-dark/40 bg-cream-dark/15 px-6 py-24 sm:py-28 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-dusty-blue">
                Handpicked
              </p>
              <h2 className="mt-4 font-serif text-4xl font-medium text-navy sm:text-5xl">
                Featured Pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-3 border-b border-navy/30 pb-1 text-[11px] font-medium uppercase tracking-[0.3em] text-navy transition-colors duration-300 hover:border-oxblood hover:text-oxblood"
            >
              View all pieces
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {featured.map((product, index) => (
              <Reveal key={product.id} delay={index * 90}>
                <ProductCard product={product} onClick={setSelectedProduct} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COLLECTION DIVIDERS ================= */}
      <section>
        {collections.map((collection, index) => (
          <Link
            key={collection.slug}
            href={`/shop/${collection.slug}`}
            className="group relative block h-[70vh] min-h-[480px] w-full overflow-hidden border-b border-cream-dark/40"
          >
            <Image
              src={collection.bannerImage}
              alt={collection.name}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/25 to-navy-deep/40 transition-opacity duration-700 group-hover:opacity-90" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-ochre-light">
                Collezione 0{index + 1}
              </p>
              <h3 className="mt-5 font-serif text-4xl font-semibold uppercase leading-tight tracking-[0.08em] text-cream sm:text-5xl md:text-6xl">
                {collection.name}
              </h3>
              <div className="mt-6 flex items-center gap-4">
                <span className="h-px w-12 bg-ochre/60 transition-all duration-500 group-hover:w-20" />
                <span className="text-ochre-light">&#10043;</span>
                <span className="h-px w-12 bg-ochre/60 transition-all duration-500 group-hover:w-20" />
              </div>
              <p className="mt-6 max-w-xl font-serif text-lg font-light italic text-cream/85 sm:text-xl">
                {collection.tagline}
              </p>
              <span className="mt-8 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-cream/90 transition-colors duration-300 group-hover:text-ochre-light">
                Explore the collection
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  &rarr;
                </span>
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* ================= VALUES ================= */}
      <section className="grain relative overflow-hidden bg-navy py-24 text-cream sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-ochre-light">
              Il Mestiere
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium sm:text-5xl">
              Made slowly, by hand
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {[
              {
                title: "Hand-painted",
                body: "Every tile is painted stroke by stroke, in the time-honoured traditions of Sicilian ceramic art.",
              },
              {
                title: "Small batches",
                body: "We craft in limited runs, so each piece carries the character only time and care can give.",
              },
              {
                title: "Made to be lived with",
                body: "More than decor — objects with soul, made to become part of your everyday life.",
              },
            ].map((value, index) => (
              <Reveal key={value.title} delay={index * 100} className="text-center">
                <p className="font-serif text-5xl font-light text-ochre/50">
                  0{index + 1}
                </p>
                <div className="mx-auto mt-5 h-px w-10 bg-ochre/40" />
                <h3 className="mt-5 font-serif text-2xl font-medium">
                  {value.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-sm font-light leading-relaxed text-cream/60">
                  {value.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section
        id="newsletter"
        className="scroll-mt-24 px-6 py-24 sm:py-32 lg:px-10"
      >
        <Reveal className="grain relative mx-auto w-full max-w-3xl overflow-hidden bg-navy px-6 py-16 text-center sm:px-14 sm:py-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-ochre-light">
            Stay Connected
          </p>
          <h2 className="mt-4 font-serif text-4xl font-medium text-cream sm:text-5xl">
            Join the House
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-cream/65">
            Become part of our world — receive{" "}
            <span className="text-ochre-light">10% off your first piece</span>,
            early access to new collections and stories from the studio.
          </p>
          <div className="mx-auto mt-10 max-w-md">
            <NewsletterForm />
          </div>
          <p className="mt-5 text-[9px] uppercase tracking-[0.25em] text-cream/35">
            No spam, only the Mediterranean — unsubscribe anytime
          </p>
        </Reveal>
      </section>

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

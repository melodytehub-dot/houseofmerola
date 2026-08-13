"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { HeartIcon } from "@/components/icons";
import { products } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistPage() {
  const { items } = useWishlist();
  const saved = products.filter((product) => items.includes(product.slug));

  return (
    <>
      <section className="border-b border-navy/10 bg-cream">
        <Reveal className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="eyebrow text-ochre">Saved for later</p>
          <h1 className="mt-4 font-serif text-4xl text-navy sm:text-5xl">
            Your wishlist
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-navy/70">
            The pieces you are dreaming about, kept here until you are ready.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {saved.length === 0 ? (
          <Reveal className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-navy/10 bg-cream-soft px-8 py-24 text-center">
            <HeartIcon className="h-10 w-10 text-ochre" />
            <p className="font-serif text-2xl italic text-navy">
              Your wishlist is empty
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-steel">
              Tap the heart on any piece to save it here for later.
            </p>
            <Link
              href="/shop"
              className="rounded-full bg-navy px-8 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood"
            >
              Browse the shop
            </Link>
          </Reveal>
        ) : (
          <div className="product-grid">
            {saved.map((product, index) => (
              <Reveal
                key={product.slug}
                className="h-full"
                delay={Math.min(index, 5) * 70}
              >
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

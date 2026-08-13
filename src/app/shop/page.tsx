"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { BoxIcon, BrushIcon, ReturnIcon } from "@/components/icons";
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
    () =>
      active === "all"
        ? products
        : products.filter((p) => p.collection === active),
    [active],
  );

  const countFor = (slug: string) =>
    slug === "all"
      ? products.length
      : products.filter((p) => p.collection === slug).length;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-deep">
        <div className="absolute inset-0">
          <Image
            src="/images/collection-mediterranean.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy-deep/80 to-navy-deep/95" />
        </div>
        <Reveal className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <p className="eyebrow text-ochre-soft">The House Collection</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            Made slowly, <em className="text-ochre-soft">by hand</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/85">
            Every tile is hand-painted and every study board drawn, painted and
            engraved in our studio. Small batches only, no two pieces alike,
            made to be kept.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-cream/15 pt-6 text-cream/80">
            {[
              "Hand-painted in Sicily",
              "Free UK delivery over £50",
              "14-day returns",
            ].map((item) => (
              <p
                key={item}
                className="flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.2em]"
              >
                <span className="text-ochre-soft">✦</span>
                {item}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[4.5rem] z-20 border-b border-navy/10 bg-cream-soft/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 [scrollbar-width:none]">
          {tabs.map((tab) => {
            const isActive = active === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActive(tab.slug)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] transition ${
                  isActive
                    ? "bg-navy text-cream shadow-[0_8px_20px_rgb(14_42_77/0.25)]"
                    : "border border-navy/15 text-navy hover:border-ochre hover:text-ochre"
                }`}
              >
                {tab.name}
                <span
                  className={`text-[0.6rem] ${
                    isActive ? "text-cream/60" : "text-steel/70"
                  }`}
                >
                  {countFor(tab.slug)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {visible.length > 0 ? (
          <div className="product-grid">
            {visible.map((product, index) => (
              <Reveal
                key={product.slug}
                className="h-full"
                delay={Math.min(index, 5) * 70}
              >
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-navy/60">
            No pieces here yet. Check back soon.
          </p>
        )}
      </section>

      {/* Craft strip */}
      <section className="border-y border-navy/10 bg-cream/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8 lg:py-16">
          {[
            {
              icon: BrushIcon,
              title: "Hand-painted, in small batches",
              body: "Each tile is painted individually and each board engraved line by line, so a little variation is part of every piece.",
            },
            {
              icon: BoxIcon,
              title: "Wrapped and shipped with care",
              body: "UK delivery from £3.95 and free over £50, with every parcel wrapped by hand and sent with tracking.",
            },
            {
              icon: ReturnIcon,
              title: "14 days to decide",
              body: "Changed your mind? Return any piece in its original condition within 14 days for a full refund.",
            },
          ].map((feature, index) => (
            <Reveal key={feature.title} delay={index * 120}>
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ochre/40 bg-ochre/10 text-ochre">
                  <feature.icon className="h-6 w-6" />
                </span>
                <h3 className="brand-wordmark mt-5 text-[0.8rem] text-navy">
                  {feature.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-navy/70">
                  {feature.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Commission CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal className="relative overflow-hidden rounded-2xl bg-navy-deep px-8 py-14 text-center sm:px-12 lg:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "url(/images/collection-botanical.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative">
            <p className="font-serif text-3xl italic leading-snug text-cream sm:text-4xl">
              Looking for something made just for you?
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/75">
              Commissions are our favourite work. Tell us your idea and we will
              paint the first sketch.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ochre px-8 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-navy-deep transition hover:bg-ochre-soft"
            >
              Start a commission
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

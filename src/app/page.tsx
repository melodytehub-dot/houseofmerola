import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import { getCollections, getProducts, getSettings } from "@/lib/content";

export default async function HomePage() {
  const [products, collections, settings] = await Promise.all([
    getProducts(),
    getCollections(),
    getSettings(),
  ]);
  const featured = products.filter((p) => p.featured).slice(0, 6);
  // The core "four houses" grid, seasonal collections (e.g. Halloween) are
  // still surfaced in the nav/shop but not counted among the main four.
  const mainCollections = collections.filter((c) => !c.temporary);
  const collectionName = (slug: string) =>
    collections.find((c) => c.slug === slug)?.name;
  return (
    <>
      <section className="grain relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 pb-12 pt-16 text-center sm:px-6 lg:pb-16 lg:pt-24">
          <div>
            <h1 className="font-serif text-[2.6rem] font-bold leading-[1.08] text-navy [text-wrap:balance] sm:text-6xl lg:text-[4.2rem]">
              {settings.hero.lines.map((line, i) => {
                const accent = settings.hero.accentWord;
                const idx =
                  accent && line.includes(accent) ? line.indexOf(accent) : -1;
                return (
                  <span
                    key={i}
                    className={`block animate-fade-up ${i ? `delay-${i}` : ""}`}
                  >
                    {idx >= 0 ? (
                      <>
                        {line.slice(0, idx)}
                        <em className="text-ochre">
                          {line.slice(idx, idx + accent.length)}
                        </em>
                        {line.slice(idx + accent.length)}
                      </>
                    ) : (
                      line
                    )}
                  </span>
                );
              })}
            </h1>

            <p className="mx-auto mt-6 max-w-xl animate-fade-up delay-3 text-[0.95rem] leading-relaxed text-navy/70">
              {settings.hero.subheading}
            </p>

            <div className="mt-8 flex animate-fade-up delay-4 flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-oxblood px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_14px_30px_rgb(107_15_26/0.35)] transition hover:bg-oxblood-deep"
              >
                Shop the collection
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-navy/25 px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-navy transition hover:border-oxblood hover:text-oxblood"
              >
                Our story
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="relative overflow-hidden rounded-lg border border-navy/15 shadow-[0_35px_70px_rgb(14_42_77/0.28)]">
            <Image
              src="/images/hero.jpg"
              alt="House of Merola, Mediterranean artwork with lemons, tiles and the Amalfi coast"
              width={1717}
              height={916}
              priority
              className="h-auto w-full"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4 text-xs text-steel">
            <p>The House Collection, painted and printed in Liverpool</p>
            <p className="shrink-0 tabular-nums">{featured.length} featured pieces</p>
          </div>
        </div>
      </section>

      <section id="collections" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mb-10 max-w-2xl">
          <h2 className="font-serif text-3xl tracking-tight text-navy [text-wrap:balance] sm:text-4xl lg:text-5xl">
            Four houses, one spirit
          </h2>
        </Reveal>

        <div className="border-t border-navy/20">
          {mainCollections.map((collection) => {
            const count = products.filter((p) => p.collection === collection.slug).length;
            return (
              <Reveal key={collection.slug}>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="group grid gap-1 border-b border-navy/20 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <h3 className="font-serif text-2xl tracking-tight text-navy transition group-hover:text-oxblood sm:col-span-4 sm:text-3xl">
                    {collection.name}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-navy/70 sm:col-span-5">
                    {collection.tagline}
                  </p>
                  <p className="text-sm tabular-nums text-steel sm:col-span-3 sm:text-right">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-cream/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-serif text-3xl tracking-tight text-navy sm:text-4xl">
              Featured pieces
            </h2>
            <p className="text-sm tabular-nums text-steel">
              {featured.length} on the shelf
            </p>
          </Reveal>

          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                collectionName={collectionName(product.collection)}
              />
            ))}
          </div>
          <Reveal className="mt-10 border-t border-navy/20 pt-5">
            <Link
              href="/shop"
              className="text-sm font-medium text-navy underline decoration-oxblood decoration-2 underline-offset-8 transition hover:text-oxblood"
            >
              View all {products.length} pieces
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <Reveal>
          <h2 className="font-serif text-3xl leading-tight tracking-tight text-navy [text-wrap:balance] sm:text-4xl">
            {settings.aboutIntro.heading}
          </h2>
          {settings.aboutIntro.body.map((para, i) => (
            <p
              key={i}
              className={`mx-auto leading-relaxed text-navy/70 ${
                i === 0 ? "mt-5 max-w-xl" : "mt-4 max-w-xl"
              }`}
            >
              {para}
            </p>
          ))}
          <ul className="mx-auto mt-10 max-w-xl divide-y divide-navy/15 border-y border-navy/15 text-left">
            {settings.aboutIntro.points.map((point) => (
              <li key={point} className="py-3 text-sm text-navy/80">
                {point}
              </li>
            ))}
          </ul>
          <Link
            href="/about"
            className="mt-8 inline-block text-sm font-medium text-navy underline decoration-oxblood decoration-2 underline-offset-8 transition hover:text-oxblood"
          >
            Read the full story
          </Link>
        </Reveal>
      </section>

      <Newsletter />
    </>
  );
}

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
        <div className="mx-auto max-w-4xl px-4 pb-12 pt-14 text-center sm:px-6 lg:pb-16 lg:pt-20">
          <p className="eyebrow mb-5 animate-fade-up text-ochre">{settings.hero.eyebrow}</p>
          <h1 className="font-serif text-[2.75rem] font-bold leading-[1.06] tracking-tight text-navy [text-wrap:balance] sm:text-6xl lg:text-7xl">
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
              href="/bespoke"
              className="rounded-full border border-navy/25 px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-navy transition hover:border-oxblood hover:text-oxblood"
            >
              Commission a piece
            </Link>
          </div>

          <div className="mt-12 flex animate-fade-up delay-4 items-center justify-center gap-4" aria-hidden="true">
            <span className="h-px w-24 bg-gradient-to-r from-transparent to-ochre/60" />
            <span className="block h-2 w-2 rotate-45 border border-ochre/70" />
            <span className="h-px w-24 bg-gradient-to-l from-transparent to-ochre/60" />
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="relative overflow-hidden rounded-b-xl rounded-t-[120px] border border-ochre/40 shadow-[0_35px_70px_rgb(14_42_77/0.28)] sm:rounded-t-[200px]">
            <Image
              src="/images/hero.jpg"
              alt="House of Merola, Mediterranean artwork with lemons, tiles and the Amalfi coast"
              width={1717}
              height={916}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section id="collections" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mb-12 text-center">
          <h2 className="font-serif text-3xl tracking-tight text-navy [text-wrap:balance] sm:text-4xl lg:text-5xl">
            Four houses, one spirit
          </h2>
          <div className="mt-6 flex items-center justify-center gap-4" aria-hidden="true">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-ochre/60" />
            <span className="block h-2 w-2 rotate-45 border border-ochre/70" />
            <span className="h-px w-20 bg-gradient-to-l from-transparent to-ochre/60" />
          </div>
        </Reveal>

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:gap-x-10">
          {mainCollections.map((collection, index) => {
            const count = products.filter((p) => p.collection === collection.slug).length;
            return (
              <Reveal key={collection.slug} className="h-full" delay={(index % 2) * 120}>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="group flex h-full flex-col items-center text-center"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-b-lg rounded-t-[110px] border border-ochre/40 shadow-[0_24px_50px_rgb(14_42_77/0.18)] sm:rounded-t-[150px]">
                    <Image
                      src={collection.bannerImage}
                      alt={collection.name}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-steel">
                    {collection.tagline}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl tracking-tight text-navy transition group-hover:text-oxblood sm:text-3xl">
                    {collection.name}
                  </h3>
                  <p className="mt-1 text-xs tabular-nums text-steel/80">
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
          <Reveal className="mb-12 text-center">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-steel">
              From the studio
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight text-navy sm:text-4xl">
              Featured pieces
            </h2>
            <div className="mt-5 flex items-center justify-center gap-4" aria-hidden="true">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-ochre/60" />
              <span className="block h-2 w-2 rotate-45 border border-ochre/70" />
              <span className="h-px w-20 bg-gradient-to-l from-transparent to-ochre/60" />
            </div>
          </Reveal>

          <div className="product-grid">
            {featured.map((product, index) => (
              <Reveal key={product.slug} className="h-full" delay={Math.min(index, 5) * 70}>
                <ProductCard
                  product={product}
                  collectionName={collectionName(product.collection)}
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-navy transition hover:text-oxblood"
            >
              View all pieces
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <Reveal>
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="overflow-hidden rounded-b-xl rounded-t-[999px] border border-ochre/40 shadow-[0_24px_50px_rgb(14_42_77/0.2)]">
              <Image
                src="/images/prod-madonna-blue.jpg"
                alt="Madonna Blue Tile"
                width={900}
                height={900}
                className="h-auto w-full"
              />
            </div>
          </div>
          <h2 className="mt-8 font-serif text-3xl leading-tight tracking-tight text-navy [text-wrap:balance] sm:text-4xl">
            {settings.aboutIntro.heading}
          </h2>
          {settings.aboutIntro.body.map((para, i) => (
            <p
              key={i}
              className={`mx-auto leading-relaxed text-navy/70 ${
                i === 0 ? "mt-5 max-w-lg" : "mt-4 max-w-lg"
              }`}
            >
              {para}
            </p>
          ))}
          <div className="mx-auto mt-6 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {settings.aboutIntro.points.map((point) => (
              <p key={point} className="flex items-center gap-2 text-sm text-navy/80">
                <span className="block h-1.5 w-1.5 rotate-45 bg-ochre/80" aria-hidden="true" />
                {point}
              </p>
            ))}
          </div>
          <Link
            href="/about"
            className="mt-8 inline-block rounded-full border border-navy/25 px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-navy transition hover:border-oxblood hover:text-oxblood"
          >
            Read the full story
          </Link>
        </Reveal>
      </section>

      <Newsletter />
    </>
  );
}

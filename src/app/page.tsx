import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import { collections, products } from "@/lib/products";

const featured = products.filter((p) => p.featured).slice(0, 6);

export default function HomePage() {
  return (
    <>
      {/* ── Editorial hero ─────────────────────────────────────── */}
      <section className="grain relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pb-24 lg:pt-20">
          {/* Text column */}
          <div>
            <h1 className="font-serif text-[2.6rem] font-bold italic leading-[1.08] text-navy sm:text-6xl lg:text-[4.2rem]">
              <span className="block animate-fade-up">
                Mediterranean <em className="text-ochre">soul.</em>
              </span>
              <span className="block animate-fade-up delay-1">
                Botanical beauty.
              </span>
              <span className="block animate-fade-up delay-2">
                Sacred tradition.
              </span>
            </h1>

            <p className="mt-6 max-w-md animate-fade-up delay-3 text-[0.95rem] leading-relaxed text-navy/70">
              Hand-painted ceramic tiles and gold-engraved study boards, crafted
              in the spirit of old Sicilian majolica, each piece carrying the
              cobalt, lemon and ochre of a sun-washed coast.
            </p>

            <div className="mt-8 flex animate-fade-up delay-4 flex-wrap items-center justify-center gap-3 sm:justify-start sm:gap-4">
              <Link
                href="/shop"
                className="group flex items-center gap-2 rounded-full bg-oxblood px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream shadow-[0_14px_30px_rgb(107_15_26/0.35)] transition hover:bg-oxblood-deep sm:px-8 sm:py-4"
              >
                Shop the collection
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-navy/25 px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-navy transition hover:border-ochre hover:text-ochre sm:px-8 sm:py-4"
              >
                Our story
              </Link>
            </div>
          </div>

          {/* Artwork column */}
          <div className="animate-fade-in relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-2xl border border-ochre/40 sm:-inset-4"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-xl border border-navy/15 shadow-[0_35px_70px_rgb(14_42_77/0.28)]">
              <Image
                src="/images/hero.jpg"
                alt="House of Merola, Mediterranean artwork with lemons, tiles and the Amalfi coast"
                width={1717}
                height={916}
                priority
                className="h-auto w-full animate-slow-zoom"
              />
            </div>
            {/* Rotating badge */}
            <div
              aria-hidden="true"
              className="absolute -right-5 -top-5 z-10 hidden h-24 w-24 sm:block lg:h-28 lg:w-28"
            >
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full animate-spin-slow drop-shadow-[0_6px_16px_rgb(14_42_77/0.3)]"
              >
                <defs>
                  <path
                    id="merola-badge-circle"
                    d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                  />
                </defs>
                <circle cx="50" cy="50" r="49" className="fill-cream-soft" />
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  fill="none"
                  className="stroke-ochre/55"
                  strokeWidth="1"
                />
                <text
                  className="fill-navy"
                  fontSize="9"
                  letterSpacing="2.5"
                  textLength="239"
                  lengthAdjust="spacingAndGlyphs"
                >
                  <textPath href="#merola-badge-circle">
                    HAND-PAINTED IN SICILY · HOUSE OF MEROLA ·
                  </textPath>
                </text>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-serif text-2xl italic text-ochre">
                M
              </span>
            </div>
            {/* Floating accent tile */}
            <div className="absolute -bottom-8 -left-6 hidden w-40 rotate-[-6deg] animate-float-tilt overflow-hidden rounded-lg border-4 border-cream-soft shadow-[0_18px_40px_rgb(14_42_77/0.3)] sm:block lg:w-48">
              <Image
                src="/images/prod-lemon.jpg"
                alt="Limone tile"
                width={600}
                height={600}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Collections ────────────────────────────────────────── */}
      <section id="collections" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mb-10 text-center">
          <div className="section-rule justify-center">
            <span className="eyebrow text-navy">The Collections</span>
          </div>
          <h2 className="mt-4 font-serif text-3xl text-navy sm:text-4xl lg:text-5xl">
            Two houses, one spirit
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {collections.map((collection, index) => (
            <Reveal key={collection.slug} className="h-full" delay={index * 120}>
            <Link
              href={`/collections/${collection.slug}`}
              className="group relative block aspect-[16/10] overflow-hidden rounded-xl border border-navy/10"
            >
              <Image
                src={collection.bannerImage}
                alt={collection.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/90 to-navy-deep/70" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="eyebrow text-ochre-soft">{collection.tagline}</p>
                <h3 className="mt-2 font-serif text-2xl text-cream sm:text-3xl">
                  {collection.name}
                </h3>
                <span className="mt-3 inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-cream/85 transition group-hover:gap-3 group-hover:text-ochre-soft">
                  Explore
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Featured pieces ─────────────────────────────────────── */}
      <section className="bg-cream/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="section-rule">
                <span className="eyebrow text-navy">From the studio</span>
              </div>
              <h2 className="mt-4 font-serif text-3xl text-navy sm:text-4xl">
                Featured pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="group flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-navy transition hover:text-ochre"
            >
              View all
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>

          <div className="product-grid">
            {featured.map((product, index) => (
              <Reveal key={product.slug} className="h-full" delay={Math.min(index, 5) * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story teaser ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 mx-auto w-full max-w-md lg:order-1 lg:max-w-none">
            <div className="absolute -inset-3 rounded-2xl border border-ochre/40" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-xl border border-navy/15">
              <Image
                src="/images/prod-madonna-blue.jpg"
                alt="Madonna Blue Tile"
                width={900}
                height={900}
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="section-rule">
              <span className="eyebrow text-navy">Our story</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-navy sm:text-4xl">
              Every tile begins with
              <em className="text-ochre"> a little Sicilian light</em>
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-navy/70">
              House of Merola is a love letter to the Mediterranean: to
              lemon groves, cobalt majolica, and the old naturalists’ cabinets.
              Each tile is hand-painted; each study board is drawn, painted and
              laser-engraved by hand, so no two pieces leave the studio
              identical.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Hand-painted ceramic, fired with care",
                "Painted & laser-engraved wood study boards",
                "Small-batch, made to be kept",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-sm text-navy/80"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ochre/15 text-[0.6rem] text-ochre">
                    ✦
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-navy/25 px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-navy transition hover:border-ochre hover:text-ochre"
            >
              Read the full story
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Newsletter ──────────────────────────────────────────── */}
      <Newsletter />
    </>
  );
}

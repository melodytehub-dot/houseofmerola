import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "About the House",
  description:
    "The story of House of Merola — hand-painted tiles, engraved botanicals and sacred art, crafted in the spirit of the Mediterranean.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero band */}
      <section className="relative h-[52vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src="/collection2.jpg"
          alt="House of Merola — about the house"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/25 to-navy-deep/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-ochre-light">
            La Nostra Storia
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold uppercase tracking-[0.08em] text-cream sm:text-5xl md:text-6xl">
            About the House
          </h1>
          <div className="mt-6 flex items-center gap-4">
            <span className="h-px w-12 bg-ochre/60" />
            <span className="text-ochre-light">&#10043;</span>
            <span className="h-px w-12 bg-ochre/60" />
          </div>
          <p className="mt-6 max-w-xl font-serif text-lg font-light italic text-cream/85 sm:text-xl">
            A Mediterranean soul, rooted in tradition
          </p>
        </div>
      </section>

      {/* Story split */}
      <section className="px-6 py-24 sm:py-32 lg:px-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-dusty-blue">
              Born from the sun
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.15] text-navy sm:text-5xl">
              A house built on
              <br />
              <em className="font-light italic text-oxblood">ceramic &amp;
              craft</em>
            </h2>
            <div className="mt-8 space-y-5 text-[15px] font-light leading-relaxed text-navy/65">
              <p>
                House of Merola began with a love of the Mediterranean — its
                sun-drenched coasts, its ancient markets, and the patience of
                its artisans. What started as a few hand-painted tiles gathered
                on travels became a home for the objects that carry the sea
                with them.
              </p>
              <p>
                Every piece we offer is made by hand: tiles painted stroke by
                stroke in the tradition of Sicilian ceramics, botanicals
                engraved into wood, sacred imagery glazed in blues and gold.
                They are not made quickly, and they are not meant to be — like
                the pigments on an old tile, their beauty is in the layering.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-14 bg-ochre/50" />
              <span className="text-ochre">&#10043;</span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative overflow-hidden border border-cream-dark/60">
              <div className="aspect-[4/5]">
                <Image
                  src="/prod7.jpg"
                  alt="Hand-painted pomegranate tile"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 bg-navy/75 px-4 py-2 backdrop-blur-sm">
                <span className="text-[9px] uppercase tracking-[0.25em] text-ochre-light">
                  Hand-painted tile &mdash; the colours of the house
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-cream-dark/40 bg-cream-dark/15 px-6 py-24 sm:py-28 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-dusty-blue">
              Our Philosophy
            </p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-navy sm:text-5xl">
              What we believe in
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {[
              {
                title: "Handcrafted with love",
                body: "Meticulous attention to detail and deep respect for traditional Mediterranean techniques in every single piece.",
              },
              {
                title: "Rooted in tradition",
                body: "Our designs draw from centuries of ceramic art, botanical illustration and sacred devotional imagery.",
              },
              {
                title: "Timeless beauty",
                body: "Objects that transcend trends — lasting pieces that bring warmth, character and soul to any space.",
              },
            ].map((value, index) => (
              <Reveal key={value.title} delay={index * 100} className="text-center">
                <span className="font-serif text-5xl font-light text-ochre/60">
                  0{index + 1}
                </span>
                <div className="mx-auto mt-5 h-px w-10 bg-ochre/50" />
                <h3 className="mt-5 font-serif text-2xl font-medium text-navy">
                  {value.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-sm font-light leading-relaxed text-navy/60">
                  {value.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quote band */}
      <section className="grain relative overflow-hidden bg-navy px-6 py-28 text-center sm:py-36">
        <Reveal className="mx-auto max-w-3xl">
          <span className="font-serif text-6xl text-ochre/60">&ldquo;</span>
          <blockquote className="font-serif text-3xl font-light italic leading-snug text-cream sm:text-4xl md:text-5xl">
            Every tile is a small piece of the Mediterranean — sun, sea and
            centuries of craft, glazed and set in clay.
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-14 bg-ochre/40" />
            <span className="text-ochre">&#10043;</span>
            <span className="h-px w-14 bg-ochre/40" />
          </div>
          <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.4em] text-cream/50">
            House of Merola
          </p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center sm:py-28">
        <Reveal>
          <h2 className="font-serif text-4xl font-medium text-navy sm:text-5xl">
            Discover our world
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-navy/60">
            Explore the collections and find the piece that brings a little
            Mediterranean sun into your home.
          </p>
          <Link
            href="/shop"
            className="mt-9 inline-block bg-oxblood px-10 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-cream transition-all duration-500 hover:bg-oxblood-dark"
          >
            Browse the Shop
          </Link>
        </Reveal>
      </section>
    </>
  );
}

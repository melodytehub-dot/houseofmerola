import Image from "next/image";
import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import Reveal from "@/components/Reveal";
import { BrushIcon, HourglassIcon, LeafIcon } from "@/components/icons";

export const metadata = {
  title: "Our Story",
  description:
    "The story of House of Merola: House of Merola artwork UV-printed onto ceramic and wood, and laser-engraved pieces, made to order in our Liverpool studio.",
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-navy/10 bg-cream">
        <Reveal className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <p className="eyebrow text-ochre">Our story</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-navy sm:text-6xl">
            Made in the spirit
            <br />
            <em className="font-light italic text-ochre">of the Mediterranean & the cabinet of curiosities</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-navy/70">
            House of Merola began with the Mediterranean: lemons, saints, tiled
            courtyards and the colours of southern Italy, and wandered into old
            botanical books, celestial imagery and the strange and beautiful.
          </p>
        </Reveal>
      </section>

      {/* Story blocks */}
      <section className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 mx-auto w-full max-w-md lg:order-1 lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-2xl border border-ochre/40"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-xl border border-navy/15">
              <Image
                src="/images/prod-madonna-sicilia.jpg"
                alt="Madonna di Sicilia tile"
                width={900}
                height={900}
                className="h-auto w-full"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="section-rule">
              <span className="eyebrow text-navy">The beginning</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl text-navy sm:text-4xl">
              From the Mediterranean to the cabinet of curiosities
            </h2>
            <p className="mt-5 leading-relaxed text-navy/70">
              Everything starts with the coast: cobalt blue against white
              plaster, lemons hanging over garden walls, saints watching from
              tiled corners. We wanted to bring that feeling home, one tile and
              one study board at a time.
            </p>
            <p className="mt-4 leading-relaxed text-navy/70">
              From there the collection wandered into old botanical books and
              natural-history cabinets, celestial imagery and the strange and
              beautiful. Our pieces are designed in the spirit of old Sicilian
              majolica, with borders of scrollwork and blossom that echo old
              chapel floors; our study boards draw on the naturalists’ cabinets
              of the nineteenth century, herbals, herpetology and mycology,
              UV-printed and laser-engraved in antique gold on dark wood.
            </p>
          </div>
        </Reveal>

        <Reveal className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="section-rule">
              <span className="eyebrow text-navy">By hand</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl text-navy sm:text-4xl">
              No two pieces are identical
            </h2>
            <p className="mt-5 leading-relaxed text-navy/70">
              Made to order, piece by piece. Each design is printed or engraved
              individually, then finished by hand, so the light catches it a
              little differently every time. The subtle variations you’ll see
              are not imperfections; they’re the signature of the hand that made
              it.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-oxblood px-8 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood-deep"
            >
              See the pieces
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-2xl border border-ochre/40"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-xl border border-navy/15">
              <Image
                src="/images/prod-herbolologia.jpg"
                alt="Herbolologia Medica study board"
                width={900}
                height={1125}
                className="h-auto w-full"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="bg-navy py-16 text-cream lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <div className="section-rule justify-center text-ochre-soft">
              <span className="eyebrow text-ochre-soft">What we hold dear</span>
            </div>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              Art for a more magical home
            </h2>
          </Reveal>
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[
              {
                icon: BrushIcon,
                title: "Handmade",
                body: "Every piece is UV-printed or engraved, then finished by hand in our Liverpool studio.",
              },
              {
                icon: LeafIcon,
                title: "Mediterranean & beyond",
                body: "Cobalt, lemon and ochre; beyond the coast, a cabinet of curiosities.",
              },
              {
                icon: HourglassIcon,
                title: "Made to be kept",
                body: "Pieces built to be passed down, not thrown away, but heirlooms in waiting.",
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.title} className="h-full" delay={index * 120}>
                  <div className="h-full rounded-xl border border-cream/10 bg-cream/5 p-8">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ochre/30 bg-ochre/10 text-ochre-soft">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="brand-wordmark mt-5 text-base text-ochre-soft">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-cream/75">
                      {value.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

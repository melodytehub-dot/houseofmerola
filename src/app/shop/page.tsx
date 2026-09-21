import Image from "next/image";
import Link from "next/link";
import ShopGrid from "@/components/ShopGrid";
import Reveal from "@/components/Reveal";
import { getCollections, getProducts, getSettings } from "@/lib/content";
import { deliverySummary, formatGBPWhole } from "@/lib/format";

export default async function ShopPage() {
  const [products, collections, settings] = await Promise.all([
    getProducts(),
    getCollections(),
    getSettings(),
  ]);

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
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/90 via-navy-deep/85 to-navy-deep/95" />
        </div>
        <Reveal className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <p className="eyebrow text-ochre-soft">The House Collection</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            Made slowly, <em className="text-ochre-soft">by hand</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/85">
            House of Merola artwork UV-printed onto ceramic and wood, engraved and
            finished by hand, designed and made to order in our Liverpool
            studio. Small batches only, made to be kept.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-cream/15 pt-6 text-cream/80">
            {[
              "Designed & finished in Liverpool",
              settings.commerce.freeShippingThreshold > 0
                ? `Free UK delivery over ${formatGBPWhole(settings.commerce.freeShippingThreshold)}`
                : "UK delivery",
              "14-day standard returns",
            ].map((item) => (
              <p
                key={item}
                className="flex items-center gap-2.5 text-[0.66rem] uppercase tracking-[0.2em]"
              >
                <span className="block h-1.5 w-1.5 rotate-45 border border-ochre-soft/80" aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Filterable grid */}
      <ShopGrid products={products} collections={collections} />

      {/* Craft strip */}
      <section className="border-y border-navy/10 bg-cream/60">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:py-16">
          <Reveal>
            <h2 className="font-serif text-2xl tracking-tight text-navy [text-wrap:balance] sm:text-3xl">
              Made to order, piece by piece
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-navy/70">
              Every piece is designed in-house, made to order and finished by hand in our Liverpool studio, so subtle variations in print, colour and finish make each piece individual.
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-4" aria-hidden="true">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-ochre/60" />
              <span className="block h-2 w-2 rotate-45 border border-ochre/70" />
              <span className="h-px w-20 bg-gradient-to-l from-transparent to-ochre/60" />
            </div>
          </Reveal>
          <div className="mx-auto mt-8 grid max-w-3xl gap-8 text-center sm:grid-cols-2 sm:gap-12 sm:text-left">
            <Reveal delay={100} className="border-t border-navy/15 pt-6">
              <h3 className="brand-wordmark text-[0.8rem] text-navy">
                Wrapped and shipped with care
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/70">
                {`Every parcel is wrapped by hand and sent with tracking. ${deliverySummary(settings.commerce)}.`}
              </p>
            </Reveal>
            <Reveal delay={160} className="border-t border-navy/15 pt-6">
              <h3 className="brand-wordmark text-[0.8rem] text-navy">
                14 days to decide
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/70">
                Changed your mind? Return any standard piece in its original condition within 14 days for a full refund. Personalised and bespoke pieces are made to order and can only be returned if faulty.
              </p>
            </Reveal>
          </div>
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
              Commissions are our favourite work. Tell us your idea, add a
              reference image and we’ll send you a mock-up before you commit.
            </p>
            <Link
              href="/bespoke"
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

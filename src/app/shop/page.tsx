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
        <Reveal className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h1 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight text-cream [text-wrap:balance] sm:text-5xl lg:text-6xl">
            Made slowly, <em className="text-ochre-soft">by hand</em>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream/85">
            House of Merola artwork UV-printed onto ceramic and wood, engraved and
            finished by hand, designed and made to order in our Liverpool
            studio. Small batches only, made to be kept.
          </p>
          <dl className="mt-8 grid max-w-3xl gap-x-10 gap-y-2 border-t border-cream/15 pt-5 text-[0.72rem] sm:grid-cols-3">
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-cream/55">Studio</dt>
              <dd className="text-cream/90 sm:mt-1">Designed &amp; finished in Liverpool</dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-cream/55">Delivery</dt>
              <dd className="text-cream/90 sm:mt-1">
                {settings.commerce.freeShippingThreshold > 0
                  ? `Free UK delivery over ${formatGBPWhole(settings.commerce.freeShippingThreshold)}`
                  : "UK delivery"}
              </dd>
            </div>
            <div className="flex justify-between gap-3 sm:block">
              <dt className="text-cream/55">Returns</dt>
              <dd className="text-cream/90 sm:mt-1">14-day standard returns</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      {/* Filterable grid */}
      <ShopGrid products={products} collections={collections} />

      {/* Craft strip */}
      <section className="border-y border-navy/10 bg-cream/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <Reveal className="max-w-2xl">
            <h2 className="font-serif text-2xl tracking-tight text-navy [text-wrap:balance] sm:text-3xl">
              Made to order, piece by piece
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-navy/70">
              Every piece is designed in-house, made to order and finished by hand in our Liverpool studio, so subtle variations in print, colour and finish make each piece individual.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-x-12 gap-y-6 border-t border-navy/15 pt-8 sm:grid-cols-2">
            <Reveal delay={100}>
              <h3 className="text-sm font-semibold text-navy">
                Wrapped and shipped with care
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-navy/70">
                {`Every parcel is wrapped by hand and sent with tracking. ${deliverySummary(settings.commerce)}.`}
              </p>
            </Reveal>
            <Reveal delay={160}>
              <h3 className="text-sm font-semibold text-navy">
                14 days to decide
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-navy/70">
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

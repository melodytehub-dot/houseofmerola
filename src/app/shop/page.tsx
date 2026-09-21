import Image from "next/image";
import Link from "next/link";
import ShopGrid from "@/components/ShopGrid";
import Reveal from "@/components/Reveal";
import { BoxIcon, BrushIcon, ReturnIcon } from "@/components/icons";
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
        <Reveal className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="eyebrow text-ochre-soft">The House Collection</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            Made slowly, <em className="text-ochre-soft">by hand</em>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream/85">
            House of Merola artwork UV-printed onto ceramic and wood, engraved and
            finished by hand, designed and made to order in our Liverpool
            studio. Small batches only, made to be kept.
          </p>
          <div className="mt-9 flex max-w-2xl flex-col gap-3 border-t border-cream/15 pt-6 text-cream/80 sm:flex-row sm:flex-wrap sm:gap-x-10">
            {[
              "Designed & finished in Liverpool",
              settings.commerce.freeShippingThreshold > 0
                ? `Free UK delivery over ${formatGBPWhole(settings.commerce.freeShippingThreshold)}`
                : "UK delivery",
              "14-day standard returns",
            ].map((item) => (
              <p
                key={item}
                className="flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.2em]"
              >
                <span className="h-1 w-1 rounded-full bg-ochre-soft" />
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-16">
          <Reveal>
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ochre/40 bg-ochre/10 text-ochre lg:mx-0">
              <BrushIcon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-serif text-2xl leading-snug text-navy sm:text-3xl">
              Made to order, piece by piece
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-navy/70">
              Every piece is designed in-house, made to order and finished by hand in our Liverpool studio, so subtle variations in print, colour and finish make each piece individual.
            </p>
          </Reveal>
          <div className="flex flex-col divide-y divide-navy/10 border-t border-navy/10 lg:border-t-0">
            <Reveal delay={120} className="flex gap-5 py-6 lg:py-0 lg:pb-6">
              <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ochre/40 bg-ochre/10 text-ochre">
                <BoxIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="brand-wordmark text-[0.8rem] text-navy">
                  Wrapped and shipped with care
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy/70">
                  {`Every parcel is wrapped by hand and sent with tracking. ${deliverySummary(settings.commerce)}.`}
                </p>
              </div>
            </Reveal>
            <Reveal delay={200} className="flex gap-5 py-6 lg:pb-0 lg:pt-6">
              <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ochre/40 bg-ochre/10 text-ochre">
                <ReturnIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="brand-wordmark text-[0.8rem] text-navy">
                  14 days to decide
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-navy/70">
                  Changed your mind? Return any standard piece in its original condition within 14 days for a full refund. Personalised and bespoke pieces are made to order and can only be returned if faulty.
                </p>
              </div>
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

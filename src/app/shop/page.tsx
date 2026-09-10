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
        <Reveal className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <p className="eyebrow text-ochre-soft">The House Collection</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            Made slowly, <em className="text-ochre-soft">by hand</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/85">
            Original artwork UV-printed onto ceramic and wood, engraved and
            finished by hand — designed and made to order in our Liverpool
            studio. Small batches only, made to be kept.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-cream/15 pt-6 text-cream/80">
            {[
              "Designed & finished in Liverpool",
              settings.commerce.freeShippingThreshold > 0
                ? `Free UK delivery over ${formatGBPWhole(settings.commerce.freeShippingThreshold)}`
                : "UK delivery",
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

      {/* Filterable grid */}
      <ShopGrid products={products} collections={collections} />

      {/* Craft strip */}
      <section className="border-y border-navy/10 bg-cream/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8 lg:py-16">
          {[
            {
              icon: BrushIcon,
              title: "Made to order, piece by piece",
              body: "Each piece is designed in-house, UV-printed or laser-engraved, then finished by hand in our Liverpool studio — so every one is individual.",
            },
            {
              icon: BoxIcon,
              title: "Wrapped and shipped with care",
              body: `Every parcel is wrapped by hand and sent with tracking. ${deliverySummary(settings.commerce)}.`,
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

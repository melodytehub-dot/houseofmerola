import BespokeEnquiry from "@/components/BespokeEnquiry";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getCollections, getProducts, getSettings } from "@/lib/content";

export const metadata = {
  title: "Bespoke & Personalised",
  description:
    "Made-to-order ceramic, wood and laser-engraved pieces, designed in our Liverpool studio. Send a bespoke enquiry and attach a reference image.",
};

export const dynamic = "force-dynamic";

export default async function BespokePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
  const { product } = await searchParams;
  const productSlug = Array.isArray(product) ? product[0] : product;
  const [products, settings, collections] = await Promise.all([
    getProducts(),
    getSettings(),
    getCollections(),
  ]);
  const bespoke = products.filter((p) => p.madeToOrder);
  const bespokeCollectionName =
    collections.find((c) => c.slug === "bespoke-personalised")?.name;
  const preset = productSlug
    ? bespoke.find((p) => p.slug === productSlug)
    : undefined;

  return (
    <>
      {/* Header */}
      <section className="border-b border-navy/10 bg-cream">
        <Reveal className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <p className="eyebrow text-ochre">Bespoke &amp; Personalised</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-navy sm:text-6xl">
            Made just for you
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-navy/70">
            Lots of our customers come to us with an idea of their own — a name,
            a date, a favourite photo. We design each commission and create a
            mock-up for your approval before you commit, then make it to order
            in our Liverpool studio.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.68rem] uppercase tracking-[0.2em] text-steel">
            <span>✦ UV print onto ceramic &amp; wood</span>
            <span>✦ Laser engraving &amp; cutting</span>
            <span>✦ Designed &amp; finished by hand</span>
          </div>
        </Reveal>
      </section>

      {/* Enquiry + how it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <Reveal className="lg:col-span-3">
            <BespokeEnquiry
              product={preset}
              products={bespoke}
              contactEmail={settings.contactEmail}
            />
          </Reveal>

          <Reveal delay={120} className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="font-serif text-2xl text-navy">How it works</h2>
              <ol className="mt-5 space-y-5">
                {[
                  {
                    step: "01",
                    title: "Tell us your idea",
                    body: "Describe what you’d love, add the name or text you want featured and upload a reference image if you have one.",
                  },
                  {
                    step: "02",
                    title: "We send a mock-up",
                    body: "We design your piece and email a mock-up so you can see exactly what you’ll get — with any tweaks you’d like.",
                  },
                  {
                    step: "03",
                    title: "We make it to order",
                    body: "Once you approve, we print, engrave and finish your piece by hand in our Liverpool studio and dispatch it.",
                  },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="brand-wordmark shrink-0 text-ochre">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg text-navy">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-navy/70">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-navy/10 bg-cream-soft p-6">
              <p className="font-serif text-xl italic text-navy">
                Prefer to email us directly?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-steel">
                Send your idea and any reference images to
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-ochre underline"
                >
                  {" "}
                  {settings.contactEmail}
                </a>{" "}
                and we’ll take it from there.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Made-to-order pieces */}
      <section className="bg-cream/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10">
            <div className="section-rule">
              <span className="eyebrow text-navy">Made to order</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
              What we can make
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-navy/70">
              These are the starting points — tell us what you’d like and we’ll
              shape the piece around you.
            </p>
          </Reveal>
          <div className="product-grid">
            {bespoke.map((product, index) => (
              <Reveal
                key={product.slug}
                className="h-full"
                delay={Math.min(index, 3) * 70}
              >
                <ProductCard product={product} collectionName={bespokeCollectionName} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

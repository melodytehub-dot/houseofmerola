import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/content";
import { formatGBPWhole } from "@/lib/format";

export const metadata = {
  title: "Shipping & Returns",
  description:
    "UK and international delivery times and our returns policy for House of Merola pieces, including personalised and bespoke exclusions.",
};

const careSections = [
  {
    title: "Care",
    body: [
      "Ceramic tiles: wipe with a soft, dry cloth. Avoid harsh chemicals and prolonged direct sunlight.",
      "Engraved wood boards: dust gently; keep out of damp rooms. Wood may settle over time, and that’s part of its character.",
    ],
  },
  {
    title: "Returns & exchanges",
    body: [
      "Changed your mind? You have 14 days from delivery to return a standard piece in its original condition and packaging for a full refund.",
      "To start a return, email hello@houseofmerola.com with your order number and we’ll send a prepaid label.",
      "Personalised, custom and commissioned pieces are made to order and cannot be returned unless faulty.",
      "If your piece arrives damaged, send a photo within 48 hours and we’ll replace or refund it, no fuss.",
    ],
  },
];

export default async function ShippingPage() {
  const settings = await getSettings();
  const commerce = settings.commerce;
  const money = formatGBPWhole;

  const ukLine =
    commerce.freeShippingThreshold > 0
      ? `United Kingdom: ${money(commerce.shippingFee)}, free over ${money(commerce.freeShippingThreshold)}. Standard delivery 2–4 working days after dispatch.`
      : `United Kingdom: ${money(commerce.shippingFee)}. Standard delivery 2–4 working days after dispatch.`;

  const intlLine = commerce.internationalEnabled
    ? commerce.internationalFreeShippingThreshold > 0
      ? `International: ${money(commerce.internationalShippingFee)}, free over ${money(commerce.internationalFreeShippingThreshold)}. Delivery 5–14 working days depending on the destination.`
      : `International: from ${money(commerce.internationalShippingFee)}. Delivery 5–14 working days depending on the destination.`
    : "International delivery is quoted individually; we’ll confirm the price for your destination before you pay.";

  const sections = [
    {
      title: "Shipping",
      body: [
        "All pieces are designed and made to order in our Liverpool studio, then dispatched by hand.",
        ukLine,
        intlLine,
        "Dispatch happens within 1–3 working days; bespoke commissions may take longer, and we’ll let you know when your piece ships.",
      ],
    },
    ...careSections,
  ];

  return (
    <>
      <section className="border-b border-navy/10 bg-cream">
        <Reveal className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <p className="eyebrow text-ochre">Good to know</p>
          <h1 className="mt-4 font-serif text-4xl text-navy sm:text-6xl">
            Shipping & returns
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6 lg:py-20">
        {sections.map((section) => (
          <Reveal key={section.title}>
            <div className="section-rule">
              <span className="eyebrow text-navy">{section.title}</span>
            </div>
            <div className="mt-5 space-y-3">
              {section.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="leading-relaxed text-navy/75"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        ))}

        <Reveal className="rounded-xl border border-ochre/40 bg-cream-soft p-8 text-center">
          <p className="font-serif text-2xl italic text-navy">
            Questions about a piece?
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood"
          >
            Get in touch
          </Link>
        </Reveal>
      </section>
    </>
  );
}

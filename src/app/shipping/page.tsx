import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Shipping & Returns",
  description:
    "UK and international delivery times and our 14-day returns policy for House of Merola pieces.",
};

const sections = [
  {
    title: "Shipping",
    body: [
      "All pieces are made and dispatched by hand from our studio.",
      "UK: £3.95, free over £50. Standard delivery 2–4 working days after dispatch.",
      "Europe: from £9. Delivery 5–10 working days.",
      "Rest of world: from £14. Delivery 7–14 working days.",
      "Dispatch happens within 1–3 working days; bespoke commissions may take longer, and we’ll let you know when your piece ships.",
    ],
  },
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
      "Changed your mind? You have 14 days from delivery to return a piece in its original condition and packaging for a full refund.",
      "To start a return, email hello@houseofmerola.com with your order number and we’ll send a prepaid label.",
      "Custom and commissioned pieces are made to order and cannot be returned unless faulty.",
      "If your piece arrives damaged, send a photo within 48 hours and we’ll replace or refund it, no fuss.",
    ],
  },
];

export default function ShippingPage() {
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

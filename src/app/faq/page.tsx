"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "Are the pieces really handmade?",
    answer:
      "Yes — every tile is hand-painted and every study board is drawn, painted and laser-engraved by hand in small batches. Subtle variations in glaze and line are part of the charm: no two pieces are identical.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "We dispatch within 1–3 working days. UK delivery is 2–4 working days after dispatch, Europe 5–10, and the rest of the world 7–14. Every parcel is wrapped by hand and sent with tracking.",
  },
  {
    question: "Can I use the discount code with anything?",
    answer:
      "Code MEROLA10 gives you 10% off your first order at checkout. It can be combined with our free-UK-delivery-over-£50 offer, but not with other discounts.",
  },
  {
    question: "Do you take commissions?",
    answer:
      "We love them. Bespoke tiles, personalised study boards and wedding or housewarming pieces are our favourite projects. Send us your idea via the contact page and we’ll sketch a proposal.",
  },
  {
    question: "What if my piece arrives damaged?",
    answer:
      "Send a photo within 48 hours of delivery and we’ll replace or refund it, no fuss. See our shipping & returns page for the full policy.",
  },
  {
    question: "How do I look after a tile or study board?",
    answer:
      "Ceramic tiles: wipe with a soft dry cloth, avoid harsh chemicals. Wood boards: dust gently and keep them out of damp rooms. More details on our shipping & returns page.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="border-b border-navy/10 bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <p className="eyebrow text-ochre">Questions</p>
          <h1 className="mt-4 font-serif text-4xl text-navy sm:text-6xl">
            Frequently asked
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="divide-y divide-navy/10 rounded-2xl border border-navy/10 bg-cream-soft">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-serif text-lg text-navy sm:text-xl">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isOpen
                        ? "rotate-45 border-ochre text-ochre"
                        : "border-navy/20 text-navy"
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-sm leading-relaxed text-navy/75">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="font-serif text-2xl italic text-navy">
            Still wondering about something?
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood"
          >
            Ask us anything
          </Link>
        </div>
      </section>
    </>
  );
}

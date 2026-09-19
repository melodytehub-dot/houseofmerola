"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const faqs = [
  {
    question: "Are the pieces handmade and made to order?",
    answer:
      "Yes. Our original artwork is UV-printed onto ceramic or wood, with some pieces laser-engraved or cut, then finished by hand in our Liverpool studio. Every piece is designed in-house and made to order, so a little variation is part of the charm.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "We dispatch within 1–3 working days. UK delivery is 2–4 working days after dispatch, Europe 5–10, and the rest of the world 7–14. Every parcel is wrapped by hand and sent with tracking.",
  },
  {
    question: "Do you take commissions?",
    answer:
      "We love them. Bespoke ceramic, wooden plaques and engraved pieces are our favourite projects. Share your idea and a reference image via our bespoke enquiry and we’ll send a mock-up before you commit.",
  },
  {
    question: "What if my piece arrives damaged?",
    answer:
      "Send a photo within 48 hours of delivery and we’ll replace or refund it, no fuss. See our shipping & returns page for the full policy.",
  },
  {
    question: "How do I look after a ceramic piece or wooden board?",
    answer:
      "Ceramic: wipe with a soft dry cloth, avoid harsh chemicals. Wood: dust gently and keep it out of damp rooms. More details on our shipping & returns page.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <section className="border-b border-navy/10 bg-cream">
        <Reveal className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <p className="eyebrow text-ochre">Questions</p>
          <h1 className="mt-4 font-serif text-4xl text-navy sm:text-6xl">
            Frequently asked
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
        <Reveal className="divide-y divide-navy/10 rounded-2xl border border-navy/10 bg-cream-soft">
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
                  <p className="animate-fade-in px-6 pb-6 text-sm leading-relaxed text-navy/75">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </Reveal>

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

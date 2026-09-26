"use client";

import Reveal from "@/components/Reveal";
import DiscountSignupForm from "./DiscountSignupForm";

/**
 * Pre-footer House-list signup: studio news and early access plus, via the
 * verification link, a personal discount code — the same signup as the
 * first-visit popup.
 */
export default function Newsletter() {
  return (
    <section id="newsletter" className="grain relative scroll-mt-20 overflow-hidden bg-navy text-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url(/images/collection-botanical.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-deep/75 via-navy-deep/65 to-navy-deep/85" />
      <Reveal className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="eyebrow mb-4 text-ochre-soft">Join the House</p>
        <h2 className="font-serif text-3xl leading-tight text-cream sm:text-4xl">
          News, early access &amp; up to 20% off
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cream/75">
          Subscribe for studio notes and first looks at new collections — and
          we’ll email you a verification link so you can claim a personal
          discount code for your first piece.
        </p>

        <div className="mx-auto mt-8 max-w-md text-left">
          <DiscountSignupForm tone="dark" idPrefix="newsletter" />
        </div>
      </Reveal>
    </section>
  );
}

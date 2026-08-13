import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply to shopping with House of Merola.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <Reveal>
        <p className="eyebrow text-ochre">Legal</p>
        <h1 className="mt-3 font-serif text-4xl text-navy sm:text-5xl">
          Terms & Conditions
        </h1>
        <p className="mt-3 text-sm text-steel">Last updated: August 2026</p>
      </Reveal>

      <Reveal delay={120}>
      <div className="mt-10 space-y-8 leading-relaxed text-navy/75">
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">
            The pieces we sell
          </h2>
          <p>
            All products are handmade, small-batch pieces. Because each item is
            made by hand, slight variations in colour, glaze and engraving are
            to be expected and are not considered faults.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">Orders</h2>
          <p>
            An order is confirmed once we accept it and payment is processed. We
            may decline or cancel orders that appear fraudulent or where items
            are unavailable. Custom commissions are agreed individually and may
            require a deposit.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">
            Pricing & availability
          </h2>
          <p>
            Prices are shown in pounds sterling and include any applicable
            taxes. We make every effort to keep prices current, but we reserve
            the right to correct pricing errors.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">
            Returns & refunds
          </h2>
          <p>
            Our returns policy is outlined on our{" "}
            <Link href="/shipping" className="text-ochre underline">
              shipping & returns
            </Link>{" "}
            page and forms part of these terms. Commissioned pieces are
            non-refundable unless faulty.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">
            Intellectual property
          </h2>
          <p>
            All designs, images and text on this site are the property of House
            of Merola and may not be reproduced without written permission.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">Contact</h2>
          <p>
            For anything related to these terms, email{" "}
            <a
              href="mailto:hello@houseofmerola.com"
              className="text-ochre underline"
            >
              hello@houseofmerola.com
            </a>
            .
          </p>
        </div>
      </div>
      </Reveal>
    </div>
  );
}

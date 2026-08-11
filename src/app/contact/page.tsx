import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with House of Merola — questions, commissions and orders. We reply within two working days.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero band */}
      <section className="grain relative overflow-hidden border-b border-cream-dark/40 bg-navy px-6 py-20 text-center sm:py-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 8%, rgba(176,134,47,0.14), transparent 45%), radial-gradient(circle at 90% 92%, rgba(97,31,42,0.18), transparent 50%)",
          }}
        />
        <Reveal className="relative">
          <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-ochre-light">
            Get in Touch
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold uppercase tracking-[0.08em] text-cream sm:text-5xl md:text-6xl">
            Contact the House
          </h1>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-ochre/60" />
            <span className="text-ochre-light">&#10043;</span>
            <span className="h-px w-12 bg-ochre/60" />
          </div>
          <p className="mx-auto mt-6 max-w-xl font-serif text-lg font-light italic text-cream/85 sm:text-xl">
            Questions, commissions, or a piece you cannot find — write to us.
          </p>
        </Reveal>
      </section>

      {/* Form + details */}
      <section className="px-6 py-20 sm:py-24 lg:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-5 lg:gap-20">
          {/* Form */}
          <Reveal className="lg:col-span-3">
            <div className="grain relative overflow-hidden bg-navy p-8 text-cream sm:p-12">
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-ochre-light">
                Send a message
              </p>
              <h2 className="mt-4 font-serif text-3xl font-medium sm:text-4xl">
                We reply within two working days
              </h2>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <div className="lg:col-span-2">
            <Reveal delay={120}>
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-dusty-blue">
                The details
              </p>
              <h2 className="mt-4 font-serif text-4xl font-medium text-navy">
                How to reach us
              </h2>
              <div className="mt-8 space-y-8">
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-dusty-blue">
                    Email
                  </h3>
                  <a
                    href="mailto:hello@houseofmerola.com"
                    className="mt-2 inline-block break-all font-serif text-xl text-navy underline decoration-ochre/50 underline-offset-4 transition-colors hover:text-oxblood"
                  >
                    hello@houseofmerola.com
                  </a>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-dusty-blue">
                    Social
                  </h3>
                  <div className="mt-2 flex gap-5">
                    {["Instagram", "Etsy", "Pinterest"].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="text-sm font-light text-navy/70 transition-colors hover:text-oxblood"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-dusty-blue">
                    Good to know
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm font-light leading-relaxed text-navy/70">
                    <li>Pieces are handmade, so dispatch takes 3&ndash;5 working days.</li>
                    <li>Free delivery on orders over &pound;50.</li>
                    <li>Commissions and bespoke orders welcome.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <span className="h-px w-14 bg-ochre/50" />
                <span className="text-ochre">&#10043;</span>
              </div>
              <Link
                href="/shop"
                className="cta-sweep mt-6 inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-navy transition-colors hover:text-oxblood"
              >
                Browse the shop &rarr;
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

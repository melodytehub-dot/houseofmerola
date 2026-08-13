import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Privacy Policy",
  description: "How House of Merola collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <Reveal>
        <p className="eyebrow text-ochre">Legal</p>
        <h1 className="mt-3 font-serif text-4xl text-navy sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-steel">Last updated: August 2026</p>
      </Reveal>

      <Reveal delay={120}>
      <div className="mt-10 space-y-8 leading-relaxed text-navy/75">
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">
            What we collect
          </h2>
          <p>
            When you place an order, subscribe to our newsletter, or get in
            touch, we collect only what we need: your name, email address,
            delivery address and order details. We never collect more than
            necessary.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">
            How we use it
          </h2>
          <p>
            Your details are used to fulfil orders, deliver your newsletter
            (only if you asked for it), and respond to messages. We do not sell
            or rent your personal data to anyone.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">
            Payments & security
          </h2>
          <p>
            Payment details are processed by our secure payment providers and
            are never stored on our servers. We use encryption in transit and
            follow security best practice across the site.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">
            Cookies & analytics
          </h2>
          <p>
            We use minimal, privacy-respecting analytics to understand how the
            shop is used. You can disable cookies in your browser at any time.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-serif text-2xl text-navy">Your rights</h2>
          <p>
            You may request a copy of the data we hold about you, ask us to
            correct it, or ask us to delete it at any time by emailing{" "}
            <a
              href="mailto:hello@houseofmerola.com"
              className="text-ochre underline"
            >
              hello@houseofmerola.com
            </a>
            .
          </p>
        </div>
        <p>
          Questions? See our{" "}
          <Link href="/terms" className="text-ochre underline">
            Terms
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="text-ochre underline">
            contact us
          </Link>
          .
        </p>
      </div>
      </Reveal>
    </div>
  );
}

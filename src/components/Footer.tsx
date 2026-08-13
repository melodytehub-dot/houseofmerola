import Link from "next/link";
import Reveal from "@/components/Reveal";
import { collections } from "@/lib/products";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain bg-navy-deep text-cream">
      <Reveal className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <p className="brand-wordmark text-2xl text-cream">House of Merola</p>
            <p className="mt-2 text-xs uppercase tracking-[0.34em] text-ochre-soft">
              Arte · Casa · Mediterraneo
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
              Hand-painted ceramic tiles and gold-engraved study boards, crafted
              in the spirit of old Sicilian majolica, for walls that carry a
              little sunshine.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                  icon: "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2Zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-10.5a1.4 1.4 0 1 1-2.9 0 1.4 1.4 0 0 1 2.9 0Z",
                },
                {
                  label: "Pinterest",
                  href: "https://pinterest.com",
                  icon: "M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.4.7 1.4 1.6 0 1-.6 2.5-1 3.9-.3 1.2.6 2.1 1.7 2.1 2 0 3.6-2.2 3.6-5.3 0-2.8-2-4.7-4.9-4.7a5.1 5.1 0 0 0-5.3 5.1c0 1 .4 2.1.9 2.7a.4.4 0 0 1 .1.3l-.3 1.3c-.1.2-.2.3-.4.2-1.4-.7-2.3-2.7-2.3-4.4 0-3.6 2.6-6.9 7.5-6.9 3.9 0 7 2.8 7 6.6 0 3.9-2.5 7.1-5.9 7.1-1.2 0-2.3-.6-2.6-1.3l-.7 2.7c-.3 1-1 2.3-1.4 3A10 10 0 1 0 12 2Z",
                },
                {
                  label: "TikTok",
                  href: "https://tiktok.com",
                  icon: "M16.6 2h-3.2v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.3a6.2 6.2 0 0 0-.9-.1 6.1 6.1 0 1 0 6.1 6.1V8.4a7.6 7.6 0 0 0 4.4 1.4V6.6a4.4 4.4 0 0 1-4.4-4.6Z",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition hover:border-ochre hover:text-ochre-soft"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className="md:col-span-3">
            <h3 className="eyebrow mb-5 text-ochre-soft">Collections</h3>
            <ul className="space-y-3">
              {collections.map((collection) => (
                <li key={collection.slug}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="text-sm text-cream/75 transition hover:text-ochre-soft"
                  >
                    {collection.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-cream/75 transition hover:text-ochre-soft"
                >
                  All pieces
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="md:col-span-2">
            <h3 className="eyebrow mb-5 text-ochre-soft">Help</h3>
            <ul className="space-y-3">
              {[
                { href: "/shipping", label: "Shipping & returns" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
                { href: "/about", label: "Our story" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/75 transition hover:text-ochre-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Note */}
          <div className="md:col-span-2">
            <h3 className="eyebrow mb-5 text-ochre-soft">Studio</h3>
            <p className="text-sm leading-relaxed text-cream/75">
              Made by hand,
              <br />
              inspired by Sicily.
              <br />
              hello@houseofmerola.com
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="text-xs text-cream/50">
            © {year} House of Merola. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-cream/50">
            <Link href="/privacy" className="transition hover:text-ochre-soft">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-ochre-soft">
              Terms
            </Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}

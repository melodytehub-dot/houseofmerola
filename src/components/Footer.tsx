import Image from 'next/image'
import Link from 'next/link'

const shopLinks = ['Ceramics', 'Textiles', 'Home Decor', 'Tableware', 'Art & Wall Decor']
const infoLinks = ['About Us', 'Shipping & Returns', 'Terms & Conditions', 'Privacy Policy']
const careLinks = ['FAQs', 'Contact Us', 'Track Your Order']

export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="border-b border-cream/15 bg-[#f4eadb] text-navy">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/35 bg-cream-soft">
              <span className="font-serif text-2xl text-gold">✣</span>
            </div>
            <div>
              <h3 className="font-serif text-2xl">Join our world</h3>
              <p className="text-sm text-navy/70">
                Subscribe to our newsletter and enjoy 10% off your first order.
              </p>
            </div>
          </div>

          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="min-w-0 flex-1 border border-navy/15 bg-white/60 px-4 py-3 text-sm outline-none placeholder:text-navy/45"
            />
            <button
              type="submit"
              className="bg-navy px-6 py-3 text-sm font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-navy-deep"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative h-14 w-14">
              <Image
                src="/houseofmerolalogo(1).png"
                alt="House of Merola"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-serif text-2xl tracking-[0.08em]">HOUSE OF MEROLA</div>
              <div className="text-[10px] tracking-[0.42em] text-cream/65">
                ARTE • CASA • MEDITERRANEO
              </div>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-6 text-cream/75">
            Mediterranean objects, devotional tiles, and timeless decor pieces curated with a warm
            coastal feel.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-xl text-gold">SHOP</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {shopLinks.map((link) => (
              <li key={link}>
                <Link href="/shop" className="transition-colors hover:text-cream">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-xl text-gold">INFO</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {infoLinks.map((link) => (
              <li key={link}>
                <Link
                  href={
                    link === 'About Us'
                      ? '/about'
                      : link === 'Shipping & Returns'
                        ? '/shipping'
                        : link === 'Terms & Conditions'
                          ? '/terms'
                          : '/privacy'
                  }
                  className="transition-colors hover:text-cream"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-xl text-gold">CUSTOMER CARE</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {careLinks.map((link) => (
              <li key={link}>
                <Link
                  href={
                    link === 'FAQs' ? '/faq' : link === 'Contact Us' ? '/contact' : '/track'
                  }
                  className="transition-colors hover:text-cream"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-3 text-cream/80">
            {['instagram', 'pinterest', 'facebook', 'email'].map((label) => (
              <span
                key={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15"
                aria-hidden="true"
              >
                {label.slice(0, 1).toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 px-4 py-5 text-center text-sm text-cream/65 sm:px-6">
        © 2024 House of Merola. All rights reserved.
      </div>
    </footer>
  )
}

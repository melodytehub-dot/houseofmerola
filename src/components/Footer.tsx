"use client";

import Link from "next/link";
import { collections } from "@/lib/products";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-navy text-cream">
      {/* Newsletter strip */}
      <div className="border-b border-cream/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="max-w-md">
            <h3 className="font-serif text-3xl font-medium text-cream">
              Join the House
            </h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-cream/60">
              10% off your first piece, early access to new collections, and
              stories from the studio.
            </p>
          </div>
          <div className="w-full max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <p className="font-serif text-xl font-semibold uppercase leading-none tracking-[0.16em]">
              House of Merola
            </p>
            <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.42em] text-ochre-light">
              Arte &bull; Casa &bull; Mediterraneo
            </p>
            <div className="mt-6 flex gap-6">
              {["Instagram", "Etsy", "Pinterest"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[10px] uppercase tracking-[0.25em] text-cream/50 transition-colors duration-300 hover:text-ochre-light"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-cream/40">
              Collections
            </h4>
            <div className="mt-5 flex flex-col gap-3">
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/shop/${collection.slug}`}
                  className="w-fit text-sm font-light text-cream/70 transition-colors duration-300 hover:text-ochre-light"
                >
                  {collection.name}
                </Link>
              ))}
              <Link
                href="/shop"
                className="w-fit text-sm font-light text-ochre-light transition-colors duration-300 hover:text-ochre"
              >
                All pieces
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-cream/40">
              Explore
            </h4>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/"
                className="w-fit text-sm font-light text-cream/70 transition-colors duration-300 hover:text-ochre-light"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="w-fit text-sm font-light text-cream/70 transition-colors duration-300 hover:text-ochre-light"
              >
                About the House
              </Link>
              <Link
                href="/#newsletter"
                className="w-fit text-sm font-light text-cream/70 transition-colors duration-300 hover:text-ochre-light"
              >
                Newsletter
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-cream/40">
              Contact
            </h4>
            <div className="mt-5 flex flex-col gap-3 text-sm font-light text-cream/70">
              <a
                href="mailto:hello@houseofmerola.com"
                className="w-fit break-all transition-colors duration-300 hover:text-ochre-light"
              >
                hello@houseofmerola.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 sm:flex-row">
          <p className="text-[10px] uppercase tracking-[0.25em] text-cream/35">
            &copy; {new Date().getFullYear()} House of Merola. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

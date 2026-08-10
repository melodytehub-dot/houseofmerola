"use client";

import Link from "next/link";
import { useState } from "react";
import { collections } from "@/lib/products";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-navy text-cream">
      {/* Newsletter Section */}
      <div className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-cream mb-3">
              Join the House
            </h3>
            <p className="text-cream/60 text-sm tracking-wider mb-8 font-light">
              Subscribe for early access to new collections, exclusive offers,
              and a 10% discount on your first order.
            </p>
            {subscribed ? (
              <div className="bg-cream/10 rounded-lg p-6">
                <p className="text-ochre font-serif text-2xl mb-2">
                  Benvenuto!
                </p>
                <p className="text-cream/70 text-sm">
                  Use code{" "}
                  <span className="text-ochre font-semibold tracking-wider">
                    MEROLA10
                  </span>{" "}
                  at checkout for 10% off.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-5 py-3.5 bg-cream/10 border border-cream/20 rounded-lg text-cream placeholder-cream/40 text-sm tracking-wide focus:outline-none focus:border-ochre/60 transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-oxblood hover:bg-oxblood-light text-cream text-sm font-medium tracking-widest uppercase rounded-lg transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h4 className="font-serif text-xl font-semibold tracking-wider uppercase text-cream mb-1">
              House of Merola
            </h4>
            <p className="text-[10px] font-sans font-medium tracking-[0.35em] text-dusty-blue uppercase mb-4">
              Arte &bull; Casa &bull; Mediterraneo
            </p>
            <p className="text-cream/50 text-sm leading-relaxed">
              Mediterranean soul. Botanical beauty. Sacred tradition. Timeless
              curiosities.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h5 className="text-xs font-medium tracking-[0.25em] uppercase text-cream/40 mb-5">
              Collections
            </h5>
            <div className="flex flex-col gap-3">
              {collections.map((col) => (
                <Link
                  key={col.slug}
                  href={`/shop/${col.slug}`}
                  className="text-sm text-cream/70 hover:text-ochre transition-colors tracking-wide"
                >
                  {col.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h5 className="text-xs font-medium tracking-[0.25em] uppercase text-cream/40 mb-5">
              Explore
            </h5>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-cream/70 hover:text-ochre transition-colors tracking-wide"
              >
                Home
              </Link>
              <Link
                href="/shop/mediterranean-heritage"
                className="text-sm text-cream/70 hover:text-ochre transition-colors tracking-wide"
              >
                Shop All
              </Link>
              <Link
                href="/about"
                className="text-sm text-cream/70 hover:text-ochre transition-colors tracking-wide"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs tracking-wider">
            &copy; {new Date().getFullYear()} House of Merola. All rights reserved.
          </p>
          <p className="text-cream/20 text-xs tracking-wider font-light italic font-serif">
            Handcrafted with love, from the Mediterranean.
          </p>
        </div>
      </div>
    </footer>
  );
}

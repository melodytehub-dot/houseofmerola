"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden">
        <Image
          src="/collection2.jpg"
          alt="House of Merola"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/30 to-navy/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-ochre/80 text-xs tracking-[0.4em] uppercase font-medium mb-4 font-sans">
            Our Story
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-cream tracking-[0.08em] uppercase mb-4 drop-shadow-lg">
            About the House
          </h1>
          <div className="w-20 h-px bg-ochre/50 mb-6" />
          <p className="font-serif text-lg sm:text-xl text-cream/80 italic font-light max-w-xl drop-shadow-md">
            A Mediterranean soul, rooted in tradition
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-ochre/40" />
                <span className="text-ochre text-sm">&#10043;</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy leading-tight mb-6">
                Born from the
                <br />
                Mediterranean Sun
              </h2>
              <div className="space-y-4 text-navy/60 text-sm leading-relaxed font-light">
                <p>
                  House of Merola was born from a deep love for the Mediterranean
                  — its sun-drenched coasts, its ancient traditions, and the
                  timeless beauty of its artisan craft. Every piece in our
                  collection is a tribute to this extraordinary world.
                </p>
                <p>
                  From the hand-painted tiles of Sicily to the engraved wood
                  traditions of the Italian countryside, we bring together
                  centuries of craft knowledge and creative passion. Our pieces
                  are not just decorative objects — they are stories, frozen in
                  colour and form.
                </p>
              </div>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="/prod7.jpg"
                alt="Mediterranean craftsmanship"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28 px-4 bg-cream-dark/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-dusty-blue text-xs tracking-[0.35em] uppercase font-medium mb-3">
              Our Philosophy
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy">
              What We Believe In
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-navy/5 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-ochre"
                >
                  <path d="M12 22C12 22 3 16.5 3 10C3 7 5.5 4 8.5 4C10 4 11.5 5 12 6C12.5 5 14 4 15.5 4C18.5 4 21 7 21 10C21 16.5 12 22 12 22Z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy mb-3">
                Handcrafted with Love
              </h3>
              <p className="text-navy/50 text-sm font-light leading-relaxed">
                Each piece is crafted with meticulous attention to detail and a
                deep respect for traditional Mediterranean artisan techniques.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-navy/5 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-ochre"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2L12 12L17 7" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy mb-3">
                Rooted in Tradition
              </h3>
              <p className="text-navy/50 text-sm font-light leading-relaxed">
                Our designs draw from centuries of Mediterranean ceramic art,
                botanical illustration, and sacred devotional imagery.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-navy/5 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-ochre"
                >
                  <path d="M12 2L15 8.5L22 9.5L17 14.5L18.5 22L12 18.5L5.5 22L7 14.5L2 9.5L9 8.5L12 2Z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-navy mb-3">
                Timeless Beauty
              </h3>
              <p className="text-navy/50 text-sm font-light leading-relaxed">
                We create pieces that transcend trends — objects of lasting
                beauty that bring warmth, character, and soul to any space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-navy mb-6">
            Discover Our World
          </h2>
          <p className="text-navy/50 text-sm font-light mb-10 max-w-lg mx-auto">
            Explore our collections and find the perfect piece to bring
            Mediterranean soul into your home.
          </p>
          <Link
            href="/shop/mediterranean-heritage"
            className="inline-block px-10 py-4 bg-navy hover:bg-navy-light text-cream text-xs tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500"
          >
            Browse the Shop
          </Link>
        </div>
      </section>
    </>
  );
}

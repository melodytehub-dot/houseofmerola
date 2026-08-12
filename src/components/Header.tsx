"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { useCart } from "@/lib/cart";
import { collections } from "@/lib/products";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="bg-navy-deep text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[0.68rem] font-medium uppercase tracking-[0.22em]">
          <span className="text-ochre-soft">✦</span>
          <p>
            Free UK delivery over £50 · Use code{" "}
            <span className="text-ochre-soft">MEROLA10</span> for 10% off
          </p>
          <span className="text-ochre-soft">✦</span>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`border-b border-navy/10 bg-cream-soft/90 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-[0_10px_30px_rgb(14_42_77/0.08)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre lg:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16M4 12h16M4 17h10" />
                </>
              )}
            </svg>
          </button>

          {/* Logo — perfectly centered on mobile, left on desktop */}
          <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
            <Logo />
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            <Link
              href="/shop"
              className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-navy transition hover:text-ochre"
            >
              Shop
            </Link>

            <li
              ref={dropdownRef}
              className="relative list-none"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-navy transition hover:text-ochre"
                onClick={() => setCollectionsOpen((v) => !v)}
              >
                Collections
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={`transition-transform ${collectionsOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {collectionsOpen && (
                <div className="absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 rounded-lg border border-navy/10 bg-cream-soft p-2 shadow-xl">
                  {collections.map((collection) => (
                    <Link
                      key={collection.slug}
                      href={`/collections/${collection.slug}`}
                      className="block rounded-md px-4 py-3 transition hover:bg-cream"
                    >
                      <span className="brand-wordmark block text-[0.8rem] text-navy">
                        {collection.name}
                      </span>
                      <span className="mt-0.5 block text-[0.68rem] tracking-wide text-steel">
                        {collection.tagline}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <Link
              href="/about"
              className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-navy transition hover:text-ochre"
            >
              Our Story
            </Link>
            <Link
              href="/contact"
              className="text-[0.72rem] font-medium uppercase tracking-[0.24em] text-navy transition hover:text-ochre"
            >
              Contact
            </Link>
          </nav>

          {/* Cart — fixed width on mobile so the logo sits dead-centre */}
          <div className="flex w-10 items-center justify-end gap-2 lg:w-auto lg:flex-1">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 7h12l1.5 12.5a1 1 0 0 1-1 1.1H5.5a1 1 0 0 1-1-1.1L6 7Z" />
                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-oxblood px-1 text-[0.62rem] font-semibold text-cream">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav
            className="border-t border-navy/10 bg-cream-soft px-4 pb-6 pt-2 lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col divide-y divide-navy/10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.24em] text-navy"
                >
                  {link.label}
                </Link>
              ))}
              <div className="py-3.5">
                <p className="eyebrow mb-3 text-ochre">Collections</p>
                <div className="flex flex-col gap-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.slug}
                      href={`/collections/${collection.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-[0.72rem] uppercase tracking-[0.2em] text-navy/80 transition hover:text-ochre"
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

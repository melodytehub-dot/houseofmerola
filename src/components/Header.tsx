"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { collections } from "@/lib/products";

const navLinkClasses =
  "relative text-[11px] font-medium uppercase tracking-[0.28em] text-navy transition-colors duration-300 hover:text-oxblood after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ochre after:transition-all after:duration-300 hover:after:w-full";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeMenus = () => {
    setMenuOpen(false);
    setShopOpen(false);
  };

  useEffect(() => {
    if (!shopOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShopOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [shopOpen]);

  return (
    <>
      {/* Utility bar */}
      <div className="bg-navy-deep text-cream/80">
        <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
          <p className="text-[9px] uppercase tracking-[0.3em]">
            Free UK delivery on orders over &pound;50
          </p>
          <Link
            href="/#newsletter"
            className="text-[9px] uppercase tracking-[0.3em] text-ochre-light transition-colors duration-300 hover:text-ochre"
          >
            Subscribe &amp; save 10% &rarr;
          </Link>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 border-b border-cream-dark/50 bg-cream-light/90 backdrop-blur-md">
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Logo lockup */}
          <Link
            href="/"
            onClick={closeMenus}
            className="group flex items-center gap-3 sm:gap-3.5"
          >
            <Image
              src="/logo.png"
              alt="House of Merola"
              width={52}
              height={40}
              priority
              className="h-10 w-auto shrink-0 transition-transform duration-500 group-hover:scale-105 sm:h-11"
            />
            <span className="flex flex-col items-start">
              <span className="font-serif text-lg font-semibold uppercase leading-none tracking-[0.16em] text-navy transition-colors duration-300 sm:text-xl group-hover:text-oxblood">
                House of Merola
              </span>
              <span className="mt-1.5 text-[8px] font-medium uppercase tracking-[0.42em] text-dusty-blue sm:text-[9px]">
                Arte &bull; Casa &bull; Mediterraneo
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-10 md:flex">
            <Link href="/" onClick={closeMenus} className={navLinkClasses}>
              Home
            </Link>

            {/* Shop dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button
                type="button"
                onClick={() => setShopOpen((open) => !open)}
                aria-expanded={shopOpen}
                aria-haspopup="true"
                className={`${navLinkClasses} flex items-center gap-1.5`}
              >
                Shop
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9L12 15L18 9" />
                </svg>
              </button>

              <div
                className={`absolute left-1/2 top-full z-50 mt-4 w-80 -translate-x-1/2 border border-cream/10 bg-navy py-2 shadow-2xl shadow-navy-deep/50 transition-all duration-300 ${
                  shopOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0"
                }`}
              >
                <p className="px-5 pb-2 pt-3 text-[9px] uppercase tracking-[0.35em] text-cream/50">
                  The Collections
                </p>
                {collections.map((collection, index) => (
                  <Link
                    key={collection.slug}
                    href={`/shop/${collection.slug}`}
                    onClick={() => setShopOpen(false)}
                    className="group flex items-baseline justify-between gap-4 px-5 py-2.5 transition-colors duration-200 hover:bg-cream/5"
                  >
                    <span className="font-serif text-lg text-cream transition-colors duration-200 group-hover:text-ochre-light">
                      {collection.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-cream/40 transition-colors duration-200 group-hover:text-ochre">
                      0{index + 1}
                    </span>
                  </Link>
                ))}
                <div className="mt-1 border-t border-cream/10 px-5 py-3">
                  <Link
                    href="/shop"
                    onClick={() => setShopOpen(false)}
                    className="text-[10px] uppercase tracking-[0.3em] text-ochre-light transition-colors duration-200 hover:text-ochre"
                  >
                    All pieces &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/about" onClick={closeMenus} className={navLinkClasses}>
              About
            </Link>
          </div>

          {/* Join the House */}
          <div className="hidden md:block">
            <Link
              href="/#newsletter"
              onClick={closeMenus}
              className="border border-navy/25 px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.28em] text-navy transition-all duration-300 hover:border-navy hover:bg-navy hover:text-cream"
            >
              Join the House
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex flex-col gap-1.5 p-2 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`h-0.5 w-6 bg-navy transition-all duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-navy transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-navy transition-all duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-cream-dark/40 bg-cream-light md:hidden">
            <div className="flex flex-col px-6 py-6">
              <Link
                href="/"
                className="py-3 font-serif text-2xl text-navy"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="py-3 font-serif text-2xl text-navy"
                onClick={() => setMenuOpen(false)}
              >
                Shop
              </Link>
              <p className="pb-2 pt-3 text-[9px] uppercase tracking-[0.35em] text-dusty-blue">
                Collections
              </p>
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/shop/${collection.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="border-l border-cream-dark/60 py-2 pl-4 text-sm text-navy/80 transition-colors hover:text-oxblood"
                >
                  {collection.name}
                </Link>
              ))}
              <Link
                href="/about"
                className="mt-2 py-3 font-serif text-2xl text-navy"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/#newsletter"
                onClick={() => setMenuOpen(false)}
                className="mt-4 bg-oxblood px-6 py-3.5 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-cream"
              >
                Join the House
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

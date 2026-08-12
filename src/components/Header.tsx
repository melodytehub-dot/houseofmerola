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
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const closeMenus = () => {
    setMenuOpen(false);
    setShopOpen(false);
  };

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the drawer automatically when crossing up to the desktop breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // Focus the close button when opening; return focus to the burger when closing
  useEffect(() => {
    if (menuOpen) {
      drawerCloseRef.current?.focus();
    } else if (wasOpenRef.current) {
      burgerRef.current?.focus();
    }
    wasOpenRef.current = menuOpen;
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

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
      <header className="sticky top-0 z-50 border-b border-cream-dark/50 bg-cream-light/95 backdrop-blur-md">
        {/* Announcement strip */}
        <div className="border-b border-cream-dark/40 bg-navy">
          <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-[9px] font-medium uppercase leading-relaxed tracking-[0.24em] text-cream/80">
            <span className="text-ochre-light">&#10043;</span>
            <span className="sm:hidden">Get 10% off your first piece</span>
            <span className="hidden sm:inline">
              Free delivery over &pound;50 &nbsp;&bull;&nbsp; 10% off your
              first piece &nbsp;&bull;&nbsp; code{" "}
              <span className="font-semibold tracking-[0.3em] text-ochre-light">
                MEROLA10
              </span>
            </span>
            <span className="hidden text-ochre-light sm:inline">&#10043;</span>
          </p>
        </div>

        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Logo lockup */}
          <Link
            href="/"
            onClick={closeMenus}
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3.5"
          >
            <Image
              src="/logo.png"
              alt="House of Merola"
              width={52}
              height={40}
              priority
              className="h-8 w-auto shrink-0 transition-transform duration-500 group-hover:scale-105 sm:h-11"
            />
            <span className="flex min-w-0 flex-col items-start">
              <span className="whitespace-nowrap font-serif text-[17px] font-semibold uppercase leading-none tracking-[0.14em] text-navy transition-colors duration-300 sm:text-xl sm:tracking-[0.16em] group-hover:text-oxblood">
                House of Merola
              </span>
              <span className="mt-1.5 whitespace-nowrap text-[7px] font-medium uppercase tracking-[0.28em] text-dusty-blue sm:text-[9px] sm:tracking-[0.42em]">
                Art &bull; Home &bull; Mediterranean
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-5 lg:gap-9 md:flex">
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
            <Link href="/contact" onClick={closeMenus} className={navLinkClasses}>
              Contact
            </Link>
          </div>

          {/* Get 10% Off */}
          <div className="hidden md:block">
            <Link
              href="/#newsletter"
              onClick={closeMenus}
              className="border border-navy/25 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.28em] text-navy transition-all duration-300 hover:border-navy hover:bg-navy hover:text-cream lg:px-6"
            >
              Get 10% Off
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex flex-col gap-1.5 p-2 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
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
      </header>

      {/* Mobile slide-in drawer */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`fixed inset-0 z-[90] md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-navy-deep/70 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-cream-light shadow-2xl shadow-navy-deep/40 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-cream-dark/40 px-6 py-5">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5"
            >
              <Image
                src="/logo.png"
                alt="House of Merola"
                width={40}
                height={31}
                className="h-8 w-auto"
              />
              <span className="whitespace-nowrap font-serif text-base font-semibold uppercase leading-none tracking-[0.14em] text-navy">
                House of Merola
              </span>
            </Link>
            <button
              ref={drawerCloseRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-cream-dark/50 text-navy transition-colors duration-300 hover:bg-navy hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M1 1L17 17M17 1L1 17" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-6 py-6">
            <Link
              href="/"
              className="block py-3 font-serif text-2xl text-navy transition-colors hover:text-oxblood"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block py-3 font-serif text-2xl text-navy transition-colors hover:text-oxblood"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>

            {/* Collections — tidy, organised rows */}
            <p className="pb-1 pt-5 text-[9px] uppercase tracking-[0.35em] text-dusty-blue">
              The Collections
            </p>
            <div className="mt-1 border-t border-cream-dark/40">
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/shop/${collection.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between border-b border-cream-dark/40 py-3 transition-colors duration-200 hover:bg-cream/40"
                >
                  <span className="font-serif text-lg leading-tight text-navy transition-colors duration-200 group-hover:text-oxblood">
                    {collection.name}
                  </span>
                  <span className="translate-x-0 text-ochre opacity-0 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:opacity-100">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/about"
              className="block py-3 font-serif text-2xl text-navy transition-colors hover:text-oxblood"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-3 font-serif text-2xl text-navy transition-colors hover:text-oxblood"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>

          {/* Drawer footer */}
          <div className="border-t border-cream-dark/40 px-6 py-6">
            <Link
              href="/#newsletter"
              onClick={() => setMenuOpen(false)}
              className="block bg-oxblood px-6 py-4 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-cream transition-colors duration-300 hover:bg-oxblood-dark"
            >
              Get 10% Off
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

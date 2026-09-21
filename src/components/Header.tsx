"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { HeartIcon } from "./icons";
import { useCart } from "@/lib/cart";
import type { Collection } from "@/lib/products";
import type { SiteSettings } from "@/lib/site";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { useWishlist } from "@/lib/wishlist";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/bespoke", label: "Bespoke" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  settings,
  collections,
}: {
  settings: SiteSettings;
  collections: Collection[];
}) {
  const { count, openCart } = useCart();
  const { count: wishCount } = useWishlist();
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const desktopLink = (href: string) =>
    `text-[0.8rem] transition hover:text-oxblood ${
      isActive(href) ? "font-semibold text-navy" : "font-medium text-navy/70"
    }`;
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

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (menuOpen) lockScroll();
    else unlockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Close the drawer automatically when the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const actions = (
    <>
      <Link
        href="/wishlist"
        aria-label={`Wishlist, ${wishCount} items`}
        className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre"
      >
        <HeartIcon className="h-[18px] w-[18px]" />
        {wishCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ochre px-1 text-[0.62rem] font-semibold tabular-nums text-navy-deep">
            {wishCount}
          </span>
        )}
      </Link>
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
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-oxblood px-1 text-[0.62rem] font-semibold tabular-nums text-cream">
            {count}
          </span>
        )}
      </button>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-40">
        {settings.announcement && (
          <div className="bg-navy-deep text-center text-[0.64rem] font-medium uppercase tracking-[0.24em] text-cream">
            <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">{settings.announcement}</div>
          </div>
        )}
        {/* Main bar */}
        <div
          className={`border-b border-navy/10 bg-cream-soft/90 backdrop-blur-md transition-shadow ${
            scrolled ? "shadow-[0_10px_30px_rgb(14_42_77/0.08)]" : ""
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            {/* Mobile row */}
            <div className="flex items-center justify-between gap-4 lg:hidden">
              <div className="flex w-20 items-center">
                <button
                  type="button"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre"
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
                      <path d="M6 6l12 12M18 6L6 18" />
                    ) : (
                      <>
                        <path d="M4 7h16M4 12h16M4 17h10" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              <div className="flex flex-1 justify-center">
                <Logo />
              </div>
              <div className="flex w-20 items-center justify-end gap-1.5">{actions}</div>
            </div>

            {/* Desktop row, nav perfectly centred */}
            <div className="hidden items-center lg:grid lg:grid-cols-[1fr_auto_1fr]">
              <div className="flex justify-start">
                <Logo />
              </div>
              <nav className="flex items-center justify-center gap-7" aria-label="Main">
              <Link
                href="/shop"
                aria-current={isActive("/shop") ? "page" : undefined}
                className={desktopLink("/shop")}
              >
                Shop
              </Link>

              <Link
                href="/bespoke"
                aria-current={isActive("/bespoke") ? "page" : undefined}
                className={desktopLink("/bespoke")}
              >
                Bespoke
              </Link>

              <li
                ref={dropdownRef}
                className="relative list-none"
                onMouseEnter={() => setCollectionsOpen(true)}
                onMouseLeave={() => setCollectionsOpen(false)}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={collectionsOpen}
                  className={`flex items-center gap-1.5 text-[0.8rem] transition hover:text-oxblood ${
                    pathname.startsWith("/collections") ? "font-semibold text-navy" : "font-medium text-navy/70"
                  }`}
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
                  /* Padding (not margin) keeps the hover area continuous */
                  <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                    <div className="rounded-lg border border-navy/10 bg-cream-soft p-2 shadow-xl">
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
                  </div>
                )}
              </li>

              <Link
                href="/about"
                aria-current={isActive("/about") ? "page" : undefined}
                className={desktopLink("/about")}
              >
                Our Story
              </Link>
              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className={desktopLink("/contact")}
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center justify-end gap-1.5">{actions}</div>
          </div>
        </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-50 bg-navy-deep/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      />

      {/* Mobile menu drawer, slides in like the cart */}
      <aside
        id="mobile-menu"
        role="dialog"
        aria-label="Menu"
        aria-modal="true"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-cream-soft shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy/10 px-6 py-5">
          <p className="brand-wordmark text-lg text-navy">Menu</p>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Mobile">
          <div className="flex flex-col divide-y divide-navy/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center justify-between py-3 text-base font-medium text-navy transition hover:text-ochre"
              >
                {link.label}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-steel/60"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={closeMenu}
                className="flex items-center justify-between py-3 text-base font-medium text-navy transition hover:text-ochre"
              >
                Wishlist
              <HeartIcon className="h-4 w-4 text-steel/60" />
            </Link>
          </div>

          <div className="mt-5">
            <p className="eyebrow mb-3 text-ochre">Collections</p>
            <div className="flex flex-col">
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/collections/${collection.slug}`}
                  onClick={closeMenu}
                  className="py-2 text-sm text-navy/80 transition hover:text-ochre"
                >
                  {collection.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer CTA */}
        <div className="border-t border-navy/10 p-6">
          <Link
            href="/shop"
            onClick={closeMenu}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-oxblood px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood-deep"
          >
            Shop all pieces
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </aside>
    </>
  );
}

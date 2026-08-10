"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <span
              className="font-serif text-xl sm:text-2xl font-semibold tracking-[0.15em] text-navy uppercase leading-tight"
            >
              House of Merola
            </span>
            <span className="text-[9px] sm:text-[10px] font-sans font-medium tracking-[0.35em] text-dusty-blue uppercase">
              Arte &bull; Casa &bull; Mediterraneo
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="text-sm font-medium tracking-widest uppercase text-navy hover:text-ochre transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/shop/mediterranean-heritage"
              className="text-sm font-medium tracking-widest uppercase text-navy hover:text-ochre transition-colors duration-300"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium tracking-widest uppercase text-navy hover:text-ochre transition-colors duration-300"
            >
              About
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-navy transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`w-6 h-0.5 bg-navy transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-6 h-0.5 bg-navy transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-cream-dark/30">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium tracking-widest uppercase text-navy hover:text-ochre transition-colors"
              >
                Home
              </Link>
              <Link
                href="/shop/mediterranean-heritage"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium tracking-widest uppercase text-navy hover:text-ochre transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium tracking-widest uppercase text-navy hover:text-ochre transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

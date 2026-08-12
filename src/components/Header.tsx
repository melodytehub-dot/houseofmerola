'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-navy text-cream text-center py-2 px-4 text-sm">
        <div className="flex items-center justify-center gap-2">
          <span className="text-ochre">✦</span>
          <span>FREE SHIPPING ON ORDERS OVER €100</span>
          <span className="text-ochre">✦</span>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-cream sticky top-0 z-50 border-b border-navy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className="text-navy hover:text-ochre transition-colors text-sm uppercase tracking-wide"
              >
                Home
              </Link>
              <Link 
                href="/shop" 
                className="text-navy hover:text-ochre transition-colors text-sm uppercase tracking-wide"
              >
                Shop
              </Link>
              <Link 
                href="/about" 
                className="text-navy hover:text-ochre transition-colors text-sm uppercase tracking-wide"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="text-navy hover:text-ochre transition-colors text-sm uppercase tracking-wide"
              >
                Contact
              </Link>
            </nav>

            {/* Logo center */}
            <Link href="/" className="flex flex-col items-center">
              <div className="relative w-12 h-12 mb-1">
                <Image 
                  src="/houseofmerolalogo(1).png" 
                  alt="House of Merola" 
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-center">
                <div className="font-serif text-2xl tracking-wider text-navy">HOUSE OF MEROLA</div>
                <div className="text-xs tracking-[0.2em] text-navy/70">ARTE • CASA • MEDITERRANEO</div>
              </div>
            </Link>

            {/* Right icons */}
            <div className="hidden md:flex items-center gap-6">
              <button className="text-navy hover:text-ochre transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-navy hover:text-ochre transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="text-navy hover:text-ochre transition-colors relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-navy"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-navy/10 bg-cream">
            <nav className="flex flex-col py-4">
              <Link 
                href="/" 
                className="px-6 py-3 text-navy hover:bg-navy/5 text-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/shop" 
                className="px-6 py-3 text-navy hover:bg-navy/5 text-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/about" 
                className="px-6 py-3 text-navy hover:bg-navy/5 text-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="px-6 py-3 text-navy hover:bg-navy/5 text-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

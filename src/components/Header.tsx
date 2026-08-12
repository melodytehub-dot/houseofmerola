'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-navy transition-colors hover:border-navy/10 hover:bg-cream-soft">
      {children}
    </span>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-navy py-2 text-center text-[11px] tracking-[0.28em] text-cream">
        <div className="flex items-center justify-center gap-4">
          <span className="text-gold">✦</span>
          <span>FREE SHIPPING ON ORDERS OVER €150</span>
          <span className="text-gold">✦</span>
        </div>
      </div>

      <div className="bg-[linear-gradient(180deg,#fcf6ed_0%,#f7ecdd_100%)] nav-shadow">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/10 text-navy md:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            <span className="text-xl leading-none">{isOpen ? '✕' : '☰'}</span>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:text-rust ${
                  pathname === item.href ? 'text-rust' : 'text-navy'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-1 h-12 w-12 md:h-14 md:w-14">
                <Image
                  src="/houseofmerolalogo(1).png"
                  alt="House of Merola"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="font-serif text-[28px] tracking-[0.08em] text-navy md:text-[34px]">
                HOUSE OF MEROLA
              </div>
              <div className="mt-1 text-[10px] tracking-[0.42em] text-rust md:text-[11px]">
                ARTE • CASA • MEDITERRANEO
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:text-rust ${
                  pathname === item.href ? 'text-rust' : 'text-navy'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center gap-2">
              <Icon>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
                  <path d="M20 20l-3.5-3.5" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Icon>
              <Icon>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="8" r="3.25" strokeWidth="1.8" />
                  <path d="M5.5 20c1.6-3.8 5-5.5 6.5-5.5S17 16.2 18.5 20" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Icon>
              <Icon>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6.5 8.5h11l-1.2 10.5H7.7L6.5 8.5Z" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M9 8.5a3 3 0 0 1 6 0" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Icon>
            </div>
          </nav>
        </div>

        {isOpen ? (
          <div className="border-t border-navy/10 bg-cream-soft md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`border-b border-navy/5 py-3 text-sm font-medium uppercase tracking-[0.16em] ${
                    pathname === item.href ? 'text-rust' : 'text-navy'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

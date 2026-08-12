'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  return (
    <div>
      <section className="grain relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.jpg" alt="Contact House of Merola" fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/76 via-cream/40 to-navy/10" />
        </div>

        <div className="relative mx-auto grid min-h-[74vh] max-w-7xl items-center px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-xl">
            <p className="mb-4 text-sm tracking-[0.28em] text-gold uppercase">Contact</p>
            <h1 className="font-serif text-5xl leading-tight text-navy md:text-7xl">Let’s stay connected.</h1>
            <div className="mt-6 h-px w-16 bg-gold" />
            <p className="mt-6 max-w-lg text-base leading-7 text-navy/80">
              Have a question, a special request, or want to inquire about a piece? We’d love to
              hear from you.
            </p>

            <div className="mt-8 space-y-5 text-navy">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold">✉</div>
                <div>
                  <p className="font-medium">Email us</p>
                  <p className="text-navy/75">hello@houseofmerola.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold">☎</div>
                <div>
                  <p className="font-medium">Call us</p>
                  <p className="text-navy/75">+39 091 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold">◷</div>
                <div>
                  <p className="font-medium">Our hours</p>
                  <p className="text-navy/75">Mon - Fri: 9:00 - 18:00 (CET)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="soft-card p-6 sm:p-8">
            <p className="mb-3 text-sm tracking-[0.28em] text-gold uppercase">Send us a message</p>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/45"
                />
                <input
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className="border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/45"
                />
              </div>
              <input
                placeholder="Subject"
                value={formData.subject}
                onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                className="border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/45"
              />
              <textarea
                rows={7}
                placeholder="Your message"
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                className="border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/45"
              />
              <button className="mt-2 inline-flex w-fit bg-navy px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-navy-deep">
                Send message
              </button>
            </form>
          </div>

          <div className="soft-card overflow-hidden">
            <div className="grid h-full gap-0 md:grid-cols-[0.95fr_1.05fr]">
              <div className="p-6 sm:p-8">
                <p className="mb-3 text-sm tracking-[0.28em] text-gold uppercase">Find us</p>
                <div className="space-y-6 text-navy">
                  <div>
                    <p className="font-medium">Our Studio & Showroom</p>
                    <p className="text-sm leading-6 text-navy/75">Via dei Ceramisti, 14</p>
                    <p className="text-sm leading-6 text-navy/75">90133 Palermo, Sicily</p>
                    <p className="text-sm leading-6 text-navy/75">Italy</p>
                  </div>
                  <div>
                    <p className="font-medium">Online store</p>
                    <p className="text-sm leading-6 text-navy/75">We ship worldwide from our studio in Sicily.</p>
                  </div>
                  <div className="flex gap-3 text-navy/75">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/10">I</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/10">P</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/10">F</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/10">M</span>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[360px] bg-cream-soft">
                <Image src="/more details.jpg" alt="Sicily map inspiration" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-cream-soft px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {[
            ['Need help with an order?', 'Visit our FAQ page or reach out to us and we will be happy to assist you.', 'View FAQs'],
            ['Wholesale & Partnerships', 'Interested in carrying our pieces in your store or project?', 'Learn more'],
            ['Press & Collaborations', 'For press inquiries, collaborations or brand partnerships.', 'Contact us'],
          ].map(([title, text, action]) => (
            <div key={title} className="text-center">
              <h2 className="font-serif text-2xl text-navy">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-navy/75">{text}</p>
              <button className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-rust">
                {action} →
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] grain overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Contact Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-cream px-6">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Let's stay connected.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Have a question, a special request, or just want to say hello? We'd love to hear from you. Our team is here to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 lg:px-12 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-3xl text-navy mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-navy/20 rounded focus:outline-none focus:border-ochre bg-cream-light"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-navy/20 rounded focus:outline-none focus:border-ochre bg-cream-light"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-navy mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-navy/20 rounded focus:outline-none focus:border-ochre bg-cream-light"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-navy mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-navy/20 rounded focus:outline-none focus:border-ochre bg-cream-light resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-navy text-cream px-8 py-4 hover:bg-navy-deep transition-all duration-300 uppercase text-sm tracking-wide font-medium"
                >
                  <span>Send Message</span>
                  <span>→</span>
                </button>

                <p className="text-sm text-navy/60">
                  We aim to reply within 24 hours.
                </p>
              </form>
            </div>

            {/* Contact Information & Map */}
            <div>
              <h2 className="font-serif text-3xl text-navy mb-8">Find us</h2>

              {/* Contact Details */}
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-navy mb-1">Email Us</h3>
                    <p className="text-navy/70">hello@houseofmerola.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-navy mb-1">Call Us</h3>
                    <p className="text-navy/70">+39 091 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-navy mb-1">Our Hours</h3>
                    <p className="text-navy/70">Mon - Fri: 9:00 - 18:00 (CET)</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative aspect-[4/3] rounded overflow-hidden border border-navy/10">
                <Image
                  src="/more details.jpg"
                  alt="Sicily Location"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-navy/30 flex items-center justify-center">
                  <div className="text-center text-cream">
                    <h4 className="font-serif text-2xl mb-2">Our Studio & Showroom</h4>
                    <p className="text-sm">Via del Corso, 14</p>
                    <p className="text-sm">98123 Palermo, Sicily</p>
                    <p className="text-sm">Italy</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-serif text-xl text-navy mb-4">Online Store</h3>
                <p className="text-navy/70 mb-4">
                  We ship worldwide from our studio in Sicily.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-navy text-cream rounded-full flex items-center justify-center hover:bg-ochre transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://pinterest.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-navy text-cream rounded-full flex items-center justify-center hover:bg-ochre transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-navy text-cream rounded-full flex items-center justify-center hover:bg-ochre transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Help Section */}
      <section className="py-16 px-6 lg:px-12 bg-cream-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-ochre/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-serif text-xl text-navy mb-2">Need help with an order?</h3>
              <p className="text-sm text-navy/70 mb-4">
                Visit our FAQ page reach out to us and we'll be happy to assist you.
              </p>
              <button className="text-ochre hover:underline text-sm font-medium">
                VIEW FAQS →
              </button>
            </div>

            <div>
              <div className="w-16 h-16 bg-ochre/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="font-serif text-xl text-navy mb-2">Wholesale & Partnerships</h3>
              <p className="text-sm text-navy/70 mb-4">
                Interested in carrying our pieces in your store or project?
              </p>
              <button className="text-ochre hover:underline text-sm font-medium">
                LEARN MORE →
              </button>
            </div>

            <div>
              <div className="w-16 h-16 bg-ochre/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📰</span>
              </div>
              <h3 className="font-serif text-xl text-navy mb-2">Press & Collaborations</h3>
              <p className="text-sm text-navy/70 mb-4">
                For press inquiries or brand collaborations or brand partnerships.
              </p>
              <button className="text-ochre hover:underline text-sm font-medium">
                CONTACT US →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-navy">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-ochre text-3xl">✦</span>
            <h3 className="font-serif text-3xl text-cream">Join our world</h3>
          </div>
          <p className="text-cream/70 mb-8">
            Subscribe to our newsletter and enjoy 10% off your first order. Be the first to discover new collections, stories and offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-cream/10 border border-cream/20 rounded text-cream placeholder:text-cream/50 focus:outline-none focus:border-ochre"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-ochre text-navy hover:bg-ochre-light transition-colors font-medium rounded"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

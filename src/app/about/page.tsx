import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] grain overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/more details.jpg"
            alt="Our Story"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/50" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-cream px-6">
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Our story is rooted in the Mediterranean.
          </h1>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-ochre" />
            <span className="text-ochre">✦</span>
            <span className="h-px w-12 bg-ochre" />
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="py-20 px-6 lg:px-12 bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <p className="text-lg leading-relaxed text-navy/80 mb-6">
              House of Merola was born from a love for the Mediterranean—its colors, its traditions, its way of life. Each piece we offer carries the soul of the artisans and the spirit of the sun and sea.
            </p>
            <p className="text-lg leading-relaxed text-navy/80">
              Every object we create is a tribute to hand-made traditions that have been passed down through centuries. We believe in taking time, in honoring heritage behind every piece.
            </p>
          </div>

          <div className="my-16">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-navy text-cream px-8 py-4 hover:bg-navy-deep transition-all duration-300 uppercase text-sm tracking-wide"
            >
              <span>Discover Our Collection</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 lg:px-12 bg-cream-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-ochre tracking-widest uppercase text-sm mb-3">Our Mission</p>
            <h2 className="font-serif text-4xl md:text-5xl text-navy">
              Bringing timeless beauty into everyday living.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            {[
              {
                icon: '✦',
                title: 'AUTHENTICITY',
                description: 'We celebrate traditional craftsmanship as we honor the heritage behind every piece.'
              },
              {
                icon: '✋',
                title: 'HAND-CRAFTED',
                description: 'From materials to finishing, we are committed to lasting quality you can feel.'
              },
              {
                icon: '🌿',
                title: 'BEAUTY',
                description: 'Inspired by the Mediterranean landscape, our designs bring warmth, elegance, and soul beyond home.'
              },
              {
                icon: '♥',
                title: 'SUSTAINABILITY',
                description: 'We value mindful production and lasting design that stand the test of time and trend.'
              }
            ].map((value, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl text-ochre mb-4">{value.icon}</div>
                <h3 className="font-serif text-xl text-navy mb-3">{value.title}</h3>
                <p className="text-sm text-navy/70 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisans Section */}
      <section className="py-20 px-6 lg:px-12 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px]">
              <Image
                src="/hero.jpg"
                alt="Made by Artisans"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-ochre tracking-widest uppercase text-sm mb-4">Made by Artisans</p>
              <h2 className="font-serif text-4xl md:text-5xl text-navy mb-6">
                Honoring traditions, supporting artisans.
              </h2>
              <p className="text-lg leading-relaxed text-navy/80 mb-6">
                We partner with skilled artisans across the Mediterranean who keep centuries-old techniques alive. By choosing their work, you support their craft and bring beauty into your home—you're supporting their craft, their communities, and their future.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-ochre text-navy px-8 py-3 hover:bg-ochre-light transition-all duration-300 uppercase text-sm font-medium"
              >
                Meet the Artisans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-24 px-6 lg:px-12 grain">
        <div className="absolute inset-0 bg-navy" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-cream">
          <div className="mb-6 text-6xl font-serif text-ochre">"</div>
          <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-relaxed">
            The Mediterranean is not a place, it's a feeling — of sun, of home, of timeless beauty.
          </h2>
          <p className="text-ochre tracking-widest uppercase text-sm">— House of Merola</p>
        </div>
      </section>
    </div>
  )
}

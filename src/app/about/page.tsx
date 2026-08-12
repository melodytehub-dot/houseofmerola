import Image from 'next/image'
import Link from 'next/link'

const values = [
  {
    title: 'Authenticity',
    description: 'We honor traditional craftsmanship and the layered beauty of handmade work.',
  },
  {
    title: 'Quality',
    description: 'From materials to finishing, every piece is chosen for longevity and presence.',
  },
  {
    title: 'Beauty',
    description: 'We favor warm color, ornamental detail, and a Mediterranean sense of calm.',
  },
  {
    title: 'Sustainability',
    description: 'We value thoughtful production and objects that are meant to be kept, not replaced.',
  },
]

export default function AboutPage() {
  return (
    <div>
      <section className="grain relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/more details.jpg" alt="About House of Merola" fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/76 via-cream/40 to-navy/10" />
        </div>
        <div className="relative mx-auto grid min-h-[74vh] max-w-7xl items-center px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-xl">
            <p className="mb-4 text-sm tracking-[0.28em] text-gold uppercase">About us</p>
            <h1 className="font-serif text-5xl leading-tight text-navy md:text-7xl">
              Our story is rooted in the Mediterranean.
            </h1>
            <div className="mt-6 h-px w-16 bg-gold" />
            <p className="mt-6 text-base leading-7 text-navy/80">
              House of Merola was born from a love for sea light, ceramic tradition, and the
              layered beauty of objects made by hand.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="soft-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 text-2xl text-gold">
                  ✣
                </div>
                <h2 className="font-serif text-2xl text-navy">{value.title}</h2>
                <p className="mt-3 text-sm leading-6 text-navy/75">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image src="/prod7.jpg" alt="Artisan work" fill className="object-cover" />
        </div>
        <div className="bg-cream-soft px-6 py-14 sm:px-8 lg:px-12">
          <p className="mb-3 text-sm tracking-[0.28em] text-gold uppercase">Made by artisans</p>
          <h2 className="font-serif text-4xl text-navy md:text-5xl">Honoring traditions. Supporting artisans.</h2>
          <div className="mt-6 h-px w-16 bg-gold" />
          <p className="mt-6 max-w-xl text-base leading-8 text-navy/80">
            We partner with makers who keep centuries-old techniques alive. The result is a
            collection that feels personal, textured and quietly timeless.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex bg-rust px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-rust-deep"
          >
            Meet the artisans
          </Link>
        </div>
      </section>

      <section className="grain bg-navy px-4 py-16 text-cream sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-6xl text-gold">“</div>
          <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
            The Mediterranean is not a place, it is a feeling.
          </h2>
          <p className="mt-6 text-sm tracking-[0.3em] text-gold uppercase">House of Merola</p>
        </div>
      </section>
    </div>
  )
}

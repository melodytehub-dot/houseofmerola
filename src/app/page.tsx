import Image from 'next/image'
import Link from 'next/link'
import { collections, products } from '@/lib/products'

const featured = products.filter((product) => product.featured).slice(0, 5)

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <div className="text-center">
      <p className="mb-2 text-sm tracking-[0.28em] text-gold uppercase">{eyebrow}</p>
      <h2 className="font-serif text-4xl leading-tight text-navy md:text-5xl">{title}</h2>
      <div className="section-rule mt-4 text-gold">✣</div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="grain relative overflow-hidden bg-[linear-gradient(90deg,#f6f0e5_0%,#f4e8d8_40%,#ede0cf_100%)]">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Mediterranean home decor"
            fill
            priority
            className="object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/35 to-navy/10" />
        </div>

        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-xl">
            <p className="mb-5 text-sm tracking-[0.3em] text-gold uppercase">Mediterranean living</p>
            <h1 className="max-w-lg font-serif text-5xl leading-[0.95] text-navy md:text-7xl">
              Timeless home objects shaped by light, sea and tradition.
            </h1>
            <div className="mt-8 h-px w-16 bg-gold" />
            <p className="mt-6 max-w-md text-base leading-7 text-navy/80 md:text-lg">
              Curated ceramics, devotional tiles and decorative pieces inspired by the art and
              soul of the Mediterranean.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="bg-navy px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-navy-deep"
              >
                Shop the Collection
              </Link>
              <Link
                href="/about"
                className="border border-navy/15 bg-cream/70 px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-cream-soft"
              >
                Our Story
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-[560px] lg:block">
            <div className="absolute right-8 top-8 h-[430px] w-[260px] overflow-hidden rounded-[1.5rem] border border-navy/10 bg-cream-soft shadow-[0_16px_60px_rgba(18,48,87,0.2)]">
              <Image src="/prod10.jpg" alt="Decorative tile" fill className="object-cover" />
            </div>
            <div className="absolute left-10 top-24 h-[340px] w-[230px] overflow-hidden rounded-[1.5rem] border border-navy/10 bg-cream-soft shadow-[0_18px_50px_rgba(18,48,87,0.16)]">
              <Image src="/prod7.jpg" alt="Ceramic vase" fill className="object-cover" />
            </div>
            <div className="absolute bottom-6 left-28 h-[220px] w-[220px] overflow-hidden rounded-[1.5rem] border border-navy/10 bg-cream-soft shadow-[0_18px_50px_rgba(18,48,87,0.16)]">
              <Image src="/prod15.jpg" alt="Lemon tile" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-soft px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Explore our collections" title="Rooted in tradition. Made for today." />

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href="/shop"
                className="group overflow-hidden border border-navy/8 bg-white/40 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={collection.bannerImage}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/18 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl text-navy">{collection.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-navy/75">{collection.tagline}</p>
                  <p className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-rust">
                    Shop {collection.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#fbf4ea_0%,#f5ebde_100%)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Featured pieces" title="Handpicked for you" />

          <div className="product-grid mt-12">
            {featured.map((product) => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className="group overflow-hidden border border-navy/10 bg-cream-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(18,48,87,0.12)]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl text-navy">{product.name}</h3>
                      <p className="mt-1 text-sm text-navy/65">{product.shortDescription}</p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-navy">€{product.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex bg-rust px-9 py-4 text-sm font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-rust-deep"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grain bg-navy px-6 py-16 text-cream sm:px-8 lg:px-12">
          <p className="mb-3 text-sm tracking-[0.3em] text-gold uppercase">Our story</p>
          <h2 className="max-w-md font-serif text-4xl leading-tight md:text-5xl">
            Inspired by the past, made for today.
          </h2>
          <div className="mt-6 h-px w-16 bg-gold" />
          <p className="mt-6 max-w-lg text-base leading-7 text-cream/82">
            House of Merola began with a love for the Mediterranean and the idea that everyday
            objects can carry memory, craft and warmth.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-gold-soft"
          >
            Discover Our Story
          </Link>
        </div>

        <div className="relative min-h-[360px] lg:min-h-[440px]">
          <Image src="/more details.jpg" alt="House story" fill className="object-cover" />
        </div>
      </section>
    </div>
  )
}

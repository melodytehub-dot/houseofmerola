import Image from 'next/image'
import Link from 'next/link'
import { collections, products } from '@/lib/products'

const featured = products.filter((product) => product.featured).slice(0, 5)

const collectionImageBySlug: Record<string, string> = {
  'sacred-art': '/collection1.jpg',
  'botanical-studies': '/collection2.jpg',
}

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
      <section className="overflow-hidden bg-[linear-gradient(180deg,#fbf4ea_0%,#f4e8d8_100%)]">
        <div className="mx-auto max-w-[1535px] px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          <div className="relative overflow-hidden rounded-[1.25rem] border border-navy/10 bg-cream shadow-[0_20px_80px_rgba(18,48,87,0.18)]">
            <div className="relative aspect-[1535/834] w-full">
              <Image
                src="/hero.jpg"
                alt="House of Merola hero artwork"
                fill
                priority
                quality={100}
                sizes="(min-width: 1700px) 1535px, 100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
            <p className="text-sm tracking-[0.28em] text-gold uppercase">Arte • Casa • Mediterraneo</p>
            <p className="mt-4 text-base leading-7 text-navy/80 md:text-lg">
              Curated ceramics, devotional tiles and decorative pieces inspired by the Mediterranean
              soul.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link
                href="/shop"
                className="bg-navy px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-navy-deep"
              >
                Shop the Collection
              </Link>
              <Link
                href="/about"
                className="border border-navy/15 bg-cream-soft px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-cream"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-soft px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Explore our collections" title="Rooted in tradition. Made for today." />

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href="/shop"
                className="group overflow-hidden border border-navy/8 bg-white/40 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={collectionImageBySlug[collection.slug] ?? collection.bannerImage}
                    alt={collection.name}
                    fill
                    quality={95}
                    sizes="(min-width: 1280px) 20vw, (min-width: 768px) 45vw, 100vw"
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

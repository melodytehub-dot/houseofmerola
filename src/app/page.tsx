import Link from "next/link"
import Image from "next/image"
import { products, collections } from "@/lib/products"

export default async function Home() {
  const featured = products.slice(0, 5)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] grain overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Mediterranean living"
            fill
            className="object-cover animate-kenburns"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/40 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight text-cream animate-fade-up">
              Mediterranean living, timeless by nature.
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed text-cream/90 animate-fade-up" style={{ animationDelay: "0.15s" }}>
              Curated pieces inspired by the art, culture and soul of the Mediterranean. 
              Every object is a story, and every detail is hand-made.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-navy hover:bg-navy-deep text-cream px-10 py-4 font-medium tracking-wide transition-all duration-300 uppercase text-sm animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 px-6 lg:px-12 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-ochre tracking-widest uppercase text-sm mb-3">Explore Our Collections</p>
            <h2 className="font-serif text-4xl md:text-5xl text-navy mb-4">
              Rooted in tradition. Made for today.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection, i) => (
              <Link
                key={collection.slug}
                href={`/shop/${collection.slug}`}
                className="group relative overflow-hidden bg-cream-dark hover:shadow-xl transition-all duration-500 animate-fade-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={collection.bannerImage}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent opacity-80" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
                  <h3 className="font-serif text-2xl mb-2">{collection.name}</h3>
                  <p className="text-sm text-cream/80 mb-3">{collection.tagline}</p>
                  <div className="flex items-center gap-2 text-ochre text-sm uppercase tracking-wide">
                    <span>Shop {collection.name.split(' ')[0]}</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6 lg:px-12 bg-cream-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-ochre tracking-widest uppercase text-sm mb-3">Featured Pieces</p>
            <h2 className="font-serif text-4xl md:text-5xl text-navy">Handpicked for you</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featured.map((product, i) => (
              <Link
                key={product.id}
                href="/shop"
                className="group bg-cream border border-navy/10 overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="aspect-square relative overflow-hidden bg-cream-dark">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base text-navy mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-navy font-medium">€{product.price}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-block border-2 border-navy text-navy px-10 py-3 font-medium hover:bg-navy hover:text-cream transition-all duration-300 uppercase text-sm"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-24 px-6 lg:px-12 grain">
        <div className="absolute inset-0">
          <Image
            src="/more details.jpg"
            alt="Our Story"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-cream">
          <div className="mb-6 text-6xl font-serif text-ochre">"</div>
          <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-relaxed">
            The Mediterranean is not a place, it's a feeling — of sun, of home, of timeless beauty.
          </h2>
          <p className="text-ochre tracking-widest uppercase text-sm">— House of Merola</p>
          <Link
            href="/about"
            className="mt-10 inline-block bg-ochre hover:bg-ochre-light text-navy px-10 py-4 font-medium tracking-wide transition-all duration-300 uppercase text-sm"
          >
            Discover Our Story
          </Link>
        </div>
      </section>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySlug, products } from '@/lib/products'

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const related = products
    .filter((item) => item.collection === product.collection && item.slug !== product.slug)
    .slice(0, 3)

  return (
    <div>
      <section className="bg-cream-soft px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-navy/70">
          <Link href="/" className="hover:text-rust">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-rust">Shop</Link>
          <span>›</span>
          <span>{product.name}</span>
        </div>
      </section>

      <section className="px-4 pb-12 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="soft-card overflow-hidden">
            <div className="relative aspect-[4/5]">
              <Image src={product.image} alt={product.name} fill className="object-cover" priority />
            </div>
          </div>

          <div className="soft-card p-8 lg:p-10">
            <p className="mb-3 text-sm tracking-[0.26em] text-gold uppercase">{product.category}</p>
            <h1 className="font-serif text-4xl text-navy md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-3xl text-rust">€{product.price}</p>
            <div className="mt-6 h-px w-16 bg-gold" />
            <p className="mt-6 text-base leading-8 text-navy/80">{product.description}</p>

            <div className="mt-8 grid gap-3 text-sm text-navy/75">
              <div className="flex items-center justify-between border-b border-navy/10 py-3">
                <span className="font-medium text-navy">Materials</span>
                <span>{product.materials.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between border-b border-navy/10 py-3">
                <span className="font-medium text-navy">Collection</span>
                <span>{product.category}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="bg-navy px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-navy-deep">
                Add to cart
              </button>
              <Link
                href="/contact"
                className="border border-navy/15 px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-cream"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-cream-soft px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="mb-2 text-sm tracking-[0.26em] text-gold uppercase">Related pieces</p>
              <h2 className="font-serif text-4xl text-navy">Pieces that share the same spirit</h2>
            </div>

            <div className="product-grid">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/shop/${item.slug}`}
                  className="overflow-hidden border border-navy/10 bg-cream-soft transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-xl text-navy">{item.name}</h3>
                    <p className="mt-1 text-sm text-navy/65">€{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}

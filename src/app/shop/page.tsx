'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { products } from '@/lib/products'

const categories = ['All', 'Sacred Art', 'Botanical Studies', 'Celestial Motifs', 'Coastal Motifs', 'Fruit & Flora']
const materials = ['Ceramic', 'Print', 'Wood']

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 80])
  const [sortBy, setSortBy] = useState('featured')
  const [activeMaterials, setActiveMaterials] = useState<string[]>([])

  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
      const materialMatch =
        activeMaterials.length === 0 || activeMaterials.some((material) => product.materials.includes(material))
      return categoryMatch && priceMatch && materialMatch
    })

    return [...list].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return Number(b.featured) - Number(a.featured)
    })
  }, [activeMaterials, priceRange, selectedCategory, sortBy])

  const toggleMaterial = (material: string) => {
    setActiveMaterials((current) =>
      current.includes(material) ? current.filter((item) => item !== material) : [...current, material]
    )
  }

  return (
    <div>
      <section className="grain relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero.jpg" alt="Shop the collection" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/78 via-cream/58 to-navy/10" />
        </div>

        <div className="relative mx-auto grid min-h-[46vh] max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="max-w-lg">
            <p className="mb-4 text-sm tracking-[0.28em] text-gold uppercase">Shop the Collection</p>
            <h1 className="font-serif text-5xl leading-tight text-navy md:text-7xl">Ceramics and decor with a coastal soul.</h1>
            <div className="mt-6 h-px w-16 bg-gold" />
            <p className="mt-6 text-base leading-7 text-navy/80">
              Browse tiles, art pieces and decorative accents inspired by the Mediterranean
              palette.
            </p>
          </div>
          <div className="hidden lg:block" />
        </div>
      </section>

      <section className="border-b border-navy/10 bg-cream-soft px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-navy/70">
          <Link href="/" className="hover:text-rust">Home</Link>
          <span>›</span>
          <span>Shop</span>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="soft-card h-fit p-6">
            <div className="mb-6">
              <p className="mb-3 text-sm tracking-[0.24em] text-gold uppercase">Browse by category</p>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                      selectedCategory === category ? 'bg-navy text-cream' : 'text-navy hover:bg-navy/5'
                    }`}
                  >
                    <span>{category}</span>
                    <span>({category === 'All' ? products.length : products.filter((product) => product.category === category).length})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm tracking-[0.24em] text-gold uppercase">Filter by price</p>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={priceRange[1]}
                  onChange={(event) => setPriceRange([0, Number(event.target.value)])}
                  className="w-full accent-[var(--color-rust)]"
                />
                <div className="flex items-center justify-between text-sm text-navy/70">
                  <span>€{priceRange[0]}</span>
                  <span>€{priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm tracking-[0.24em] text-gold uppercase">Material</p>
              <div className="space-y-3">
                {materials.map((material) => (
                  <label key={material} className="flex cursor-pointer items-center gap-3 text-sm text-navy">
                    <input
                      type="checkbox"
                      checked={activeMaterials.includes(material)}
                      onChange={() => toggleMaterial(material)}
                      className="h-4 w-4 accent-[var(--color-rust)]"
                    />
                    <span>{material}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('All')
                setPriceRange([0, 80])
                setSortBy('featured')
                setActiveMaterials([])
              }}
              className="w-full border border-navy/15 px-4 py-3 text-sm font-medium uppercase tracking-[0.16em] text-navy transition-colors hover:bg-navy hover:text-cream"
            >
              Clear all filters
            </button>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-4 border-b border-navy/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-navy/70">
                Showing <span className="font-medium text-navy">1-{filteredProducts.length}</span> of{' '}
                <span className="font-medium text-navy">{filteredProducts.length}</span> results
              </p>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="border border-navy/15 bg-cream-soft px-4 py-3 text-sm text-navy outline-none"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Sort by: Price low to high</option>
                <option value="price-high">Sort by: Price high to low</option>
                <option value="name">Sort by: Name</option>
              </select>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <Link
                  key={product.slug}
                  href={`/shop/${product.slug}`}
                  className="group overflow-hidden border border-navy/10 bg-cream-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,48,87,0.12)]"
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
                    <h3 className="font-serif text-xl text-navy">{product.name}</h3>
                    <p className="mt-1 text-sm text-navy/65">{product.shortDescription}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-navy">€{product.price}</span>
                      <span className="text-sm font-medium uppercase tracking-[0.16em] text-rust">
                        View
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

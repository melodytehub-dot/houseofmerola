'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { products } from '@/lib/products'

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 120])
  const [sortBy, setSortBy] = useState<string>('featured')

  const categories = ['All', 'Ceramics', 'Textiles', 'Home Decor', 'Tableware', 'Art & Wall Decor']

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'All' || product.description.includes(selectedCategory)
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return categoryMatch && priceMatch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[50vh] grain overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Shop the Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-cream px-6">
          <h1 className="font-serif text-5xl md:text-7xl mb-4">Shop the Collection</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Timeless pieces inspired by the art, culture and soul of the Mediterranean.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-cream border-b border-navy/10 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 text-sm text-navy/70">
            <Link href="/" className="hover:text-ochre">Home</Link>
            <span>›</span>
            <span>Shop</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-8">
            {/* Browse by Category */}
            <div>
              <h3 className="font-serif text-xl mb-4 text-navy">BROWSE BY CATEGORY</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-4 py-2 transition-colors ${
                      selectedCategory === category
                        ? 'bg-navy text-cream'
                        : 'text-navy hover:bg-navy/5'
                    }`}
                  >
                    {category}
                    <span className="float-right text-sm">
                      ({category === 'All' ? products.length : products.filter(p => p.description.includes(category)).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Price */}
            <div>
              <h3 className="font-serif text-xl mb-4 text-navy">FILTER BY PRICE</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-navy">€{priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <span className="text-sm text-navy">€{priceRange[1]}</span>
                </div>
                <button className="w-full bg-navy text-cream py-2 hover:bg-navy-deep transition-colors">
                  FILTER
                </button>
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <h3 className="font-serif text-xl mb-4 text-navy">MATERIAL</h3>
              <div className="space-y-2">
                {['Ceramic', 'Cotton & Linen', 'Glass', 'Wood', 'Metal'].map(material => (
                  <label key={material} className="flex items-center gap-2 text-navy cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{material}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear All Filters */}
            <button className="w-full border border-navy/20 text-navy py-2 hover:bg-navy/5 transition-colors">
              CLEAR ALL FILTERS
            </button>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-navy/10">
              <p className="text-navy">
                Showing <span className="font-medium">1-{sortedProducts.length}</span> of <span className="font-medium">{sortedProducts.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-navy">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-navy/20 px-4 py-2 rounded bg-cream text-navy focus:outline-none focus:border-ochre"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Link
                  key={product.id}
                  href="/shop"
                  className="group bg-cream border border-navy/10 overflow-hidden hover:shadow-xl transition-all duration-500"
                >
                  <div className="aspect-square relative overflow-hidden bg-cream-dark">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Quick Actions on Hover */}
                    <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button className="bg-cream text-navy w-10 h-10 rounded-full flex items-center justify-center hover:bg-ochre transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button className="bg-cream text-navy w-10 h-10 rounded-full flex items-center justify-center hover:bg-ochre transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-base text-navy mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-navy font-medium">€{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 border border-navy/20 flex items-center justify-center hover:bg-navy hover:text-cream transition-colors">
                  ‹
                </button>
                {[1, 2, 3, 4].map(page => (
                  <button
                    key={page}
                    className={`w-10 h-10 border border-navy/20 flex items-center justify-center transition-colors ${
                      page === 1 ? 'bg-navy text-cream' : 'hover:bg-navy/5'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="w-10 h-10 border border-navy/20 flex items-center justify-center hover:bg-navy hover:text-cream transition-colors">
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-cream-light py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-ochre text-3xl">✦</span>
            <h3 className="font-serif text-3xl text-navy">Join our world</h3>
          </div>
          <p className="text-navy/70 mb-8">
            Subscribe to our newsletter and enjoy 10% off your first order. Be the first to discover new collections, stories and offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-navy/20 rounded focus:outline-none focus:border-ochre"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-navy text-cream hover:bg-navy-deep transition-colors font-medium rounded"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

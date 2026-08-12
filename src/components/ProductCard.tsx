"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { getCollectionBySlug, type Product } from "@/lib/products";
import { formatGBP } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const collection = getCollectionBySlug(product.collection);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-navy/8 bg-cream-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgb(14_42_77/0.14)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-warm">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-cream backdrop-blur-sm">
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {collection && (
          <p className="eyebrow mb-1.5 text-[0.58rem] text-ochre">
            {collection.name}
          </p>
        )}
        <h3 className="font-serif text-lg leading-snug text-navy transition group-hover:text-ochre sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-steel">
          {product.tagline}
        </p>
        <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-center font-medium text-navy sm:text-left">
            {formatGBP(product.price)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className="w-full rounded-full border border-navy/20 bg-cream px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-navy transition hover:border-oxblood hover:bg-oxblood hover:text-cream sm:w-auto sm:bg-transparent sm:py-2 sm:opacity-0 sm:group-hover:opacity-100"
          >
            Add to cart
          </button>
        </div>
      </div>
    </Link>
  );
}

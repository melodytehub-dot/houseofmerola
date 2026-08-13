"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { getCollectionBySlug, type Product } from "@/lib/products";
import { formatGBP } from "@/lib/format";
import { BagIcon } from "./icons";
import WishlistButton from "./WishlistButton";

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
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-navy/8 bg-cream-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgb(14_42_77/0.14)]"
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
        <WishlistButton product={product} />
        {/* Quick-add cart button, always visible */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-navy text-cream shadow-[0_10px_24px_rgb(14_42_77/0.35)] transition hover:scale-105 hover:bg-oxblood active:scale-95"
        >
          <BagIcon className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        {collection && (
          <p className="eyebrow mb-1 text-[0.55rem] text-ochre sm:mb-1.5 sm:text-[0.58rem]">
            {collection.name}
          </p>
        )}
        <h3 className="font-serif text-[0.95rem] font-bold leading-snug text-navy transition group-hover:text-ochre sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-1 hidden text-xs leading-relaxed text-steel sm:block sm:line-clamp-2">
          {product.tagline}
        </p>
        <div className="mt-auto flex items-center pt-2 sm:pt-4">
          <span className="text-sm font-semibold text-navy sm:text-base">
            {formatGBP(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}

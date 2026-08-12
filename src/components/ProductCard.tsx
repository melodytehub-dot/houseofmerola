"use client";

import Image from "next/image";
import { getCollectionBySlug, type Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const collection = getCollectionBySlug(product.collection);

  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      className="group w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ochre"
      aria-label={`View ${product.name}`}
    >
      {/* Matted frame */}
      <div className="lift relative overflow-hidden border border-cream-dark/50 bg-cream-light p-1.5 shadow-[0_1px_3px_rgba(22,41,77,0.05),0_12px_32px_-20px_rgba(22,41,77,0.25)] transition-colors duration-500 group-hover:border-ochre/60 group-hover:shadow-[0_2px_6px_rgba(22,41,77,0.06),0_30px_55px_-24px_rgba(22,41,77,0.4)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark/30">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/65 via-navy-deep/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-0 border border-cream/25 transition-colors duration-500 group-hover:border-ochre/30" />

          {/* Hover reveal */}
          <div className="absolute bottom-0 left-0 right-0 flex translate-y-3 items-center justify-between px-5 pb-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cream">
              View piece
            </span>
            <span className="flex h-8 w-8 items-center justify-center border border-cream/40 text-ochre-light transition-all duration-300 group-hover:border-ochre-light">
              &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-5">
        <div className="flex items-center gap-2.5">
          <span className="h-px w-5 bg-ochre/60 transition-all duration-500 group-hover:w-8" />
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-dusty-blue">
            {collection ? collection.name : "The House"}
          </p>
        </div>
        <h3 className="mt-2.5 font-serif text-lg font-semibold leading-snug text-navy transition-colors duration-300 group-hover:text-oxblood sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-2 font-serif text-lg font-medium text-ochre-dark">
          &pound;{product.price.toFixed(2)}
        </p>
      </div>
    </button>
  );
}

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
      className="group w-full cursor-pointer text-left"
    >
      <div className="relative aspect-[4/5] overflow-hidden border border-cream-dark/60 bg-cream-dark/30 transition-colors duration-500 group-hover:border-ochre/60">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 flex translate-y-3 items-center gap-2 px-5 pb-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-[10px] uppercase tracking-[0.3em] text-cream">
            View piece
          </span>
          <span className="text-ochre-light">&rarr;</span>
        </div>
      </div>

      <div className="mt-5">
        {collection && (
          <p className="text-[9px] uppercase tracking-[0.3em] text-dusty-blue">
            {collection.name}
          </p>
        )}
        <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-navy transition-colors duration-300 group-hover:text-oxblood">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm font-medium text-navy/60">
          &pound;{product.price.toFixed(2)}
        </p>
      </div>
    </button>
  );
}

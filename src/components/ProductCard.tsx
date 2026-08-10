"use client";

import Image from "next/image";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={() => onClick(product)}
      className="group cursor-pointer text-left w-full"
    >
      <div className="relative overflow-hidden rounded-lg bg-cream-dark/30 aspect-square mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-cream text-xs tracking-widest uppercase font-medium">
            View Details
          </span>
        </div>
      </div>
      <h3 className="font-serif text-lg font-semibold text-navy group-hover:text-ochre transition-colors duration-300 leading-snug">
        {product.name}
      </h3>
      <p className="text-dusty-blue text-sm font-light mt-1">
        &pound;{product.price.toFixed(2)}
      </p>
    </button>
  );
}

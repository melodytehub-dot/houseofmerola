"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { formatGBP } from "@/lib/format";
import { BagIcon } from "./icons";
import WishlistButton from "./WishlistButton";

export default function ProductCard({
  product,
  collectionName,
}: {
  product: Product;
  collectionName?: string;
}) {
  const { addItem, openCart } = useCart();
  const isBespoke = product.madeToOrder;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex h-full flex-col"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-cream-warm">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <WishlistButton product={product} />
      </div>

      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <div className="flex items-baseline justify-between gap-2">
          {collectionName ? (
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-steel">
              {collectionName}
            </p>
          ) : (
            <span />
          )}
          {product.featured && (
            <p className="shrink-0 font-serif text-[0.8rem] italic text-ochre">
              Featured
            </p>
          )}
        </div>
        <h3 className="mt-1 font-serif text-[0.95rem] font-bold leading-snug text-navy underline-offset-4 transition group-hover:text-oxblood group-hover:underline sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-1 hidden text-xs leading-relaxed text-steel sm:block sm:line-clamp-2">
          {product.tagline}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 sm:pt-4">
          <span className="text-sm font-semibold tabular-nums text-navy sm:text-base">
            {isBespoke ? "Made to order" : formatGBP(product.price)}
          </span>
          {isBespoke ? (
            <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-oxblood underline-offset-4 transition group-hover:underline">
              Enquire
            </span>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-cream transition hover:bg-oxblood active:scale-95"
            >
              <BagIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <span className="mt-3 block h-px w-full origin-left scale-x-0 bg-ochre/60 transition-transform duration-500 ease-out group-hover:scale-x-100" />
    </Link>
  );
}

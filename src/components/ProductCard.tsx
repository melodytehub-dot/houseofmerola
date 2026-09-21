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
      className="group flex h-full flex-col rounded-lg border border-navy/10 bg-cream-soft p-3 text-center transition duration-300 hover:-translate-y-1 hover:border-ochre/50 hover:shadow-[0_22px_45px_rgb(14_42_77/0.14)] sm:p-4"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-cream-warm">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-1/2 top-3 -translate-x-1/2 border border-ochre-soft/70 bg-navy-deep/80 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ochre-soft">
            Featured
          </span>
        )}
        <WishlistButton product={product} />
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        {collectionName && (
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-steel">
            {collectionName}
          </p>
        )}
        <h3 className="mt-1.5 font-serif text-[0.95rem] font-bold leading-snug tracking-tight text-navy transition group-hover:text-oxblood sm:text-xl">
          {product.name}
        </h3>
        <p className="mx-auto mt-1 hidden max-w-[26ch] text-xs leading-relaxed text-steel sm:block sm:line-clamp-2">
          {product.tagline}
        </p>
        <div className="mx-auto mt-3 flex w-full max-w-[220px] items-center justify-center gap-2 border-t border-navy/10 pt-3">
          <span className="block h-1.5 w-1.5 rotate-45 border border-ochre/70" aria-hidden="true" />
          <span className="text-sm font-semibold tabular-nums text-navy sm:text-base">
            {isBespoke ? "Made to order" : formatGBP(product.price)}
          </span>
          <span className="block h-1.5 w-1.5 rotate-45 border border-ochre/70" aria-hidden="true" />
        </div>
        <div className="mt-auto flex justify-center pt-4">
          {isBespoke ? (
            <span className="rounded-full bg-navy px-6 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cream transition group-hover:bg-oxblood">
              Enquire
            </span>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className="flex h-10 items-center gap-2 rounded-full bg-navy px-6 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-cream shadow-[0_8px_18px_rgb(14_42_77/0.25)] transition hover:bg-oxblood active:scale-95"
            >
              <BagIcon className="h-4 w-4" />
              Add to cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

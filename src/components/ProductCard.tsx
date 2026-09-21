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
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <WishlistButton product={product} />
      </div>

      <div className="flex flex-1 flex-col border-t border-navy/20 pt-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="font-serif text-[1.05rem] font-bold leading-snug tracking-tight text-navy transition group-hover:text-oxblood sm:text-lg">
            {product.name}
          </h3>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-navy">
            {isBespoke ? "Made to order" : formatGBP(product.price)}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-steel sm:line-clamp-1">
          {collectionName ? `${collectionName} · ${product.tagline}` : product.tagline}
        </p>
        <div className="mt-auto flex items-center justify-end pt-3">
          {isBespoke ? (
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-oxblood">
              Enquire
            </span>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className="flex h-9 items-center gap-2 rounded-full bg-navy px-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-cream transition hover:bg-oxblood active:scale-[0.98]"
            >
              <BagIcon className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

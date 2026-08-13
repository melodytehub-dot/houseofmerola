"use client";

import { useWishlist } from "@/lib/wishlist";
import type { Product } from "@/lib/products";
import { HeartIcon } from "./icons";

interface WishlistButtonProps {
  product: Product;
  variant?: "overlay" | "inline";
  className?: string;
}

export default function WishlistButton({
  product,
  variant = "overlay",
  className = "",
}: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(product.slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  const label = active
    ? `Remove ${product.name} from wishlist`
    : `Add ${product.name} to wishlist`;

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={label}
        className={`flex items-center justify-center gap-2.5 rounded-full border px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] transition ${
          active
            ? "border-ochre bg-ochre/10 text-ochre"
            : "border-navy/25 text-navy hover:border-ochre hover:text-ochre"
        } ${className}`}
      >
        <HeartIcon className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
        {active ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={label}
      className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition ${
        active
          ? "border-oxblood/40 bg-oxblood text-cream"
          : "border-navy/10 bg-cream-soft/90 text-navy hover:border-oxblood hover:text-oxblood"
      } ${className}`}
    >
      <HeartIcon className={`h-[17px] w-[17px] ${active ? "fill-current" : ""}`} />
    </button>
  );
}

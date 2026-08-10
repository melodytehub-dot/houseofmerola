"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Product } from "@/lib/products";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-cream-light rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-cream/90 hover:bg-cream text-navy transition-colors"
          aria-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 1L17 17M17 1L1 17" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-1/2 aspect-square bg-cream-dark/30">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <p className="text-dusty-blue text-xs tracking-[0.3em] uppercase font-medium mb-3">
              {product.collection
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy leading-tight mb-4">
              {product.name}
            </h2>
            <p className="text-navy/70 text-sm leading-relaxed mb-6 font-light">
              {product.description}
            </p>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-serif text-3xl font-semibold text-ochre">
                &pound;{product.price.toFixed(2)}
              </span>
            </div>
            <button className="w-full py-4 bg-navy hover:bg-navy-light text-cream text-sm font-medium tracking-widest uppercase rounded-lg transition-colors duration-300">
              Add to Cart
            </button>
            <p className="text-center text-navy/40 text-xs mt-4 tracking-wider">
              Free shipping on orders over &pound;50
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

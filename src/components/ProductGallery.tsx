"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  sources,
  alt,
}: {
  /** Ordered image URLs, the first is the hero. */
  sources: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const active = sources[index] ?? sources[0];

  return (
    <div className="space-y-3">
      <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-navy/15 bg-cream-warm shadow-[0_30px_60px_rgb(14_42_77/0.2)] sm:h-[480px] lg:h-[560px]">
        <Image
          src={active}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
      </div>

      {sources.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {sources.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1} of ${sources.length}`}
              className={`relative aspect-square overflow-hidden rounded-lg border bg-cream-warm transition ${
                i === index
                  ? "border-ochre ring-2 ring-ochre/30"
                  : "border-navy/10 hover:border-navy/30"
              }`}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

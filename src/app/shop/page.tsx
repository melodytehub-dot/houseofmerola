import Image from "next/image";
import Link from "next/link";
import { collections, getProductsByCollection } from "@/lib/products";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "The Shop",
  description:
    "Explore the House of Merola collections — hand-painted tiles, engraved botanicals and sacred art from the Mediterranean.",
};

export default function ShopPage() {
  return (
    <>
      {/* Header band */}
      <section className="border-b border-cream-dark/40 px-6 py-20 text-center sm:py-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-dusty-blue">
          Il Negozio
        </p>
        <h1 className="mt-4 font-serif text-4xl font-medium uppercase leading-tight tracking-[0.04em] text-navy sm:text-6xl sm:tracking-[0.06em]">
          The Collections
        </h1>
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="h-px w-14 bg-ochre/60" />
          <span className="text-ochre">&#10043;</span>
          <span className="h-px w-14 bg-ochre/60" />
        </div>
        <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-navy/60">
          Four collections of hand-painted tiles, engraved botanicals and
          sacred art. Wander through and find the piece for your home.
        </p>
      </section>

      {/* Editorial collection rows */}
      <section>
        {collections.map((collection, index) => {
          const count = getProductsByCollection(collection.slug).length;
          return (
            <div
              key={collection.slug}
              className={`border-b border-cream-dark/40 ${
                index % 2 === 1 ? "bg-cream-dark/10" : ""
              }`}
            >
              <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row">
                {/* Image */}
                <Link
                  href={`/shop/${collection.slug}`}
                  className={`group relative block h-72 w-full overflow-hidden md:h-[480px] md:w-1/2 ${
                    index % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={collection.bannerImage}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-navy-deep/35 transition-opacity duration-500 group-hover:bg-navy-deep/25" />
                  <span className="absolute bottom-5 left-5 flex items-center gap-2 bg-navy/70 px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-cream opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                    View collection &rarr;
                  </span>
                </Link>

                {/* Text */}
                <div
                  className={`flex flex-col justify-center px-6 py-16 md:w-1/2 md:px-14 lg:px-20 ${
                    index % 2 === 1 ? "md:order-1" : ""
                  }`}
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-ochre-dark">
                    Collezione 0{index + 1} &mdash; {count}{" "}
                    {count === 1 ? "piece" : "pieces"}
                  </p>
                  <h2 className="mt-4 font-serif text-4xl font-medium text-navy sm:text-5xl">
                    {collection.name}
                  </h2>
                  <p className="mt-3 font-serif text-lg font-light italic text-oxblood">
                    {collection.tagline}
                  </p>
                  <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-navy/65">
                    {collection.description}
                  </p>
                  <Link
                    href={`/shop/${collection.slug}`}
                    className="group mt-9 flex w-fit items-center gap-3 border-b border-navy/30 pb-1.5 text-[11px] font-medium uppercase tracking-[0.3em] text-navy transition-colors duration-300 hover:border-oxblood hover:text-oxblood"
                  >
                    Explore the collection
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-24 text-center">
        <Reveal>
          <h2 className="font-serif text-4xl font-medium text-navy sm:text-5xl">
            Not sure where to begin?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-navy/60">
            Browse the collections and start with your favourite piece.
          </p>
          <Link
            href="/shop/mediterranean-heritage"
            className="mt-9 inline-block bg-oxblood px-10 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-cream transition-all duration-500 hover:bg-oxblood-dark"
          >
            Begin with Heritage
          </Link>
        </Reveal>
      </section>
    </>
  );
}

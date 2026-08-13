import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import {
  collections,
  getCollectionBySlug,
  getProductsByCollection,
} from "@/lib/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const items = getProductsByCollection(collection.slug);

  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={collection.bannerImage}
            alt={collection.name}
            fill
            priority
            sizes="100vw"
            className="animate-kenburns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/85 to-navy-deep/65" />
        </div>
        <Reveal className="relative mx-auto max-w-4xl px-4 pb-20 pt-24 text-center sm:px-6 lg:pb-28 lg:pt-32">
          <p className="eyebrow text-ochre-soft">House of Merola</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
            {collection.name}
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.3em] text-cream/70">
            {collection.tagline}
          </p>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-cream/85">
            {collection.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-ochre px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-navy-deep transition hover:bg-ochre-soft"
            >
              Browse all pieces
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-cream/40 px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-cream transition hover:border-ochre-soft hover:text-ochre-soft"
            >
              Commission a piece
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-navy sm:text-3xl">
            {items.length} {items.length === 1 ? "piece" : "pieces"}
          </h2>
          <Link
            href="/shop"
            className="text-[0.72rem] font-medium uppercase tracking-[0.2em] text-steel transition hover:text-ochre"
          >
            All pieces →
          </Link>
        </div>
        <div className="product-grid">
          {items.map((product, index) => (
            <Reveal key={product.slug} className="h-full" delay={Math.min(index, 5) * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

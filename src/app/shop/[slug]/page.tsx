import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "./AddToCart";
import ProductCard from "@/components/ProductCard";
import { formatGBP } from "@/lib/format";
import {
  getCollectionBySlug,
  getProductBySlug,
  products,
} from "@/lib/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const collection = getCollectionBySlug(product.collection);
  const related = products
    .filter((p) => p.collection === product.collection && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs uppercase tracking-[0.18em] text-steel">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/shop" className="transition hover:text-ochre">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {collection && (
              <>
                <li>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="transition hover:text-ochre"
                  >
                    {collection.name}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
              </>
            )}
            <li className="text-navy">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-2xl border border-ochre/40"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-xl border border-navy/15 bg-cream-warm shadow-[0_30px_60px_rgb(14_42_77/0.2)]">
              <Image
                src={product.image}
                alt={product.name}
                width={900}
                height={900}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            {collection && (
              <Link
                href={`/collections/${collection.slug}`}
                className="eyebrow text-ochre transition hover:text-navy"
              >
                {collection.name}
              </Link>
            )}
            <h1 className="mt-3 font-serif text-4xl leading-tight text-navy sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-medium text-navy">
              {formatGBP(product.price)}
            </p>

            <p className="mt-6 text-[0.95rem] leading-relaxed text-navy/75">
              {product.description}
            </p>

            <div className="mt-8 space-y-2.5 border-t border-navy/10 pt-6">
              <p className="flex gap-3 text-sm text-navy/80">
                <span className="w-24 shrink-0 uppercase tracking-[0.14em] text-steel">
                  Medium
                </span>
                {product.materials.join(", ")}
              </p>
              <p className="flex gap-3 text-sm text-navy/80">
                <span className="w-24 shrink-0 uppercase tracking-[0.14em] text-steel">
                  Dispatch
                </span>
                1–3 working days
              </p>
              <p className="flex gap-3 text-sm text-navy/80">
                <span className="w-24 shrink-0 uppercase tracking-[0.14em] text-steel">
                  Delivery
                </span>
                From £3.95 · free over £50 (UK)
              </p>
            </div>

            <AddToCart product={product} />

            <div className="mt-8 rounded-xl border border-navy/10 bg-cream-soft p-5">
              <p className="text-sm leading-relaxed text-navy/75">
                <span className="font-serif text-base italic text-navy">
                  A note on handmade:
                </span>{" "}
                because every piece is made by hand, subtle variations in glaze
                and engraving are part of the charm — your tile is genuinely one
                of one.
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="mb-8">
              <div className="section-rule">
                <span className="eyebrow text-navy">You may also like</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl text-navy">
                From the same collection
              </h2>
            </div>
            <div className="product-grid">
              {related.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

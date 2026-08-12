import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <p className="brand-wordmark text-7xl text-ochre">404</p>
      <h1 className="mt-4 font-serif text-3xl text-navy sm:text-4xl">
        Questa pagina non esiste
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-steel">
        This page seems to have wandered off the coast. Let’s get you back to
        the collection.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-full bg-oxblood px-8 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood-deep"
        >
          Visit the shop
        </Link>
        <Link
          href="/"
          className="rounded-full border border-navy/25 px-8 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-navy transition hover:border-ochre hover:text-ochre"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

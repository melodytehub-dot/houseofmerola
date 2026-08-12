export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="soft-card p-8">
        <p className="mb-3 text-sm tracking-[0.28em] text-gold uppercase">FAQs</p>
        <h1 className="font-serif text-5xl text-navy">Frequently Asked Questions</h1>
        <div className="mt-6 h-px w-16 bg-gold" />
        <div className="mt-8 space-y-6 text-navy/80">
          <div>
            <h2 className="font-serif text-2xl text-navy">How long does shipping take?</h2>
            <p className="mt-2 text-base leading-7">
              Most orders ship within 2 to 4 business days. Delivery times depend on destination.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-navy">Are the pieces handmade?</h2>
            <p className="mt-2 text-base leading-7">
              Many of the pieces are handmade or finished by hand, which means each one carries
              subtle variation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

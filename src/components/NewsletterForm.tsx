"use client";

import { useId, useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const inputId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setDone(true);
      setEmail("");
    }
  };

  if (done) {
    return (
      <div className="w-full border border-ochre/40 bg-cream/5 px-6 py-6 text-center">
        <p className="font-serif text-2xl text-ochre-light">Benvenuto!</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-cream/70">
          Your 10% welcome code —{" "}
          <span className="font-semibold tracking-[0.2em] text-ochre-light">
            MEROLA10
          </span>{" "}
          — will be waiting at checkout on your first order.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 sm:flex-row"
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="min-w-0 flex-1 border border-cream/25 bg-cream/5 px-5 py-3.5 text-sm text-cream transition-colors placeholder:text-cream/40 focus:border-ochre/70 focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 bg-oxblood px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.3em] text-cream transition-colors duration-300 hover:bg-oxblood-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre"
      >
        Subscribe
      </button>
    </form>
  );
}

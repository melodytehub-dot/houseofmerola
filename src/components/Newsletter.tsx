"use client";

import { useSyncExternalStore } from "react";

const SUB_KEY = "houseofmerola-subscribed";

/* Module-level store for the subscription flag */
let subscribed = false;
let subLoaded = false;
const subListeners = new Set<() => void>();

function getSubSnapshot(): boolean {
  if (!subLoaded) {
    subLoaded = true;
    try {
      subscribed = window.localStorage.getItem(SUB_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
  }
  return subscribed;
}

function subscribeSub(listener: () => void): () => void {
  subListeners.add(listener);
  return () => subListeners.delete(listener);
}

function markSubscribed() {
  subscribed = true;
  try {
    window.localStorage.setItem(SUB_KEY, "1");
  } catch {
    /* storage unavailable */
  }
  subListeners.forEach((l) => l());
}

export default function Newsletter() {
  const isSubscribed = useSyncExternalStore(
    subscribeSub,
    getSubSnapshot,
    () => false,
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      "newsletter-email",
    ) as HTMLInputElement;
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.focus();
      return;
    }
    markSubscribed();
  };

  return (
    <section className="grain relative overflow-hidden bg-navy text-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "url(/images/collection-botanical.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="eyebrow mb-4 text-ochre-soft">✦ Join the House ✦</p>
        <h2 className="font-serif text-3xl leading-tight text-cream sm:text-4xl">
          Welcome into the House of Merola
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cream/75">
          New collections, studio notes and early access — and a{" "}
          <span className="text-ochre-soft">10% welcome code</span> on your
          first order.
        </p>

        {isSubscribed ? (
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-ochre/50 bg-navy-deep/60 px-6 py-6 backdrop-blur-sm">
            <p className="text-lg">Benvenuti! 🫒</p>
            <p className="mt-2 text-sm text-cream/80">
              You’re on the list. Use this code at checkout:
            </p>
            <p className="brand-wordmark mt-3 inline-block rounded-md border border-dashed border-ochre/70 bg-cream/10 px-6 py-2.5 text-xl text-ochre-soft">
              MEROLA10
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            noValidate
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="newsletter-email"
              type="email"
              placeholder="Your email address"
              className="min-w-0 flex-1 rounded-full border border-cream/25 bg-cream/10 px-5 py-3.5 text-sm text-cream placeholder:text-cream/50 focus:border-ochre focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-ochre px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-navy-deep transition hover:bg-ochre-soft"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="mt-6 text-[0.68rem] tracking-wide text-cream/50">
          No spam — only beautiful things. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

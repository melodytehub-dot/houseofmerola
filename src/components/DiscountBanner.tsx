"use client";

import { useState, useSyncExternalStore } from "react";
import Reveal from "@/components/Reveal";
import { OliveIcon } from "./icons";

const JOINED_KEY = "houseofmerola-discount-joined";

let joined = false;
let joinedLoaded = false;
const joinedListeners = new Set<() => void>();

function getJoinedSnapshot(): boolean {
  if (!joinedLoaded) {
    joinedLoaded = true;
    try {
      joined = window.localStorage.getItem(JOINED_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
  }
  return joined;
}

function subscribeJoined(listener: () => void): () => void {
  joinedListeners.add(listener);
  return () => joinedListeners.delete(listener);
}

function markJoined() {
  joined = true;
  try {
    window.localStorage.setItem(JOINED_KEY, "1");
  } catch {
    /* storage unavailable */
  }
  joinedListeners.forEach((l) => l());
}

const STEPS = [
  { n: "01", text: "Share your email below" },
  { n: "02", text: "Tap the verification link we send you" },
  { n: "03", text: "Receive your personal code by email" },
];

export default function DiscountBanner() {
  const hasJoined = useSyncExternalStore(subscribeJoined, getJoinedSnapshot, () => false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/discount/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "discount", sendVerification: true }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        alreadyVerified?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again in a moment.");
        return;
      }
      setAlreadyVerified(!!data.alreadyVerified);
      markJoined();
    } catch {
      setError("We couldn’t reach the studio. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-label="House discount" className="grain relative overflow-hidden border-y border-ochre/25 bg-navy-deep text-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "url(/images/collection-mediterranean.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-navy-deep/60" />
      <Reveal className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div>
          <p className="eyebrow mb-4 text-ochre-soft">● Members of the House ●</p>
          <h2 className="font-serif text-3xl font-bold italic leading-tight sm:text-4xl lg:text-[2.75rem]">
            Enjoy <span className="text-ochre-soft">up to 20% off</span> your first piece
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-cream/75">
            Join the House list and we’ll send a verification link to your inbox.
            Once verified, the studio will issue your personal discount code —
            one code per email, to use at checkout.
          </p>
          <ol className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            {STEPS.map((s) => (
              <li key={s.n} className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-cream/70">
                <span className="font-serif text-sm italic text-ochre-soft">{s.n}</span>
                {s.text}
              </li>
            ))}
          </ol>
        </div>

        <div className="min-w-0">
          {hasJoined ? (
            <div className="rounded-2xl border border-ochre/50 bg-navy/60 p-7 text-center backdrop-blur-sm sm:p-8">
              <OliveIcon className="mx-auto h-8 w-8 text-ochre-soft" />
              <p className="mt-3 font-serif text-2xl italic text-cream">
                {alreadyVerified ? "You’re already on the list" : "Controlla la tua email"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-cream/75">
                {alreadyVerified
                  ? "This email is verified — watch your inbox, your personal code is on its way."
                  : "We’ve sent a verification link to your inbox. Tap it within 48 hours and your personal code will follow."}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-cream/15 bg-cream/[0.06] p-6 backdrop-blur-sm sm:p-8"
            >
              <label
                htmlFor="discount-email"
                className="mb-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-cream/70"
              >
                Email address
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="discount-email"
                  name="discount-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-full border border-cream/25 bg-navy-deep/60 px-5 py-3.5 text-sm text-cream placeholder:text-cream/40 focus:border-ochre focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="shrink-0 rounded-full bg-ochre px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-navy-deep transition hover:bg-ochre-soft disabled:opacity-60"
                >
                  {busy ? "Joining…" : "Claim mine"}
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-ochre-soft">{error}</p>}
              <p className="mt-4 text-[0.68rem] leading-relaxed tracking-wide text-cream/50">
                One code per email · codes are single-use and checked against your checkout email · no spam, unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}

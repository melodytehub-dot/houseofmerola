"use client";

import { useState } from "react";
import { OliveIcon } from "./icons";

const JOINED_KEY = "houseofmerola-discount-joined";

export function markDiscountJoined() {
  try {
    window.localStorage.setItem(JOINED_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

export function hasDiscountJoined(): boolean {
  try {
    return window.localStorage.getItem(JOINED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The single House-list signup: one email address joins the newsletter and,
 * via the verification link, becomes eligible for a personal discount code.
 * Shared by the first-visit popup and the pre-footer section.
 */
export default function DiscountSignupForm({
  tone,
  idPrefix,
  onJoined,
}: {
  tone: "dark" | "light";
  idPrefix: string;
  onJoined?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [joined, setJoined] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  const dark = tone === "dark";

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
      setJoined(true);
      markDiscountJoined();
      onJoined?.();
    } catch {
      setError("We couldn’t reach the studio. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (joined) {
    return (
      <div
        className={`rounded-2xl border p-7 text-center sm:p-8 ${
          dark ? "border-ochre/50 bg-navy-deep/60" : "border-ochre/50 bg-cream"
        }`}
      >
        <OliveIcon className={`mx-auto h-8 w-8 ${dark ? "text-ochre-soft" : "text-ochre"}`} />
        <p className={`mt-3 font-serif text-2xl italic ${dark ? "text-cream" : "text-navy"}`}>
          {alreadyVerified ? "You’re already on the list" : "Controlla la tua email"}
        </p>
        <p className={`mx-auto mt-2 max-w-sm text-sm leading-relaxed ${dark ? "text-cream/75" : "text-navy/70"}`}>
          {alreadyVerified
            ? "This email is verified — watch your inbox for studio news and your personal code."
            : "We’ve sent a verification link to your inbox. Tap it within 48 hours to join the list and receive your personal code."}
        </p>
      </div>
    );
  }

  const inputId = `${idPrefix}-email`;
  return (
    <form onSubmit={handleSubmit} noValidate>
      <label
        htmlFor={inputId}
        className={`mb-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.07em] ${
          dark ? "text-cream/70" : "text-steel"
        }`}
      >
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={inputId}
          name={inputId}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`min-w-0 flex-1 rounded-full border px-5 py-3.5 text-sm focus:border-ochre focus:outline-none ${
            dark
              ? "border-cream/25 bg-navy-deep/60 text-cream placeholder:text-cream/40"
              : "border-navy/15 bg-cream-soft text-navy placeholder:text-steel/50"
          }`}
        />
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 rounded-full bg-ochre px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-navy-deep transition hover:bg-ochre-soft disabled:opacity-60"
        >
          {busy ? "Joining…" : "Subscribe"}
        </button>
      </div>
      {error && (
        <p className={`mt-3 text-sm ${dark ? "text-ochre-soft" : "text-oxblood"}`}>{error}</p>
      )}
      <p className={`mt-4 text-[0.68rem] leading-relaxed tracking-wide ${dark ? "text-cream/50" : "text-steel/80"}`}>
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}

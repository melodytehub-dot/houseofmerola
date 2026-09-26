"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import DiscountSignupForm, { hasDiscountJoined, markDiscountJoined } from "./DiscountSignupForm";

const SEEN_KEY = "houseofmerola-popup-seen";

function hasSeen(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

/** First-visit popup: the House-list signup (news + discount code). */
export default function DiscountPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Mount-only first-visit check; the delayed open is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hasSeen() || hasDiscountJoined()) return;
    const t = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(t);
  }, []);

  const close = useCallback(() => {
    markSeen();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe to the House list"
      className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 cursor-default bg-navy-deep/60 backdrop-blur-sm"
      />
      <div className="relative max-h-[calc(100svh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-ochre/30 bg-cream p-7 text-center shadow-[0_40px_90px_rgb(8_27_51/0.45)] sm:p-9">
        <button
          type="button"
          onClick={close}
          aria-label="Close popup"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <Image
          src="/images/logo.png"
          alt="House of Merola"
          width={684}
          height={532}
          className="mx-auto h-16 w-auto"
        />
        <p className="eyebrow mb-3 mt-4 text-ochre">Welcome to the House</p>
        <h2 className="font-serif text-3xl font-bold italic leading-tight text-navy">
          News, early access <span className="text-ochre">&amp; up to 20% off</span>
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-navy/70">
          Subscribe to the House list for studio notes and first looks at new
          collections — we’ll email you a verification link so you can claim a
          personal discount code for your first piece.
        </p>
        <div className="mt-6 text-left">
          <DiscountSignupForm
            tone="light"
            idPrefix="discount-popup"
            onJoined={() => markDiscountJoined()}
          />
        </div>
      </div>
    </div>
  );
}

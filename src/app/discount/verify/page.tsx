"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { OliveIcon } from "@/components/icons";

type State = "checking" | "ok" | "failed";

function VerifyResult() {
  const params = useSearchParams();
  const [state, setState] = useState<State>("checking");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Mount-only verification from the emailed link; state is set from the
    // async result, so the effect rule is suppressed like elsewhere.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    (async () => {
      const token = params.get("token") || "";
      if (!token) {
        setState("failed");
        setError("This verification link is incomplete. Please join again from the homepage banner.");
        return;
      }
      try {
        const res = await fetch(`/api/discount/verify?token=${encodeURIComponent(token)}`);
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; email?: string; error?: string };
        if (res.ok && data.ok) {
          setEmail(data.email || "");
          setState("ok");
        } else {
          setError(data.error || "This link didn’t work. Please try again.");
          setState("failed");
        }
      } catch {
        setError("We couldn’t reach the studio. Please check your connection and try again.");
        setState("failed");
      }
    })();
  }, [params]);

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:py-28">
      <Reveal>
        <OliveIcon className={`mx-auto h-14 w-14 ${state === "failed" ? "text-steel" : "text-ochre"}`} />
        <p className="eyebrow mt-5 text-ochre">Members of the House</p>
        <h1 className="mt-3 font-serif text-4xl text-navy sm:text-5xl">
          {state === "checking" ? "Verifying…" : state === "ok" ? "Email verified" : "Link expired"}
        </h1>
        {state === "checking" ? (
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-navy/70">
            One moment while we confirm your address.
          </p>
        ) : state === "ok" ? (
          <>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-navy/70">
              Grazie{email ? ` — ${email} is` : " — you’re"} now on the House list.
              The studio will send your personal discount code (up to 20% off) to
              your inbox shortly.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-oxblood px-8 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood-deep"
              >
                Browse the collection
              </Link>
              <Link
                href="/"
                className="rounded-full border border-navy/25 px-8 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-navy transition hover:border-ochre hover:text-ochre"
              >
                Back home
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-navy/70">{error}</p>
            <div className="mt-8">
              <Link
                href="/#newsletter"
                className="rounded-full bg-navy px-8 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood"
              >
                Join again
              </Link>
            </div>
          </>
        )}
      </Reveal>
    </section>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyResult />
    </Suspense>
  );
}

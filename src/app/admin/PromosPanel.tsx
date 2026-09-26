"use client";

import { useMemo, useState } from "react";
import type { PromoCode, Subscriber } from "@/lib/site";
import { Field, TextInput, NumInput } from "./ui";

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

type PromoStatus = "Active" | "Used" | "Expired" | "Disabled";

function promoStatus(p: PromoCode, now: Date): PromoStatus {
  if (p.usedAt) return "Used";
  if (!p.active) return "Disabled";
  if (p.expiresAt <= now.toISOString()) return "Expired";
  return "Active";
}

const STATUS_CLS: Record<PromoStatus, string> = {
  Active: "bg-emerald-700/10 text-emerald-700",
  Used: "bg-navy/10 text-steel",
  Expired: "bg-oxblood/10 text-oxblood",
  Disabled: "bg-navy/10 text-steel",
};

async function jsonFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export default function PromosPanel({
  subscribers,
  promos,
  onSubscribers,
  onPromos,
  notify,
}: {
  subscribers: Subscriber[];
  promos: PromoCode[];
  onSubscribers: (s: Subscriber[]) => void;
  onPromos: (p: PromoCode[]) => void;
  notify: (msg: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [percent, setPercent] = useState(20);
  const [days, setDays] = useState(30);
  const [customCode, setCustomCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [filter, setFilter] = useState("");

  const now = useMemo(() => new Date(), []);
  const verified = useMemo(
    () =>
      subscribers
        .filter((s) => s.verified)
        .sort((a, b) => (b.verifiedAt || b.createdAt).localeCompare(a.verifiedAt || a.createdAt)),
    [subscribers],
  );
  const pending = useMemo(
    () => subscribers.filter((s) => !s.verified).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [subscribers],
  );
  const activeCodeByEmail = useMemo(() => {
    const map = new Map<string, PromoCode>();
    for (const p of promos) {
      if (promoStatus(p, now) === "Active" && !map.has(p.email.toLowerCase())) {
        map.set(p.email.toLowerCase(), p);
      }
    }
    return map;
  }, [promos, now]);

  const q = filter.trim().toLowerCase();
  const shownVerified = q ? verified.filter((s) => s.email.includes(q)) : verified;
  const shownCodes = q
    ? promos.filter((p) => p.code.toLowerCase().includes(q) || p.email.includes(q))
    : promos;

  const refresh = async () => {
    const [s, p] = await Promise.all([
      jsonFetch("/api/admin/subscribers"),
      jsonFetch("/api/admin/promos"),
    ]);
    if (s.ok) onSubscribers(s.data.subscribers ?? []);
    if (p.ok) onPromos(p.data.promos ?? []);
  };

  const issue = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    const { ok, data } = await jsonFetch("/api/admin/promos", {
      method: "POST",
      body: JSON.stringify({
        email: email.trim(),
        percentOff: percent,
        daysValid: days,
        ...(customCode.trim() ? { code: customCode.trim() } : {}),
      }),
    });
    setBusy(false);
    if (!ok || !data.ok) {
      setFormError(data?.error ?? "Could not issue the code.");
      return;
    }
    setEmail("");
    setCustomCode("");
    await refresh();
    notify(
      data.emailSent
        ? `Code ${data.promo.code} issued and emailed.`
        : `Code ${data.promo.code} issued, but the email failed to send — use Resend to retry.`,
    );
  };

  const toggleActive = async (p: PromoCode) => {
    onPromos(promos.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
    await jsonFetch("/api/admin/promos", {
      method: "PATCH",
      body: JSON.stringify({ id: p.id, active: !p.active }),
    });
    notify(p.active ? "Code disabled." : "Code enabled.");
  };

  const resend = async (p: PromoCode) => {
    notify("Sending…");
    const { ok, data } = await jsonFetch("/api/admin/promos", {
      method: "PATCH",
      body: JSON.stringify({ id: p.id, resend: true }),
    });
    notify(ok && data.emailSent ? `Code re-sent to ${p.email}.` : "The email failed to send.");
  };

  const remove = async (p: PromoCode) => {
    if (!window.confirm(`Delete code ${p.code} permanently?`)) return;
    onPromos(promos.filter((x) => x.id !== p.id));
    await jsonFetch("/api/admin/promos", {
      method: "DELETE",
      body: JSON.stringify({ id: p.id }),
    });
    notify("Code deleted.");
  };

  const removeSubscriber = async (s: Subscriber) => {
    if (!window.confirm(`Remove ${s.email} from the list?`)) return;
    onSubscribers(subscribers.filter((x) => x.id !== s.id));
    await jsonFetch("/api/admin/subscribers", {
      method: "DELETE",
      body: JSON.stringify({ id: s.id }),
    });
    notify("Subscriber removed.");
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Issue a code */}
      <section className="min-w-0 rounded-2xl border border-ochre/40 bg-cream-soft p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="eyebrow text-ochre">Promos</p>
            <h2 className="mt-1 font-serif text-2xl text-navy">Issue a discount code</h2>
          </div>
          <p className="text-xs text-steel">
            {verified.length} verified · {pending.length} awaiting verification · {promos.length} codes
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/70">
          Codes are percent-off, single-use, and only work with the checkout email
          they were issued to. Issuing emails the code to the customer automatically.
        </p>
        <form onSubmit={issue} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Field label="Customer email" hint="Verified addresses are suggested as you type.">
              <TextInput
                id="promo-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                list="promo-verified-emails"
                autoComplete="email"
              />
              <datalist id="promo-verified-emails">
                {verified.map((s) => (
                  <option key={s.id} value={s.email} />
                ))}
              </datalist>
            </Field>
          </div>
          <Field label="Discount %">
            <NumInput id="promo-percent" value={percent} min={1} max={90} step={1} onChange={(e) => setPercent(Number(e.currentTarget.value))} />
          </Field>
          <Field label="Valid for (days)">
            <NumInput id="promo-days" value={days} min={1} max={365} step={1} onChange={(e) => setDays(Number(e.currentTarget.value))} />
          </Field>
          <div className="sm:col-span-2 lg:col-span-3">
            <Field label="Custom code (optional)" hint="Blank generates one like MEROLA-K7Q2XD.">
              <TextInput
                id="promo-code"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                placeholder="Auto-generate"
              />
            </Field>
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-oxblood px-6 py-3 text-[0.7rem] font-semibold tracking-[0.18em] text-cream transition hover:bg-oxblood-deep disabled:opacity-60"
            >
              {busy ? "Issuing…" : "Issue & send"}
            </button>
          </div>
        </form>
        {formError && <p className="mt-3 text-sm text-oxblood">{formError}</p>}
      </section>

      {/* Search */}
      <div className="min-w-0">
        <Field label="Search codes and emails">
          <TextInput
            id="promo-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Type to filter…"
          />
        </Field>
      </div>

      {/* Verified list */}
      <section className="min-w-0 rounded-2xl border border-navy/10 bg-cream-soft p-5 sm:p-6">
        <h2 className="font-serif text-2xl text-navy">Ready to reward</h2>
        <p className="mt-1 text-sm text-navy/70">
          Verified emails — pick one to issue a code. New verifications pop up here automatically.
        </p>
        {shownVerified.length === 0 ? (
          <p className="mt-4 rounded-xl bg-cream px-4 py-6 text-center text-sm text-steel">
            {verified.length === 0
              ? "No verified emails yet. They’ll appear here once visitors confirm the link in their inbox."
              : "No verified emails match your search."}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {shownVerified.map((s) => {
              const active = activeCodeByEmail.get(s.email.toLowerCase());
              return (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/10 bg-cream px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy">{s.email}</p>
                    <p className="mt-0.5 text-xs text-steel">
                      Verified {fmtDate(s.verifiedAt)}
                      {s.source === "newsletter" ? " · via newsletter" : " · via discount banner"}
                      {active ? ` · active code ${active.code} (${active.percentOff}%)` : " · no active code"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(s.email);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded-full border border-ochre/50 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-ochre transition hover:bg-ochre hover:text-navy-deep"
                    >
                      Issue code
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSubscriber(s)}
                      aria-label={`Remove ${s.email}`}
                      className="rounded-full border border-navy/15 px-3 py-2 text-[0.68rem] text-steel transition hover:border-oxblood hover:text-oxblood"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Codes */}
      <section className="min-w-0 rounded-2xl border border-navy/10 bg-cream-soft p-5 sm:p-6">
        <h2 className="font-serif text-2xl text-navy">Issued codes</h2>
        <p className="mt-1 text-sm text-navy/70">Single-use — a code burns itself the moment it pays for an order.</p>
        {shownCodes.length === 0 ? (
          <p className="mt-4 rounded-xl bg-cream px-4 py-6 text-center text-sm text-steel">
            No codes yet. Issue the first one above.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {shownCodes.map((p) => {
              const status = promoStatus(p, now);
              return (
                <li key={p.id} className="rounded-xl border border-navy/10 bg-cream px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-base font-semibold tracking-wider text-navy">
                          {p.code}
                        </span>
                        <span className="rounded-full bg-navy px-2.5 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] text-cream">
                          {p.percentOff}% OFF
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[0.62rem] font-medium tracking-[0.14em] ${STATUS_CLS[status]}`}>
                          {status}
                        </span>
                      </div>
                      <p className="mt-1.5 break-all text-sm text-navy/75">
                        <a href={`mailto:${p.email}`} className="text-ochre">{p.email}</a>
                      </p>
                      <p className="mt-0.5 text-xs text-steel">
                        Issued {fmtDate(p.createdAt)} ·{" "}
                        {p.usedAt
                          ? `used ${fmtDate(p.usedAt)}`
                          : `expires ${fmtDate(p.expiresAt)}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => resend(p)}
                        className="rounded-full border border-navy/20 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-navy transition hover:bg-navy hover:text-cream"
                      >
                        Re-send
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(p)}
                        disabled={!!p.usedAt}
                        className="rounded-full border border-navy/20 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-navy transition hover:bg-navy hover:text-cream disabled:opacity-40"
                      >
                        {p.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p)}
                        className="rounded-full border border-oxblood/40 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-oxblood transition hover:bg-oxblood hover:text-cream"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Awaiting verification */}
      <section className="min-w-0 rounded-2xl border border-navy/10 bg-cream-soft p-5 sm:p-6">
        <h2 className="font-serif text-2xl text-navy">Awaiting verification</h2>
        <p className="mt-1 text-sm text-navy/70">
          Joined but haven’t tapped their link yet (links last 48 hours). Codes can still be issued manually above.
        </p>
        {pending.length === 0 ? (
          <p className="mt-4 rounded-xl bg-cream px-4 py-6 text-center text-sm text-steel">
            Nobody waiting — every subscriber is verified.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {pending.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/10 bg-cream px-4 py-3 opacity-80"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-navy/80">{s.email}</p>
                  <p className="mt-0.5 text-xs text-steel">
                    Joined {fmtDate(s.createdAt)}{s.source === "newsletter" ? " · via newsletter" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeSubscriber(s)}
                  aria-label={`Remove ${s.email}`}
                  className="shrink-0 rounded-full border border-navy/15 px-3 py-2 text-[0.68rem] text-steel transition hover:border-oxblood hover:text-oxblood"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

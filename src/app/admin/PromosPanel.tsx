"use client";

import { useEffect, useMemo, useState } from "react";
import type { PromoCode, Subscriber } from "@/lib/site";
import { Field, TextArea, TextInput, NumInput } from "./ui";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Client-side twin of the server code generator (MEROLA-XXXXXX). */
function randomPromoCode(): string {
  const buf = new Uint32Array(6);
  crypto.getRandomValues(buf);
  let suffix = "";
  for (const n of buf) suffix += CODE_ALPHABET[n % CODE_ALPHABET.length];
  return `MEROLA-${suffix}`;
}

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
  const [selected, setSelected] = useState<string[]>([]);
  const [historyEmail, setHistoryEmail] = useState<string | null>(null);
  const [view, setView] = useState<"emails" | "history">("emails");
  // Broadcast composer
  const [audience, setAudience] = useState<"all" | "selected">("all");
  const [bcSubject, setBcSubject] = useState("");
  const [bcHeading, setBcHeading] = useState("");
  const [bcMessage, setBcMessage] = useState("");
  const [bcCtaLabel, setBcCtaLabel] = useState("");
  const [bcCtaUrl, setBcCtaUrl] = useState("");
  const [bcBusy, setBcBusy] = useState(false);
  const [bcError, setBcError] = useState("");

  // Pre-fill a fresh random code so the field is never empty; clearing it
  // falls back to a server-generated code on issue.
  useEffect(() => {
    // Mount-only initialisation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCustomCode(randomPromoCode());
  }, []);

  const now = useMemo(() => new Date(), []);
  const verified = useMemo(
    () =>
      subscribers
        .filter((s) => s.verified)
        .sort((a, b) => (b.verifiedAt || b.createdAt).localeCompare(a.verifiedAt || a.createdAt)),
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

  const toggleSelect = (address: string) => {
    const key = address.toLowerCase();
    setSelected((prev) => (prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]));
  };
  const selectShown = () =>
    setSelected((prev) => Array.from(new Set([...prev, ...shownVerified.map((s) => s.email.toLowerCase())])));

  const historyPromos = historyEmail
    ? promos
        .filter((p) => p.email.toLowerCase() === historyEmail.toLowerCase())
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

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
    // Bulk: every selected address gets its own generated code in one go.
    if (selected.length > 0) {
      setBusy(true);
      const { ok, data } = await jsonFetch("/api/admin/promos", {
        method: "POST",
        body: JSON.stringify({ emails: selected, percentOff: percent, daysValid: days }),
      });
      setBusy(false);
      if (!ok || !data.ok) {
        setFormError(data?.error ?? "Could not issue the codes.");
        return;
      }
      const sent = data.emailed ?? 0;
      const failed = data.failed ?? [];
      setSelected([]);
      setCustomCode(randomPromoCode());
      await refresh();
      notify(
        failed.length === 0
          ? `${data.promos.length} code${data.promos.length === 1 ? "" : "s"} issued and emailed.`
          : `${sent} emailed, ${failed.length} email${failed.length === 1 ? "" : "s"} failed — use Re-send to retry.`,
      );
      return;
    }
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
    setCustomCode(randomPromoCode());
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

  const sendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBcError("");
    const count = audience === "all" ? verified.length : selected.length;
    if (count === 0) {
      setBcError(
        audience === "all"
          ? "There are no verified emails yet."
          : "Tick at least one verified email below first.",
      );
      return;
    }
    if (!window.confirm(`Send this email to ${count} verified address${count === 1 ? "" : "es"}?`)) return;
    setBcBusy(true);
    const { ok, data } = await jsonFetch("/api/admin/broadcast", {
      method: "POST",
      body: JSON.stringify({
        audience,
        ...(audience === "selected" ? { emails: selected } : {}),
        subject: bcSubject.trim(),
        heading: bcHeading.trim(),
        message: bcMessage.trim(),
        ctaLabel: bcCtaLabel.trim(),
        ctaUrl: bcCtaUrl.trim(),
      }),
    });
    setBcBusy(false);
    if (!ok || !data.ok) {
      setBcError(data?.error ?? "Could not send the email.");
      return;
    }
    const failed = data.failed ?? [];
    notify(
      failed.length === 0
        ? `Sent to ${data.sent} address${data.sent === 1 ? "" : "es"}.`
        : `Sent to ${data.sent}, ${failed.length} failed.`,
    );
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
            {verified.length} verified · {promos.length} codes
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/70">
          Codes are percent-off, single-use, and only work with the checkout email
          they were issued to. Issuing emails the code to the customer automatically.
          Tick several verified emails below to send to them all together.
        </p>
        {selected.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-ochre/10 px-4 py-3">
            <span className="text-xs font-medium text-navy">
              Sending to {selected.length}:
            </span>
            {selected.map((address) => (
              <span
                key={address}
                className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1 text-[0.68rem] text-cream"
              >
                <span className="max-w-[12rem] truncate">{address}</span>
                <button
                  type="button"
                  onClick={() => toggleSelect(address)}
                  aria-label={`Remove ${address}`}
                  className="text-cream/70 transition hover:text-cream"
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-[0.68rem] tracking-[0.14em] text-steel underline transition hover:text-oxblood"
            >
              Clear all
            </button>
          </div>
        )}
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
            <Field
              label="Custom code (optional)"
              hint={selected.length > 0 ? "Bulk sends always generate a fresh code per address." : "A random code is filled in — edit it or clear it to auto-generate."}
            >
              <div className="flex gap-2">
                <TextInput
                  id="promo-code"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="Auto-generate"
                  disabled={selected.length > 0}
                />
                <button
                  type="button"
                  onClick={() => setCustomCode(randomPromoCode())}
                  disabled={selected.length > 0}
                  aria-label="Generate a new random code"
                  title="Generate a new random code"
                  className="shrink-0 rounded-full border border-navy/20 px-4 text-lg text-navy transition hover:border-ochre hover:text-ochre disabled:opacity-40"
                >
                  ⟳
                </button>
              </div>
            </Field>
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-oxblood px-6 py-3 text-[0.7rem] font-semibold tracking-[0.18em] text-cream transition hover:bg-oxblood-deep disabled:opacity-60"
            >
              {busy ? "Issuing…" : selected.length > 0 ? `Issue & send to ${selected.length}` : "Issue & send"}
            </button>
          </div>
        </form>
        {formError && <p className="mt-3 text-sm text-oxblood">{formError}</p>}
      </section>

      {/* Sub-tabs */}
      <div role="tablist" aria-label="Promos views" className="flex min-w-0 flex-wrap gap-2">
        {(
          [
            { id: "emails", label: "Verified emails" },
            { id: "history", label: "Code issued history" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={view === t.id}
            onClick={() => setView(t.id)}
            className={`rounded-full px-5 py-2.5 text-[0.7rem] font-medium tracking-[0.16em] transition ${
              view === t.id ? "bg-navy text-cream" : "border border-navy/20 text-navy/70 hover:border-navy/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === "emails" && (
        <>
          {/* Broadcast composer */}
          <section className="min-w-0 rounded-2xl border border-navy/10 bg-cream-soft p-5 sm:p-6">
            <p className="eyebrow text-ochre">Studio mail</p>
            <h2 className="mt-1 font-serif text-2xl text-navy">Send a promotional email</h2>
            <p className="mt-1 text-sm text-navy/70">
              Compose once — it goes out with the House template, logo included.
            </p>
            <form onSubmit={sendBroadcast} className="mt-4 grid grid-cols-1 gap-4">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Recipients">
                <button
                  type="button"
                  onClick={() => setAudience("all")}
                  aria-pressed={audience === "all"}
                  className={`rounded-full px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] transition ${
                    audience === "all" ? "bg-navy text-cream" : "border border-navy/20 text-navy/70 hover:border-navy/40"
                  }`}
                >
                  All verified ({verified.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAudience("selected")}
                  aria-pressed={audience === "selected"}
                  className={`rounded-full px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] transition ${
                    audience === "selected" ? "bg-navy text-cream" : "border border-navy/20 text-navy/70 hover:border-navy/40"
                  }`}
                >
                  Selected ticked ({selected.length})
                </button>
              </div>
              <Field label="Subject">
                <TextInput
                  id="bc-subject"
                  value={bcSubject}
                  onChange={(e) => setBcSubject(e.target.value)}
                  placeholder="e.g. New collection has landed"
                  maxLength={140}
                />
              </Field>
              <Field label="Headline">
                <TextInput
                  id="bc-heading"
                  value={bcHeading}
                  onChange={(e) => setBcHeading(e.target.value)}
                  placeholder="e.g. The Autumn Edit is here"
                  maxLength={140}
                />
              </Field>
              <Field label="Message" hint="Blank lines start a new paragraph.">
                <TextArea
                  id="bc-message"
                  rows={5}
                  value={bcMessage}
                  onChange={(e) => setBcMessage(e.target.value)}
                  placeholder="Write your news, offers and stories…"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Button label (optional)">
                  <TextInput
                    id="bc-cta-label"
                    value={bcCtaLabel}
                    onChange={(e) => setBcCtaLabel(e.target.value)}
                    placeholder="e.g. Shop new arrivals"
                    maxLength={40}
                  />
                </Field>
                <Field label="Button link (optional)" hint="A page like /shop or a full https:// link.">
                  <TextInput
                    id="bc-cta-url"
                    value={bcCtaUrl}
                    onChange={(e) => setBcCtaUrl(e.target.value)}
                    placeholder="/shop"
                    maxLength={500}
                  />
                </Field>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={bcBusy}
                  className="rounded-full bg-navy px-8 py-3 text-[0.7rem] font-semibold tracking-[0.18em] text-cream transition hover:bg-oxblood disabled:opacity-60"
                >
                  {bcBusy
                    ? "Sending…"
                    : `Send to ${audience === "all" ? verified.length : selected.length} address${(audience === "all" ? verified.length : selected.length) === 1 ? "" : "es"}`}
                </button>
              </div>
            </form>
            {bcError && <p className="mt-3 text-sm text-oxblood">{bcError}</p>}
          </section>
        </>
      )}

      {view === "history" && (
        <>
          {/* Per-email code history */}
      {historyEmail && (
        <section className="min-w-0 rounded-2xl border border-navy/25 bg-navy/[0.04] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="eyebrow text-ochre">Code history</p>
              <h2 className="mt-1 break-all font-serif text-2xl text-navy">{historyEmail}</h2>
              <p className="mt-1 text-sm text-navy/70">
                {historyPromos.length} code{historyPromos.length === 1 ? "" : "s"} sent
                {historyPromos.some((p) => p.usedAt)
                  ? ` · ${historyPromos.filter((p) => p.usedAt).length} used`
                  : ""}
                .
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHistoryEmail(null)}
              className="shrink-0 rounded-full border border-navy/20 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-navy transition hover:border-oxblood hover:text-oxblood"
            >
              Close
            </button>
          </div>
          {historyPromos.length === 0 ? (
            <p className="mt-4 rounded-xl bg-cream px-4 py-6 text-center text-sm text-steel">
              No codes have been sent to this address yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {historyPromos.map((p) => {
                const status = promoStatus(p, now);
                return (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-navy/10 bg-cream px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold tracking-wider text-navy">
                        {p.code}
                      </span>
                      <span className="rounded-full bg-navy px-2.5 py-0.5 text-[0.62rem] font-semibold tracking-[0.14em] text-cream">
                        {p.percentOff}% OFF
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[0.62rem] font-medium tracking-[0.14em] ${STATUS_CLS[status]}`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-xs text-steel">
                      Issued {fmtDate(p.createdAt)} ·{" "}
                      {p.usedAt ? `used ${fmtDate(p.usedAt)}` : `expires ${fmtDate(p.expiresAt)}`}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

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
        </>
      )}

      {view === "emails" && (
        <>
          {/* Verified list */}
      <section className="min-w-0 rounded-2xl border border-navy/10 bg-cream-soft p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-navy">Ready to reward</h2>
            <p className="mt-1 text-sm text-navy/70">
              Verified emails — tick several to send codes together, or pick one. New verifications pop up here automatically.
            </p>
          </div>
          {shownVerified.length > 0 && (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={selectShown}
                className="rounded-full border border-navy/20 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-navy transition hover:bg-navy hover:text-cream"
              >
                Select all
              </button>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="rounded-full border border-navy/20 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-navy transition hover:border-oxblood hover:text-oxblood"
                >
                  Clear ({selected.length})
                </button>
              )}
            </div>
          )}
        </div>
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
              const isSelected = selected.includes(s.email.toLowerCase());
              const sentCount = promos.filter((p) => p.email.toLowerCase() === s.email.toLowerCase()).length;
              return (
                <li
                  key={s.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-cream px-4 py-3 transition ${
                    isSelected ? "border-ochre bg-ochre/10" : "border-navy/10"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(s.email)}
                      aria-label={`Select ${s.email} for bulk send`}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#c6932b]"
                    />
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => setHistoryEmail(s.email)}
                        title="View code history"
                        className="block max-w-full truncate text-left text-sm font-medium text-navy underline decoration-ochre/50 decoration-dotted underline-offset-4 transition hover:text-ochre"
                      >
                        {s.email}
                      </button>
                      <p className="mt-0.5 text-xs text-steel">
                        Verified {fmtDate(s.verifiedAt)}
                        {s.source === "newsletter" ? " · via newsletter" : " · via discount banner"}
                        {active ? ` · active code ${active.code} (${active.percentOff}%)` : " · no active code"}
                        {sentCount > 0 ? ` · ${sentCount} sent total` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHistoryEmail(s.email)}
                      className="rounded-full border border-navy/20 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-navy transition hover:bg-navy hover:text-cream"
                    >
                      History
                    </button>
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

        </>
      )}

      {view === "history" && (
        <>
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
                        <button
                          type="button"
                          onClick={() => setHistoryEmail(p.email)}
                          title="View code history for this email"
                          className="text-left text-ochre underline decoration-ochre/50 decoration-dotted underline-offset-4 transition hover:text-navy"
                        >
                          {p.email}
                        </button>
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

        </>
      )}
    </div>
  );
}

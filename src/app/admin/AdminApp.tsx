"use client";

import { useCallback, useEffect, useState } from "react";
import type { Content, Enquiry, Order } from "@/lib/site";
import ProductsPanel from "./ProductsPanel";
import CollectionsPanel from "./CollectionsPanel";
import SettingsPanel from "./SettingsPanel";
import StripePanel from "./StripePanel";
import EnquiriesPanel from "./EnquiriesPanel";
import OrdersPanel from "./OrdersPanel";

type Tab = "products" | "collections" | "settings" | "stripe" | "enquiries" | "orders";
type Phase = "loading" | "login" | "dashboard";

const TABS: { id: Tab; label: string }[] = [
  { id: "products", label: "Products" },
  { id: "collections", label: "Collections" },
  { id: "settings", label: "Settings" },
  { id: "stripe", label: "Stripe" },
  { id: "enquiries", label: "Enquiries" },
  { id: "orders", label: "Orders" },
];

async function jsonFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export default function AdminApp() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [content, setContent] = useState<Content | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<Tab>("products");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2600);
  }, []);

  const loadDashboard = useCallback(async () => {
    const [c, e, o] = await Promise.all([
      jsonFetch("/api/admin/content"),
      jsonFetch("/api/admin/enquiries"),
      jsonFetch("/api/admin/orders"),
    ]);
    if (c.ok) setContent(c.data);
    if (e.ok) setEnquiries(e.data.enquiries ?? []);
    if (o.ok) setOrders(o.data.orders ?? []);
    setPhase("dashboard");
  }, []);

  const bootstrap = useCallback(async () => {
    const s = await jsonFetch("/api/admin/session");
    if (s.ok && s.data.enabled && s.data.authenticated) {
      await loadDashboard();
    } else {
      setPhase("login");
    }
  }, [loadDashboard]);

  useEffect(() => {
    // Mount-only bootstrapping (session check → possibly setState). This is the
    // intended single-time initialisation, so the effect rule is suppressed.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    bootstrap();
  }, [bootstrap]);

  const handleLogin = async (password: string) => {
    setBusy(true);
    setLoginError("");
    const { ok, data } = await jsonFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (ok) await loadDashboard();
    else setLoginError(data?.error ?? "Could not sign in.");
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setPhase("login");
    setContent(null);
  };

  const save = async () => {
    if (!content) return;
    setBusy(true);
    const { ok, data } = await jsonFetch("/api/admin/content", {
      method: "PUT",
      body: JSON.stringify(content),
    });
    setBusy(false);
    if (ok && data.content) {
      setContent(data.content);
      notify("Saved — live on the site.");
    } else {
      notify(data?.error ?? "Save failed.");
    }
  };

  if (phase === "loading") {
    return (
      <main className="mx-auto grid min-h-svh max-w-3xl place-items-center px-4">
        <p className="font-serif text-xl italic text-navy">Loading studio…</p>
      </main>
    );
  }

  if (phase === "login") {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4">
        <div className="rounded-2xl border border-navy/10 bg-cream-soft p-8 shadow-[0_30px_60px_rgb(14_42_77/0.12)]">
          <p className="eyebrow text-ochre">House of Merola</p>
          <h1 className="mt-2 font-serif text-3xl text-navy">Studio Admin</h1>
          <p className="mt-2 text-sm text-steel">
            Sign in to manage products, collections, settings and payments.
          </p>
          <LoginForm busy={busy} error={loginError} onSubmit={handleLogin} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-cream">
      <div className="sticky top-0 z-20 border-b border-navy/10 bg-cream-soft/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="brand-wordmark text-sm text-navy">House of Merola</p>
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-steel">
              Studio Admin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded-full bg-oxblood px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cream transition hover:bg-oxblood-deep disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-navy/20 px-4 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-navy transition hover:border-oxblood hover:text-oxblood"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition ${
                tab === t.id
                  ? "bg-navy text-cream"
                  : "text-navy/70 hover:bg-navy/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {content ? (
          tab === "products" ? (
            <ProductsPanel content={content} onChange={setContent} />
          ) : tab === "collections" ? (
            <CollectionsPanel content={content} onChange={setContent} />
          ) : tab === "settings" ? (
            <SettingsPanel content={content} onChange={setContent} />
          ) : tab === "stripe" ? (
            <StripePanel content={content} onChange={setContent} />
          ) : tab === "enquiries" ? (
            <EnquiriesPanel enquiries={enquiries} onChange={setEnquiries} notify={notify} />
          ) : (
            <OrdersPanel orders={orders} onChange={setOrders} notify={notify} />
          )
        ) : (
          <p className="py-20 text-center text-navy/60">No studio data loaded.</p>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full bg-navy-deep px-6 py-3 text-sm text-cream shadow-xl">
          {toast}
        </div>
      )}
    </main>
  );
}

function LoginForm({
  busy,
  error,
  onSubmit,
}: {
  busy: boolean;
  error: string;
  onSubmit: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(password);
      }}
    >
      <div>
        <label
          htmlFor="admin-password"
          className="mb-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel"
        >
          Admin password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-sm text-navy focus:border-ochre focus:outline-none"
          placeholder="••••••••"
        />
      </div>
      {error && <p className="text-sm text-oxblood">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-oxblood px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cream transition hover:bg-oxblood-deep disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

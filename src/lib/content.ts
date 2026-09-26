/* ────────────────────────────────────────────────────────────────
 * Runtime content accessors.
 * Admin-saved content (Postgres/Neon / local file) takes priority; the
 * compiled seed in products.ts is the starting point / fallback, so
 * the site works out of the box and reflects admin edits live.
 * ──────────────────────────────────────────────────────────────── */
import {
  collections as seedCollections,
  products as seedProducts,
} from "./products";
import {
  defaultSettings,
  defaultStripe,
  type Content,
  type Enquiry,
  type PromoCode,
  type SiteSettings,
  type StripeConfig,
  type Subscriber,
  type Order,
} from "./site";
import { readJson, writeJson } from "./store";

const CONTENT_KEY = "hm_content";
const ENQUIRIES_KEY = "hm_enquiries";
const ORDERS_KEY = "hm_orders";
const SUBSCRIBERS_KEY = "hm_subscribers";
const PROMOS_KEY = "hm_promos";

function isContent(x: unknown): x is Content {
  if (!x || typeof x !== "object") return false;
  const c = x as Content;
  return Array.isArray(c.products) && Array.isArray(c.collections) && !!c.settings && !!c.stripe;
}

type Commerce = SiteSettings["commerce"];

/** Deep-merge commerce settings so persisted data without the newer
 * fields (e.g. international carriage) keeps its values and gains safe defaults. */
function mergeCommerce(base: Commerce, stored?: Partial<Commerce>): Commerce {
  if (!stored) return base;
  const num = (v: unknown, fallback: number) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
  return {
    ...base,
    ...stored,
    currency: stored.currency ?? base.currency,
    shippingFee: num(stored.shippingFee, base.shippingFee),
    freeShippingThreshold: num(stored.freeShippingThreshold, base.freeShippingThreshold),
    internationalEnabled:
      typeof stored.internationalEnabled === "boolean"
        ? stored.internationalEnabled
        : base.internationalEnabled,
    internationalShippingFee: num(stored.internationalShippingFee, base.internationalShippingFee),
    internationalFreeShippingThreshold: num(
      stored.internationalFreeShippingThreshold,
      base.internationalFreeShippingThreshold,
    ),
  };
}

async function loadContent(): Promise<Content> {
  const stored = await readJson<Content>(CONTENT_KEY);
  if (isContent(stored)) {
    return {
      products: stored.products,
      collections: stored.collections,
      settings: {
        ...defaultSettings,
        ...stored.settings,
        commerce: mergeCommerce(defaultSettings.commerce, stored.settings?.commerce),
      },
      stripe: { ...defaultStripe, ...stored.stripe },
    };
  }
  return {
    products: seedProducts,
    collections: seedCollections,
    settings: defaultSettings,
    stripe: defaultStripe,
  };
}

export async function getContent(): Promise<Content> {
  return loadContent();
}

export async function setContent(content: Content): Promise<void> {
  await writeJson<Content>(CONTENT_KEY, content);
}

export async function getProducts() {
  return (await loadContent()).products;
}
export async function getCollections() {
  return (await loadContent()).collections;
}
export async function getSettings(): Promise<SiteSettings> {
  return (await loadContent()).settings;
}
export async function getStripe(): Promise<StripeConfig> {
  return (await loadContent()).stripe;
}
export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}
export async function getProductsByCollection(slug: string) {
  return (await getProducts()).filter((p) => p.collection === slug);
}
export async function getCollectionBySlug(slug: string) {
  return (await getCollections()).find((c) => c.slug === slug);
}

/* ── Enquiries ───────────────────────────────────────────────── */

export async function getEnquiries(): Promise<Enquiry[]> {
  const list = await readJson<Enquiry[]>(ENQUIRIES_KEY);
  return Array.isArray(list) ? list : [];
}

export async function addEnquiry(data: Omit<Enquiry, "id" | "createdAt" | "status">): Promise<Enquiry> {
  const list = await getEnquiries();
  const enquiry: Enquiry = {
    ...data,
    id: `enq_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "new",
  };
  await writeJson<Enquiry[]>(ENQUIRIES_KEY, [enquiry, ...list]);
  return enquiry;
}

export async function setEnquiryStatus(id: string, status: Enquiry["status"]): Promise<void> {
  const list = await getEnquiries();
  await writeJson<Enquiry[]>(
    ENQUIRIES_KEY,
    list.map((e) => (e.id === id ? { ...e, status } : e)),
  );
}

/* ── Orders ─────────────────────────────────────────────────── */

export async function getOrders(): Promise<Order[]> {
  const list = await readJson<Order[]>(ORDERS_KEY);
  return Array.isArray(list) ? list : [];
}

/** Idempotent upsert keyed by the Stripe session id, so retried webhooks
 * (and Stripe's at-least-once delivery) never duplicate an order. */
export async function saveOrder(order: Order): Promise<void> {
  const list = await getOrders();
  const exists = list.some((o) => o.id === order.id);
  const next = exists
    ? list.map((o) => (o.id === order.id ? { ...o, ...order } : o))
    : [order, ...list];
  await writeJson<Order[]>(ORDERS_KEY, next);
}

export async function setOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const list = await getOrders();
  await writeJson<Order[]>(
    ORDERS_KEY,
    list.map((o) => (o.id === id ? { ...o, status } : o)),
  );
}

export async function removeOrder(id: string): Promise<void> {
  const list = await getOrders();
  await writeJson<Order[]>(
    ORDERS_KEY,
    list.filter((o) => o.id !== id),
  );
}

/* ── Stripe masking / merging ────────────────────────────────── */

function maskKey(v: string): string {
  if (!v) return "";
  return v.length > 8 ? `${v.slice(0, 6)}…${v.slice(-4)}` : "••••";
}

/** Strip secret/webhook values to display-only placeholders for the admin UI. */
export function maskStripe(cfg: StripeConfig): StripeConfig {
  return {
    ...cfg,
    sandbox: {
      publishableKey: cfg.sandbox.publishableKey,
      secretKey: maskKey(cfg.sandbox.secretKey),
      webhookSecret: maskKey(cfg.sandbox.webhookSecret),
    },
    live: {
      publishableKey: cfg.live.publishableKey,
      secretKey: maskKey(cfg.live.secretKey),
      webhookSecret: maskKey(cfg.live.webhookSecret),
    },
  };
}

export function mergeStripe(current: StripeConfig, incoming: StripeConfig): StripeConfig {
  const keep = (prev: string, next: string) =>
    next === "" || next.includes("…") || next.includes("••••") ? prev : next;
  return {
    mode: incoming.mode === "live" ? "live" : "sandbox",
    sandbox: {
      publishableKey: keep(current.sandbox.publishableKey, incoming.sandbox.publishableKey),
      secretKey: keep(current.sandbox.secretKey, incoming.sandbox.secretKey),
      webhookSecret: keep(current.sandbox.webhookSecret, incoming.sandbox.webhookSecret),
    },
    live: {
      publishableKey: keep(current.live.publishableKey, incoming.live.publishableKey),
      secretKey: keep(current.live.secretKey, incoming.live.secretKey),
      webhookSecret: keep(current.live.webhookSecret, incoming.live.webhookSecret),
    },
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── Subscribers (discount banner + newsletter list) ──────────── */

export async function getSubscribers(): Promise<Subscriber[]> {
  const list = await readJson<Subscriber[]>(SUBSCRIBERS_KEY);
  return Array.isArray(list) ? list : [];
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const wanted = email.trim().toLowerCase();
  return (await getSubscribers()).find((s) => s.email.toLowerCase() === wanted) ?? null;
}

/** Insert or update the subscriber row for an email, preserving verification. */
export async function upsertSubscriber(data: {
  email: string;
  source: Subscriber["source"];
  verifyToken?: string;
  tokenExpiresAt?: string;
}): Promise<Subscriber> {
  const list = await getSubscribers();
  const email = data.email.trim().toLowerCase();
  const existing = list.find((s) => s.email.toLowerCase() === email);
  if (existing) {
    const next: Subscriber = {
      ...existing,
      email,
      source: data.source === "discount" ? "discount" : existing.source,
      ...(existing.verified
        ? {}
        : {
            verifyToken: data.verifyToken ?? existing.verifyToken,
            tokenExpiresAt: data.tokenExpiresAt ?? existing.tokenExpiresAt,
          }),
    };
    await writeJson<Subscriber[]>(
      SUBSCRIBERS_KEY,
      list.map((s) => (s.id === existing.id ? next : s)),
    );
    return next;
  }
  const sub: Subscriber = {
    id: `sub_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    email,
    source: data.source,
    verified: false,
    verifyToken: data.verifyToken,
    tokenExpiresAt: data.tokenExpiresAt,
    createdAt: new Date().toISOString(),
  };
  await writeJson<Subscriber[]>(SUBSCRIBERS_KEY, [sub, ...list]);
  return sub;
}

/** Consume a verification token; returns the subscriber or null when unknown/expired. */
export async function verifySubscriberByToken(token: string): Promise<Subscriber | null> {
  const list = await getSubscribers();
  const now = new Date().toISOString();
  const found = list.find(
    (s) =>
      !s.verified &&
      s.verifyToken === token &&
      (!s.tokenExpiresAt || s.tokenExpiresAt > now),
  );
  if (!found) return null;
  const next: Subscriber = {
    ...found,
    verified: true,
    verifiedAt: new Date().toISOString(),
    verifyToken: undefined,
    tokenExpiresAt: undefined,
  };
  await writeJson<Subscriber[]>(
    SUBSCRIBERS_KEY,
    list.map((s) => (s.id === found.id ? next : s)),
  );
  return next;
}

export async function removeSubscriber(id: string): Promise<void> {
  const list = await getSubscribers();
  await writeJson<Subscriber[]>(
    SUBSCRIBERS_KEY,
    list.filter((s) => s.id !== id),
  );
}

/* ── Promo codes (single-use, bound to one email) ─────────────── */

export async function getPromos(): Promise<PromoCode[]> {
  const list = await readJson<PromoCode[]>(PROMOS_KEY);
  return Array.isArray(list) ? list : [];
}

export async function getPromoByCode(code: string): Promise<PromoCode | null> {
  const wanted = code.trim().toUpperCase();
  return (await getPromos()).find((p) => p.code.toUpperCase() === wanted) ?? null;
}

export async function addPromo(data: Omit<PromoCode, "id" | "createdAt" | "usedAt" | "usedBySession">): Promise<PromoCode> {
  const list = await getPromos();
  const promo: PromoCode = {
    ...data,
    id: `prm_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  await writeJson<PromoCode[]>(PROMOS_KEY, [promo, ...list]);
  return promo;
}

export async function setPromoActive(id: string, active: boolean): Promise<void> {
  const list = await getPromos();
  await writeJson<PromoCode[]>(
    PROMOS_KEY,
    list.map((p) => (p.id === id ? { ...p, active } : p)),
  );
}

/** Burn a code after a successful payment so it cannot be reused. */
export async function markPromoUsed(code: string, sessionId: string): Promise<void> {
  const list = await getPromos();
  const wanted = code.trim().toUpperCase();
  await writeJson<PromoCode[]>(
    PROMOS_KEY,
    list.map((p) =>
      p.code.toUpperCase() === wanted && !p.usedAt
        ? { ...p, usedAt: new Date().toISOString(), usedBySession: sessionId }
        : p,
    ),
  );
}

export async function removePromo(id: string): Promise<void> {
  const list = await getPromos();
  await writeJson<PromoCode[]>(PROMOS_KEY, list.filter((p) => p.id !== id));
}

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
  type SiteSettings,
  type StripeConfig,
} from "./site";
import { readJson, writeJson } from "./store";

const CONTENT_KEY = "hm_content";
const ENQUIRIES_KEY = "hm_enquiries";

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

/**
 * Merge an incoming Stripe config over the stored one. Blank/marked keys are
 * left untouched so the admin can edit the UI without wiping real secrets.
 */
export function mergeStripe(current: StripeConfig, incoming: StripeConfig): StripeConfig {
  const keep = (prev: string, next: string) =>
    next === "" || next.includes("…") || next.includes("••••") ? prev : next;
  return {
    mode: incoming.mode === "live" ? "live" : "sandbox",
    enabled: Boolean(incoming.enabled),
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

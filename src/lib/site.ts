/* ────────────────────────────────────────────────────────────────
 * Site-wide editable content & commerce settings.
 * Persisted by the admin (see src/lib/store.ts) and merged over the
 * seed data so every page can be customised by the site owner.
 * ──────────────────────────────────────────────────────────────── */

export interface HeroContent {
  eyebrow: string;
  /** Render each entry as its own animated line. */
  lines: string[];
  /** A word (e.g. "soul.") wrapped in the ochre italic accent if present in a line. */
  accentWord: string;
  subheading: string;
}

export interface SiteSettings {
  siteName: string;
  /** Short strapline, e.g. "Art for a more magical home". */
  tagline: string;
  /** Announcement bar text, blank hides the bar. */
  announcement: string;
  contactEmail: string;
  footerBlurb: string;
  hero: HeroContent;
  aboutIntro: {
    heading: string;
    body: string[];
    points: string[];
  };
  commerce: {
    currency: string;
    /** United Kingdom carriage, the default delivery zone. */
    shippingFee: number;
    freeShippingThreshold: number;
    /** International / rest-of-world carriage, chosen at checkout. */
    internationalEnabled: boolean;
    internationalShippingFee: number;
    internationalFreeShippingThreshold: number;
  };
  social: {
    instagram: string;
    pinterest: string;
    tiktok: string;
  };
  metadata: {
    title: string;
    titleTemplate: string;
    description: string;
    keywords: string[];
    url: string;
  };
}

export type StripeMode = "sandbox" | "live";

export interface StripeConfig {
  mode: StripeMode;
  sandbox: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  live: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  enabled?: boolean;
}

export interface Enquiry {
  id: string;
  kind: "bespoke" | "contact";
  name: string;
  email: string;
  /** Main message / requested text for bespoke pieces. */
  text?: string;
  notes?: string;
  productName?: string;
  material?: string;
  size?: string;
  reference?: { name: string; dataUrl: string } | null;
  /** Array of enquiry bodies in the email (contact sends `message`). */
  createdAt: string;
  status: "new" | "done";
}

export type OrderStatus = "new" | "fulfilled";

export interface OrderItem {
  name: string;
  /** Unit price in major currency units (e.g. 15 for £15.00). */
  unitPrice: number;
  qty: number;
  /** Human-readable variant string, e.g. "UV-printed ceramic · 15 × 15 cm". */
  variant?: string;
}

export interface Order {
  /** Stripe Checkout session id, used as the stable, idempotency-safe key. */
  id: string;
  createdAt: string;
  email: string;
  name?: string;
  address?: string;
  city?: string;
  postcode?: string;
  deliveryZone: "uk" | "international";
  currency: string;
  /** Sum of line items before shipping, in major currency units. */
  subtotal: number;
  shipping: number;
  /** amount_total from Stripe (includes shipping), in major currency units. */
  total: number;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus?: "paid";
}

export interface Content {
  products: import("./products").Product[];
  collections: import("./products").Collection[];
  settings: SiteSettings;
  stripe: StripeConfig;
}

export const defaultSettings: SiteSettings = {
  siteName: "House of Merola",
  tagline: "Art for a more magical home.",
  announcement: "",
  contactEmail: "hello@houseofmerola.com",
  footerBlurb:
    "House of Merola artwork UV-printed onto ceramic and wood, engraved and finished by hand in our Liverpool studio, for walls that carry a little magic, somewhere between a Mediterranean house, an old apothecary and a cabinet of curiosities.",
  hero: {
    eyebrow: "The House Collection",
    lines: [
      "Mediterranean soul.",
      "Sacred & celestial.",
      "Botanical curiosities.",
    ],
    accentWord: "soul.",
    subheading:
      "House of Merola artwork UV-printed onto ceramic and wood, engraved and finished by hand in our Liverpool studio, art for a more magical home, caught between a Mediterranean house, an old apothecary and a cabinet of curiosities.",
  },
  aboutIntro: {
    heading: "From a Mediterranean house to a cabinet of curiosities",
    body: [
      "House of Merola began with the Mediterranean: lemons, saints, tiled courtyards and the colours of southern Italy. From there the collection wandered into old botanical books, natural history cabinets, celestial imagery and the strange and beautiful.",
    ],
    points: [
      "House of Merola artwork UV-printed onto ceramic",
      "UV-printed & laser-engraved wood pieces",
      "Designed & made to order in Liverpool",
      "From the Mediterranean to the mystical and curious",
    ],
  },
  commerce: {
    currency: "GBP",
    shippingFee: 3.95,
    freeShippingThreshold: 50,
    internationalEnabled: false,
    internationalShippingFee: 15,
    internationalFreeShippingThreshold: 0,
  },
  social: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    tiktok: "https://tiktok.com",
  },
  metadata: {
    title: "House of Merola · Art for a more magical home",
    titleTemplate: "%s · House of Merola",
    description:
      "House of Merola artwork UV-printed onto ceramic and wood, and laser-engraved pieces, designed and finished by hand in our Liverpool studio. From the Mediterranean to the mystical, botanical and curious, art for a more magical home.",
    keywords: [
      "House of Merola",
      "UV printed ceramic tiles",
      "laser engraved wood art",
      "bespoke personalised plaques",
      "botanical wall art",
      "Mediterranean decor",
      "sacred art tiles",
      "cabinet of curiosities",
      "mystical wall art",
      "celestial art tiles",
    ],
    url: "https://houseofmerola.vercel.app",
  },
};

export const defaultStripe: StripeConfig = {
  mode: "sandbox",
  sandbox: { publishableKey: "", secretKey: "", webhookSecret: "" },
  live: { publishableKey: "", secretKey: "", webhookSecret: "" },
};

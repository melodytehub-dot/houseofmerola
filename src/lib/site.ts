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
  /** Short strapline, e.g. "Arte · Casa · Mediterraneo". */
  tagline: string;
  /** Announcement bar text — blank hides the bar. */
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
    /** United Kingdom carriage — the default delivery zone. */
    shippingFee: number;
    freeShippingThreshold: number;
    /** International / rest-of-world carriage, chosen at checkout. */
    internationalEnabled: boolean;
    internationalShippingFee: number;
    internationalFreeShippingThreshold: number;
    /** newsletter welcome discount shown after subscribing */
    welcomeCode: string;
    welcomeCodePercent: number;
    /** Flat discount codes the shopper can enter at checkout. */
    discountCodes: Record<string, number>;
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
  /** When true and a secret key is present, checkout uses Stripe. */
  enabled: boolean;
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

export interface Content {
  products: import("./products").Product[];
  collections: import("./products").Collection[];
  settings: SiteSettings;
  stripe: StripeConfig;
}

export const defaultSettings: SiteSettings = {
  siteName: "House of Merola",
  tagline: "Arte · Casa · Mediterraneo",
  announcement: "",
  contactEmail: "hello@houseofmerola.com",
  footerBlurb:
    "Original artwork UV-printed onto ceramic and wood, engraved and finished by hand in our Liverpool studio, for walls that carry a little sunshine.",
  hero: {
    eyebrow: "The House Collection",
    lines: [
      "Mediterranean soul.",
      "Botanical beauty.",
      "Sacred tradition.",
    ],
    accentWord: "soul.",
    subheading:
      "Original artwork UV-printed onto ceramic and wood, engraved and finished by hand in our Liverpool studio — each piece carrying the cobalt, lemon and ochre of a sun-washed coast.",
  },
  aboutIntro: {
    heading: "Every tile begins with a little Sicilian light",
    body: [
      "House of Merola is a love letter to the Mediterranean: to lemon groves, cobalt majolica, and the old naturalists’ cabinets. Each piece is designed in-house and finished by hand in our Liverpool studio, so no two pieces leave the studio identical.",
    ],
    points: [
      "Original artwork UV-printed onto ceramic",
      "UV-printed & laser-engraved wood pieces",
      "Designed & made to order in Liverpool",
    ],
  },
  commerce: {
    currency: "GBP",
    shippingFee: 3.95,
    freeShippingThreshold: 50,
    internationalEnabled: false,
    internationalShippingFee: 15,
    internationalFreeShippingThreshold: 0,
    welcomeCode: "MEROLA10",
    welcomeCodePercent: 10,
    discountCodes: {
      MEROLA10: 10,
    },
  },
  social: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    tiktok: "https://tiktok.com",
  },
  metadata: {
    title: "House of Merola · Art · Casa · Mediterraneo",
    titleTemplate: "%s · House of Merola",
    description:
      "Original artwork UV-printed onto ceramic and wood, and laser-engraved pieces, designed and finished by hand in our Liverpool studio. Mediterranean soul, botanical beauty, sacred tradition.",
    keywords: [
      "House of Merola",
      "UV printed ceramic tiles",
      "laser engraved wood art",
      "bespoke personalised plaques",
      "botanical wall art",
      "Mediterranean decor",
      "sacred art tiles",
    ],
    url: "https://houseofmerola.vercel.app",
  },
};

export const defaultStripe: StripeConfig = {
  mode: "sandbox",
  enabled: false,
  sandbox: { publishableKey: "", secretKey: "", webhookSecret: "" },
  live: { publishableKey: "", secretKey: "", webhookSecret: "" },
};

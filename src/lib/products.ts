export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number; // GBP
  image: string;
  collection: string; // collection slug
  materials: string[];
  tagline: string;
  description: string;
  featured?: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bannerImage: string;
}

export const collections: Collection[] = [
  {
    slug: "mediterranean-tiles",
    name: "Mediterranean Tiles",
    tagline: "Hand-painted majolica for sun-washed walls",
    description:
      "Bright, hand-painted ceramic tiles in the spirit of Sicilian majolica: Madonnas, lemons, Ape trucks and pomegranates, each framed in cobalt and gold.",
    bannerImage: "/images/collection-mediterranean.jpg",
  },
  {
    slug: "botanical-natural-history",
    name: "Botanical & Natural History",
    tagline: "Antique study boards, engraved in gold",
    description:
      "Scholarly wall boards, painted and laser-engraved in antique gold: herbal medicine, snakes, frogs, fungi and the phases of the moon.",
    bannerImage: "/images/collection-botanical.jpg",
  },
];

export const products: Product[] = [
  // ── Mediterranean Tiles ─────────────────────────────────────────────
  {
    id: "madonna-di-sicilia-tile",
    slug: "madonna-di-sicilia-tile",
    name: "Madonna di Sicilia Tile",
    price: 15,
    image: "/images/prod-madonna-sicilia.jpg",
    collection: "mediterranean-tiles",
    materials: ["Hand-painted ceramic tile"],
    tagline: "Our Lady of Sicily, painted in cobalt and gold",
    description:
      "A serene Madonna in prayer, hand-painted in the tradition of Sicilian majolica. Cobalt and gold scrollwork frames a star-scattered mantle and a gilded halo, with sprigs of lemon blossom gathered at her feet and a coastal village glowing behind her.",
    featured: true,
  },
  {
    id: "amalfi-ape-truck",
    slug: "amalfi-ape-truck",
    name: "Amalfi Ape Truck",
    price: 14,
    image: "/images/prod-ape-truck.jpg",
    collection: "mediterranean-tiles",
    materials: ["Hand-painted ceramic tile"],
    tagline: "The little three-wheeler, loaded with lemons",
    description:
      "The iconic three-wheeled ‘Ape’ of the Amalfi coast, piled high with lemons and white blossom. Painted in cobalt, gold and leaf green, framed by ornate majolica scrollwork.",
    featured: true,
  },
  {
    id: "melograno-vase",
    slug: "melograno-vase",
    name: "Melograno Vase",
    price: 15,
    image: "/images/prod-melograno.jpg",
    collection: "mediterranean-tiles",
    materials: ["Hand-painted ceramic tile"],
    tagline: "The pomegranate, fruit of abundance",
    description:
      "A two-handled urn overflowing with ripe pomegranates, painted in deep cobalt, crimson and ochre with sliced fruit resting at its base, the old symbol of abundance at the heart of Mediterranean homes.",
  },
  {
    id: "rosato-moon-tile",
    slug: "rosato-moon-tile",
    name: "Rosato Moon Tile",
    price: 13,
    image: "/images/prod-rosato-moon.jpg",
    collection: "mediterranean-tiles",
    materials: ["Hand-painted ceramic tile"],
    tagline: "A dreaming sun cradled in a crescent moon",
    description:
      "A personified sun sleeping inside a crescent moon, floating among stars, clouds and white lilies in dusty navy, lavender and warm peach. A romantic piece for a gallery wall.",
    featured: true,
  },
  {
    id: "madonna-blue-tile",
    slug: "madonna-blue-tile",
    name: "Madonna Blue Tile",
    price: 14,
    image: "/images/prod-madonna-blue.jpg",
    collection: "mediterranean-tiles",
    materials: ["Hand-painted ceramic tile"],
    tagline: "The Virgin in prayer beneath cobalt canopy",
    description:
      "The Virgin Mary in prayer, her rosary in hand, framed by an arched canopy of cobalt scrollwork and ringed with bright lemons, green leaves and blue blossoms.",
  },
  {
    id: "limone-tile",
    slug: "limone-tile",
    name: "Limone Tile",
    price: 12,
    image: "/images/prod-lemon.jpg",
    collection: "mediterranean-tiles",
    materials: ["Hand-painted ceramic tile"],
    tagline: "Three sun-washed lemons, framed in gold",
    description:
      "Three ripe, glossy lemons among dark leaves and delicate white citrus blossom, enclosed by a border of cobalt and golden-yellow flourish scrollwork.",
    featured: true,
  },
  {
    id: "la-dolce-vita-tile",
    slug: "la-dolce-vita-tile",
    name: "La Dolce Vita Tile",
    price: 15,
    image: "/images/prod-dolce-vita.jpg",
    collection: "mediterranean-tiles",
    materials: ["Hand-painted ceramic tile"],
    tagline: "A vintage Ape truck before the colours of Amalfi",
    description:
      "‘La Dolce Vita’: a vintage lemon-laden Ape truck parked before the cliffside village of Amalfi, bordered with lemons and blue scrollwork. Playful, nostalgic, unmistakably Italian.",
  },
  {
    id: "sunset-madonna-tile",
    slug: "sunset-madonna-tile",
    name: "Sunset Madonna Tile",
    price: 15,
    image: "/images/prod-sunset-madonna.jpg",
    collection: "mediterranean-tiles",
    materials: ["Hand-painted ceramic tile"],
    tagline: "A painterly Madonna at golden hour",
    description:
      "A Madonna with rosary painted in warm, painterly light, framed by Portuguese-style cobalt-and-gold ceramic tiles with a coastal village glowing under a golden sunset.",
  },

  // ── Botanical & Natural History ─────────────────────────────────────
  {
    id: "herbolologia-medica",
    slug: "herbolologia-medica",
    name: "Herbolologia Medica",
    price: 18,
    image: "/images/prod-herbolologia.jpg",
    collection: "botanical-natural-history",
    materials: ["Painted & laser-engraved wood panel"],
    tagline: "The study of medicinal plants, engraved in gold",
    description:
      "An apothecary’s chart of healing plants, engraved in antique gold on charcoal wood: herb portraits, pestle and mortar, and the old Sicilian remedy: ‘Let food be thy medicine.’",
    featured: true,
  },
  {
    id: "snakeology",
    slug: "snakeology",
    name: "Snakeology",
    price: 18,
    image: "/images/prod-snakeology.jpg",
    collection: "botanical-natural-history",
    materials: ["Painted & laser-engraved wood panel"],
    tagline: "A naturalist’s study of snakes",
    description:
      "Anatomy, life cycle and species plates, ball python and rattlesnake, engraved in gold on black wood beneath a sun and moon, with the motto: ‘To understand a snake is to honour life.’",
  },
  {
    id: "phases-of-the-moon",
    slug: "phases-of-the-moon",
    name: "Phases of the Moon",
    price: 16,
    image: "/images/prod-phases-moon.jpg",
    collection: "botanical-natural-history",
    materials: ["Painted & laser-engraved wood panel"],
    tagline: "Eight phases, engraved in gold on black",
    description:
      "All eight phases of the moon engraved in gold on deep black, with a great moth below and a bat above, set within gothic filigree. Esoteric and quietly beautiful.",
    featured: true,
  },
  {
    id: "frogology",
    slug: "frogology",
    name: "Frogology",
    price: 18,
    image: "/images/prod-frogology.jpg",
    collection: "botanical-natural-history",
    materials: ["Painted & laser-engraved wood panel"],
    tagline: "A forest-green study of frogs",
    description:
      "Anatomy, life cycle, habitat and diet engraved in shimmering gold on deep forest green, surrounded by eight frog species within a leafy botanical border.",
  },
  {
    id: "mycology",
    slug: "mycology",
    name: "Mycology",
    price: 18,
    image: "/images/prod-mycology.jpg",
    collection: "botanical-natural-history",
    materials: ["Painted & laser-engraved wood panel"],
    tagline: "The study of fungi, from amanita to chanterelle",
    description:
      "Anatomy of a mushroom and species plates: fly agaric, chanterelle, porcini, morel and more, engraved in gold on black wood, the crown of the natural history cabinet.",
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  return products.filter((product) => product.collection === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export const DISCOUNT_CODES: Record<string, number> = {
  MEROLA10: 10,
};

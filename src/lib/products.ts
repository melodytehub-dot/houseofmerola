export interface ProductOption {
  label: string;
  priceDelta: number; // GBP added to the base price
}

export interface PersonalisationConfig {
  /** A name or short text must be provided (required field). */
  requiresText: boolean;
  textLabel: string;
  textPlaceholder: string;
  maxLength: number;
  /** Offer an optional reference / photo upload. */
  allowsImage: boolean;
  /** Offer an optional notes box. */
  notes: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number; // GBP base price
  image: string;
  /** Additional gallery images shown on the product page (the hero is `image`). */
  images?: string[];
  collection: string; // collection slug
  materials: string[];
  tagline: string;
  description: string;
  featured?: boolean;
  /** Made to order in our Liverpool studio, enquiry-led, not added straight to cart. */
  madeToOrder?: boolean;
  /** Selectable material options with price deltas. */
  materialOptions?: ProductOption[];
  /** Selectable size options with price deltas. */
  sizeOptions?: ProductOption[];
  /** Personalisation config for bespoke / personalised pieces. */
  personalisation?: PersonalisationConfig;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bannerImage: string;
  /** Seasonal / limited-run collections (e.g. Halloween) that are surfaced
   *  across the site but not counted among the core "four houses" grid. */
  temporary?: boolean;
}

/* Shared option sets so every product supports the same materials/sizes. */
const ceramicSizes: ProductOption[] = [
  { label: "15 × 15 cm", priceDelta: 0 },
  { label: "20 × 20 cm", priceDelta: 6 },
];

const boardSizes: ProductOption[] = [
  { label: "A4 · 21 × 30 cm", priceDelta: 0 },
  { label: "A3 · 30 × 42 cm", priceDelta: 10 },
];
const botanicalSizes: ProductOption[] = [
  { label: "A4 · 21 × 30 cm", priceDelta: 0 },
  { label: "A3 · 30 × 42 cm", priceDelta: 6 },
];

const ceramicMaterials: ProductOption[] = [
  { label: "UV-printed ceramic", priceDelta: 0 },
  { label: "UV-printed wood", priceDelta: 4 },
];

const woodMaterials: ProductOption[] = [
  { label: "UV-printed wood", priceDelta: 0 },
  { label: "UV-print + laser", priceDelta: 6 },
];

const engravedMaterials: ProductOption[] = [
  { label: "Laser-engraved wood", priceDelta: 0 },
  { label: "UV-print + laser", priceDelta: 6 },
];

const bespokePersonalisation: PersonalisationConfig = {
  requiresText: true,
  textLabel: "Name / text to feature",
  textPlaceholder: "e.g. Merola, or Con amore · 2026",
  maxLength: 80,
  allowsImage: true,
  notes: true,
};

export const collections: Collection[] = [
  {
    slug: "mediterranean-italian",
    name: "Mediterranean",
    tagline: "Sun-washed art of the Italian coast",
    description:
      "The soul of the house: the Amalfi coast, Sicilian groves and the joy of Italian living, in cobalt, lemon and ochre, UV-printed onto ceramic or wood in our Liverpool studio.",
    bannerImage: "/images/collection-mediterranean.jpg",
  },
  {
    slug: "sacred-mystical",
    name: "Sacred & Mystical",
    tagline: "Madonnas, moons and old devotions",
    description:
      "Our Lady in cobalt and gold, the phases of the moon and esoteric symbols, sacred and mystical pieces designed to bring quiet wonder home.",
    bannerImage: "/images/prod-madonna-sicilia.jpg",
  },
  {
    slug: "botanical-curiosities",
    name: "Cabinet of Curiosities",
    tagline: "Antique study boards from the naturalist’s cabinet",
    description:
      "Old botanical books, natural-history cabinets and the strange and beautiful: herbals, herpetology, mycology and curiosities, engraved in antique gold on dark wood.",
    bannerImage: "/images/collection-botanical.jpg",
  },
  {
    slug: "bespoke-personalised",
    name: "Bespoke & Personalised",
    tagline: "Designed & made to order in Liverpool",
    description:
      "Tell us what you have in mind: a name, a date, a reference image, and we’ll design a piece just for you, made to order in our Liverpool studio.",
    bannerImage: "/images/prod-herbolologia.jpg",
  },
  {
    slug: "halloween-strange",
    name: "Halloween & The Strange",
    tagline: "A seasonal cabinet of the strange and wonderful",
    description:
      "A temporary seasonal collection for the spookier months: curious, celestial and unsettling pieces to bewitch the house. New pieces are on their way.",
    bannerImage: "/images/prod-phases-moon.jpg",
    temporary: true,
  },
];
export const products: Product[] = [
  {
    id: "amalfi-ape-truck",
    slug: "amalfi-ape-truck",
    name: "Amalfi Ape Truck",
    price: 20,
    image: "/images/prod-ape-truck.jpg",
    collection: "mediterranean-italian",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "The little three-wheeler, loaded with lemons",
    description:
      "The iconic three-wheeled ‘Ape’ of the Amalfi coast, piled high with lemons and white blossom. Printed in cobalt, gold and leaf green, framed by ornate majolica scrollwork.",
    featured: true,
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
  },
  {
    id: "melograno-vase",
    slug: "melograno-vase",
    name: "Melograno Vase",
    price: 20,
    image: "/images/prod-melograno.jpg",
    collection: "mediterranean-italian",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "The pomegranate, fruit of abundance",
    description:
      "A two-handled urn overflowing with ripe pomegranates, printed in deep cobalt, crimson and ochre with sliced fruit resting at its base, the old symbol of abundance at the heart of Mediterranean homes.",
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
  },
  {
    id: "rosato-moon-tile",
    slug: "rosato-moon-tile",
    name: "Rosato Moon Tile",
    price: 20,
    image: "/images/prod-rosato-moon.jpg",
    collection: "mediterranean-italian",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "A dreaming sun cradled in a crescent moon",
    description:
      "A personified sun sleeping inside a crescent moon, floating among stars, clouds and white lilies in dusty navy, lavender and warm peach. A romantic piece for a gallery wall.",
    featured: true,
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
  },
  {
    id: "limone-tile",
    slug: "limone-tile",
    name: "Limone Tile",
    price: 20,
    image: "/images/prod-lemon.jpg",
    collection: "mediterranean-italian",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "Three sun-washed lemons, framed in gold",
    description:
      "Three ripe, glossy lemons among dark leaves and delicate white citrus blossom, enclosed by a border of cobalt and golden-yellow flourish scrollwork.",
    featured: true,
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
  },
  {
    id: "la-dolce-vita-tile",
    slug: "la-dolce-vita-tile",
    name: "La Dolce Vita — Amalfi Ape Ceramic Tile",
    price: 20,
    image: "/images/prod-la-dolce-vita.jpg",
    images: [
      "/images/prod-la-dolce-vita-2.jpg",
      "/images/prod-la-dolce-vita-3.jpg",
    ],
    collection: "mediterranean-italian",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "A vintage Amalfi Ape, overflowing with lemons",
    description:
      "Bring a little piece of the Italian coast home with La Dolce Vita, a decorative ceramic tile inspired by the colours and charm of southern Italy. Featuring a vintage Piaggio-style Ape overflowing with lemons against a dreamy coastal backdrop, the design is surrounded by an ornate blue, yellow and floral border reminiscent of traditional Italian ceramics. Each tile is UV printed individually in our Liverpool studio, giving the artwork rich colour and beautiful detail while retaining the character of the ceramic surface. Perfect displayed on a small easel, shelf, kitchen dresser or incorporated into a Mediterranean-inspired gallery wall. Decorative item, small variations may occur as each piece is individually produced.",
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
  },
  {
    id: "oliva-tile",
    slug: "oliva-tile",
    name: "Oliva — Mediterranean Ceramic Tile",
    price: 20,
    image: "/images/prod-oliva.jpg",
    images: [
      "/images/prod-oliva-2.jpg",
      "/images/prod-oliva-3.jpg",
    ],
    collection: "mediterranean-italian",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "A majolica jug with olive branches and blossom",
    description:
      "Inspired by traditional Italian majolica, Oliva features an ornate ceramic jug surrounded by olive branches, blossoms and rich botanical detailing. Deep cobalt blue, warm ochre and olive green create a beautifully aged Mediterranean palette, while the elaborate scrollwork gives the piece the feel of a vintage Italian ceramic discovered in a little market somewhere in Sicily. Individually UV printed in our Liverpool studio, this decorative tile works beautifully in kitchens, dining spaces, gallery walls or simply displayed on a shelf or small easel. Decorative item, small variations in colour and finish may occur as each piece is individually produced.",
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
  },

  {
    id: "madonna-di-sicilia-tile",
    slug: "madonna-di-sicilia-tile",
    name: "Madonna di Sicilia Tile",
    price: 20,
    image: "/images/prod-madonna-sicilia.jpg",
    collection: "sacred-mystical",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "Our Lady of Sicily, framed in cobalt and gold",
    description:
      "A serene Madonna in prayer, framed in the spirit of old Sicilian majolica. Cobalt and gold scrollwork frames a star-scattered mantle and a gilded halo, with sprigs of lemon blossom gathered at her feet and a coastal village glowing behind her.",
    featured: true,
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
  },
  {
    id: "madonna-celeste",
    slug: "madonna-celeste",
    name: "Madonna Celeste — Sacred Heart Wall Art",
    price: 30,
    image: "/images/prod-madonna-celeste.jpg",
    images: [
      "/images/prod-madonna-celeste-2.jpg",
      "/images/prod-madonna-celeste-3.jpg",
    ],
    collection: "sacred-mystical",
    materials: ["Original artwork UV-printed & laser-cut onto wood"],
    tagline: "A celestial Madonna, laser cut in cobalt and ivory",
    description:
      "A striking celestial interpretation of the Madonna, surrounded by roses, stars, a crescent moon and ornate vintage-inspired detailing. Madonna Celeste combines traditional Italian sacred imagery with the darker, mystical aesthetic of House of Merola. Created from wood, the intricate silhouette is laser cut and UV printed, allowing the natural texture of the material to show through the rich cobalt-blue artwork and delicate ivory detailing. Each piece is individually made and finished in our Liverpool studio, designed as a statement piece for a gallery wall, bedroom, hallway or sacred space. Small variations in colour and finish may occur as each piece is individually made.",
    featured: true,
    materialOptions: [{ label: "UV-printed & laser-cut wood", priceDelta: 0 }],
    sizeOptions: [{ label: "42 × 30 cm", priceDelta: 0 }],
  },
  {
    id: "madonna-blue-tile",
    slug: "madonna-blue-tile",
    name: "Madonna Blue Tile",
    price: 20,
    image: "/images/prod-madonna-blue.jpg",
    collection: "sacred-mystical",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "The Virgin in prayer beneath a cobalt canopy",
    description:
      "The Virgin Mary in prayer, her rosary in hand, framed by an arched canopy of cobalt scrollwork and ringed with bright lemons, green leaves and blue blossoms.",
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
  },
  {
    id: "sunset-madonna-tile",
    slug: "sunset-madonna-tile",
    name: "Sunset Madonna Tile",
    price: 20,
    image: "/images/prod-sunset-madonna.jpg",
    collection: "sacred-mystical",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "A painterly Madonna at golden hour",
    description:
      "A Madonna with rosary depicted in warm, painterly light, framed by Portuguese-style cobalt-and-gold ceramic tiles with a coastal village glowing under a golden sunset.",
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
  },
  {
    id: "phases-of-the-moon",
    slug: "phases-of-the-moon",
    name: "Phases of the Moon",
    price: 16,
    image: "/images/prod-phases-moon.jpg",
    collection: "sacred-mystical",
    materials: ["Original artwork laser-engraved onto wood"],
    tagline: "Eight phases, engraved in gold on black",
    description:
      "All eight phases of the moon engraved in gold on deep black, with a great moth below and a bat above, set within gothic filigree. Esoteric and quietly beautiful.",
    featured: true,
    materialOptions: engravedMaterials,
    sizeOptions: boardSizes,
  },

  {
    id: "herbolologia-medica",
    slug: "herbolologia-medica",
    name: "Herbolologia Medica",
    price: 14,
    image: "/images/prod-herbolologia.jpg",
    collection: "botanical-curiosities",
    materials: ["Original artwork laser-engraved onto wood"],
    tagline: "The study of medicinal plants, engraved in gold",
    description:
      "An apothecary’s chart of healing plants, engraved in antique gold on charcoal wood: herb portraits, pestle and mortar, and the old Sicilian remedy: ‘Let food be thy medicine.’",
    featured: true,
    materialOptions: engravedMaterials,
    sizeOptions: botanicalSizes,
  },
  {
    id: "snakeology",
    slug: "snakeology",
    name: "Snakeology",
    price: 14,
    image: "/images/prod-snakeology.jpg",
    collection: "botanical-curiosities",
    materials: ["Original artwork laser-engraved onto wood"],
    tagline: "A naturalist’s study of snakes",
    description:
      "Anatomy, life cycle and species plates, ball python and rattlesnake, engraved in gold on black wood beneath a sun and moon, with the motto: ‘To understand a snake is to honour life.’",
    materialOptions: engravedMaterials,
    sizeOptions: botanicalSizes,
  },
  {
    id: "frogology",
    slug: "frogology",
    name: "Frogology",
    price: 14,
    image: "/images/prod-frogology.jpg",
    collection: "botanical-curiosities",
    materials: ["Original artwork laser-engraved onto wood"],
    tagline: "A forest-green study of frogs",
    description:
      "Anatomy, life cycle, habitat and diet engraved in shimmering gold on deep forest green, surrounded by eight frog species within a leafy botanical border.",
    materialOptions: engravedMaterials,
    sizeOptions: botanicalSizes,
  },
  {
    id: "mycology",
    slug: "mycology",
    name: "Mycology",
    price: 14,
    image: "/images/prod-mycology.jpg",
    collection: "botanical-curiosities",
    materials: ["Original artwork laser-engraved onto wood"],
    tagline: "The study of fungi, from amanita to chanterelle",
    description:
      "Anatomy of a mushroom and species plates: fly agaric, chanterelle, porcini, morel and more, engraved in gold on black wood, the crown of the natural history cabinet.",
    materialOptions: engravedMaterials,
    sizeOptions: botanicalSizes,
  },

  {
    id: "personalised-ceramic-tile",
    slug: "personalised-ceramic-tile",
    name: "Personalised Ceramic Tile",
    price: 25,
    image: "/images/prod-madonna-sicilia.jpg",
    collection: "bespoke-personalised",
    materials: ["Original artwork UV-printed onto ceramic"],
    tagline: "Your name, a date or a design on ceramic",
    description:
      "A one-of-a-kind ceramic tile printed with your artwork, name or a short message. Tell us what you’d like, send a reference image and we’ll design a mock-up before you commit.",
    madeToOrder: true,
    featured: true,
    materialOptions: ceramicMaterials,
    sizeOptions: ceramicSizes,
    personalisation: bespokePersonalisation,
  },
  {
    id: "uv-wooden-plaque",
    slug: "uv-wooden-plaque",
    name: "UV-Printed Wooden Plaque / Sign",
    price: 25,
    image: "/images/prod-dolce-vita.jpg",
    collection: "bespoke-personalised",
    materials: ["Original artwork UV-printed onto wood"],
    tagline: "A wooden sign or plaque, printed with your design",
    description:
      "A wooden plaque or sign printed with your design: a name, an address, a favourite phrase. Choose a size, add a reference image and we’ll create a mock-up for your approval.",
    madeToOrder: true,
    materialOptions: woodMaterials,
    sizeOptions: boardSizes,
    personalisation: bespokePersonalisation,
  },
  {
    id: "laser-engraved-piece",
    slug: "laser-engraved-piece",
    name: "Laser-Engraved Piece",
    price: 30,
    image: "/images/prod-herbolologia.jpg",
    collection: "bespoke-personalised",
    materials: ["Original artwork laser-engraved onto wood"],
    tagline: "A name or design engraved line by line",
    description:
      "A piece engraved line by line with your name, motto or artwork. Perfect for gifts, anniversaries and keepsakes. Send your idea and a reference and we’ll draft it for you.",
    madeToOrder: true,
    featured: true,
    materialOptions: engravedMaterials,
    sizeOptions: boardSizes,
    personalisation: bespokePersonalisation,
  },
  {
    id: "mixed-uv-laser-piece",
    slug: "mixed-uv-laser-piece",
    name: "Mixed UV Print + Laser Piece",
    price: 30,
    image: "/images/prod-mycology.jpg",
    collection: "bespoke-personalised",
    materials: ["Original artwork UV-printed & laser-engraved, mixed"],
    tagline: "A combined print-and-engraved piece",
    description:
      "The best of both: a full-colour UV print combined with fine laser engraving or cutting. Ideal for a bold, layered piece made entirely to your brief.",
    madeToOrder: true,
    materialOptions: woodMaterials,
    sizeOptions: boardSizes,
    personalisation: bespokePersonalisation,
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

export const bespokeProducts = products.filter((product) => product.madeToOrder);


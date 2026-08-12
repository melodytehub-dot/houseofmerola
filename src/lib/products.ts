export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  collection: string;
  materials: string[];
  description: string;
  shortDescription: string;
  featured?: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bannerImage: string;
  accent: "navy" | "terracotta" | "ochre";
}

export const collections: Collection[] = [
  {
    slug: "sacred-art",
    name: "Sacred Art",
    tagline: "Devotional tiles and icon studies",
    description:
      "Portraits and devotional pieces shaped by old Mediterranean iconography, soft dusk light, and ornate ceramic borders.",
    bannerImage: "/prod1.jpg",
    accent: "navy",
  },
  {
    slug: "botanical-studies",
    name: "Botanical Studies",
    tagline: "Natural history rendered by hand",
    description:
      "Antique naturalist boards and hand-finished studies that feel like they were lifted from an old Sicilian cabinet of curiosities.",
    bannerImage: "/prod2.jpg",
    accent: "ochre",
  },
  {
    slug: "celestial-motifs",
    name: "Celestial Motifs",
    tagline: "Moon phases and night-sky symbols",
    description:
      "Lunar imagery, starlight, and dusky rose palettes for walls that want a little mystery.",
    bannerImage: "/prod5.jpg",
    accent: "terracotta",
  },
  {
    slug: "coastal-motifs",
    name: "Coastal Motifs",
    tagline: "Travelling tiles and seaside scenes",
    description:
      "Aperitivo coastlines, village streets, and olive-bright views collected into ceramic keepsakes.",
    bannerImage: "/prod11.jpg",
    accent: "navy",
  },
  {
    slug: "fruit-flora",
    name: "Fruit & Flora",
    tagline: "Lemons, pomegranates and blooming branches",
    description:
      "Sun-washed still lifes built from citrus, blossoms, and painterly frames that bring warmth into any room.",
    bannerImage: "/prod15.jpg",
    accent: "ochre",
  },
];

export const products: Product[] = [
  {
    id: "madonna-di-sicilia-tile",
    slug: "madonna-di-sicilia-tile",
    name: "Madonna di Sicilia Tile",
    price: 46,
    image: "/prod1.jpg",
    category: "Sacred Art",
    collection: "sacred-art",
    materials: ["Ceramic"],
    description:
      "A devotional ceramic tile with soft blue robes, lemon branches, and a haloed composition that feels lifted from a sunlit Sicilian chapel.",
    shortDescription: "A serene devotional tile with rich blue glazing and lemon blossom accents.",
    featured: true,
  },
  {
    id: "herbolologia-medica",
    slug: "herbolologia-medica",
    name: "Herbolologia Medica",
    price: 42,
    image: "/prod2.jpg",
    category: "Botanical Studies",
    collection: "botanical-studies",
    materials: ["Print", "Wood"],
    description:
      "An antique-style herbal study board celebrating medicinal plants, rendered in oxidized gold lettering and timeworn botanical detail.",
    shortDescription: "A dark, scholarly herb study with old-world typography.",
    featured: true,
  },
  {
    id: "snakeology-study",
    slug: "snakeology-study",
    name: "Snakeology Study",
    price: 44,
    image: "/prod3.jpg",
    category: "Botanical Studies",
    collection: "botanical-studies",
    materials: ["Print", "Wood"],
    description:
      "A natural-history study board devoted to snakes, with ornate border work and illustrated anatomy in a museum-poster style.",
    shortDescription: "A dark botanical board with ornate scientific detail.",
    featured: true,
  },
  {
    id: "frogology-study",
    slug: "frogology-study",
    name: "Frogology Study",
    price: 44,
    image: "/prod4.jpg",
    category: "Botanical Studies",
    collection: "botanical-studies",
    materials: ["Print", "Wood"],
    description:
      "A companion naturalist board filled with frogs, habitats, and delicate border florals, made to feel like a collector's plate for the wall.",
    shortDescription: "A museum-style frog board with a softly aged finish.",
    featured: false,
  },
  {
    id: "phases-of-the-moon",
    slug: "phases-of-the-moon",
    name: "Phases of the Moon",
    price: 52,
    image: "/prod5.jpg",
    category: "Celestial Motifs",
    collection: "celestial-motifs",
    materials: ["Print", "Wood"],
    description:
      "A moon-phase plaque in dusky coral and midnight ink, framed by moth wings, stars, and baroque botanical scrollwork.",
    shortDescription: "A celestial plaque with a vintage moon chart mood.",
    featured: true,
  },
  {
    id: "amalfi-ape-truck",
    slug: "amalfi-ape-truck",
    name: "Amalfi Ape Truck",
    price: 58,
    image: "/prod6.jpg",
    category: "Coastal Motifs",
    collection: "coastal-motifs",
    materials: ["Ceramic"],
    description:
      "A joyful ceramic tile featuring an iconic Italian Ape truck full of lemons against a sea-bright Amalfi backdrop.",
    shortDescription: "A coastal travel tile with sunshine and lemon cargo.",
    featured: true,
  },
  {
    id: "melograno-vase",
    slug: "melograno-vase",
    name: "Melograno Vase",
    price: 72,
    image: "/prod7.jpg",
    category: "Fruit & Flora",
    collection: "fruit-flora",
    materials: ["Ceramic"],
    description:
      "A pomegranate vase rendered in rich reds, cobalt scrollwork, and decorative flourishes that echo hand-painted Italian ceramics.",
    shortDescription: "A generous vase motif with ripe pomegranates and blue scrolls.",
    featured: true,
  },
  {
    id: "rosato-moon-tile",
    slug: "rosato-moon-tile",
    name: "Rosato Moon Tile",
    price: 48,
    image: "/prod8.jpg",
    category: "Celestial Motifs",
    collection: "celestial-motifs",
    materials: ["Ceramic"],
    description:
      "A rosy celestial tile where the sun and moon meet in a soft night-sky palette, ideal for a gallery wall with a romantic edge.",
    shortDescription: "A pink-and-indigo moon tile with a dreamy constellation feel.",
    featured: false,
  },
  {
    id: "mycology-study",
    slug: "mycology-study",
    name: "Mycology Study",
    price: 46,
    image: "/prod9.jpg",
    category: "Botanical Studies",
    collection: "botanical-studies",
    materials: ["Print", "Wood"],
    description:
      "A dark mycology board with luminous mushroom studies, root systems, and handwritten labels inspired by antique scientific sketches.",
    shortDescription: "A mushroom study board with a moody collector's look.",
    featured: false,
  },
  {
    id: "madonna-blue-tile",
    slug: "madonna-blue-tile",
    name: "Madonna Blue Tile",
    price: 46,
    image: "/prod10.jpg",
    category: "Sacred Art",
    collection: "sacred-art",
    materials: ["Ceramic"],
    description:
      "A classic blue-and-white Madonna tile framed by citrus leaves and fine scroll borders, designed for a bright sacred corner.",
    shortDescription: "A blue Madonna tile with crisp floral borders.",
    featured: false,
  },
  {
    id: "amalfi-coast-ape-tile",
    slug: "amalfi-coast-ape-tile",
    name: "Amalfi Coast Ape Tile",
    price: 62,
    image: "/prod11.jpg",
    category: "Coastal Motifs",
    collection: "coastal-motifs",
    materials: ["Ceramic"],
    description:
      "A travel-inspired tile with a lemon-laden Ape truck, coastal village skyline, and ornate border work that feels both playful and collected.",
    shortDescription: "A coastal tile with a vintage truck and panoramic village scene.",
    featured: false,
  },
  {
    id: "sunset-madonna-tile",
    slug: "sunset-madonna-tile",
    name: "Sunset Madonna Tile",
    price: 48,
    image: "/prod14.jpg",
    category: "Sacred Art",
    collection: "sacred-art",
    materials: ["Ceramic"],
    description:
      "A warm-toned Madonna tile with dusky sunset light, weathered patina, and a painterly, heirloom-style finish.",
    shortDescription: "A sunset devotional piece with an aged, painterly surface.",
    featured: false,
  },
  {
    id: "lemon-botanical-tile",
    slug: "lemon-botanical-tile",
    name: "Lemon Botanical Tile",
    price: 38,
    image: "/prod15.jpg",
    category: "Fruit & Flora",
    collection: "fruit-flora",
    materials: ["Ceramic"],
    description:
      "A bright lemon branch tile with glossy fruit, blue ornamentation, and fresh white blossoms framed in a timeless Mediterranean border.",
    shortDescription: "A radiant citrus tile with blue scrollwork.",
    featured: true,
  },
  {
    id: "coastal-market-tile",
    slug: "coastal-market-tile",
    name: "Coastal Market Tile",
    price: 56,
    image: "/prod6.jpg",
    category: "Coastal Motifs",
    collection: "coastal-motifs",
    materials: ["Ceramic"],
    description:
      "A second-edition seaside tile that captures the same nostalgic Mediterranean road-trip mood in a different composition.",
    shortDescription: "A travel tile that feels like a sunlit market postcard.",
    featured: false,
  },
  {
    id: "sacred-coast-tile",
    slug: "sacred-coast-tile",
    name: "Sacred Coast Tile",
    price: 54,
    image: "/prod1.jpg",
    category: "Sacred Art",
    collection: "sacred-art",
    materials: ["Ceramic"],
    description:
      "An alternate devotional edition with luminous blues, coastal light, and iconography designed for a more intimate wall arrangement.",
    shortDescription: "A devotional tile with coastal light and ornate framing.",
    featured: false,
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

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  collection: string;
  description: string;
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
    slug: "mediterranean-heritage",
    name: "Mediterranean Heritage",
    tagline: "Hand-painted Sicilian tiles and coastal ceramics",
    description:
      "Hand-painted tiles and decorative pieces inspired by the sun-kissed shores of the Mediterranean. Each piece captures the warmth of Sicilian ceramic tradition, the vibrant colours of coastal villages, and the timeless beauty of Italian craftsmanship.",
    bannerImage: "/collection2.jpg",
  },
  {
    slug: "botanical-natural-history",
    name: "Botanical & Natural History",
    tagline: "Engraved wood and painted botanical studies",
    description:
      "Engraved and painted wood pieces celebrating the natural world — from the intricate anatomy of fungi to the ancient wisdom of herbal medicine. Each piece is a tribute to the beauty and mystery of the natural sciences.",
    bannerImage: "/collection1.jpg",
  },
  {
    slug: "sacred-mystical",
    name: "Sacred & Mystical",
    tagline: "Devotional tiles, moons and sacred imagery",
    description:
      "Art pieces rooted in centuries of Mediterranean devotion and mystical symbolism. From the Virgin Mary to celestial moon phases, each work carries the weight of sacred tradition and the ethereal beauty of the divine.",
    bannerImage: "/prod1.jpg",
  },
  {
    slug: "decorative-curiosities",
    name: "Decorative Curiosities",
    tagline: "Characterful signs and decorative curiosities",
    description:
      "Unique decorative objects and signs that bring character and conversation to any space. Quirky, beautiful, and unmistakably Mediterranean — each piece tells a story.",
    bannerImage: "/prod5.jpg",
  },
];

export const products: Product[] = [
  {
    id: "sacred-art-virgin-mary",
    name: "Sacred Art Virgin Mary",
    price: 28,
    image: "/prod1.jpg",
    collection: "sacred-mystical",
    description:
      "A hand-painted ceramic tile of the Virgin Mary against a Mediterranean coastal backdrop, with gold-leaf halos and deep cobalt borders. A devotional piece to hang, prop or gift.",
  },
  {
    id: "snakeology-sign",
    name: "Snakeology Engraved Sign",
    price: 24,
    image: "/prod2.jpg",
    collection: "botanical-natural-history",
    description:
      "An engraved and painted wood sign dedicated to the study of snakes — anatomy, life cycles and species drawn in a fine antique botanical style. A quiet, curious conversation piece for the wall.",
  },
  {
    id: "herbolologia-medica",
    name: "Herbolologia Medica Sign",
    price: 26,
    image: "/prod3.jpg",
    collection: "botanical-natural-history",
    description:
      "An engraved wood sign recording the healing plants of the old apothecary — lavender, chamomile and rosemary set out in fine antique script. Botany, rendered by hand.",
  },
  {
    id: "frogology-sign",
    name: "Frogology Engraved Sign",
    price: 22,
    image: "/prod4.jpg",
    collection: "botanical-natural-history",
    description:
      "A playful engraved wood sign charting the life of frogs — from tadpole to bullfrog — drawn in careful antique style. For natural-history lovers and curious walls alike.",
  },
  {
    id: "phases-of-the-moon",
    name: "Phases of the Moon Sign",
    price: 24,
    image: "/prod5.jpg",
    collection: "sacred-mystical",
    description:
      "An engraved wood study of the lunar cycle, framed by ornate botanical borders and dotted with bats, moths and celestial marks. A little night sky for the wall.",
  },
  {
    id: "mediterranean-ape-truck",
    name: "Italian Ape Truck Tile",
    price: 18,
    image: "/prod6.jpg",
    collection: "mediterranean-heritage",
    description:
      "A hand-painted tile of the classic Italian Ape truck, loaded with lemons and patterned in blue ceramic motifs. Sunshine, set in clay.",
  },
  {
    id: "pomegranate-vase-tile",
    name: "Pomegranate Vase Tile",
    price: 16,
    image: "/prod7.jpg",
    collection: "mediterranean-heritage",
    description:
      "A hand-painted tile of a traditional vase spilling ripe pomegranates — rich blues, reds and ochres laid in the old Sicilian palette.",
  },
  {
    id: "sun-and-moon-tile",
    name: "Sun & Moon Ceramic Tile",
    price: 18,
    image: "/prod8.jpg",
    collection: "sacred-mystical",
    description:
      "A celestial tile in deep navy and rose, where sun and crescent moon meet among stars, clouds and botanical tendrils. A meditation in glaze.",
  },
  {
    id: "mycology-sign",
    name: "Mycology Engraved Sign",
    price: 26,
    image: "/prod9.jpg",
    collection: "botanical-natural-history",
    description:
      "An engraved wood sign celebrating the kingdom of fungi — mushroom species, anatomy and the quiet work of mycelium, drawn in antique naturalist style.",
  },
  {
    id: "virgin-mary-blue-tile",
    name: "Madonna Blue & White Tile",
    price: 32,
    image: "/prod10.jpg",
    collection: "sacred-mystical",
    description:
      "A hand-painted tile of the Madonna in traditional blue and white, ringed by lemons and Mediterranean botanicals. Classic ceramic artistry, glazed by hand.",
  },
  {
    id: "amalfi-ape-truck-tile",
    name: "Amalfi Coast Ape Truck Tile",
    price: 20,
    image: "/prod11.jpg",
    collection: "mediterranean-heritage",
    description:
      "A hand-painted tile of a vintage Ape truck against the Amalfi coast, piled with lemons and framed by ornate blue borders. A postcard in ceramic.",
  },
  {
    id: "virgin-mary-sunset-tile",
    name: "Madonna at Sunset Tile",
    price: 30,
    image: "/prod14.jpg",
    collection: "sacred-mystical",
    description:
      "The Virgin Mary bathed in warm sunset light above a Mediterranean village — a deeply atmospheric piece of devotional art in glaze.",
  },
  {
    id: "lemon-botanical-tile",
    name: "Lemon Botanical Tile",
    price: 15,
    image: "/prod15.jpg",
    collection: "mediterranean-heritage",
    description:
      "A hand-painted tile of lemons on the branch with white blossom, in classic blue, gold and green. Simple, sunny and timeless.",
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  return products.filter((p) => p.collection === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

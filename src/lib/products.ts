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
    tagline: "Italian heritage. Sun-drenched coasts. Timeless beauty.",
    description:
      "Hand-painted tiles and decorative pieces inspired by the sun-kissed shores of the Mediterranean. Each piece captures the warmth of Sicilian ceramic tradition, the vibrant colours of coastal villages, and the timeless beauty of Italian craftsmanship.",
    bannerImage: "/collection2.jpg",
  },
  {
    slug: "botanical-natural-history",
    name: "Botanical & Natural History",
    tagline: "Curated by nature. Rooted in botany. Inspired by wonder.",
    description:
      "Engraved and painted wood pieces celebrating the natural world — from the intricate anatomy of fungi to the ancient wisdom of herbal medicine. Each piece is a tribute to the beauty and mystery of the natural sciences.",
    bannerImage: "/collection1.jpg",
  },
  {
    slug: "sacred-mystical",
    name: "Sacred & Mystical",
    tagline: "Sacred tradition. Celestial beauty. Devotional art.",
    description:
      "Art pieces rooted in centuries of Mediterranean devotion and mystical symbolism. From the Virgin Mary to celestial moon phases, each work carries the weight of sacred tradition and the ethereal beauty of the divine.",
    bannerImage: "/prod1.jpg",
  },
  {
    slug: "decorative-curiosities",
    name: "Decorative Curiosities",
    tagline: "Timeless curiosities. Art for the soul. Objects of wonder.",
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
      "A stunning hand-painted tile featuring the Virgin Mary against a Mediterranean coastal backdrop. Gold leaf halos and ornate blue borders create a piece of timeless devotional art.",
  },
  {
    id: "snakeology-sign",
    name: "Snakeology Engraved Sign",
    price: 24,
    image: "/prod2.jpg",
    collection: "botanical-natural-history",
    description:
      "A beautifully detailed engraved and painted wood sign exploring the study of snakes. Features anatomy, life cycles, and species illustrations in an antique botanical style.",
  },
  {
    id: "herbolologia-medica",
    name: "Herbolologia Medica Sign",
    price: 26,
    image: "/prod3.jpg",
    collection: "botanical-natural-history",
    description:
      "An exquisite engraved sign documenting healing plants and their medicinal properties. Lavender, chamomile, rosemary, and more — a celebration of herbal wisdom.",
  },
  {
    id: "frogology-sign",
    name: "Frogology Engraved Sign",
    price: 22,
    image: "/prod4.jpg",
    collection: "botanical-natural-history",
    description:
      "A charming engraved and painted wood sign dedicated to the study of frogs. Featuring anatomy, life cycles, and species from tree frogs to bullfrogs.",
  },
  {
    id: "phases-of-the-moon",
    name: "Phases of the Moon Sign",
    price: 24,
    image: "/prod5.jpg",
    collection: "sacred-mystical",
    description:
      "A mystical engraved wood piece depicting the lunar cycle with ornate botanical borders. Bats, moths, and celestial symbols adorn this enchanting wall art.",
  },
  {
    id: "mediterranean-ape-truck",
    name: "Italian Ape Truck Tile",
    price: 18,
    image: "/prod6.jpg",
    collection: "mediterranean-heritage",
    description:
      "A charming hand-painted tile featuring a classic Italian Ape truck adorned with blue ceramic patterns and loaded with lemons. Pure Mediterranean joy.",
  },
  {
    id: "pomegranate-vase-tile",
    name: "Pomegranate Vase Tile",
    price: 16,
    image: "/prod7.jpg",
    collection: "mediterranean-heritage",
    description:
      "A vibrant hand-painted tile depicting a traditional Mediterranean vase overflowing with ripe pomegranates. Rich blues, reds, and ochre tones.",
  },
  {
    id: "sun-and-moon-tile",
    name: "Sun & Moon Ceramic Tile",
    price: 18,
    image: "/prod8.jpg",
    collection: "sacred-mystical",
    description:
      "A celestial tile featuring the sun and crescent moon in an embrace, surrounded by stars, clouds, and botanical elements in deep navy and rose tones.",
  },
  {
    id: "mycology-sign",
    name: "Mycology Engraved Sign",
    price: 26,
    image: "/prod9.jpg",
    collection: "botanical-natural-history",
    description:
      "A detailed engraved sign celebrating the kingdom of fungi. Features mushroom species, anatomy, and the vital ecological roles of mycelium networks.",
  },
  {
    id: "virgin-mary-blue-tile",
    name: "Madonna Blue & White Tile",
    price: 32,
    image: "/prod10.jpg",
    collection: "sacred-mystical",
    description:
      "A breathtaking hand-painted tile of the Madonna in traditional blue and white, surrounded by lemons and Mediterranean botanicals. Classic ceramic artistry.",
  },
  {
    id: "amalfi-ape-truck-tile",
    name: "Amalfi Coast Ape Truck Tile",
    price: 20,
    image: "/prod11.jpg",
    collection: "mediterranean-heritage",
    description:
      "A picturesque tile depicting a vintage Ape truck against the stunning Amalfi Coast, loaded with lemons and framed by ornate blue ceramic borders.",
  },
  {
    id: "virgin-mary-sunset-tile",
    name: "Madonna at Sunset Tile",
    price: 30,
    image: "/prod14.jpg",
    collection: "sacred-mystical",
    description:
      "The Virgin Mary bathed in warm sunset light, with a Mediterranean village backdrop. A deeply atmospheric piece of devotional art.",
  },
  {
    id: "lemon-botanical-tile",
    name: "Lemon Botanical Tile",
    price: 15,
    image: "/prod15.jpg",
    collection: "mediterranean-heritage",
    description:
      "A fresh hand-painted tile featuring lemons on the branch with white blossoms. Classic Mediterranean ceramic art in blue, gold, and green.",
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

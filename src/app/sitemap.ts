import type { MetadataRoute } from "next";
import { getCollections, getProducts, getSettings } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, products, collections] = await Promise.all([
    getSettings(),
    getProducts(),
    getCollections(),
  ]);
  const base = settings.metadata.url || "https://houseofmerola.co.uk";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/bespoke`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/shop/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionUrls: MetadataRoute.Sitemap = collections
    .filter((c) => products.some((p) => p.collection === c.slug))
    .map((c) => ({
      url: `${base}/collections/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticPages, ...productUrls, ...collectionUrls];
}

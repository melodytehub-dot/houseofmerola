import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const base = settings.metadata.url || "https://houseofmerola.co.uk";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { getCollections, getProducts, getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const base = new URL(settings.metadata.url || "https://houseofmerola.vercel.app");
  return {
    metadataBase: base,
    title: {
      default: settings.metadata.title,
      template: settings.metadata.titleTemplate,
    },
    description: settings.metadata.description,
    keywords: settings.metadata.keywords,
    openGraph: {
      title: settings.metadata.title,
      description: settings.metadata.description,
      siteName: settings.siteName,
      type: "website",
      url: base.toString(),
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metadata.title,
      description: settings.metadata.description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0E2A4D",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const settings = await getSettings();
  const collections = isAdmin ? [] : await getCollections();
  const products = isAdmin ? [] : await getProducts();
  const visibleCollections = collections.filter((c) =>
    products.some((p) => p.collection === c.slug),
  );
  const baseUrl = settings.metadata.url || "https://houseofmerola.vercel.app";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    sameAs: [
      settings.social.instagram,
      settings.social.pinterest,
      settings.social.tiktok,
    ].filter(Boolean),
  };
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="flex min-h-svh flex-col bg-cream font-sans text-navy antialiased">
        <noscript>
          <style>
            {".reveal{opacity:1!important;transform:none!important}"}
          </style>
        </noscript>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            {!isAdmin && <Header settings={settings} collections={visibleCollections} />}
            <main className="flex-1">{children}</main>
            {!isAdmin && <Footer settings={settings} collections={visibleCollections} />}
            {!isAdmin && <CartDrawer settings={settings} />}
          </WishlistProvider>
        </CartProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}

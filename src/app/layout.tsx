import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";

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

export const metadata: Metadata = {
  title: {
    default: "House of Merola · Art · Casa · Mediterraneo",
    template: "%s · House of Merola",
  },
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
  metadataBase: new URL("https://houseofmerola.com"),
  openGraph: {
    title: "House of Merola · Art · Casa · Mediterraneo",
    description:
      "Original artwork UV-printed onto ceramic and wood, and laser-engraved pieces, designed and finished by hand in our Liverpool studio.",
    siteName: "House of Merola",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E2A4D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

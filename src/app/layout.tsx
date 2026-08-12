import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart";

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
    default: "House of Merola — Art • Casa • Mediterraneo",
    template: "%s — House of Merola",
  },
  description:
    "Hand-painted ceramic tiles and gold-engraved botanical study boards, crafted in the spirit of old Sicilian majolica. Mediterranean soul, botanical beauty, sacred tradition.",
  keywords: [
    "House of Merola",
    "Sicilian majolica",
    "hand-painted ceramic tiles",
    "botanical wall art",
    "laser engraved wood art",
    "Mediterranean decor",
    "sacred art tiles",
  ],
  metadataBase: new URL("https://houseofmerola.com"),
  openGraph: {
    title: "House of Merola — Art • Casa • Mediterraneo",
    description:
      "Hand-painted ceramic tiles and gold-engraved botanical study boards, crafted in the spirit of old Sicilian majolica.",
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
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

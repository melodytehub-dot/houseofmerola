import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    default: "House of Merola — Arte • Casa • Mediterraneo",
    template: "%s — House of Merola",
  },
  description:
    "Hand-painted tiles, engraved botanicals and sacred art — crafted in the spirit of the Mediterranean. Arte, casa, Mediterraneo.",
  keywords: [
    "Mediterranean art",
    "hand-painted ceramic tiles",
    "Sicilian tiles",
    "botanical wall art",
    "sacred art",
    "Italian home decor",
    "House of Merola",
  ],
};

export const viewport: Viewport = {
  themeColor: "#16294d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable}`}
    >
      <body className="flex min-h-svh flex-col bg-cream-light font-sans text-navy antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

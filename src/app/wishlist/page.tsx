import WishlistView from "@/components/WishlistView";
import { getCollections, getProducts } from "@/lib/content";

export const metadata = {
  title: "Your Wishlist",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);
  return <WishlistView products={products} collections={collections} />;
}

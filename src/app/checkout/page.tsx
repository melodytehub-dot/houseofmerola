import CheckoutClient from "@/components/CheckoutClient";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const settings = await getSettings();
  return <CheckoutClient settings={settings} />;
}

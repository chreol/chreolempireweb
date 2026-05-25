import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Cartes Cadeaux PSN, Roblox, Steam, Nintendo au Cameroun | Chreol Empire" },
  description: "Achetez vos cartes cadeaux PSN PlayStation, iTunes App Store, Roblox, Steam, Nintendo eShop et Razer Gold à Douala. Codes authentiques garantis. Livraison WhatsApp 15-30 min. Paiement MTN MoMo.",
  keywords: ["PSN cameroun", "cartes cadeaux PSN douala", "iTunes cameroun", "Roblox cameroun", "Steam cameroun", "Nintendo eShop cameroun", "Razer Gold cameroun"],
  alternates: { canonical: "https://chreolempire.com/services/cartes-cadeaux" },
  openGraph: {
    title: "Cartes Cadeaux PSN, iTunes, Roblox — Cameroun | Chreol Empire",
    description: "Codes authentiques PSN, iTunes, Roblox, Steam. Livraison WhatsApp 15-30 min.",
    url: "https://chreolempire.com/services/cartes-cadeaux",
    images: [{ url: "/assets/PlayStation_Store_Card.webp", width: 1200, height: 630, alt: "Cartes Cadeaux PSN Roblox Steam Cameroun" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

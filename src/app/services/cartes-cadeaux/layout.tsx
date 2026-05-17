import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartes Cadeaux PSN, iTunes, Roblox, Steam, Nintendo au Cameroun",
  description: "Achetez vos cartes cadeaux PSN PlayStation, iTunes App Store, Roblox, Steam, Nintendo eShop et Razer Gold à Douala. Codes authentiques garantis. Livraison WhatsApp 15-30 min. Paiement MTN MoMo.",
  keywords: ["PSN cameroun", "cartes cadeaux PSN douala", "iTunes cameroun", "Roblox cameroun", "Steam cameroun", "Nintendo eShop cameroun", "Razer Gold cameroun"],
  openGraph: {
    title: "Cartes Cadeaux PSN, iTunes, Roblox — Cameroun | Chreol Empire",
    description: "Codes authentiques PSN, iTunes, Roblox, Steam. Livraison WhatsApp 15-30 min.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

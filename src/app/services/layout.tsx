import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Tous nos Services — Cartes Cadeaux, Crypto, PayPal | Chreol Empire" },
  description: "Découvrez tous les services Chreol Empire : cartes cadeaux PSN/Roblox/Steam, échange crypto USDT/BTC, PayPal Europe, coupons PCS/Transcash, carte UBA et paiement de factures à Douala.",
  openGraph: {
    title: "Tous nos Services | Chreol Empire Douala",
    description: "Cartes cadeaux, crypto, PayPal, coupons, UBA, factures — livraison WhatsApp 15 min.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Carte UBA Cameroun — Achat & Recharge Visa Prépayée | Chreol Empire" },
  description: "Obtenez votre carte prépayée UBA Cameroun (Segment I dès 10 500 FCFA, II 17 500 FCFA, III 25 000 FCFA) ou rechargez votre carte existante. Livraison express à Douala. Paiement Mobile Money.",
  keywords: ["carte UBA cameroun", "UBA prépayée douala", "recharge UBA cameroun", "carte UBA segment 1 2 3", "UBA visa cameroun"],
  openGraph: {
    title: "Carte UBA Cameroun Segment I, II, III | Chreol Empire",
    description: "Achat et recharge carte UBA prépayée à Douala. Paiement MTN MoMo / Orange Money.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

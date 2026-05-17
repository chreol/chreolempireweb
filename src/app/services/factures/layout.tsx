import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Paiement Factures Eneo Canal+ & Échange MoMo — Douala | Chreol Empire" },
  description: "Payez vos factures Canal+, Eneo, Camwater, StarTimes à Douala. Échangez de l'argent entre opérateurs Mobile Money (MTN, Orange, Express Union, Yoomee) sans frais. Commission 200 FCFA/facture.",
  keywords: ["paiement Canal+ cameroun", "Eneo cameroun", "Camwater cameroun", "échange MTN Orange cameroun", "échange mobile money douala"],
  openGraph: {
    title: "Factures & Échange MoMo — Canal+, Eneo, Camwater | Chreol Empire",
    description: "Payez vos factures ou échangez entre opérateurs MoMo. Commission 200 FCFA seulement.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

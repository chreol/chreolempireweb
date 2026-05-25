import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Paiement Factures Eneo Canal+ & Échange MoMo — Douala | Chreol Empire" },
  description: "Payez vos factures Canal+, Eneo, Camwater, StarTimes à Douala. Échangez de l'argent entre opérateurs Mobile Money (MTN, Orange, Express Union, Yoomee) sans frais. Commission 200 FCFA/facture.",
  keywords: ["paiement Canal+ cameroun", "Eneo cameroun", "Camwater cameroun", "échange MTN Orange cameroun", "échange mobile money douala"],
  alternates: { canonical: "https://chreolempire.com/services/factures" },
  openGraph: {
    title: "Factures & Échange MoMo — Canal+, Eneo, Camwater | Chreol Empire",
    description: "Payez vos factures ou échangez entre opérateurs MoMo. Commission 200 FCFA seulement.",
    url: "https://chreolempire.com/services/factures",
    images: [{ url: "/assets/paiement-+-facture-services.webp", width: 1200, height: 630, alt: "Paiement Factures Canal+ Eneo Camwater Cameroun" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

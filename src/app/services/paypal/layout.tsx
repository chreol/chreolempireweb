import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "PayPal Europe en FCFA — Achat & Vente au Cameroun | Chreol Empire" },
  description: "Vendez votre solde PayPal Europe contre FCFA (580 FCFA/€) ou achetez du solde PayPal (700 FCFA/€). Paiement MTN MoMo / Orange Money. Traitement en 15-30 min. Douala, Cameroun.",
  keywords: ["PayPal cameroun", "vendre PayPal FCFA", "acheter PayPal cameroun", "PayPal contre FCFA douala", "solde PayPal europe cameroun"],
  alternates: { canonical: "https://chreolempire.com/services/paypal" },
  openGraph: {
    title: "PayPal Europe ↔ FCFA | Chreol Empire Douala",
    description: "Vendez 580 FCFA/€ ou achetez 700 FCFA/€ de solde PayPal. MTN MoMo / Orange Money.",
    url: "https://chreolempire.com/services/paypal",
    images: [{ url: "/assets/Achat_VentePaypal.webp", width: 1200, height: 630, alt: "PayPal Europe contre FCFA Cameroun" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

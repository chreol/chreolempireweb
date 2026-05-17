import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acheter & Vendre Solde PayPal Europe au Cameroun",
  description: "Vendez votre solde PayPal Europe contre FCFA (580 FCFA/€) ou achetez du solde PayPal (700 FCFA/€). Paiement MTN MoMo / Orange Money. Traitement en 15-30 min. Douala, Cameroun.",
  keywords: ["PayPal cameroun", "vendre PayPal FCFA", "acheter PayPal cameroun", "PayPal contre FCFA douala", "solde PayPal europe cameroun"],
  openGraph: {
    title: "PayPal Europe ↔ FCFA | Chreol Empire Douala",
    description: "Vendez 580 FCFA/€ ou achetez 700 FCFA/€ de solde PayPal. MTN MoMo / Orange Money.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

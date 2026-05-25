import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Échange Transcash & PCS Mastercard en FCFA — Douala | Chreol Empire" },
  description: "Échangez vos coupons Transcash ou PCS Mastercard contre du FCFA à Douala. Taux garanti 440 FCFA/€. Paiement instantané MTN MoMo ou Orange Money. Cameroun.",
  keywords: ["Transcash cameroun", "PCS Mastercard cameroun", "échange Transcash FCFA", "coupon Transcash douala", "PCS contre FCFA cameroun"],
  alternates: { canonical: "https://chreolempire.com/services/coupons" },
  openGraph: {
    title: "Échange Transcash & PCS Mastercard | Chreol Empire Douala",
    description: "440 FCFA/€ garanti. Échangez vos coupons en moins de 30 min. MTN MoMo / Orange Money.",
    url: "https://chreolempire.com/services/coupons",
    images: [{ url: "/assets/contenu-pack-transcash.webp", width: 1200, height: 630, alt: "Échange Transcash PCS Cameroun" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

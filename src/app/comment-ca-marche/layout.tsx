import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Comment ça marche — Acheter & Échanger en toute sécurité | Chreol Empire" },
  description: "Guide étape par étape pour commander vos cartes cadeaux, échanger vos crypto, payer vos factures ou acheter une carte UBA via Chreol Empire. Paiement MTN MoMo ou Orange Money.",
  alternates: { canonical: "https://shop.chreolempire.com/comment-ca-marche" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Offres Spéciales & Promotions — Chreol Empire" },
  description: "Offres flash, taux bonifiés et packs exclusifs sur les cartes cadeaux PSN, Robux, V-Bucks et l'échange crypto FCFA. Durée et stock limités.",
  alternates: { canonical: "https://shop.chreolempire.com/promo" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "À Propos — Chreol Empire, le Premium Numérique depuis 2012 | Douala" },
  description: "L'histoire de Chreol Empire, la boutique numérique de référence à Douala depuis 2012. Cartes cadeaux, crypto, PayPal — Le monde digital, à portée de Mobile Money..",
  alternates: { canonical: "https://shop.chreolempire.com/a-propos" },
  openGraph: {
    title: "À Propos — Chreol Empire depuis 2012 | Douala",
    description: "Notre histoire, notre mission, notre équipe. Le premium des services digitaux camerounais.",
    url: "https://shop.chreolempire.com/a-propos",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Conditions Générales d'Utilisation | Chreol Empire" },
  description: "Conditions générales d'utilisation de la plateforme Chreol Empire : services, paiements, délais de livraison et droits des utilisateurs.",
  alternates: { canonical: "https://shop.chreolempire.com/cgu" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Politique de Confidentialité | Chreol Empire" },
  description: "Politique de confidentialité de Chreol Empire : données collectées, finalité, droits des utilisateurs et protection de la vie privée.",
  alternates: { canonical: "https://shop.chreolempire.com/confidentialite" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

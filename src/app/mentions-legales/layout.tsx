import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Mentions Légales | Chreol Empire — Douala, Cameroun" },
  description: "Mentions légales de Chreol Empire : éditeur, hébergeur, responsabilité et informations légales obligatoires.",
  alternates: { canonical: "https://shop.chreolempire.com/mentions-legales" },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

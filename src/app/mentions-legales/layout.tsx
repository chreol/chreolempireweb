import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Mentions Légales | Chreol Empire — Douala, Cameroun" },
  description: "Mentions légales de Chreol Empire : éditeur, hébergeur, responsabilité et informations légales obligatoires.",
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

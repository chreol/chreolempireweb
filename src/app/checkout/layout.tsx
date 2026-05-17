import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Paiement Mobile Money — Chreol Empire" },
  description: "Finalisez votre commande via Orange Money ou MTN MoMo. Paiement sécurisé et instantané.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

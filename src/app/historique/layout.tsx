import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Historique des Transactions | Chreol Empire" },
  description: "Retrouvez l'historique de vos commandes et transactions passées sur Chreol Empire.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

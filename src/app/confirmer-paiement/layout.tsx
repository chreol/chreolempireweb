import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Confirmer mon paiement — Chreol Empire" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

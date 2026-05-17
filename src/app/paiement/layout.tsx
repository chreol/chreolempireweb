import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Modes de Paiement — MTN MoMo, Orange Money | Chreol Empire" },
  description: "Payez avec MTN MoMo, Orange Money, Express Union, Yoomee Money ou en espèces à notre boutique Vallée 3, Deido, Douala. Paiement sécurisé pour cartes cadeaux et crypto.",
  openGraph: {
    title: "Modes de Paiement | Chreol Empire Douala",
    description: "MTN MoMo · Orange Money · Express Union · Espèces Deido, Douala.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

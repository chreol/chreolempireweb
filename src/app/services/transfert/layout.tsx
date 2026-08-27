import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Transfert d'argent du Cameroun vers l'Afrique | Chreol Empire" },
  description: "Envoyez de l'argent du Cameroun vers l'Afrique avec des frais transparents. Choisissez le pays, le réseau du bénéficiaire et recevez une assistance WhatsApp.",
  keywords: ["transfert argent cameroun afrique", "envoyer argent cameroun cote ivoire", "transfert mobile money afrique", "transfert argent douala"],
  alternates: { canonical: "https://shop.chreolempire.com/services/transfert" },
  openGraph: {
    title: "Transfert d'argent du Cameroun vers l'Afrique | Chreol Empire",
    description: "Transfert rapide et sécurisé vers plusieurs pays africains. Réseaux bénéficiaires adaptés à chaque destination.",
    url: "https://shop.chreolempire.com/services/transfert",
    images: [{ url: "/assets/Chreol%20Empire%20Transfert.png", width: 1536, height: 1024, alt: "Chreol Empire Transfer Afrique" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

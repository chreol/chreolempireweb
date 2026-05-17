import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Crypto USDT BTC FCFA Douala — 0% Commission | Chreol Empire" },
  description: "Échangez vos cryptomonnaies USDT, BTC, TRX, ETH, SOL contre FCFA à Douala. 0% commission, taux du marché en temps réel. Paiement MTN MoMo ou Orange Money. Livraison 15-30 min.",
  keywords: ["USDT FCFA", "BTC FCFA", "acheter crypto cameroun", "vendre crypto douala", "échange crypto MTN", "USDT contre CFA", "BTC orange money cameroun"],
  openGraph: {
    title: "Crypto & MoMo — USDT, BTC, TRX contre FCFA | Chreol Empire",
    description: "Achetez ou vendez vos cryptos contre FCFA. 0% commission. Paiement Mobile Money.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

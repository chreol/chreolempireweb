import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Crypto USDT BTC FCFA Douala — 0% Commission | Chreol Empire" },
  description: "Échangez vos cryptomonnaies USDT, BTC, TRX, ETH, SOL contre FCFA à Douala. 0% commission, taux du marché en temps réel. Paiement MTN MoMo ou Orange Money. Livraison 15-30 min.",
  keywords: ["USDT FCFA", "BTC FCFA", "acheter crypto cameroun", "vendre crypto douala", "échange crypto MTN", "USDT contre CFA", "BTC orange money cameroun"],
  alternates: { canonical: "https://chreolempire.com/services/crypto" },
  openGraph: {
    title: "Crypto & MoMo — USDT, BTC, TRX contre FCFA | Chreol Empire",
    description: "Achetez ou vendez vos cryptos contre FCFA. 0% commission. Paiement Mobile Money.",
    url: "https://chreolempire.com/services/crypto",
    images: [{ url: "/assets/Monnaie Crypto Chreol Empire en cfa mobile money.webp", width: 1200, height: 630, alt: "Échange Crypto USDT BTC FCFA Cameroun" }],
  },
};

const BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://chreolempire.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://chreolempire.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Crypto & MoMo", "item": "https://chreolempire.com/services/crypto" },
  ],
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Échange Crypto FCFA — USDT BTC TRX",
  "description": "Achetez ou vendez vos cryptomonnaies (USDT, BTC, TRX) contre FCFA à Douala. 0% commission, paiement MTN MoMo ou Orange Money.",
  "provider": { "@type": "LocalBusiness", "name": "Chreol Empire", "address": { "@type": "PostalAddress", "addressLocality": "Douala", "addressCountry": "CM" } },
  "areaServed": { "@type": "Country", "name": "Cameroun" },
  "offers": [
    { "@type": "Offer", "name": "Achat USDT TRC20", "description": "Achetez de l'USDT TRC20 en FCFA. Taux : 700 FCFA/$", "priceCurrency": "XAF", "seller": { "@type": "Organization", "name": "Chreol Empire" } },
    { "@type": "Offer", "name": "Vente USDT TRC20", "description": "Vendez votre USDT TRC20 contre FCFA. Taux : 580 FCFA/$", "priceCurrency": "XAF", "seller": { "@type": "Organization", "name": "Chreol Empire" } },
  ],
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127", "bestRating": "5" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }} />
      {children}
    </>
  );
}

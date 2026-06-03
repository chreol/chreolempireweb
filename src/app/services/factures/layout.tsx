import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Recharge Canal+ & Paiement Factures Eneo — Échange MoMo Cameroun | Chreol Empire" },
  description: "Rechargez Canal+ ou payez vos factures Eneo, Camwater, StarTimes à Douala via MTN MoMo ou Orange Money. Échangez entre opérateurs Mobile Money sans frais. Commission 200 FCFA/facture. Service 7j/7.",
  keywords: [
    "paiement Canal+ cameroun", "recharge Canal+ Douala", "recharge Canal+ MTN MoMo", "recharge Canal+ Orange Money",
    "paiement Eneo cameroun", "recharge Eneo Douala", "paiement facture Eneo MTN MoMo",
    "recharge Camwater cameroun", "paiement StarTimes cameroun",
    "échange MTN Orange cameroun", "échange mobile money Douala", "transfert MoMo cameroun",
    "recharge mobile money cameroun", "échange Orange MTN Douala sans frais",
    "paiement facture douala", "recharge abonnement Canal+ Cameroun",
  ],
  alternates: { canonical: "https://shop.chreolempire.com/services/factures" },
  openGraph: {
    title: "Recharge Canal+, Eneo, Camwater & Échange MoMo | Chreol Empire Douala",
    description: "Rechargez Canal+, payez Eneo, Camwater, StarTimes ou échangez entre opérateurs MoMo. 200 FCFA seulement.",
    url: "https://shop.chreolempire.com/services/factures",
    images: [{ url: "/assets/paiement-+-facture-services.webp", width: 1200, height: 630, alt: "Paiement Factures Canal+ Eneo Camwater Cameroun" }],
  },
};

const BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://shop.chreolempire.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://shop.chreolempire.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Paiement Factures", "item": "https://shop.chreolempire.com/services/factures" },
  ],
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Recharge Canal+ & Paiement Factures — Échange Mobile Money Cameroun",
  "description": "Rechargez Canal+, payez vos factures Eneo, Camwater et StarTimes à Douala. Échangez entre MTN MoMo, Orange Money, Express Union et Yoomee sans frais. Commission fixe 200 FCFA par facture.",
  "provider": { "@type": "LocalBusiness", "name": "Chreol Empire", "address": { "@type": "PostalAddress", "addressLocality": "Douala", "addressCountry": "CM" } },
  "areaServed": { "@type": "Country", "name": "Cameroun" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "XAF",
    "lowPrice": "0",
    "highPrice": "200",
    "offerCount": 2,
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Chreol Empire" },
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127", "bestRating": "5" },
  "review": { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Blanche E." }, "reviewBody": "Facture Canal+ payée en 10 minutes. Service rapide et sans problème.", "datePublished": "2026-04-12" },
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

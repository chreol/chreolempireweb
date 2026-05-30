import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Carte UBA Cameroun — Achat & Recharge Visa Prépayée | Chreol Empire" },
  description: "Obtenez votre carte prépayée UBA Cameroun (Segment I dès 10 500 FCFA, II 17 500 FCFA, III 25 000 FCFA) ou rechargez votre carte existante. Livraison express à Douala. Paiement Mobile Money.",
  keywords: ["carte UBA cameroun", "UBA prépayée douala", "recharge UBA cameroun", "carte UBA segment 1 2 3", "UBA visa cameroun"],
  alternates: { canonical: "https://chreolempire.com/services/uba" },
  openGraph: {
    title: "Carte UBA Cameroun Segment I, II, III | Chreol Empire",
    description: "Achat et recharge carte UBA prépayée à Douala. Paiement MTN MoMo / Orange Money.",
    url: "https://chreolempire.com/services/uba",
    images: [{ url: "/assets/Carte UBA Cameroun pour RECHARGE.webp", width: 1200, height: 630, alt: "Carte UBA Cameroun Prépayée" }],
  },
};

const BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://chreolempire.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://chreolempire.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Carte UBA Cameroun", "item": "https://chreolempire.com/services/uba" },
  ],
};

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Cartes UBA Cameroun — Chreol Empire",
  "url": "https://chreolempire.com/services/uba",
  "itemListElement": [
    {
      "@type": "ListItem", "position": 1,
      "item": {
        "@type": "Product",
        "name": "Carte UBA Visa Prépayée Segment I — Cameroun",
        "description": "Carte Visa UBA Cameroun Segment I. Plafond 2 500 000 FCFA/mois. Utilisable sur Amazon, Netflix, PayPal.",
        "brand": { "@type": "Brand", "name": "UBA" },
        "offers": { "@type": "AggregateOffer", "priceCurrency": "XAF", "lowPrice": "10500", "highPrice": "10500", "offerCount": 1, "availability": "https://schema.org/InStock", "seller": { "@type": "Organization", "name": "Chreol Empire" } },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127", "bestRating": "5" },
        "review": { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Nadège F." }, "reviewBody": "Carte UBA reçue en 3 jours. Fonctionne parfaitement sur Amazon.", "datePublished": "2026-01-15" },
      },
    },
    {
      "@type": "ListItem", "position": 2,
      "item": {
        "@type": "Product",
        "name": "Carte UBA Visa Prépayée Segment II — Cameroun",
        "description": "Carte Visa UBA Cameroun Segment II. Plafond 5 000 000 FCFA/mois.",
        "brand": { "@type": "Brand", "name": "UBA" },
        "offers": { "@type": "AggregateOffer", "priceCurrency": "XAF", "lowPrice": "17500", "highPrice": "17500", "offerCount": 1, "availability": "https://schema.org/InStock", "seller": { "@type": "Organization", "name": "Chreol Empire" } },
      },
    },
    {
      "@type": "ListItem", "position": 3,
      "item": {
        "@type": "Product",
        "name": "Carte UBA Visa Prépayée Segment III — Cameroun",
        "description": "Carte Visa UBA Cameroun Segment III. Plafond 10 000 000 FCFA/mois.",
        "brand": { "@type": "Brand", "name": "UBA" },
        "offers": { "@type": "AggregateOffer", "priceCurrency": "XAF", "lowPrice": "25000", "highPrice": "25000", "offerCount": 1, "availability": "https://schema.org/InStock", "seller": { "@type": "Organization", "name": "Chreol Empire" } },
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }} />
      {children}
    </>
  );
}

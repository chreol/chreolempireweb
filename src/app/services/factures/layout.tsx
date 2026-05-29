import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Paiement Factures Eneo Canal+ & Échange MoMo — Douala | Chreol Empire" },
  description: "Payez vos factures Canal+, Eneo, Camwater, StarTimes à Douala. Échangez de l'argent entre opérateurs Mobile Money (MTN, Orange, Express Union, Yoomee) sans frais. Commission 200 FCFA/facture.",
  keywords: ["paiement Canal+ cameroun", "Eneo cameroun", "Camwater cameroun", "échange MTN Orange cameroun", "échange mobile money douala"],
  alternates: { canonical: "https://chreolempire.com/services/factures" },
  openGraph: {
    title: "Factures & Échange MoMo — Canal+, Eneo, Camwater | Chreol Empire",
    description: "Payez vos factures ou échangez entre opérateurs MoMo. Commission 200 FCFA seulement.",
    url: "https://chreolempire.com/services/factures",
    images: [{ url: "/assets/paiement-+-facture-services.webp", width: 1200, height: 630, alt: "Paiement Factures Canal+ Eneo Camwater Cameroun" }],
  },
};

const BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://chreolempire.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://chreolempire.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Paiement Factures", "item": "https://chreolempire.com/services/factures" },
  ],
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Paiement Factures & Échange Mobile Money Cameroun",
  "description": "Payez vos factures Canal+, Eneo, Camwater et StarTimes à Douala. Échangez entre MTN MoMo, Orange Money, Express Union et Yoomee sans frais. Commission fixe 200 FCFA par facture.",
  "provider": { "@type": "LocalBusiness", "name": "Chreol Empire", "address": { "@type": "PostalAddress", "addressLocality": "Douala", "addressCountry": "CM" } },
  "areaServed": { "@type": "Country", "name": "Cameroun" },
  "offers": [
    { "@type": "Offer", "name": "Paiement facture Canal+ / Eneo / Camwater", "description": "Commission fixe 200 FCFA par facture, quel que soit le montant.", "price": "200", "priceCurrency": "XAF" },
    { "@type": "Offer", "name": "Échange Mobile Money MTN ↔ Orange", "description": "Échange sans frais entre opérateurs MoMo. Minimum 1 000 FCFA.", "price": "0", "priceCurrency": "XAF" },
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

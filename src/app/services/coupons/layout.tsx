import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Échange Transcash & PCS Mastercard en FCFA — Douala | Chreol Empire" },
  description: "Échangez vos coupons Transcash ou PCS Mastercard contre du FCFA à Douala. Taux garanti 480 FCFA/€. Paiement instantané MTN MoMo ou Orange Money. Cameroun.",
  keywords: ["Transcash cameroun", "PCS Mastercard cameroun", "échange Transcash FCFA", "coupon Transcash douala", "PCS contre FCFA cameroun"],
  alternates: { canonical: "https://shop.chreolempire.com/services/coupons" },
  openGraph: {
    title: "Échange Transcash & PCS Mastercard | Chreol Empire Douala",
    description: "480 FCFA/€ garanti. Échangez vos coupons en moins de 30 min. MTN MoMo / Orange Money.",
    url: "https://shop.chreolempire.com/services/coupons",
    images: [{ url: "/assets/contenu-pack-transcash.webp", width: 1200, height: 630, alt: "Échange Transcash PCS Cameroun" }],
  },
};

const BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://shop.chreolempire.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://shop.chreolempire.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Échange Coupons", "item": "https://shop.chreolempire.com/services/coupons" },
  ],
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Échange Coupons Transcash & PCS Mastercard en FCFA",
  "description": "Échangez vos coupons Transcash ou PCS Mastercard contre du FCFA au taux de 480 FCFA/€ à Douala. Paiement MTN MoMo ou Orange Money en 15-30 min.",
  "provider": { "@type": "LocalBusiness", "name": "Chreol Empire", "address": { "@type": "PostalAddress", "addressLocality": "Douala", "addressCountry": "CM" } },
  "areaServed": { "@type": "Country", "name": "Cameroun" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "XAF",
    "lowPrice": "8800",
    "highPrice": "440000",
    "offerCount": 2,
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Chreol Empire" },
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127", "bestRating": "5" },
  "review": { "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }, "author": { "@type": "Person", "name": "Serge A." }, "reviewBody": "Échange Transcash rapide, MoMo reçu en 15 min. Aucune arnaque.", "datePublished": "2026-03-20" },
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

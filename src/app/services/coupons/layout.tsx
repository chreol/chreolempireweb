import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Échange Transcash & PCS Mastercard en FCFA — Douala | Chreol Empire" },
  description: "Échangez vos coupons Transcash ou PCS Mastercard contre du FCFA à Douala. Taux garanti 440 FCFA/€. Paiement instantané MTN MoMo ou Orange Money. Cameroun.",
  keywords: ["Transcash cameroun", "PCS Mastercard cameroun", "échange Transcash FCFA", "coupon Transcash douala", "PCS contre FCFA cameroun"],
  alternates: { canonical: "https://chreolempire.com/services/coupons" },
  openGraph: {
    title: "Échange Transcash & PCS Mastercard | Chreol Empire Douala",
    description: "440 FCFA/€ garanti. Échangez vos coupons en moins de 30 min. MTN MoMo / Orange Money.",
    url: "https://chreolempire.com/services/coupons",
    images: [{ url: "/assets/contenu-pack-transcash.webp", width: 1200, height: 630, alt: "Échange Transcash PCS Cameroun" }],
  },
};

const BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://chreolempire.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://chreolempire.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Échange Coupons", "item": "https://chreolempire.com/services/coupons" },
  ],
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Échange Coupons Transcash & PCS Mastercard en FCFA",
  "description": "Échangez vos coupons Transcash ou PCS Mastercard contre du FCFA au taux de 440 FCFA/€ à Douala. Paiement MTN MoMo ou Orange Money en 15-30 min.",
  "provider": { "@type": "LocalBusiness", "name": "Chreol Empire", "address": { "@type": "PostalAddress", "addressLocality": "Douala", "addressCountry": "CM" } },
  "areaServed": { "@type": "Country", "name": "Cameroun" },
  "offers": [
    { "@type": "Offer", "name": "Échange coupon Transcash", "description": "Échangez votre coupon Transcash en FCFA. Taux : 440 FCFA/€. Minimum 20€.", "priceCurrency": "XAF" },
    { "@type": "Offer", "name": "Échange coupon PCS Mastercard", "description": "Échangez votre coupon PCS Mastercard en FCFA. Taux : 440 FCFA/€ après 7% commission. Minimum 20€.", "priceCurrency": "XAF" },
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

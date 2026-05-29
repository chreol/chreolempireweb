import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "PayPal Europe en FCFA — Achat & Vente au Cameroun | Chreol Empire" },
  description: "Vendez votre solde PayPal Europe contre FCFA (580 FCFA/€) ou achetez du solde PayPal (700 FCFA/€). Paiement MTN MoMo / Orange Money. Traitement en 15-30 min. Douala, Cameroun.",
  keywords: ["PayPal cameroun", "vendre PayPal FCFA", "acheter PayPal cameroun", "PayPal contre FCFA douala", "solde PayPal europe cameroun"],
  alternates: { canonical: "https://chreolempire.com/services/paypal" },
  openGraph: {
    title: "PayPal Europe ↔ FCFA | Chreol Empire Douala",
    description: "Vendez 580 FCFA/€ ou achetez 700 FCFA/€ de solde PayPal. MTN MoMo / Orange Money.",
    url: "https://chreolempire.com/services/paypal",
    images: [{ url: "/assets/Achat_VentePaypal.webp", width: 1200, height: 630, alt: "PayPal Europe contre FCFA Cameroun" }],
  },
};

const BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://chreolempire.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://chreolempire.com/services" },
    { "@type": "ListItem", "position": 3, "name": "PayPal Europe", "item": "https://chreolempire.com/services/paypal" },
  ],
};

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Achat & Vente PayPal Europe en FCFA",
  "description": "Échangez votre solde PayPal Europe contre FCFA à Douala. Achat à 700 FCFA/€, vente à 580 FCFA/€. Paiement MTN MoMo ou Orange Money.",
  "provider": { "@type": "LocalBusiness", "name": "Chreol Empire", "address": { "@type": "PostalAddress", "addressLocality": "Douala", "addressCountry": "CM" } },
  "areaServed": { "@type": "Country", "name": "Cameroun" },
  "offers": [
    { "@type": "Offer", "name": "Achat solde PayPal", "description": "Achetez du solde PayPal Europe à 700 FCFA/€. Minimum 10 000 FCFA.", "priceCurrency": "XAF" },
    { "@type": "Offer", "name": "Vente solde PayPal", "description": "Vendez votre solde PayPal Europe à 580 FCFA/€. Minimum 5€.", "priceCurrency": "XAF" },
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

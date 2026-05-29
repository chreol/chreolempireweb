import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Cartes Cadeaux PSN, Roblox, Steam, Nintendo au Cameroun | Chreol Empire" },
  description: "Achetez vos cartes cadeaux PSN PlayStation, iTunes App Store, Roblox, Steam, Nintendo eShop et Razer Gold à Douala. Codes authentiques garantis. Livraison WhatsApp 15-30 min. Paiement MTN MoMo.",
  keywords: ["PSN cameroun", "cartes cadeaux PSN douala", "iTunes cameroun", "Roblox cameroun", "Steam cameroun", "Nintendo eShop cameroun", "Razer Gold cameroun"],
  alternates: { canonical: "https://chreolempire.com/services/cartes-cadeaux" },
  openGraph: {
    title: "Cartes Cadeaux PSN, iTunes, Roblox — Cameroun | Chreol Empire",
    description: "Codes authentiques PSN, iTunes, Roblox, Steam. Livraison WhatsApp 15-30 min.",
    url: "https://chreolempire.com/services/cartes-cadeaux",
    images: [{ url: "/assets/PlayStation_Store_Card.webp", width: 1200, height: 630, alt: "Cartes Cadeaux PSN Roblox Steam Cameroun" }],
  },
};

const BREADCRUMB = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://chreolempire.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://chreolempire.com/services" },
    { "@type": "ListItem", "position": 3, "name": "Cartes Cadeaux", "item": "https://chreolempire.com/services/cartes-cadeaux" },
  ],
};

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Cartes Cadeaux Gaming — Chreol Empire Cameroun",
  "description": "Cartes cadeaux PSN, iTunes, Roblox, Steam, Nintendo livrées en 15-30 min à Douala",
  "url": "https://chreolempire.com/services/cartes-cadeaux",
  "itemListElement": [
    {
      "@type": "ListItem", "position": 1,
      "item": {
        "@type": "Product",
        "name": "Carte Cadeau PSN PlayStation — Cameroun",
        "description": "Carte cadeau PlayStation Store livrée par WhatsApp. Régions EU, FR, US, UK disponibles.",
        "brand": { "@type": "Brand", "name": "PlayStation" },
        "offers": { "@type": "Offer", "priceCurrency": "XAF", "price": "7500", "priceValidUntil": "2026-12-31", "availability": "https://schema.org/InStock", "seller": { "@type": "Organization", "name": "Chreol Empire" } },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127" },
      },
    },
    {
      "@type": "ListItem", "position": 2,
      "item": {
        "@type": "Product",
        "name": "Robux Roblox — Cameroun FCFA",
        "description": "Achetez des Robux pour Roblox en FCFA via MTN MoMo ou Orange Money.",
        "brand": { "@type": "Brand", "name": "Roblox" },
        "offers": { "@type": "Offer", "priceCurrency": "XAF", "price": "4500", "availability": "https://schema.org/InStock", "seller": { "@type": "Organization", "name": "Chreol Empire" } },
      },
    },
    {
      "@type": "ListItem", "position": 3,
      "item": {
        "@type": "Product",
        "name": "Carte Steam — Cameroun",
        "description": "Carte cadeau Steam livrée par WhatsApp en 15-30 min à Douala.",
        "brand": { "@type": "Brand", "name": "Steam" },
        "offers": { "@type": "Offer", "priceCurrency": "XAF", "price": "7500", "availability": "https://schema.org/InStock", "seller": { "@type": "Organization", "name": "Chreol Empire" } },
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

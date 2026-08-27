import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GIFT_CARDS, IMAGES } from "@/lib/services";
import GoogleReviewPrompt from "@/components/GoogleReviewPrompt";

const REGIONS: Record<string, { code: string; flag: string; label: string; slug: string }> = {
  europe:    { code: "EU", flag: "🇪🇺", label: "Europe",    slug: "europe"    },
  france:    { code: "FR", flag: "🇫🇷", label: "France",    slug: "france"    },
  belgique:  { code: "BE", flag: "🇧🇪", label: "Belgique",  slug: "belgique"  },
  italie:    { code: "IT", flag: "🇮🇹", label: "Italie",    slug: "italie"    },
  allemagne: { code: "DE", flag: "🇩🇪", label: "Allemagne", slug: "allemagne" },
  espagne:   { code: "ES", flag: "🇪🇸", label: "Espagne",   slug: "espagne"   },
  uk:        { code: "UK", flag: "🇬🇧", label: "UK",        slug: "uk"        },
  usa:       { code: "US", flag: "🇺🇸", label: "USA",       slug: "usa"       },
  canada:    { code: "CA", flag: "🇨🇦", label: "Canada",    slug: "canada"    },
  australie: { code: "AU", flag: "🇦🇺", label: "Australie", slug: "australie" },
  global:    { code: "GLOBAL", flag: "🌐", label: "Global", slug: "global"    },
};

function parseSlug(slug: string) {
  for (const regionSlug of Object.keys(REGIONS)) {
    if (slug.endsWith(`-${regionSlug}`)) {
      const cardId = slug.slice(0, -(regionSlug.length + 1));
      const card = GIFT_CARDS.find(c => c.id === cardId);
      const region = REGIONS[regionSlug];
      if (card && region) return { card, region };
    }
  }
  return null;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const card of GIFT_CARDS) {
    for (const regionSlug of Object.keys(REGIONS)) {
      params.push({ slug: `${card.id}-${regionSlug}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const { card, region } = parsed;
  const title = `${card.name} ${region.flag} ${region.label} au Cameroun — Chreol Empire`;
  const description = `Achetez une carte ${card.name} région ${region.label} en FCFA à Douala. Livraison WhatsApp 15-30 min. Paiement MTN MoMo / Orange Money. 0% commission.`;
  return {
    title: { absolute: `${title} | Chreol Empire` },
    description,
    alternates: { canonical: `https://shop.chreolempire.com/services/cartes-cadeaux/${slug}` },
    openGraph: { title, description, url: `https://shop.chreolempire.com/services/cartes-cadeaux/${slug}` },
  };
}

export default async function CardRegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const { card, region } = parsed;

  const amounts = (region.code === "US" && "usAmounts" in card && card.usAmounts
    ? card.usAmounts
    : card.amounts) as Array<{ label: string; price: number; previousPrice?: number }>;
  const lowestPrice  = amounts[0]?.price ?? 0;
  const highestPrice = amounts[amounts.length - 1]?.price ?? lowestPrice;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${card.name} ${region.label} — Cameroun FCFA`,
    "description": `Carte cadeau ${card.name} région ${region.label}. Livraison instantanée par WhatsApp à Douala.`,
    "brand": { "@type": "Brand", "name": card.name },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "XAF",
      "lowPrice":   lowestPrice.toString(),
      "highPrice":  highestPrice.toString(),
      "offerCount": card.amounts.length,
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Chreol Empire" },
    },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "127", "bestRating": "5" },
    "review": {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "author": { "@type": "Person", "name": "Djembé K." },
      "reviewBody": "Livraison rapide en moins de 20 minutes. Code valide immédiatement. Je recommande Chreol Empire !",
      "datePublished": "2026-03-15",
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://shop.chreolempire.com" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://shop.chreolempire.com/services" },
      { "@type": "ListItem", "position": 3, "name": "Cartes Cadeaux", "item": "https://shop.chreolempire.com/services/cartes-cadeaux" },
      { "@type": "ListItem", "position": 4, "name": `${card.name} ${region.label}`, "item": `https://shop.chreolempire.com/services/cartes-cadeaux/${slug}` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: "var(--text-muted)" }}>
        <Link href="/services" className="hover:text-white transition-colors">Services</Link>
        <span>›</span>
        <Link href="/services/cartes-cadeaux" className="hover:text-white transition-colors">Cartes Cadeaux</Link>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>{card.name} {region.flag} {region.label}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
          <Image src={card.image} alt={card.name} fill style={{ objectFit: "cover" }} unoptimized />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
            {region.flag} Région {region.label}
          </p>
          <h1 className="text-2xl font-black text-white">
            Carte {card.name} {region.label}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Livrée par WhatsApp en 15–30 min · Paiement MoMo
          </p>
        </div>
      </div>

      {/* Prix disponibles */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
          Montants disponibles
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {amounts.map(a => (
            <div
              key={a.label}
              className="py-3 px-2 rounded-xl text-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <p className="text-xs font-black text-white">{a.label}</p>
              {a.previousPrice && a.previousPrice !== a.price && (
                <p className="text-[9px] mt-0.5 line-through" style={{ color: "var(--text-muted)" }}>
                  {a.previousPrice.toLocaleString("fr-FR")} F
                </p>
              )}
              <p className="text-[11px] font-black" style={{ color: "#25D366" }}>
                {a.previousPrice && a.previousPrice > a.price ? "🔥" : "🚀"} {a.price.toLocaleString("fr-FR")} F
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: "✅", text: "Codes authentiques" },
          { icon: "⚡", text: "Livraison 15–30 min" },
          { icon: "💬", text: "Support 7j/7" },
        ].map(b => (
          <div key={b.text} className="flex flex-col items-center gap-1 p-3 rounded-xl text-center" style={{ background: "var(--bg-card)" }}>
            <span className="text-xl">{b.icon}</span>
            <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{b.text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/services/cartes-cadeaux"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-black text-black text-sm"
        style={{ background: "var(--gold)" }}
      >
        🎮 Commander {card.name} {region.label}
      </Link>

      <div className="mt-4 text-center">
        <a
          href={`https://wa.me/237697657734?text=${encodeURIComponent(`Bonjour, je souhaite commander une carte ${card.name} région ${region.label}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-75"
          style={{ color: "#25D366" }}
        >
          <Image src={IMAGES.whatsapp} alt="WhatsApp" width={16} height={16} unoptimized />
          Commander directement via WhatsApp
        </a>
      </div>

      <div className="mt-8">
        <GoogleReviewPrompt productName={`la carte ${card.name} ${region.label}`} compact />
      </div>
    </div>
  );
}

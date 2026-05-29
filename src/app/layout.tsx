import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { ToastProvider } from "@/components/Toast";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import RateTicker from "@/components/RateTicker";
import PromoBanner from "@/components/PromoBanner";
import WASupport from "@/components/WASupport";
import GoogleMerchantWidget from "@/components/GoogleMerchantWidget";
import WAPopover from "@/components/WAPopover";
import FloatingCalc from "@/components/FloatingCalc";
import MobileWACTA from "@/components/MobileWACTA";
import Image from "next/image";
import { CONTACT, IMAGES, SOCIAL_LINKS } from "@/lib/services";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chreolempire.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chreol Empire — Cartes Cadeaux & Crypto au Cameroun",
    template: "%s | Chreol Empire",
  },
  description:
    "Achetez vos cartes cadeaux PSN, iTunes, Roblox, Steam, Nintendo au meilleur prix. Échangez vos crypto (USDT, BTC, TRX) contre FCFA à 0% commission. Paiement MTN MoMo, Orange Money. Livraison WhatsApp 15-30 min. Douala, Cameroun.",
  keywords: [
    "cartes cadeaux cameroun", "cartes cadeaux douala", "PSN cameroun", "iTunes cameroun",
    "Roblox cameroun", "Steam cameroun", "USDT FCFA", "BTC FCFA", "crypto douala",
    "échange crypto cameroun", "PCS transcash cameroun", "UBA cameroun carte prépayée",
    "PayPal europe cameroun", "MTN MoMo", "Orange Money", "paiement mobile money",
    "chreol empire", "boutique digitale douala",
  ],
  authors: [{ name: "Chreol Empire", url: SITE_URL }],
  creator: "Chreol Empire",
  publisher: "Chreol Empire",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Chreol Empire — Cartes Cadeaux & Crypto au Cameroun",
    description: "Cartes cadeaux PSN/iTunes/Roblox + échange crypto USDT/BTC à 0% commission. Paiement MTN MoMo / Orange Money. Livraison express 15-30 min via WhatsApp.",
    url: SITE_URL,
    siteName: "Chreol Empire",
    locale: "fr_FR",
    type: "website",
    images: [{
      url: "/assets/Baniere_ChreolEMpire_Cartes-Cadeaux.webp",
      width: 1200,
      height: 630,
      alt: "Chreol Empire — Cartes Cadeaux & Crypto au Cameroun",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chreol Empire — Cartes Cadeaux & Crypto au Cameroun",
    description: "Cartes cadeaux & crypto à Douala. 0% commission. MTN MoMo / Orange Money. Livraison 15-30 min.",
    images: ["/assets/Baniere_ChreolEMpire_Cartes-Cadeaux.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  verification: {
    google: "c3320b203dc6ddd6",
  },
};

const LOCAL_BUSINESS_JSON = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Chreol Empire",
  "description": "Boutique en ligne spécialisée en cartes cadeaux numériques (PSN, iTunes, Roblox, Steam) et échange de cryptomonnaies (USDT, BTC, TRX) à Douala, Cameroun.",
  "url": "https://chreolempire.com",
  "telephone": "+237694360978",
  "email": "chreolempire00@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Vallée 3, Boutiques Deido",
    "addressLocality": "Douala",
    "addressCountry": "CM"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 4.0511, "longitude": 9.7679 },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "07:00",
    "closes": "23:00"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5"
  },
  "priceRange": "$$",
  "currenciesAccepted": "XAF",
  "paymentAccepted": "MTN MoMo, Orange Money, WhatsApp",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services Chreol Empire",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cartes Cadeaux PSN, iTunes, Roblox, Steam, Nintendo" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Échange Crypto USDT, BTC, TRX contre FCFA" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Coupons Transcash & PCS Mastercard" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Carte UBA Cameroun & recharge" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "PayPal Europe achat & vente" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Paiement factures Canal+, Eneo, Camwater" } }
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${geist.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Anti-flicker: apply saved theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}try{var l=localStorage.getItem('lang');if(l)document.documentElement.lang=l;}catch(e){}` }} />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="preconnect" href="https://api.brevo.com" />
        <link rel="preconnect" href="https://api.telegram.org" />
        <link rel="dns-prefetch" href="https://campay.net" />
        <link rel="dns-prefetch" href="https://maps.app.goo.gl" />
        <script src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
        <ToastProvider>
        <HistoryProvider>
        <CartProvider>
          <div className="sticky top-0 z-50">
            <RateTicker />
            <PromoBanner />
            <Navbar />
          </div>
          <main className="flex-1 pb-[72px] sm:pb-0">{children}</main>
          <FloatingCalc />
          <MobileWACTA />
          <GoogleMerchantWidget />

          {/* Footer */}
          <footer style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }} className="mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {/* Brand */}
                <div>
                  <Link href="/" className="inline-flex items-center gap-2 mb-2">
                    <Image src="/logo.png" alt="Chreol Empire" width={36} height={36} unoptimized className="rounded-xl" />
                    <p className="font-black text-xl">
                      Chreol<span style={{ color: "var(--gold)" }}>Empire</span>
                    </p>
                  </Link>
                  <p className="text-[11px] font-black mb-1" style={{ color: "var(--text-secondary)" }}>
                    Le monde digital, à portée de Mobile Money.
                  </p>
                  <p className="text-xs font-bold mb-2" style={{ color: "var(--gold)" }}>
                    Cartes cadeaux &amp; crypto · 0% commission
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {CONTACT.address}
                  </p>
                  <WAPopover
                    align="left"
                    dropDown
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-bold text-white"
                    style={{ background: "#25D366" }}
                  >
                    <Image src={IMAGES.whatsapp} alt="WhatsApp" width={16} height={16} unoptimized className="shrink-0" />
                    {CONTACT.whatsappDisplay}
                  </WAPopover>
                </div>

                {/* Links */}
                <div>
                  <p className="font-bold text-sm mb-3" style={{ color: "var(--gold)" }}>SERVICES</p>
                  <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Link href="/services/cartes-cadeaux" className="hover:text-white transition-colors">🎮 Cartes Cadeaux</Link>
                    <Link href="/services/crypto" className="hover:text-white transition-colors">₿ Crypto &amp; MoMo</Link>
                    <Link href="/services/coupons" className="hover:text-white transition-colors">🎫 Coupons PCS / Transcash</Link>
                    <Link href="/services/uba" className="hover:text-white transition-colors">💳 UBA Cameroun</Link>
                    <Link href="/services/paypal" className="hover:text-white transition-colors">💸 PayPal Europe</Link>
                    <Link href="/services/factures" className="hover:text-white transition-colors">🔄 Paiement Factures</Link>
                  </div>
                </div>

                {/* Info links */}
                <div>
                  <p className="font-bold text-sm mb-3" style={{ color: "var(--gold)" }}>INFORMATIONS</p>
                  <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Link href="/promo" className="hover:text-white transition-colors font-bold" style={{ color: "#F87171" }}>🔥 Offres spéciales</Link>
                    <Link href="/blog" className="hover:text-white transition-colors">✍️ Blog &amp; Guides</Link>
                    <Link href="/comment-ca-marche" className="hover:text-white transition-colors">📖 Comment ça marche</Link>
                    <Link href="/paiement" className="hover:text-white transition-colors">💰 Modes de paiement</Link>
                    <Link href="/a-propos" className="hover:text-white transition-colors">ℹ️ À propos</Link>
                    <Link href="/sitemap" className="hover:text-white transition-colors">🗺️ Plan du site</Link>
                    <Link href="/cgu" className="hover:text-white transition-colors">📄 CGU</Link>
                    <Link href="/confidentialite" className="hover:text-white transition-colors">🔒 Confidentialité</Link>
                    <Link href="/mentions-legales" className="hover:text-white transition-colors">⚖️ Mentions légales</Link>
                  </div>
                </div>

                {/* Trust */}
                <div>
                  <p className="font-bold text-sm mb-3" style={{ color: "var(--gold)" }}>CONFIANCE</p>
                  <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span>✅ Codes authentiques garantis</span>
                    <span>⚡ Livraison express 15–30 min</span>
                    <span>🔒 Paiement sécurisé Mobile Money</span>
                    <a
                      href={SOCIAL_LINKS.googleReview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold transition-colors hover:text-white"
                      style={{ color: "#FCD34D" }}
                    >
                      ⭐ Laisser un avis Google
                    </a>
                    <WASupport />
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  {/* WhatsApp */}
                  <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" title="WhatsApp"
                    className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center transition-opacity hover:opacity-75 shrink-0"
                    style={{ background: "#25D366" }}>
                    <Image src={IMAGES.whatsapp} alt="WhatsApp" width={22} height={22} unoptimized />
                  </a>
                  {/* Facebook Page */}
                  <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" title="Page Facebook"
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm transition-opacity hover:opacity-75 shrink-0"
                    style={{ background: "#1877F2" }}>f</a>
                  {/* Groupe Facebook */}
                  <a href={SOCIAL_LINKS.facebookGroup} target="_blank" rel="noopener noreferrer" title="Groupe Facebook"
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-[10px] transition-opacity hover:opacity-75 shrink-0"
                    style={{ background: "#1877F2", opacity: 0.8 }}>G·FB</a>
                  {/* Telegram */}
                  <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" title="Telegram"
                    className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center transition-opacity hover:opacity-75 shrink-0"
                    style={{ background: "#229ED9" }}>
                    <Image src={IMAGES.telegram} alt="Telegram" width={22} height={22} unoptimized />
                  </a>
                  {/* Instagram */}
                  <a href="https://www.instagram.com/chreolempire" target="_blank" rel="noopener noreferrer" title="Instagram"
                    className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center transition-opacity hover:opacity-75 shrink-0"
                    style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
                    <Image src={IMAGES.instagram} alt="Instagram" width={22} height={22} unoptimized />
                  </a>
                  {/* Google My Business */}
                  <a href={SOCIAL_LINKS.googleBusiness} target="_blank" rel="noopener noreferrer" title="Google My Business"
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm transition-opacity hover:opacity-75 shrink-0"
                    style={{ background: "#EA4335" }}>G</a>
                  {/* BusinessList */}
                  <a href={SOCIAL_LINKS.businesslist} target="_blank" rel="noopener noreferrer" title="BusinessList"
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs transition-opacity hover:opacity-75 shrink-0"
                    style={{ background: "#2563EB" }}>BL</a>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-1">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    © 2026 Chreol Empire. Tous droits réservés.
                  </p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Link href="/cgu" className="hover:text-white transition-colors">CGU</Link>
                    <span>·</span>
                    <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
                    <span>·</span>
                    <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </CartProvider>
        </HistoryProvider>
        </ToastProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

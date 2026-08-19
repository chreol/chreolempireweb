import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Plan du site | Chreol Empire" },
  alternates: { canonical: "https://shop.chreolempire.com/sitemap" },
  robots: { index: true, follow: true },
};

const SITEMAP = [
  {
    title: "Principal",
    links: [
      { href: "/",         label: "Accueil" },
      { href: "/services", label: "Tous les services" },
      { href: "/cart",     label: "Panier" },
      { href: "/paiement", label: "Modes de paiement" },
      { href: "/a-propos", label: "À propos" },
    ],
  },
  {
    title: "Cartes Cadeaux",
    links: [
      { href: "/services/cartes-cadeaux", label: "PSN, Steam, Roblox, Nintendo, Razer, iTunes, Google Play" },
    ],
  },
  {
    title: "Crypto & Échanges",
    links: [
      { href: "/services/crypto",  label: "Crypto & Mobile Money (USDT, BTC, TRX…)" },
      { href: "/services/paypal",  label: "PayPal Europe" },
      { href: "/services/coupons", label: "Coupons Transcash & PCS Mastercard" },
    ],
  },
  {
    title: "Autres Services",
    links: [
      { href: "/services/uba",      label: "UBA Cameroun — Carte & Recharge" },
      { href: "/services/factures", label: "Paiement Factures (Canal+, Eneo…)" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-white mb-2">Plan du site</h1>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        Toutes les pages disponibles sur Chreol Empire.
      </p>

      <div className="space-y-6">
        {SITEMAP.map(section => (
          <div key={section.title}>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>
              {section.title}
            </p>
            <div className="flex flex-col gap-2">
              {section.links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 p-3 rounded-2xl text-sm transition-all hover:-translate-y-0.5"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                >
                  <span style={{ color: "var(--gold)" }}>→</span>
                  <span className="font-semibold hover:text-white">{l.label}</span>
                  <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>{l.href}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

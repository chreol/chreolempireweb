import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { POSTS } from "@/lib/blog";

const FEATURED = [
  {
    slug: "recharge-uba-cameroun",
    title: "Comment recharger sa carte prépayée UBA Cameroun en FCFA ?",
    description: "Découvrez comment recharger votre carte UBA Cameroun facilement avec MTN Mobile Money ou Orange Money. Service rapide et sécurisé chez CHREOL EMPIRE.",
    date: "26 novembre 2026",
    dateISO: "2026-11-26",
    readTime: 3,
    category: "UBA",
    emoji: "💳",
    image: "/assets/Carte UBA Cameroun pour RECHARGE.webp",
  },
  {
    slug: "acheter-usdt-crypto-mobile-money",
    title: "Acheter ou vendre des USDT (Crypto) au Cameroun via MTN et Orange",
    description: "Vous cherchez à acheter du USDT ou du Bitcoin au Cameroun en FCFA ? Découvrez comment faire vos transactions crypto en toute sécurité avec CHREOL EMPIRE.",
    date: "26 novembre 2026",
    dateISO: "2026-11-26",
    readTime: 4,
    category: "Crypto",
    emoji: "₿",
    image: "/assets/Cryptomonnaies-visuel.webp",
  },
  {
    slug: "acheter-solde-paypal-cameroun",
    title: "Comment acheter du solde PayPal au Cameroun en toute sécurité ?",
    description: "Freelance ou e-commerçant ? Découvrez comment acheter du solde PayPal au Cameroun avec vos Mobile Money. Service d'assistance sécurisé par CHREOL EMPIRE.",
    date: "26 novembre 2026",
    dateISO: "2026-11-26",
    readTime: 3,
    category: "PayPal",
    emoji: "💸",
    image: "/assets/Achat_VentePaypal.webp",
  },
  {
    slug: "payer-netflix-cameroun-sans-carte",
    title: "Comment payer Netflix, Spotify ou Amazon au Cameroun sans carte Visa ?",
    description: "Plus besoin de carte bancaire internationale ! Payez vos abonnements Netflix, Spotify et vos achats Amazon avec nos cartes cadeaux en FCFA. Livraison rapide à Yaoundé et Douala.",
    date: "26 novembre 2026",
    dateISO: "2026-11-26",
    readTime: 3,
    category: "Cartes Cadeaux",
    emoji: "🎬",
    image: "/assets/itunes-gifts-for-business-hero_2x.webp",
  },
] as const;

const BLOG_CARDS = [
  ...FEATURED,
  ...POSTS.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    dateISO: post.dateISO,
    readTime: post.readTime,
    category: post.category,
    emoji: post.emoji,
    image: post.image,
  })),
];

export const metadata: Metadata = {
  title: { absolute: "Blog — Guides Cartes Cadeaux & Crypto au Cameroun | Chreol Empire" },
  description: "Guides pratiques pour acheter des cartes cadeaux (PSN, Roblox, V-Bucks) et échanger vos cryptomonnaies contre FCFA au Cameroun. Paiement MTN MoMo & Orange Money.",
  alternates: { canonical: "https://shop.chreolempire.com/blog" },
  openGraph: {
    title: "Blog Chreol Empire — Guides Cartes Cadeaux & Crypto Cameroun",
    description: "Guides pratiques pour acheter vos cartes cadeaux et échanger vos crypto au Cameroun.",
    url: "https://shop.chreolempire.com/blog",
  },
};

const BLOG_LIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog Chreol Empire",
  description: "Guides pratiques sur les cartes cadeaux et cryptomonnaies au Cameroun",
  url: "https://shop.chreolempire.com/blog",
  blogPost: BLOG_CARDS.map(p => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    url: `https://shop.chreolempire.com/blog/${p.slug}`,
    datePublished: p.dateISO,
  })),
};

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Blog</span>
      </div>

      <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>Guides & Conseils</p>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
        Tout savoir sur les cartes<br />cadeaux & crypto au Cameroun
      </h1>
      <p className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
        Guides pratiques pour acheter, activer et profiter de vos achats digitaux depuis Douala ou n&apos;importe où au Cameroun.
      </p>

      <div className="flex flex-col gap-5">
        {BLOG_CARDS.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl p-6 transition-all hover:scale-[1.01]"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0">
                <Image src={post.image} alt={post.title} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: "var(--gold)22", color: "var(--gold)" }}>
                    {post.category}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {post.date} · {post.readTime} min de lecture
                  </span>
                </div>
                <h2 className="text-base font-black text-white mb-1 group-hover:text-[var(--gold)] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {post.description}
                </p>
                <span className="mt-2 inline-block text-xs font-black" style={{ color: "var(--gold)" }}>
                  Lire la suite →
                </span>
              </div>
              <span className="shrink-0 text-2xl mt-1 transition-transform group-hover:translate-x-1" style={{ color: "var(--gold)" }}>{post.emoji}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl p-6 text-center"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <p className="text-2xl mb-3">💬</p>
        <p className="font-black text-white mb-1">Une question non couverte ?</p>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Notre équipe répond sur WhatsApp 7j/7 de 7h à 23h.
        </p>
        <a href="https://wa.me/237697657734?text=Bonjour%2C%20j%27ai%20une%20question%20suite%20%C3%A0%20votre%20blog."
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-white text-sm"
          style={{ background: "#25D366" }}>
          💬 Poser ma question sur WhatsApp
        </a>
      </div>

      <script type="application/ld+json" suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_LIST_SCHEMA) }} />
    </div>
  );
}

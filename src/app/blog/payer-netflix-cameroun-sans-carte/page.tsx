import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const TITLE = "Comment payer Netflix, Spotify ou Amazon au Cameroun sans carte Visa ?";
const DESCRIPTION = "Plus besoin de carte bancaire internationale ! Payez vos abonnements Netflix, Spotify et vos achats Amazon avec nos cartes cadeaux en FCFA. Livraison rapide à Yaoundé et Douala.";
const URL = "https://shop.chreolempire.com/blog/payer-netflix-cameroun-sans-carte";
const DATE = "2026-11-26";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Chreol Empire` },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "article", publishedTime: DATE },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: DATE,
  dateModified: DATE,
  inLanguage: "fr-FR",
  mainEntityOfPage: URL,
  author: { "@type": "Organization", name: "CHREOL EMPIRE SARL", url: "https://shop.chreolempire.com" },
  publisher: { "@type": "Organization", name: "CHREOL EMPIRE SARL", url: "https://shop.chreolempire.com" },
};

export default function PayerNetflixSansCartePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Cartes Cadeaux</span>
      </div>

      <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-6" style={{ border: "1px solid var(--border)" }}>
        <Image src="/assets/itunes-gifts-for-business-hero_2x.webp" alt="Cartes cadeaux pour payer en ligne au Cameroun" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover outline outline-1 -outline-offset-1 outline-white/10" />
      </div>

      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>26 novembre 2026 · 3 min de lecture</p>
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight text-balance">{TITLE}</h1>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        Beaucoup de Camerounais se retrouvent bloqués au moment de payer leur abonnement Netflix ou Spotify, car ils n&apos;ont pas de carte Visa/Mastercard active.
      </p>

      <h2 className="text-xl font-black text-white mt-8 mb-3">Les cartes cadeaux, la solution ultime</h2>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        Au lieu d&apos;utiliser une carte bancaire, achetez des cartes cadeaux (Gift Cards) adaptées à chaque service. Pour Netflix, il existe des cartes cadeaux ou vous pouvez passer par des abonnements gérés.
      </p>

      <h2 className="text-xl font-black text-white mt-8 mb-3">Où les acheter au Cameroun ?</h2>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
        Chez <strong className="text-white">CHREOL EMPIRE</strong>, nous vendons des cartes <strong className="text-white">iTunes</strong>, <strong className="text-white">Google Play</strong> et <strong className="text-white">PSN</strong> que vous pouvez utiliser pour vos achats en ligne. Livraison rapide à Yaoundé et à Douala.
      </p>

      <Link href="/services/cartes-cadeaux" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-opacity hover:opacity-85 active:scale-[0.96]" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
        Voir toutes nos cartes cadeaux
      </Link>

      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </div>
  );
}

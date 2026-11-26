import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const TITLE = "Acheter ou vendre des USDT (Crypto) au Cameroun via MTN et Orange";
const DESCRIPTION = "Vous cherchez à acheter du USDT ou du Bitcoin au Cameroun en FCFA ? Découvrez comment faire vos transactions crypto en toute sécurité avec CHREOL EMPIRE.";
const URL = "https://shop.chreolempire.com/blog/acheter-usdt-crypto-mobile-money";
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

export default function AcheterUsdtCryptoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Crypto</span>
      </div>

      <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-6" style={{ border: "1px solid var(--border)" }}>
        <Image src="/assets/Cryptomonnaies-visuel.webp" alt="Achat et vente de USDT au Cameroun" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover outline outline-1 -outline-offset-1 outline-white/10" />
      </div>

      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>26 novembre 2026 · 4 min de lecture</p>
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight text-balance">{TITLE}</h1>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        Les cryptomonnaies (USDT, Bitcoin) sont devenues des valeurs sûres pour protéger son épargne ou payer à l&apos;international. Mais comment en acheter au Cameroun ?
      </p>

      <h2 className="text-xl font-black text-white mt-8 mb-3">Le P2P, attention aux arnaques</h2>
      <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
        Sur Facebook, Telegram ou les groupes WhatsApp, des inconnus proposent d&apos;échanger des USDT contre du Mobile Money. Ce P2P sans intermédiaire identifié expose à des risques concrets :
      </p>
      <ul className="flex flex-col gap-2 mb-4 pl-4">
        <li className="text-sm leading-relaxed flex gap-2" style={{ color: "var(--text-secondary)" }}>
          <span className="shrink-0" style={{ color: "var(--gold)" }}>▸</span>
          <span>Vous payez en FCFA et les crypto n&apos;arrivent jamais, ou le reçu de transfert est falsifié.</span>
        </li>
        <li className="text-sm leading-relaxed flex gap-2" style={{ color: "var(--text-secondary)" }}>
          <span className="shrink-0" style={{ color: "var(--gold)" }}>▸</span>
          <span>On vous demande la phrase secrète ou le mot de passe de votre portefeuille. Personne de sérieux n&apos;en a besoin.</span>
        </li>
        <li className="text-sm leading-relaxed flex gap-2" style={{ color: "var(--text-secondary)" }}>
          <span className="shrink-0" style={{ color: "var(--gold)" }}>▸</span>
          <span>Une fois l&apos;argent parti, il n&apos;y a souvent ni facture, ni société à contacter.</span>
        </li>
      </ul>

      <h2 className="text-xl font-black text-white mt-8 mb-3">Achetez en toute sécurité chez CHREOL EMPIRE</h2>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
        Nous vous offrons un service d&apos;échange fiable. Vous payez en FCFA via <strong className="text-white">MTN</strong> ou <strong className="text-white">Orange</strong>, et vous recevez vos USDT sur votre portefeuille (Trust Wallet, Binance, etc.).
      </p>

      <Link href="/services/crypto" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-opacity hover:opacity-85 active:scale-[0.96]" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
        Acheter du Crypto
      </Link>

      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </div>
  );
}

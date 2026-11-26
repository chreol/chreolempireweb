import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const TITLE = "Comment acheter du solde PayPal au Cameroun en toute sécurité ?";
const DESCRIPTION = "Freelance ou e-commerçant ? Découvrez comment acheter du solde PayPal au Cameroun avec vos Mobile Money. Service d'assistance sécurisé par CHREOL EMPIRE.";
const URL = "https://shop.chreolempire.com/blog/acheter-solde-paypal-cameroun";
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

export default function AcheterSoldePaypalPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>PayPal</span>
      </div>

      <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-6" style={{ border: "1px solid var(--border)" }}>
        <Image src="/assets/Achat_VentePaypal.webp" alt="Achat de solde PayPal au Cameroun" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover outline outline-1 -outline-offset-1 outline-white/10" />
      </div>

      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>26 novembre 2026 · 3 min de lecture</p>
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight text-balance">{TITLE}</h1>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        Pour payer vos abonnements, vos publicités Facebook ou recevoir des paiements de l&apos;étranger, PayPal est indispensable. Mais comment l&apos;alimenter au Cameroun ?
      </p>

      <h2 className="text-xl font-black text-white mt-8 mb-3">Acheter du solde PayPal avec du Mobile Money</h2>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        CHREOL EMPIRE vous accompagne dans l&apos;achat de soldes PayPal. Nous sécurisons la transaction et vous accompagnons.
      </p>

      <h2 className="text-xl font-black text-white mt-8 mb-3">Pourquoi passer par notre service ?</h2>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
        Évitez les blocages de compte liés aux connexions suspectes. Nous vous fournissons les instructions nécessaires.
      </p>

      <Link href="/services/paypal" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-opacity hover:opacity-85 active:scale-[0.96]" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
        Découvrir nos services PayPal
      </Link>

      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const TITLE = "Comment recharger sa carte prépayée UBA Cameroun en FCFA ?";
const DESCRIPTION = "Découvrez comment recharger votre carte UBA Cameroun facilement avec MTN Mobile Money ou Orange Money. Service rapide et sécurisé chez CHREOL EMPIRE.";
const URL = "https://shop.chreolempire.com/blog/recharge-uba-cameroun";
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

export default function RechargeUbaCamerounPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>UBA</span>
      </div>

      <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden mb-6" style={{ border: "1px solid var(--border)" }}>
        <Image src="/assets/Carte UBA Cameroun pour RECHARGE.webp" alt="Carte prépayée UBA Cameroun" fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover outline outline-1 -outline-offset-1 outline-white/10" />
      </div>

      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>26 novembre 2026 · 3 min de lecture</p>
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight text-balance">{TITLE}</h1>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        La carte prépayée UBA est très utilisée au Cameroun pour les paiements en ligne. Cependant, recharger son solde peut parfois être un casse-tête si l&apos;on n&apos;a pas de compte bancaire classique.
      </p>

      <h2 className="text-xl font-black text-white mt-8 mb-3">La solution CHREOL EMPIRE</h2>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        Nous vous permettons de recharger votre carte prépayée UBA directement avec votre Mobile Money (<strong className="text-white">MTN MoMo</strong> ou <strong className="text-white">Orange Money</strong>).
      </p>

      <h2 className="text-xl font-black text-white mt-8 mb-3">Comment procéder ?</h2>
      <ol className="flex flex-col gap-2 mb-6 pl-5 list-decimal">
        <li className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>Rendez-vous sur notre page Recharge UBA.</li>
        <li className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>Sélectionnez le montant.</li>
        <li className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>Payez avec Mobile Money.</li>
        <li className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>Recevez la confirmation.</li>
      </ol>

      <Link href="/services/uba" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-opacity hover:opacity-85 active:scale-[0.96]" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
        Recharger ma carte UBA maintenant
      </Link>

      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </div>
  );
}

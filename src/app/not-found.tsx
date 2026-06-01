import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/services";
// logo = /assets/chreolempire logo avec contact m.webp

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Image src={IMAGES.logo} alt="Chreol Empire" width={48} height={48} unoptimized className="rounded-2xl object-cover" />
          <p className="text-2xl font-black">
            Chreol<span style={{ color: "var(--gold)" }}>Empire</span>
          </p>
        </div>

        {/* 404 */}
        <p className="text-8xl font-black mb-2" style={{ color: "var(--gold)" }}>404</p>
        <p className="text-xl font-black text-white mb-2">Page introuvable</p>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 rounded-full font-black text-black text-sm text-center transition-opacity hover:opacity-85"
            style={{ background: "var(--gold)" }}
          >
            🏠 Retour à l'accueil
          </Link>
          <Link
            href="/services"
            className="w-full py-3 rounded-full font-black text-sm text-center transition-opacity hover:opacity-85"
            style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            🛍️ Voir nos services
          </Link>
          <a
            href="https://wa.me/237697657734"
            target="_blank" rel="noopener noreferrer"
            className="w-full py-3 rounded-full font-black text-white text-sm text-center flex items-center justify-center gap-2 transition-opacity hover:opacity-85"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="WhatsApp" width={16} height={16} unoptimized />
            Nous contacter sur WhatsApp
          </a>
        </div>

        {/* Links rapides */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            { href: "/services/cartes-cadeaux", label: "🎮 Cartes Cadeaux" },
            { href: "/services/crypto",          label: "₿ Crypto" },
            { href: "/services/paypal",          label: "💸 PayPal" },
            { href: "/services/uba",             label: "💳 UBA" },
          ].map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-full text-xs font-bold transition-colors hover:text-white"
              style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { CONTACT, IMAGES, SOCIAL_LINKS } from "@/lib/services";
import WAPopover from "@/components/WAPopover";

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div
        className="relative rounded-3xl overflow-hidden mb-10 p-8"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "var(--gold)", opacity: 0.05, filter: "blur(40px)", transform: "translate(30%, -30%)" }}
        />
        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
            <Image src={IMAGES.logo} alt="Chreol Empire" fill style={{ objectFit: "cover" }} unoptimized />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              Chreol<span style={{ color: "var(--gold)" }}>Empire</span>
            </h1>
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
              {CONTACT.address}
            </p>
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black"
              style={{ background: "var(--gold)", color: "#0A0A0A" }}
            >
              🛡️ Magasin officiel depuis 2022
            </span>
          </div>
        </div>
      </div>

      {/* Notre histoire */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white mb-4">Notre histoire</h2>
        <div
          className="rounded-3xl p-6"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
            Chreol Empire est une boutique en ligne spécialisée dans la vente de cartes cadeaux numériques
            et l'échange de cryptomonnaies, basée à Douala, Cameroun. Fondée par des passionnés du digital,
            nous facilitons l'accès aux services numériques internationaux pour les Camerounais et les Africains.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Notre mission : offrir des codes authentiques, une livraison ultra-rapide (15–30 min via WhatsApp)
            et un service client de confiance, 7j/7. Que vous cherchiez un code PSN pour vos jeux PlayStation,
            des USDT pour vos transactions crypto, ou un coupon PCS à changer en FCFA, nous sommes là.
          </p>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white mb-4">Nos valeurs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "✅", title: "Authenticité", desc: "Chaque code vendu provient de sources officielles et vérifiées. Zéro risque de fraude." },
            { icon: "⚡", title: "Rapidité",     desc: "Livraison en 15–30 min via WhatsApp. Réponse client en moins de 5 minutes." },
            { icon: "🔒", title: "Sécurité",     desc: "Paiements sécurisés via Campay (agrégateur certifié) ou Mobile Money direct." },
            { icon: "💬", title: "Proximité",    desc: "Une équipe locale disponible 7j/7, qui parle votre langue et comprend vos besoins." },
          ].map(v => (
            <div
              key={v.title}
              className="flex gap-4 p-5 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <span className="text-3xl shrink-0">{v.icon}</span>
              <div>
                <p className="font-black text-white mb-1">{v.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nos services */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white mb-4">Ce que nous proposons</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            "Cartes cadeaux PSN, Steam, iTunes, Roblox, Nintendo, Razer",
            "Échange USDT, BTC, TRX contre FCFA",
            "Coupons PCS Mastercard & Transcash",
            "Cartes UBA Cameroun (Segment I, II, III)",
            "Solde PayPal Europe",
            "Paiement de factures (Canal+, Eneo, Camwater…)",
          ].map((s, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl text-xs font-semibold"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              <span style={{ color: "var(--gold)" }}>✓ </span>{s}
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-xl font-black text-white mb-4">Nous contacter</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <WAPopover
            prefill="Bonjour, j'aimerais vous contacter."
            align="right"
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5 text-left"
            style={{ background: "#0D1A0F", border: "1px solid #25D36633" }}
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <Image src={IMAGES.whatsapp} alt="WhatsApp" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div>
              <p className="font-black text-white text-sm">WhatsApp</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{CONTACT.whatsappDisplay}</p>
            </div>
          </WAPopover>
          <div
            className="flex items-center gap-4 p-5 rounded-2xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <span className="text-3xl">📍</span>
            <div>
              <p className="font-black text-white text-sm">Adresse</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{CONTACT.address}</p>
            </div>
          </div>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <span className="text-3xl">📧</span>
            <div>
              <p className="font-black text-white text-sm">Email</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{CONTACT.email}</p>
            </div>
          </a>
          <a
            href={`tel:${CONTACT.tel}`}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <span className="text-3xl">📞</span>
            <div>
              <p className="font-black text-white text-sm">Téléphone</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{CONTACT.tel}</p>
            </div>
          </a>

          {/* Google My Business */}
          <a
            href={SOCIAL_LINKS.googleBusiness}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#1A0A0A", border: "1px solid #EA433533" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xl shrink-0"
              style={{ background: "#EA4335" }}>G</div>
            <div>
              <p className="font-black text-white text-sm">Google My Business</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Trouvez-nous sur Google Maps</p>
            </div>
          </a>

          {/* BusinessList */}
          <a
            href={SOCIAL_LINKS.businesslist}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "var(--bg-card)", border: "1px solid #2563EB33" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
              style={{ background: "#2563EB" }}>BL</div>
            <div>
              <p className="font-black text-white text-sm">BusinessList</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Annuaire professionnel Cameroun</p>
            </div>
          </a>
        </div>
      </section>

      {/* Réseaux sociaux */}
      <section>
        <h2 className="text-xl font-black text-white mb-4">Suivez-nous</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#0D1326", border: "1px solid #1877F233" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shrink-0"
              style={{ background: "#1877F2" }}>f</div>
            <div>
              <p className="font-black text-white text-sm">Page Facebook</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>@chreolempire</p>
            </div>
          </a>
          <a href={SOCIAL_LINKS.facebookGroup} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#0D1326", border: "1px solid #1877F233" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0"
              style={{ background: "#1877F2" }}>FB·G</div>
            <div>
              <p className="font-black text-white text-sm">Groupe Facebook</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Communauté Chreol Empire</p>
            </div>
          </a>
          <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#071520", border: "1px solid #229ED933" }}>
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <Image src={IMAGES.telegram} alt="Telegram" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div>
              <p className="font-black text-white text-sm">Telegram</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>@chreolempire</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}

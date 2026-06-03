import Image from "next/image";
import { CONTACT, IMAGES, SOCIAL_LINKS } from "@/lib/services";
import WAPopover from "@/components/WAPopover";

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* ── Hero ── */}
      <div
        className="relative rounded-3xl overflow-hidden mb-10 p-8"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}
      >
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "var(--gold)", opacity: 0.06, filter: "blur(50px)", transform: "translate(30%, -30%)" }}
        />
        <div className="relative flex flex-col sm:flex-row items-start gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-xl">
            <Image src={IMAGES.logo} alt="Chreol Empire" fill style={{ objectFit: "cover" }} unoptimized />
          </div>
          <div>
            <h1 className="text-3xl font-black mb-1">
              Chreol<span style={{ color: "var(--gold)" }}>Empire</span>
            </h1>
            <p className="text-sm font-bold mb-1" style={{ color: "var(--gold)" }}>
              Le premium, l&apos;autorité des services digitaux Camerounais
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
              {CONTACT.address}
            </p>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
              style={{ background: "var(--gold)", color: "#0A0A0A" }}
            >
              🛡️ Magasin officiel depuis 2012
            </span>
          </div>
        </div>
      </div>

      {/* ── Notre histoire ── */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4" style={{ color: "var(--text-primary)" }}>Notre histoire</h2>
        <div
          className="rounded-3xl p-6 sm:p-8 space-y-5"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          {/* Emotional opener — quote block */}
          <div
            className="pl-4 py-1"
            style={{ borderLeft: "3px solid var(--gold)" }}
          >
            <p className="text-base font-black leading-snug" style={{ color: "var(--text-primary)" }}>
              En 2012, accéder aux services numériques au Cameroun était un chemin de croix.
            </p>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Les revendeurs fantômes encaissaient et disparaissaient. Les codes arrivaient invalides,
            ou n&apos;arrivaient jamais. Des familles perdaient des sommes durement gagnées pour un simple
            jeu PlayStation, un abonnement Canal+ ou un virement PayPal. Il n&apos;existait pas de recours.
            Pas de confiance possible. Seulement des portes fermées et des arnaques répétées.
          </p>

          <p className="text-sm leading-relaxed font-semibold" style={{ color: "var(--text-primary)" }}>
            Nous avons vécu cela. Nos proches aussi.
          </p>

          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            C&apos;est de cette frustration qu&apos;est née Chreol Empire — non pas comme un projet commercial,
            mais comme une réponse humaine à une injustice réelle :{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              pourquoi les Camerounais devaient-ils risquer leur argent pour accéder aux mêmes
              services que le reste du monde ?
            </strong>
          </p>

          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Douze ans plus tard, des milliers de clients nous font confiance. Des étudiants qui
            rechargent Steam depuis Yaoundé pour jouer avec des amis en Europe. Des parents qui
            offrent des codes Roblox à leurs enfants le jour de leur anniversaire — livrés en
            20 minutes sur WhatsApp. Des entrepreneurs qui convertissent leurs USDT en FCFA sans
            commission abusive. Des ménages qui paient leurs factures Eneo ou Canal+ depuis leur
            téléphone, sans file d&apos;attente, sans stress.
          </p>

          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Chaque transaction honorée est une promesse tenue. Chaque client satisfait est une
            victoire contre un système qui avait dit "non" là où nous avons choisi de dire "oui".
          </p>

          {/* Manifesto */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "var(--gold-dim)", border: "1px solid var(--border-strong)" }}
          >
            <p className="text-sm leading-relaxed font-bold" style={{ color: "var(--text-primary)" }}>
              Ce n&apos;est pas juste une boutique. C&apos;est notre engagement depuis 2012 : que vous puissiez
              accéder au monde numérique, en toute confiance, sans arnaque, sans frontière.
            </p>
            <p className="text-sm mt-3 font-black" style={{ color: "var(--gold)" }}>
              Bienvenue chez Chreol Empire. Nous existons parce que vous le méritez.
            </p>
          </div>
        </div>
      </section>

      {/* ── Nos valeurs ── */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4" style={{ color: "var(--text-primary)" }}>Nos valeurs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "✅", title: "Authenticité",  desc: "Chaque code vendu provient de sources officielles et vérifiées. Zéro risque de fraude." },
            { icon: "⚡", title: "Rapidité",      desc: "Livraison en 15–30 min via WhatsApp. Réponse client en moins de 5 minutes." },
            { icon: "🔒", title: "Sécurité",      desc: "Paiements sécurisés via Mobile Money certifié (MTN MoMo, Orange Money) ou espèces." },
            { icon: "💬", title: "Proximité",     desc: "Une équipe locale disponible 7j/7, qui parle votre langue et comprend vos besoins." },
          ].map(v => (
            <div
              key={v.title}
              className="flex gap-4 p-5 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <span className="text-3xl shrink-0">{v.icon}</span>
              <div>
                <p className="font-black mb-1" style={{ color: "var(--text-primary)" }}>{v.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ce que nous proposons ── */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4" style={{ color: "var(--text-primary)" }}>Ce que nous proposons</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            "Cartes cadeaux PSN, Steam, iTunes, Roblox, Nintendo, Razer",
            "Échange crypto USDT, BTC, ETH, SOL… contre FCFA",
            "Coupons PCS Mastercard & Transcash",
            "Cartes UBA Cameroun (Segment I, II, III)",
            "Solde PayPal Europe (achat & vente)",
            "Paiement de factures (Canal+, Eneo, Camwater…)",
            "Échange MoMo ↔ MoMo (tous opérateurs)",
            "Recharge carte UBA Cameroun",
            "Crypto en espèces ou Mobile Money",
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

      {/* ── Nous contacter ── */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-4" style={{ color: "var(--text-primary)" }}>Nous contacter</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* WhatsApp */}
          <WAPopover
            prefill="Bonjour Chreol Empire, j'aimerais vous contacter."
            align="right"
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5 text-left"
            style={{ background: "#0D1A0F", border: "1px solid #25D36633" }}
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <Image src={IMAGES.whatsapp} alt="WhatsApp" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>WhatsApp</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{CONTACT.whatsappDisplay}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#25D366" }}>Réponse en moins de 5 min · 7j/7</p>
            </div>
          </WAPopover>

          {/* Email */}
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <Image src={IMAGES.email} alt="Email" fill style={{ objectFit: "contain" }} unoptimized className="p-1" />
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>Email</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{CONTACT.email}</p>
            </div>
          </a>

          {/* Téléphone */}
          <a
            href={`tel:${CONTACT.tel}`}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
              style={{ background: "var(--bg-elevated)" }}
            >
              📞
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>Téléphone</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{CONTACT.tel}</p>
            </div>
          </a>

          {/* Adresse / Boutique */}
          <div
            className="flex items-center gap-4 p-5 rounded-2xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <Image src={IMAGES.boutique} alt="Boutique" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>Adresse</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{CONTACT.address}</p>
            </div>
          </div>

          {/* Google My Business */}
          <a
            href={SOCIAL_LINKS.googleBusiness}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#1A0A0A", border: "1px solid #EA433533" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xl shrink-0"
              style={{ background: "#EA4335" }}
            >
              G
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>Google My Business</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Trouvez-nous sur Google Maps</p>
              <p className="text-[10px] mt-0.5" style={{ color: "#EA4335" }}>4.9 ★ · Voir les avis</p>
            </div>
          </a>

          {/* BusinessList */}
          <a
            href={SOCIAL_LINKS.businesslist}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "var(--bg-card)", border: "1px solid #2563EB33" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
              style={{ background: "#2563EB" }}
            >
              BL
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>BusinessList</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Annuaire professionnel Cameroun</p>
            </div>
          </a>
        </div>
      </section>

      {/* ── Réseaux sociaux ── */}
      <section>
        <h2 className="text-xl font-black mb-4" style={{ color: "var(--text-primary)" }}>Suivez-nous</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Facebook Page */}
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#0D1326", border: "1px solid #1877F233" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xl shrink-0"
              style={{ background: "#1877F2" }}>f</div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>Page Facebook</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>@chreolempire</p>
            </div>
          </a>

          {/* Facebook Groupe */}
          <a href={SOCIAL_LINKS.facebookGroup} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#0D1326", border: "1px solid #1877F233" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0"
              style={{ background: "#1877F2", opacity: 0.85 }}>FB·G</div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>Groupe Facebook</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Communauté Chreol Empire</p>
            </div>
          </a>

          {/* Telegram */}
          <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#071520", border: "1px solid #229ED933" }}>
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <Image src={IMAGES.telegram} alt="Telegram" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>Telegram</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>@chreolempire</p>
            </div>
          </a>

          {/* Instagram */}
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "#1A0A12", border: "1px solid #E1306C33" }}>
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0"
              style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
              <Image src={IMAGES.instagram} alt="Instagram" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div>
              <p className="font-black text-sm" style={{ color: "var(--text-primary)" }}>Instagram</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>@chreolempire</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}

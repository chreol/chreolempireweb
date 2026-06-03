"use client";

import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import { useLanguage } from "@/contexts/LanguageContext";


const METHODS = [
  {
    image: IMAGES.mtn,
    name: "MTN Mobile Money",
    desc: "Paiement automatique via Campay. Entrez votre numéro MTN et approuvez la demande sur votre téléphone.",
    color: "#FFC107",
    steps: ["Choisissez MTN MoMo au panier", "Entrez votre numéro 6XXXXXXXX", "Approuvez la demande sur votre téléphone", "Commande confirmée en 2 min"],
    auto: true,
  },
  {
    image: IMAGES.orange,
    name: "Orange Money",
    desc: "Paiement automatique via Campay. Même processus que MTN — demande directe sur votre téléphone Orange.",
    color: "#FF6600",
    steps: ["Choisissez Orange Money au panier", "Entrez votre numéro Orange", "Approuvez la demande reçue", "Commande confirmée en 2 min"],
    auto: true,
  },
  {
    image: IMAGES.whatsapp,
    name: "WhatsApp (Manuel)",
    desc: "Passez votre commande via WhatsApp. Notre équipe vous guidera pour le paiement et confirmera la livraison.",
    color: "#25D366",
    steps: ["Cliquez 'Commander via WhatsApp'", "Un agent reçoit votre commande", "Il vous envoie le code USSD de paiement", "Payez et confirmez à l'agent"],
    auto: false,
  },
];

export default function PaiementPage() {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-4"
          style={{ background: "var(--gold)", color: "#0A0A0A" }}
        >
          🔒 Paiement sécurisé
        </span>
        <h1 className="text-3xl font-black text-white mb-2">{t("pay.title")}</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {t("pay.subtitle")}
        </p>
      </div>

      {/* Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {METHODS.map(m => (
          <div
            key={m.name}
            className="rounded-3xl overflow-hidden flex flex-col"
            style={{ background: "var(--bg-card)", border: `1px solid ${m.color}33` }}
          >
            {/* Image / Icon */}
            <div
              className="h-32 flex items-center justify-center relative"
              style={{ background: m.color + "15" }}
            >
              {m.image ? (
                <div className="relative w-24 h-24">
                  <Image src={m.image} alt={m.name} fill style={{ objectFit: "contain" }} unoptimized />
                </div>
              ) : (
                <span className="text-6xl">💬</span>
              )}
              {m.auto && (
                <span
                  className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black"
                  style={{ background: m.color, color: "#0A0A0A" }}
                >
                  ⚡ Manuel
                </span>
              )}
            </div>

            <div className="p-5 flex flex-col gap-3 flex-1">
              <p className="font-black text-white">{m.name}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{m.desc}</p>

              <div className="flex flex-col gap-2 mt-auto">
                {m.steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5"
                      style={{ background: m.color + "33", color: m.color }}
                    >
                      {i + 1}
                    </span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security section */}
      <div
        className="rounded-3xl p-8 mb-8"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}
      >
        <h2 className="text-xl font-black text-white mb-6">🔒 Sécurité & Garanties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: "✅", title: "Codes authentiques", desc: "Tous nos codes proviennent de sources officielles. Remboursement garanti si un code est invalide." },
            { icon: "⚡", title: "Livraison express", desc: "Vos codes sont livrés par WhatsApp en 15–30 min après confirmation du paiement." },
            { icon: "🔐", title: "Paiement sécurisé", desc: "Les paiements automatiques transitent par Campay, opérateur certifié au Cameroun." },
            { icon: "💬", title: "Support 7j/7", desc: "Notre équipe est disponible sur WhatsApp de 8h à 22h, 7 jours sur 7." },
          ].map(g => (
            <div key={g.title} className="flex gap-3 p-4 rounded-2xl" style={{ background: "var(--bg-elevated)" }}>
              <span className="text-2xl shrink-0">{g.icon}</span>
              <div>
                <p className="font-bold text-white text-sm">{g.title}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-black text-white mb-5">Questions fréquentes</h2>
        <div className="space-y-3">
          {[
            { q: "Combien de temps pour recevoir mon code après paiement ?", a: "En général 15 à 30 minutes. Si le délai dépasse 1 heure, contactez-nous immédiatement sur WhatsApp." },
            { q: "Que faire si ma demande de paiement Mobile Money échoue ?", a: "Utilisez le bouton WhatsApp pour nous contacter. Nous trouverons une solution alternative rapidement." },
            { q: "Les paiements sont-ils sécurisés ?", a: "Oui. Les paiements automatiques passent par Campay, un agrégateur de paiement certifié. Les paiements manuels sont gérés par notre équipe en direct." },
            { q: "Puis-je annuler une commande ?", a: "Oui, contactez-nous sur WhatsApp dès que possible. Si le code n'a pas encore été envoyé, nous pouvons annuler et rembourser." },
          ].map((faq, i) => (
            <details
              key={i}
              className="rounded-2xl overflow-hidden group"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm text-white list-none">
                {faq.q}
                <span style={{ color: "var(--gold)" }}>+</span>
              </summary>
              <p className="px-4 pb-4 text-sm" style={{ color: "var(--text-secondary)" }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="rounded-3xl p-8 text-center"
        style={{ background: "#0D1A0F", border: "1px solid #25D36633" }}
      >
        <p className="text-xl font-black text-white mb-2">Une question sur le paiement ?</p>
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Notre équipe répond en moins de 5 minutes sur WhatsApp.
        </p>
        <WAPopover
          prefill="J'ai une question sur les modes de paiement."
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-white text-sm"
          style={{ background: "#25D366" }}
        >
          <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
          Nous contacter
        </WAPopover>
      </div>
    </div>
  );
}

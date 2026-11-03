"use client";

import { useState } from "react";
import Image from "next/image";
import { IMAGES, ORANGE_MONEY_COMMERCE, MTN_MONEY, IWOPAY_SCOPE, CONTACT } from "@/lib/services";
import PayInstruction from "@/components/PayInstruction";
import WAPopover from "@/components/WAPopover";
import { useLanguage } from "@/contexts/LanguageContext";

const OM_USSD   = ORANGE_MONEY_COMMERCE.ussd;

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0"
      style={{ background: copied ? "#25D366" : "var(--bg-elevated)", color: copied ? "#fff" : "var(--text-muted)", border: "1px solid var(--border)" }}
    >
      {copied ? t("pay2.copied") : t("pay2.copy")}
    </button>
  );
}

export default function PaiementPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-4" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
          {t("pay2.badge")}
        </span>
        <h1 className="text-3xl font-black text-white mb-2">{t("pay2.title")}</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {t("pay2.subtitle")}
        </p>
      </div>

      {/* ═══ OPTION A ═══ */}
      <div className="rounded-3xl p-6 mb-5" style={{ background: "var(--bg-card)", border: "2px solid #25D36644" }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0" style={{ background: "#25D366", color: "#fff" }}>A</span>
          <div>
            <p className="font-black text-white text-base">{t("pay2.optA_title")}</p>
            <p className="text-xs" style={{ color: "#25D366" }}>{t("pay2.optA_tag")}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {t("pay2.optA_desc_1")}<strong className="text-white">MTN</strong>{t("pay2.optA_desc_2")}<strong className="text-white">Orange Money</strong>{t("pay2.optA_desc_3")}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {[t("pay2.optA_1"), t("pay2.optA_2"), t("pay2.optA_3"), t("pay2.optA_4")].map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: "#25D36622", color: "#25D366" }}>{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
        <WAPopover
          prefill={t("pay2.optA_prefill")}
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full font-black text-white text-xs transition-opacity hover:opacity-80"
          style={{ background: "#25D366" }}
        >
          <Image src={IMAGES.whatsapp} alt="" width={16} height={16} unoptimized />
          {t("pay2.optA_btn")}
        </WAPopover>
      </div>

      {/* Séparateur OU */}
      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-xs font-black px-3 py-1 rounded-full" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>{t("pay2.or")}</span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      {/* ═══ OPTION B ═══ */}
      <div className="rounded-3xl p-6 mb-8" style={{ background: "var(--bg-card)", border: "2px solid var(--border)" }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0" style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>B</span>
          <div>
            <p className="font-black text-white text-base">Traitement manuel</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Délai variable selon la charge</p>
          </div>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Payez le numéro de téléphone ou effectuez vous-même le paiement via le code USSD correspondant de votre opérateur.
        </p>

        {/* MTN */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: "#FFC10710", border: "1px solid #FFC10744" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0">
              <Image src={IMAGES.mtn} alt="MTN" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <p className="font-black text-white text-sm">🟡 MTN Mobile Money</p>
            <span className="ml-auto text-[10px] font-black uppercase" style={{ color: "#22C55E" }}>Disponible</span>
          </div>
          <div className="flex flex-col gap-2 text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
            <div className="flex justify-between"><span>Numéro</span><span className="font-black text-white">{MTN_MONEY.phoneDisplay}</span></div>
            <div className="flex justify-between"><span>Nom</span><span className="font-black text-white">{MTN_MONEY.accountName}</span></div>
            <div className="flex justify-between"><span>Frais de retrait MTN</span><span className="font-black text-white">1,5 %</span></div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "var(--bg-elevated)", border: "1px solid #FFC10733" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#FFC107" }}>Dépôt à effectuer</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-black tracking-wider" style={{ color: "#FFC107" }}>{MTN_MONEY.phoneDisplay}</code>
              <CopyBtn text={MTN_MONEY.phoneDisplay} />
            </div>
            <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>Déposez le total de la commande sur ce numéro.</p>
          </div>
        </div>

        {/* Orange */}
        <div className="rounded-2xl p-4" style={{ background: "#FF660010", border: "1px solid #FF660044" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0">
              <Image src={IMAGES.orange} alt="Orange" fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <p className="font-black text-white text-sm">🟠 Orange Money — CHREOL EMPIRE</p>
            <span className="ml-auto text-[10px] font-black uppercase" style={{ color: "#22C55E" }}>Disponible</span>
          </div>
          <div className="flex flex-col gap-2 text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
            <div className="flex justify-between"><span>Code Marchand</span><span className="font-black text-white">{ORANGE_MONEY_COMMERCE.merchantCode}</span></div>
            <div className="flex justify-between"><span>Nom</span><span className="font-black text-white">{ORANGE_MONEY_COMMERCE.merchantName}</span></div>
            <div className="flex justify-between"><span>Réf. QR</span><span className="font-black text-white">{ORANGE_MONEY_COMMERCE.qrCode}</span></div>
            <div className="flex justify-between"><span>Commission opérateur</span><span className="font-black text-white">1 %</span></div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "var(--bg-elevated)", border: "1px solid #FF660033" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#FF6600" }}>🛠 Code USSD à composer</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-black tracking-wider" style={{ color: "#FF6600" }}>{OM_USSD}</code>
              <CopyBtn text={OM_USSD} />
            </div>
            <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>Composez ce code, puis « Payer un marchand » et le code {ORANGE_MONEY_COMMERCE.merchantCode}.</p>
            <div className="relative w-36 h-36 mt-3 rounded-xl overflow-hidden" style={{ background: "#fff" }}>
              <Image src={ORANGE_MONEY_COMMERCE.image} alt="QR code marchand Orange Money CHREOL EMPIRE" fill style={{ objectFit: "contain" }} unoptimized />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-4 mt-4" style={{ background: "#0EA5E910", border: "1px solid #0EA5E944" }}>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-black text-white text-sm">💨 Iwopay</p>
            <span className="ml-auto text-[10px] font-black uppercase" style={{ color: "#22C55E" }}>Disponible</span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {IWOPAY_SCOPE} Une demande arrive sur le numéro indiqué : validez-la avec votre code secret.
          </p>
        </div>
      </div>

      {/* ═══ AUTRES MOYENS ═══ */}
      <div className="rounded-3xl p-6 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-base font-black text-white mb-2">🌍 Autres moyens de paiement disponibles</h2>
        <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
          GIMAC, PayPal et crypto utilisent les adresses déjà publiées. Le montant suit le total de la commande et les taux PayPal / crypto du site.
        </p>
        <div className="flex flex-col gap-3 mb-4">
          <PayInstruction kind="gimac" fcfa={0} direction="in" />
          <PayInstruction kind="paypal" fcfa={0} direction="in" />
          <PayInstruction kind="crypto" fcfa={0} direction="in" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { image: IMAGES.expressUnion, title: "Express Union", text: "Paiement ou transfert selon le service demandé." },
            { image: IMAGES.yoomee, title: "Yoomee Money", text: "Disponible sur demande auprès de notre équipe." },
            { image: IMAGES.paypal, title: "PayPal", text: `Proches et Familles uniquement : ${CONTACT.paypalEmail}` },
            { image: IMAGES.logo, title: "Espèces en boutique", text: "Disponible à Vallée 3, Boutiques Deido, Douala – Cameroun." },
          ].map(method => (
            <div key={method.title} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--bg-elevated)" }}>
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                <Image src={method.image} alt={method.title} fill style={{ objectFit: "contain" }} unoptimized />
              </div>
              <div>
                <p className="text-xs font-black text-white">{method.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>{method.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PAISEMENT MANUEL — VIREMENTS BANCAIRES & MOBILE MONEY ═══ */}
      <div className="rounded-3xl p-6 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-base font-black text-white mb-2">🏦 Paiement manuel</h2>
        <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
          Virements bancaires ou Mobile Money — instructions et justificatifs.
        </p>

        <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-black text-white mb-3">🏛 Virements bancaires — CHREOL EMPIRE SARL</p>
          <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>🏦 Afriland First Bank — IBAN : CM21 10005 00026 00000230112 26 — SWIFT : CCEICMCX</p>
          <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>🏦 UBA Cameroun — IBAN : CM21 10033 05221 21011000384 92 — SWIFT : UNAFCMCX</p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Payez le montant exact, puis envoyez la capture / justificatif de virement sur WhatsApp.</p>
        </div>
      </div>

      {/* ═══ IMPORTANT — Preuve de paiement ═══ */}
      <div className="rounded-2xl p-5 mb-8 flex gap-4" style={{ background: "#EF44440D", border: "1.5px solid #EF444455" }}>
        <span className="text-2xl shrink-0">⚠️</span>
        <div>
          <p className="font-black text-white text-sm mb-1">Preuve de paiement obligatoire</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Une fois le paiement effectué (option A ou B), envoyez impérativement la <strong className="text-white">capture d&apos;écran</strong> ou la preuve de transaction sur WhatsApp pour déclencher l&apos;envoi immédiat de vos fonds.
          </p>
          <p className="text-xs font-black mt-2" style={{ color: "#EF4444" }}>
            {t("pay2.proof_en")}
          </p>
        </div>
      </div>

      {/* ═══ Garanties ═══ */}
      <div className="rounded-3xl p-6 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-base font-black text-white mb-4">🔒 Sécurité & Garanties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: "✅", title: "Codes authentiques",  desc: "Sources officielles. Remboursement garanti si code invalide." },
            { icon: "⚡", title: "Livraison 15–30 min", desc: "WhatsApp dès confirmation de paiement." },
            { icon: "🔐", title: "Paiement sécurisé",   desc: "Transactions vérifiées par notre équipe." },
            { icon: "💬", title: "Support 7j/7",         desc: "Disponible de 7h à 23h sur WhatsApp." },
          ].map(g => (
            <div key={g.title} className="flex gap-3 p-3 rounded-2xl" style={{ background: "var(--bg-elevated)" }}>
              <span className="text-xl shrink-0">{g.icon}</span>
              <div>
                <p className="font-bold text-white text-xs">{g.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ FAQ ═══ */}
      <div className="mb-10">
        <h2 className="text-base font-black text-white mb-4">Questions fréquentes</h2>
        <div className="space-y-2">
          {[
            { q: "Combien de temps pour recevoir mon code après paiement ?",  a: "En général 15 à 30 min. Si le délai dépasse 1 heure, contactez-nous immédiatement sur WhatsApp." },
            { q: "Que faire si le code USSD échoue ?",                        a: "Essayez l'option A (retrait initié par nous) ou contactez-nous sur WhatsApp. Nous trouverons une solution rapidement." },
            { q: "Puis-je annuler une commande ?",                            a: "Oui, contactez-nous sur WhatsApp dès que possible. Si le code n'a pas encore été envoyé, nous annulons et remboursons." },
          ].map((faq, i) => (
            <details key={i} className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm text-white list-none">
                {faq.q}
                <span style={{ color: "var(--gold)" }}>+</span>
              </summary>
              <p className="px-4 pb-4 text-xs" style={{ color: "var(--text-secondary)" }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div className="rounded-3xl p-8 text-center" style={{ background: "#0D1A0F", border: "1px solid #25D36633" }}>
        <p className="text-lg font-black text-white mb-2">Une question sur le paiement ?</p>
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>Notre équipe répond en moins de 5 minutes.</p>
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

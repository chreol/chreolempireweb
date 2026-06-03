"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { motion } from "framer-motion";
import { COUPON_RATES, MOMO_OPERATORS, IMAGES } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import RelatedServices from "@/components/RelatedServices";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import FAQ from "@/components/FAQ";
import StepGuide from "@/components/StepGuide";
import { Field } from "@/components/FormField";

const STEPS_COUPONS = [
  { icon: "🎫", title: "Sélectionnez le type de coupon", description: "Choisissez entre PCS Mastercard (7% commission) ou Transcash (0% commission). Entrez la valeur en euros (minimum 20€)." },
  { icon: "🔑", title: "Entrez le code du coupon", description: "PCS Mastercard : 8 caractères alphanumériques (ex: AB123456). Transcash : 12 chiffres. Ne partagez jamais votre code avant d'avoir confirmé l'échange.", tip: "Grattez délicatement la zone de sécurité pour révéler le code." },
  { icon: "📱", title: "Renseignez vos coordonnées MoMo", description: "Indiquez votre opérateur (MTN ou Orange), votre numéro, votre nom complet et votre email pour la confirmation." },
  { icon: "💬", title: "Envoyez la demande via WhatsApp", description: "Notre agent vérifie le code en temps réel. Le processus prend 5 à 15 minutes. Restez disponible sur WhatsApp pendant cette période.", tip: "Un coupon utilisé ou invalide sera détecté immédiatement — nous vous informerons sans délai." },
  { icon: "💰", title: "Recevez vos FCFA sur MoMo", description: "Après validation du coupon, le montant net en FCFA est viré sur votre compte Mobile Money en moins de 15 minutes.", tip: "PCS 100€ → 93€ × 480 = 44 640 FCFA nets reçus." },
];

const PAGE_FAQ = [
  { q: "Comment échanger un coupon Transcash en FCFA au Cameroun ?", a: "Envoyez votre code Transcash sur WhatsApp avec le montant en €. Nous vérifions le code et vous virons le FCFA équivalent au taux de 480 FCFA/€ sur MTN MoMo ou Orange Money en 15 minutes. Minimum 20€ par échange." },
  { q: "Quel est le taux de change PCS Mastercard en FCFA ?", a: "Le taux PCS Mastercard est de 480 FCFA/€ après déduction de la commission de 7%. Formule : (montant − 7%) × 480 FCFA. Exemple : coupon de 100€ → 93€ × 480 = 44 640 FCFA reçus sur votre Mobile Money." },
  { q: "Y a-t-il un minimum pour échanger un coupon au Cameroun ?", a: "Oui, le minimum est de 20€ par transaction. Pas de maximum fixe — des conditions spéciales s'appliquent pour les gros montants (500€ et plus). Contactez-nous via WhatsApp pour les transactions importantes." },
  { q: "Comment recevoir son argent après échange de coupon PCS ?", a: "Par MTN MoMo ou Orange Money dans les 15 à 30 minutes après vérification du code. Pour les montants supérieurs à 500€, un paiement en espèces à notre boutique Vallée 3, Deido, Douala est également possible." },
];

const PAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAGE_FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

type CouponType = keyof typeof COUPON_RATES;

export default function CouponsPage() {
  useEffect(() => { track("service_view", { service: "coupons" }); }, []);
  const { addItem } = useCart();
  const { addEntry } = useHistory();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [type, setType]         = useState<CouponType>("pcs");
  const [amount, setAmount]     = useState("");
  const [code, setCode]         = useState("");
  const [name, setName]         = useState("");
  const [momoOp, setMomoOp]     = useState("orange");
  const [dialCode, setDialCode] = useState("+237");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [showCalc, setShowCalc] = useState(false);

  function formatTranscash(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(.{4})(?=.)/g, "$1-");
  }

  const rate       = COUPON_RATES[type];
  const numAmt     = parseFloat(amount) || 0;
  const commission = rate.commission > 0 ? numAmt * rate.commission / 100 : 0;
  const netAmt     = numAmt - commission;
  const fcfaResult = Math.round(netAmt * rate.rate);

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || numAmt <= 0) { e.amount = "Montant requis"; }
    else if (numAmt < 20)       { e.amount = "Minimum 20€"; }
    const codeDigits = code.replace(/\D/g, "");
    if (!code.trim()) e.code = "Code requis";
    else if (type === "transcash" && codeDigits.length !== 12) e.code = "12 chiffres requis";
    else if (type === "pcs" && code.trim().length !== 8)       e.code = "8 caractères requis";
    if (!name.trim()) e.name = "Nom requis";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email valide requis";
    const phoneD = phone.replace(/\D/g, "");
    const minLen = dialCode === "+237" ? 9 : 6;
    if (phoneD.length < minLen) e.phone = dialCode === "+237" ? "Numéro invalide (9 chiffres)" : "Numéro trop court";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildDetails() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const typeName = type === "pcs" ? "PCS Mastercard" : "Transcash";
    return `${typeName} ${amount}€ | Code : ${code.trim()}\n${op} ${dialCode} ${phone} | Nom : ${name}`;
  }

  function buildMsgPlain() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const typeName = type === "pcs" ? "PCS Mastercard" : "Transcash";
    return `🎫 ÉCHANGE COUPON\nType : ${typeName}\nValeur : ${amount}€\nCode : ${code.trim()}\nCommission : ${rate.commission}%\nÀ recevoir : ${fcfaResult.toLocaleString("fr-FR")} FCFA\n\n💰 Réception MoMo\nOpérateur : ${op}\nNuméro : ${dialCode} ${phone}\nNom : ${name}`;
  }

  function sendNotification() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const typeName = type === "pcs" ? "PCS Mastercard" : "Transcash";
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: `coupon-${type}-${Date.now()}`,
        clientName: name,
        clientEmail: email,
        clientPhone: `${dialCode}${phone}`,
        paymentMethod: op,
        items: [{
          name: `Échange ${typeName}`,
          qty: 1,
          price: fcfaResult,
          amount: `${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA`,
          details: buildDetails(),
        }],
        total: fcfaResult,
        sourceUrl: window.location.pathname,
      }),
    }).catch(() => {});
  }

  function handleAddToCart() {
    if (!validate()) { showToast("Corrigez les erreurs avant d'ajouter au panier", "error"); return; }
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    addItem({
      id: `coupon-${type}-${Date.now()}`,
      cardName: `Échange ${type === "pcs" ? "PCS Mastercard" : "Transcash"}`,
      amount: `${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA via ${op}`,
      price: fcfaResult,
      type: "sell",
      details: buildDetails(),
    });
    addEntry({
      service: `Coupons — ${type === "pcs" ? "PCS Mastercard" : "Transcash"}`,
      details: `${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA`,
      amount: fcfaResult,
      currency: "FCFA",
      status: "pending",
    });
    showToast("Coupon ajouté au panier !", "success");
  }


  const inputCls  = "w-full px-4 py-3 rounded-2xl text-white text-sm outline-none";
  const inputBase = { background: "var(--bg-elevated)", border: "1px solid var(--border)" };
  const inputErr  = { ...inputBase, borderColor: "#EF4444" };

  return (
    <div className="max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/services" className="hover:text-white transition-colors">Services</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Échange Coupons</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">{t("p.coupons.title")}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        {t("p.coupons.sub")}
      </p>

      {/* Type selector */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {(Object.entries(COUPON_RATES) as [CouponType, typeof COUPON_RATES.pcs][]).map(([k, r]) => (
          <button
            key={k}
            onClick={() => { setType(k); setCode(""); setErrors({}); }}
            className="p-4 rounded-2xl text-left transition-all"
            style={{
              background: type === k ? "#1B5E20" + "44" : "var(--bg-card)",
              border: `2px solid ${type === k ? "#25D366" : "var(--border)"}`,
            }}
          >
            <p className="font-black text-white text-sm">{k === "pcs" ? "PCS Mastercard" : "Transcash"}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              {r.rate} FCFA/€ · {r.commission > 0 ? `${r.commission}% commission` : "0% commission"}
            </p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
              Code : {r.codeLength} {r.codeType === "alphanumérique" ? "chars" : "chiffres"}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <Field label="Valeur du coupon (€ — minimum 20€)" error={errors.amount}>
          <input
            type="number" min="20" placeholder="ex: 50"
            value={amount}
            autoFocus
            onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); setShowCalc(false); }}
            className={inputCls} style={errors.amount ? inputErr : inputBase}
          />
        </Field>

        {/* Tableau de calcul — toggleable */}
        {numAmt >= 20 && (
          <div>
            <button
              type="button"
              onClick={() => setShowCalc(v => !v)}
              className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              style={{ background: showCalc ? "#1B5E2022" : "var(--bg-card)", border: "1px solid #25D36633", color: "#25D366" }}
            >
              📊 {showCalc ? "Masquer" : "Voir"} le tableau de calcul
            </button>
            {showCalc && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-4 mt-2"
                style={{ background: "#1B5E2022", border: "1px solid #25D36644" }}
              >
                <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: "#25D366" }}>
                  Tableau de calcul
                </p>
                <div className="flex flex-col">
                  {[
                    ["Valeur du coupon", `${numAmt}€`],
                    ...(rate.commission > 0
                      ? [
                        [`Commission ${type.toUpperCase()} (${rate.commission}%)`, `− ${commission.toFixed(2)}€`],
                        ["Valeur nette", `${netAmt.toFixed(2)}€`],
                      ]
                      : [["Commission", "0€ (0%)"]]),
                    ["Taux d'échange", `${rate.rate} FCFA/€`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
                      <span className="text-sm font-bold text-white tabular-nums">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 mt-1">
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: "#25D366" }}>Vous recevez</span>
                    <span className="text-xl font-black tabular-nums" style={{ color: "var(--gold)" }}>
                      {fcfaResult.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <Field label={`Code ${type === "pcs" ? "PCS (8 caractères alphanumériques)" : "Transcash (12 chiffres)"}`} error={errors.code}>
          <input
            type={type === "transcash" ? "tel" : "text"}
            inputMode={type === "transcash" ? "numeric" : undefined}
            placeholder={type === "pcs" ? "XXXXXXXX" : "XXXX-XXXX-XXXX"}
            value={code}
            maxLength={type === "transcash" ? 14 : 8}
            onChange={e => {
              if (type === "transcash") {
                setCode(formatTranscash(e.target.value));
              } else {
                setCode(e.target.value.toUpperCase());
              }
              setErrors(p => ({ ...p, code: "" }));
            }}
            className={inputCls}
            style={errors.code ? inputErr : inputBase}
          />
        </Field>

        <Field label="Nom du bénéficiaire" error={errors.name}>
          <input type="text" placeholder="Votre nom complet" value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
            className={inputCls} style={errors.name ? inputErr : inputBase}
          />
        </Field>

        <Field label="Adresse email" error={errors.email}>
          <input type="email" placeholder="votre@email.com" value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
            className={inputCls} style={errors.email ? inputErr : inputBase}
          />
        </Field>

        <Field label="Réception Mobile Money" error={errors.phone}>
          <div className="flex flex-col gap-2">
            {/* Tous les opérateurs — grille 2×2 */}
            <div className="grid grid-cols-2 gap-2">
              {MOMO_OPERATORS.map(o => (
                <button type="button" key={o.id} onClick={() => setMomoOp(o.id)}
                  className="flex items-center gap-2 p-2.5 rounded-xl transition-all"
                  style={{ background: momoOp === o.id ? o.color + "20" : "var(--bg-card)", border: `2px solid ${momoOp === o.id ? o.color : "var(--border)"}` }}>
                  <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0">
                    <Image src={o.image} alt={o.name} fill style={{ objectFit: "cover" }} unoptimized />
                  </div>
                  <span className="text-xs font-bold leading-tight truncate" style={{ color: momoOp === o.id ? o.color : "var(--text-secondary)" }}>{o.name}</span>
                </button>
              ))}
            </div>
            {/* Numéro avec indicatif libre */}
            <div className="flex gap-2">
              <input
                type="text"
                value={dialCode}
                onChange={e => {
                  let v = e.target.value.replace(/[^0-9+]/g, "");
                  if (!v.startsWith("+")) v = "+" + v;
                  setDialCode(v.slice(0, 5));
                }}
                placeholder="+237"
                maxLength={5}
                className="px-3 py-3 rounded-2xl text-sm font-bold text-center outline-none w-20 shrink-0"
                style={{ background: "var(--bg-elevated)", border: "2px solid var(--gold)", color: "var(--text-primary)" }}
              />
              <input
                type="tel"
                placeholder={dialCode === "+237" ? "6XXXXXXXX" : "Votre numéro"}
                value={phone}
                maxLength={dialCode === "+237" ? 9 : 15}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setErrors(p => ({ ...p, phone: "" })); }}
                className="flex-1 px-4 py-3 rounded-2xl text-white text-sm outline-none"
                style={errors.phone ? inputErr : inputBase}
              />
            </div>
          </div>
        </Field>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={handleAddToCart}
          className="w-full py-4 rounded-full font-black text-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
          style={{ background: "var(--gold)" }}
        >
          🛒 Ajouter au panier
        </button>
        <WAPopover
          onBeforeOpen={() => { const ok = validate(); if (!ok) { showToast("Corrigez les erreurs", "error"); return false; } sendNotification(); return true; }}
          getMsg={buildMsgPlain}
          prefillPrenom={name}
          className="w-full py-3 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
          style={{ background: "#25D366" }}
        >
          <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
          Démarrer directement via WhatsApp
        </WAPopover>
      </div>

      <div className="mt-8 rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <p className="font-bold text-white text-sm mb-4">Comment ça marche ?</p>
        {["Remplissez le formulaire et vérifiez le calcul", "Cliquez sur Ajouter au panier ou WhatsApp", "Notre agent vérifie votre code coupon", "Recevez vos FCFA sur Mobile Money en quelques minutes"].map((s, i) => (
          <div key={i} className="flex items-start gap-3 text-xs mb-3 last:mb-0" style={{ color: "var(--text-secondary)" }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
              {i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>
      <StepGuide title="Comment échanger un coupon PCS / Transcash — Étape par étape" steps={STEPS_COUPONS} />
      <FAQ items={PAGE_FAQ} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_FAQ_SCHEMA) }} />
      <RelatedServices current="coupons" />
    </div>
  );
}

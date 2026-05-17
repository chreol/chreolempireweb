"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { COUPON_RATES, MOMO_OPERATORS, IMAGES } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import FAQ from "@/components/FAQ";
import { Field } from "@/components/FormField";

const PAGE_FAQ = [
  { q: "Comment échanger un coupon Transcash en FCFA au Cameroun ?", a: "Envoyez votre code Transcash sur WhatsApp avec le montant en €. Nous vérifions le code et vous virons le FCFA équivalent au taux de 440 FCFA/€ sur MTN MoMo ou Orange Money en 15 minutes. Minimum 20€ par échange." },
  { q: "Quel est le taux de change PCS Mastercard en FCFA ?", a: "Le taux PCS Mastercard est de 440 FCFA/€ après déduction de la commission de 7%. Formule : (montant − 7%) × 440 FCFA. Exemple : coupon de 100€ → 93€ × 440 = 40 920 FCFA reçus sur votre Mobile Money." },
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
  const { addItem } = useCart();
  const { addEntry } = useHistory();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [type, setType]         = useState<CouponType>("pcs");
  const [amount, setAmount]     = useState("");
  const [code, setCode]         = useState("");
  const [name, setName]         = useState("");
  const [momoOp, setMomoOp]     = useState("orange");
  const [phone, setPhone]       = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [showCalc, setShowCalc] = useState(false);

  const rate       = COUPON_RATES[type];
  const numAmt     = parseFloat(amount) || 0;
  const commission = rate.commission > 0 ? numAmt * rate.commission / 100 : 0;
  const netAmt     = numAmt - commission;
  const fcfaResult = Math.round(netAmt * rate.rate);

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || numAmt <= 0) { e.amount = "Montant requis"; }
    else if (numAmt < 20)       { e.amount = "Minimum 20€"; }
    if (!code.trim()) e.code = "Code requis";
    if (!name.trim()) e.name = "Nom requis";
    const phoneD = phone.replace(/\D/g, "").replace(/^237/, "");
    if (phoneD.length < 9) e.phone = "Numéro invalide (9 chiffres)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildDetails() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const typeName = type === "pcs" ? "PCS Mastercard" : "Transcash";
    return `${typeName} ${amount}€ | Code : ${code.trim()}\n${op} +237 ${phone} | Nom : ${name}`;
  }

  function buildMsgPlain() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const typeName = type === "pcs" ? "PCS Mastercard" : "Transcash";
    return `🎫 ÉCHANGE COUPON\nType : ${typeName}\nValeur : ${amount}€\nCode : ${code.trim()}\nCommission : ${rate.commission}%\nÀ recevoir : ${fcfaResult.toLocaleString("fr-FR")} FCFA\n\n💰 Réception MoMo\nOpérateur : ${op}\nNuméro : +237 ${phone}\nNom : ${name}`;
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
          <div className="relative">
            <input
              type="text"
              placeholder={type === "pcs" ? "XXXXXXXX" : "123456789012"}
              value={code}
              maxLength={type === "pcs" ? undefined : 14}
              onChange={e => {
                const val = type === "pcs" ? e.target.value.toUpperCase() : e.target.value;
                setCode(val);
                setErrors(p => ({ ...p, code: "" }));
              }}
              className={inputCls}
              style={errors.code ? inputErr : inputBase}
            />
          </div>
        </Field>

        <Field label="Nom du bénéficiaire" error={errors.name}>
          <input type="text" placeholder="Votre nom complet" value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
            className={inputCls} style={errors.name ? inputErr : inputBase}
          />
        </Field>

        <Field label="Réception Mobile Money" error={errors.phone}>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                {MOMO_OPERATORS.slice(0, 2).map(o => (
                  <button type="button" key={o.id} onClick={() => setMomoOp(o.id)}
                    className="flex-1 flex items-center gap-2 p-2.5 rounded-xl transition-all"
                    style={{ background: momoOp === o.id ? o.color + "20" : "var(--bg-card)", border: `2px solid ${momoOp === o.id ? o.color : "var(--border)"}` }}>
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                      <Image src={o.image} alt={o.name} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                    <span className="text-xs font-bold leading-tight" style={{ color: momoOp === o.id ? o.color : "var(--text-secondary)" }}>{o.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center rounded-2xl overflow-hidden" style={errors.phone ? inputErr : inputBase}>
                <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                <input type="tel" placeholder="6XXXXXXXX" value={phone}
                  maxLength={9}
                  onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: "" })); }}
                  className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                />
              </div>
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
          onBeforeOpen={() => { const ok = validate(); if (!ok) showToast("Corrigez les erreurs", "error"); return ok; }}
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
      <FAQ items={PAGE_FAQ} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_FAQ_SCHEMA) }} />
      <div className="mt-8 rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Voir aussi</p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/services/paypal",          label: "💸 PayPal Europe" },
            { href: "/services/crypto",           label: "₿ Crypto & MoMo" },
            { href: "/services/cartes-cadeaux",   label: "🎮 Cartes Cadeaux" },
          ].map(l => (
            <a key={l.href} href={l.href}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
              style={{ background: "var(--bg-elevated)", color: "var(--gold)", border: "1px solid var(--border)" }}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { PAYPAL_RATES, PAYPAL_LIMITS, MOMO_OPERATORS, IWOPAY_METHOD, PAYPAL_PAY_METHOD, CRYPTO_PAY_METHOD, IWOPAY_SCOPE, IMAGES, CONTACT, ORANGE_MONEY_COMMERCE, MTN_MONEY, collectionFee, collectionFeeLabel, isAltPay } from "@/lib/services";
import { saveClientInfo } from "@/lib/clientInfo";
import WAPopover from "@/components/WAPopover";
import USSDOrderFlow from "@/components/USSDOrderFlow";
import PayInstruction from "@/components/PayInstruction";
import RelatedServices from "@/components/RelatedServices";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import FAQ from "@/components/FAQ";
import StepGuide from "@/components/StepGuide";
import { Field, CalcRow } from "@/components/FormField";
import { makeId } from "@/lib/uid";

// FAQ en français pour le JSON-LD SEO
const FAQ_FR = [
  { q: "Comment vendre son solde PayPal en FCFA au Cameroun ?", a: "3 étapes simples : (1) envoyez le montant en € à notre compte PayPal communiqué sur WhatsApp, (2) partagez la capture de confirmation d'envoi, (3) recevez votre FCFA sur MTN MoMo ou Orange Money en moins de 30 minutes. Taux garanti au moment de la transaction." },
  { q: "Quel est le taux de change PayPal en FCFA en 2026 ?", a: "Nous achetons votre solde PayPal à 520 FCFA par euro et vendons à 700 FCFA par euro. Ces taux sont mis à jour régulièrement selon le marché. Consultez notre ticker en haut de page pour le cours en temps réel." },
  { q: "Peut-on acheter du solde PayPal avec Orange Money au Cameroun ?", a: "Oui, minimum 3 500 FCFA (environ 5€). Payez via Orange Money, MTN MoMo ou Express Union et recevez le solde PayPal correspondant dans les 30 minutes. Votre compte PayPal doit être européen (France, Belgique, Suisse…)." },
  { q: "Chreol Empire travaille-t-il avec les comptes PayPal camerounais ?", a: "Non. Nous travaillons uniquement avec des comptes PayPal européens (France, Belgique, Italie, Espagne, Suisse…). Les comptes africains ou camerounais ne sont pas éligibles en raison des restrictions PayPal sur les transferts internationaux." },
];

const PAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_FR.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

type IdFormat = "email" | "phone" | "paypalme";
type Errors = Record<string, string> | undefined;

function PaypalIdField({
  idFormat, setIdFormat, paypalId, setPaypalId,
  errors, setErrors, label, inputBase, inputErr, inputCls, ID_FORMATS,
}: {
  idFormat: IdFormat;
  setIdFormat: (f: IdFormat) => void;
  paypalId: string;
  setPaypalId: (v: string) => void;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
  label: string;
  inputBase: React.CSSProperties;
  inputErr: React.CSSProperties;
  inputCls: string;
  ID_FORMATS: readonly { id: IdFormat; label: string; placeholder: string; icon: string }[];
}) {
  return (
    <Field label={label} error={errors?.paypalId}>
      {/* Switcher de format */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {ID_FORMATS.map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => { setIdFormat(f.id); setPaypalId(""); setErrors(p => p ? { ...p, paypalId: "" } : undefined); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all"
            style={{
              background: idFormat === f.id ? "#003087" : "var(--bg-card)",
              border: `1.5px solid ${idFormat === f.id ? "#003087" : "var(--border)"}`,
              color: idFormat === f.id ? "#fff" : "var(--text-secondary)",
            }}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>
      {/* Input dynamique */}
      {idFormat === "phone" ? (
        <div className="flex items-center rounded-2xl overflow-hidden" style={errors?.paypalId ? inputErr : inputBase}>
          <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+</span>
          <input
            type="tel" placeholder="33 6 XX XX XX XX" value={paypalId}
            onChange={e => { setPaypalId(e.target.value); setErrors(p => p ? { ...p, paypalId: "" } : undefined); }}
            className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
          />
        </div>
      ) : idFormat === "paypalme" ? (
        <div className="flex items-center rounded-2xl overflow-hidden" style={errors?.paypalId ? inputErr : inputBase}>
          <span className="px-3 text-sm font-bold shrink-0 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>paypal.me/</span>
          <input
            type="text" placeholder="monlien" value={paypalId}
            onChange={e => { setPaypalId(e.target.value); setErrors(p => p ? { ...p, paypalId: "" } : undefined); }}
            className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
          />
        </div>
      ) : (
        <input
          type="email" placeholder="exemple@email.com" value={paypalId}
          onChange={e => { setPaypalId(e.target.value); setErrors(p => p ? { ...p, paypalId: "" } : undefined); }}
          className={inputCls} style={errors?.paypalId ? inputErr : inputBase}
        />
      )}
    </Field>
  );
}

export default function PaypalPage() {
  useEffect(() => { track("service_view", { service: "paypal" }); }, []);
  const { addItem } = useCart();
  const { addEntry } = useHistory();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const orderIdRef = useRef("");
  const [direction, setDirection]     = useState<"sell" | "buy">("sell");
  const [inputCurrency, setInputCurrency] = useState<"EUR" | "FCFA">("EUR");
  const [amount, setAmount]           = useState("");
  const [idFormat, setIdFormat]       = useState<"email" | "phone" | "paypalme">("email");
  const [paypalId, setPaypalId]       = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [momoOp, setMomoOp]           = useState("orange");
  const [momoDialCode, setMomoDialCode] = useState("+237");
  const [momoPhone, setMomoPhone]     = useState("");
  const [errors, setErrors]           = useState<Record<string, string>>();
  const [publicRef, setPublicRef]     = useState("");
  const [payoutWallet, setPayoutWallet] = useState("");
  const [payLine, setPayLine]         = useState("");

  const AVAILABLE_OPS: readonly string[] = direction === "sell"
    ? ["orange", "mtn", "crypto"]
    : ["orange", "mtn", "iwopay", "gimac", "paypal", "crypto"];
  const PAY_CHOICES = [
    ...MOMO_OPERATORS.filter(o => o.id === "orange" || o.id === "mtn"),
    IWOPAY_METHOD,
    ...MOMO_OPERATORS.filter(o => o.id === "gimac"),
    PAYPAL_PAY_METHOD,
    CRYPTO_PAY_METHOD,
    ...MOMO_OPERATORS.filter(o => o.id === "eu" || o.id === "yoomee"),
  ];

  useEffect(() => {
    if (!AVAILABLE_OPS.includes(momoOp)) setMomoOp("orange");
  }, [direction]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = makeId(`paypal-${direction}`);
    orderIdRef.current = id;
    setPublicRef(id.slice(-8).toUpperCase());
  }, [direction]);

  const ID_FORMATS = [
    { id: "email",    label: "Email",         placeholder: "exemple@email.com",  icon: "✉️" },
    { id: "phone",    label: t("pp.id_phone"), placeholder: "+33 6 XX XX XX XX",  icon: "📱" },
    { id: "paypalme", label: "PayPal.me",     placeholder: "PayPal.me/monlien",  icon: "🔗" },
  ] as const;

  const { sellRate, buyRate } = PAYPAL_RATES;

  const STEPS_PAYPAL = [
    { icon: "💸", title: t("pp.step1.t"), description: t("pp.step1.d"), tip: t("pp.step1.tip") },
    { icon: "💶", title: t("pp.step2.t"), description: t("pp.step2.d") },
    { icon: "💬", title: t("pp.step3.t"), description: t("pp.step3.d") },
    { icon: "🔄", title: t("pp.step4.t"), description: t("pp.step4.d") },
    { icon: "✅", title: t("pp.step5.t"), description: t("pp.step5.d"), tip: t("pp.step5.tip") },
  ];
  const PAGE_FAQ = [
    { q: t("pp.faq1.q"), a: t("pp.faq1.a") },
    { q: t("pp.faq2.q"), a: t("pp.faq2.a") },
    { q: t("pp.faq3.q"), a: t("pp.faq3.a") },
    { q: t("pp.faq4.q"), a: t("pp.faq4.a") },
  ];

  function switchDirection(d: "sell" | "buy") {
    setDirection(d); setAmount(""); setErrors(undefined);
    setInputCurrency(d === "sell" ? "EUR" : "FCFA");
    setContactEmail(""); setPaypalId("");
  }

  const numAmount = parseFloat(amount) || 0;

  // Quand l'identifiant PayPal est un email, il sert aussi d'email de contact :
  // on évite ainsi de demander deux fois la même information.
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usesPaypalEmailAsContact = idFormat === "email";
  const effectiveEmail = (usesPaypalEmailAsContact ? paypalId : contactEmail).trim();

  // Sell: user sells PayPal → receives FCFA
  const sellEur   = direction === "sell"
    ? (inputCurrency === "EUR"  ? numAmount : numAmount / sellRate) : 0;
  const fcfaResult = direction === "sell"
    ? (inputCurrency === "EUR"  ? Math.round(numAmount * sellRate) : Math.round(numAmount)) : 0;

  // Buy: user buys PayPal → pays FCFA
  const buyFcfa   = direction === "buy"
    ? (inputCurrency === "FCFA" ? numAmount : Math.round(numAmount * buyRate)) : 0;
  const eurResult  = direction === "buy"
    ? (inputCurrency === "FCFA" ? +(numAmount / buyRate).toFixed(2) : +numAmount.toFixed(2)) : 0;

  const displayEur  = direction === "sell" ? sellEur  : eurResult;

  // ── Commission Orange Money (1 %) ──────────────────────────────────────────
  // Les encaissements marchands Orange Money sont facturés 1 %. On l'affiche
  // séparément et on l'ajoute au montant à régler (uniquement à l'achat).
  const operatorFee = direction === "buy" ? collectionFee(buyFcfa, momoOp) : 0;
  const feeLabel   = collectionFeeLabel(momoOp);
  const buyTotal   = buyFcfa + operatorFee;
  const totalDue   = direction === "sell" ? fcfaResult : buyTotal;

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || numAmount <= 0) {
      e.amount = t("err.amount_required");
    } else if (direction === "sell") {
      const inEur = inputCurrency === "EUR" ? numAmount : numAmount / sellRate;
      if (inEur < PAYPAL_LIMITS.sell.min) e.amount = t("pp.min", { v: `${PAYPAL_LIMITS.sell.min}€ (≈ ${Math.ceil(PAYPAL_LIMITS.sell.min * sellRate).toLocaleString("fr-FR")} FCFA)` });
      else if (inEur > PAYPAL_LIMITS.sell.max) e.amount = t("pp.max", { v: PAYPAL_LIMITS.sell.max });
    } else {
      const inFcfa = inputCurrency === "FCFA" ? numAmount : numAmount * buyRate;
      if (inFcfa < PAYPAL_LIMITS.buy.min) e.amount = t("pp.min", { v: `${PAYPAL_LIMITS.buy.min.toLocaleString("fr-FR")} FCFA (≈ ${+(PAYPAL_LIMITS.buy.min / buyRate).toFixed(0)}€)` });
    }
    if (!paypalId.trim()) e.paypalId = t("pp.id_required");
    else if (idFormat === "email" && !emailRe.test(paypalId)) e.paypalId = t("pp.email_invalid");
    if (!usesPaypalEmailAsContact && (!contactEmail.trim() || !emailRe.test(contactEmail))) {
      e.contactEmail = t("err.email_valid");
    }
    // Le numéro Mobile Money sert aussi de contact : il est désormais obligatoire
    // dans les deux sens (le champ « numéro WhatsApp » a été supprimé).
    if (direction === "sell" && momoOp === "crypto") {
      if (payoutWallet.trim().length < 8) e.payoutWallet = "Adresse de réception requise";
    } else {
      const mpD = momoPhone.replace(/\D/g, "").replace(/^237/, "");
      const mpLen = momoDialCode === "+237" ? 9 : 6;
      if (mpD.length < mpLen) e.momoPhone = t("err.phone_invalid");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const idLabel = ID_FORMATS.find(f => f.id === idFormat)?.label ?? "Email";

  function buildDetails() {
    const op = PAY_CHOICES.find(o => o.id === momoOp)?.name ?? momoOp;
    const idLine = `PayPal (${idLabel}) : ${paypalId}`;
    const contact = `${op} ${momoDialCode} ${momoPhone}`;
    if (direction === "sell")
      return `${idLine} | ${displayEur.toFixed(2)}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA\n${contact}`;
    return `${idLine} | ${buyFcfa.toLocaleString("fr-FR")} FCFA → ${eurResult}€\n${feeLabel} : ${operatorFee.toLocaleString("fr-FR")} FCFA\nTotal à payer : ${buyTotal.toLocaleString("fr-FR")} FCFA\n${contact}`;
  }

  function buildMsgPlain() {
    const op  = PAY_CHOICES.find(o => o.id === momoOp)?.name ?? momoOp;
    const ref = orderIdRef.current ? ` — Réf #${orderIdRef.current.slice(-8).toUpperCase()}` : "";
    if (direction === "sell") {
      const reception = momoOp === "crypto"
        ? `\n\n💰 Réception crypto\n${payLine || payoutWallet}`
        : `\n\n💰 Réception MoMo\nOpérateur : ${op}\nNuméro : ${momoDialCode} ${momoPhone}`;
      return `💸 VENTE PAYPAL${ref}\nCompte PayPal (${idLabel}) : ${paypalId}\nMontant : ${displayEur.toFixed(2)}€\nÀ recevoir : ${fcfaResult.toLocaleString("fr-FR")} FCFA\nTaux : 1€ = ${sellRate} FCFA${reception}`;
    }
    const payDetail = isAltPay(momoOp) && payLine ? `\n${payLine}` : `\nNuméro : ${momoDialCode} ${momoPhone}`;
    return `💳 ACHAT PAYPAL${ref}\nCompte PayPal (${idLabel}) : ${paypalId}\nMontant : ${buyFcfa.toLocaleString("fr-FR")} FCFA\n${feeLabel} : ${operatorFee.toLocaleString("fr-FR")} FCFA\nTotal payé : ${buyTotal.toLocaleString("fr-FR")} FCFA\nÀ recevoir : ${eurResult}€\nTaux : 1€ = ${buyRate} FCFA\n\n💰 Paiement\nOpérateur : ${op}${payDetail}`;
  }

  async function sendNotification() {
    const op = PAY_CHOICES.find(o => o.id === momoOp)?.name ?? momoOp;
    const phone = `${momoDialCode}${momoPhone}`.replace(/\D/g, "");
    if (!orderIdRef.current) {
      const id = makeId(`paypal-${direction}`);
      orderIdRef.current = id;
      setPublicRef(id.slice(-8).toUpperCase());
    }
    try {
      const res = await fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: orderIdRef.current,
        clientName: effectiveEmail.split("@")[0] || "Client PayPal",
        clientEmail: effectiveEmail,
        clientPhone: phone,
        paymentMethod: op,
        items: [{
          name: direction === "sell" ? "Vente PayPal Europe" : "Achat PayPal Europe",
          qty: 1,
          price: direction === "sell" ? fcfaResult : buyTotal,
          amount: direction === "sell"
            ? `${displayEur.toFixed(2)}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA`
            : `${buyFcfa.toLocaleString("fr-FR")} FCFA → ${eurResult}€`,
          details: buildDetails(),
        }],
        total: totalDue,
        commission: operatorFee > 0 ? operatorFee : undefined,
        commissionLabel: operatorFee > 0 ? feeLabel : undefined,
        // Permet à l'email de distinguer une vente (le client envoie des €)
        // d'un achat (le client règle en FCFA) et d'afficher les bonnes instructions.
        flow: direction,
        paypalId,
        paypalIdFormat: idFormat,
        eurAmount: direction === "sell" ? +displayEur.toFixed(2) : eurResult,
        payoutTarget: `${op} · ${momoDialCode} ${momoPhone}`,
        sourceUrl: window.location.pathname,
      }),
    });
      const data = await res.json().catch(() => ({} as { error?: string; telegram?: number }));
      if (!res.ok) {
        showToast(typeof data.error === "string" ? data.error : "L'email de confirmation n'a pas pu partir.", "error");
        return;
      }
      if (!data.telegram) {
        console.warn("[paypal] email envoyé, Telegram non joint", data);
      }
    } catch {
      showToast("Impossible de joindre le serveur de notification. Réessayez.", "error");
    }
  }

  function handleAddToCart() {
    if (!validate()) { showToast(t("err.fix"), "error"); return; }
    saveClientInfo({ email: effectiveEmail, phone: momoPhone, dialCode: momoDialCode, name: effectiveEmail.split("@")[0] });
    const op = PAY_CHOICES.find(o => o.id === momoOp)?.name ?? momoOp;
    addItem({
      id: makeId(`paypal-${direction}`),
      cardName: direction === "sell" ? "Vente PayPal Europe" : "Achat PayPal Europe",
      amount: direction === "sell"
        ? `${displayEur.toFixed(2)}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA via ${op}`
        : `${buyFcfa.toLocaleString("fr-FR")} FCFA → ${eurResult}€ (${feeLabel} : ${operatorFee.toLocaleString("fr-FR")} FCFA)`,
      price: totalDue,
      type: direction === "sell" ? "sell" : "buy",
      details: buildDetails(),
    });
    addEntry({
      service: `PayPal — ${direction === "sell" ? "Vente" : "Achat"}`,
      details: direction === "sell" ? `${displayEur.toFixed(2)}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA` : `${buyFcfa.toLocaleString("fr-FR")} FCFA → ${eurResult}€`,
      amount: totalDue,
      currency: "FCFA",
      status: "pending",
    });
    showToast("PayPal ajouté au panier !", "success");
  }


  const inputCls  = "w-full px-4 py-3 rounded-2xl text-white text-sm outline-none";
  const inputBase = { background: "var(--bg-elevated)", border: "1px solid var(--border)" };
  const inputErr  = { ...inputBase, borderColor: "#EF4444" };

  return (
    <div className="max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/services" className="hover:text-white transition-colors">{t("nav.services")}</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>{t("pp.breadcrumb")}</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">{t("p.paypal.title")}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        {t("p.paypal.sub")}
      </p>

      {/* Direction toggle */}
      <div className="flex rounded-2xl p-1 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {(["sell", "buy"] as const).map(d => (
          <button
            key={d}
            onClick={() => switchDirection(d)}
            className="flex-1 py-3 rounded-xl font-black text-sm transition-all"
            style={{
              background: direction === d ? "var(--gold)" : "transparent",
              color: direction === d ? "#0A0A0A" : "var(--text-secondary)",
            }}
          >
            {d === "sell" ? t("pp.sell_tab") : t("pp.buy_tab")}
          </button>
        ))}
      </div>

      {/* Rate card */}
      <div className="rounded-2xl p-4 mb-6" style={{ background: "#003087" + "22", border: "1px solid #003087" + "55" }}>
        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>{t("pp.rate_label")}</p>
            <p className="font-black tabular-nums" style={{ color: "var(--text-primary)" }}>1€ = {direction === "sell" ? sellRate : buyRate} FCFA</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>{t("pp.input_in")}</p>
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              {(["EUR", "FCFA"] as const).map(c => (
                <button key={c} type="button" onClick={() => { setInputCurrency(c); setAmount(""); setErrors(undefined); }}
                  className="px-3 py-1.5 text-xs font-black transition-all"
                  style={{ background: inputCurrency === c ? "#003087" : "transparent", color: inputCurrency === c ? "#fff" : "var(--text-muted)" }}>
                  {c === "EUR" ? "€ EUR" : "FCFA"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={direction}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col gap-5"
        >
          <Field
            label={direction === "sell"
              ? (inputCurrency === "EUR" ? t("pp.amount_sell_eur") : t("pp.amount_sell_fcfa"))
              : (inputCurrency === "FCFA" ? t("pp.amount_buy_fcfa") : t("pp.amount_buy_eur"))}
            error={errors?.amount}
          >
            <div className="relative">
              <input
                type="number" min="0"
                placeholder={
                  direction === "sell"
                    ? (inputCurrency === "EUR" ? `ex: 50 (min ${PAYPAL_LIMITS.sell.min}€)` : `ex: ${(PAYPAL_LIMITS.sell.min * sellRate).toLocaleString("fr-FR")} FCFA`)
                    : (inputCurrency === "FCFA" ? `ex: ${PAYPAL_LIMITS.buy.min.toLocaleString("fr-FR")} FCFA` : "ex: 20€")
                }
                value={amount}
                onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
                className={`${inputCls} pr-16`} style={errors?.amount ? inputErr : inputBase}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black pointer-events-none"
                style={{ color: "var(--text-muted)" }}>
                {inputCurrency === "EUR" ? "€" : "FCFA"}
              </span>
            </div>
          </Field>

          {/* Tableau de calcul */}
          {numAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-4"
              style={{ background: "#003087" + "18", border: "1px solid #003087" + "55" }}
            >
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: "#5B8FE8" }}>
                {t("common.calc_table")}
              </p>
              {direction === "sell" ? (
                <>
                  <CalcRow label={t("pp.sold")} value={`${displayEur.toFixed(2)}€`} />
                  <CalcRow label={t("pp.sell_rate")} value={`1€ = ${sellRate} FCFA`} />
                  <CalcRow label="Commission" value={t("common.commission_0")} />
                  <CalcRow label={t("common.you_receive")} value={`${fcfaResult.toLocaleString("fr-FR")} FCFA`} highlight />
                </>
              ) : (
                <>
                  <CalcRow label={t("pp.fcfa_to_pay")} value={`${buyFcfa.toLocaleString("fr-FR")} FCFA`} />
                  <CalcRow label={t("pp.buy_rate")} value={`1€ = ${buyRate} FCFA`} />
                  <CalcRow label={feeLabel} value={`+ ${operatorFee.toLocaleString("fr-FR")} FCFA`} />
                  <CalcRow label="Total à payer" value={`${buyTotal.toLocaleString("fr-FR")} FCFA`} />
                  <CalcRow label={t("common.you_receive")} value={`${eurResult}€`} highlight />
                </>
              )}
            </motion.div>
          )}

          {/* ── Identifiant PayPal — affiché EN PREMIER seulement en mode VENTE ── */}
          {direction === "sell" && <PaypalIdField
            idFormat={idFormat} setIdFormat={setIdFormat}
            paypalId={paypalId} setPaypalId={setPaypalId}
            errors={errors} setErrors={setErrors}
            label={t("pp.id_sell")}
            inputBase={inputBase} inputErr={inputErr} inputCls={inputCls}
            ID_FORMATS={ID_FORMATS}
          />}

          {direction === "sell" && displayEur > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "#00308718", border: "1px solid #00308755" }}>
              <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: "#5B8FE8" }}>
                💶 Envoyez {displayEur.toFixed(2)}€ sur notre compte PayPal
              </p>
              <p className="text-sm font-black break-all" style={{ color: "var(--text-primary)" }}>{CONTACT.paypalEmail}</p>
              <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
                Motif : <strong className="tabular-nums">#{publicRef || "REF"}</strong> · type d&apos;envoi : <strong>Proches et Familles</strong>
              </p>
              <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                Le même motif est repris dans l&apos;email de confirmation et la notification Telegram.
              </p>
            </div>
          )}

          <Field label={direction === "sell" ? t("f.momo_receive") : t("f.momo_pay")} error={errors?.momoPhone}>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                {PAY_CHOICES.map(o => {
                  const open = AVAILABLE_OPS.includes(o.id);
                  const active = open && momoOp === o.id;
                  return (
                    <button
                      type="button"
                      key={o.id}
                      disabled={!open}
                      onClick={() => { if (open) setMomoOp(o.id); }}
                      className="flex items-center gap-2 p-2.5 rounded-xl transition-all text-left disabled:cursor-not-allowed"
                      style={{
                        background: active ? o.color + "20" : "var(--bg-card)",
                        border: `2px solid ${active ? o.color : "var(--border)"}`,
                        opacity: open ? 1 : 0.55,
                      }}
                    >
                      {o.image ? (
                        <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0">
                          <Image src={o.image} alt={o.name} fill style={{ objectFit: "cover" }} unoptimized />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-[11px] shrink-0"
                          style={{ background: o.color }}>{o.name.slice(0, 1)}</div>
                      )}
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold leading-tight" style={{ color: active ? o.color : "var(--text-secondary)" }}>{o.name}</span>
                        <span className="block text-[9px] font-black uppercase tracking-wide" style={{ color: open ? "#22C55E" : "var(--text-muted)" }}>
                          {open ? "Disponible" : "Indisponible"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Indicatif et numéro : deux champs distincts, séparés par un petit espace */}
              {!(direction === "sell" && momoOp === "crypto") && (
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={momoDialCode}
                  onChange={e => {
                    let v = e.target.value.replace(/[^0-9+]/g, "");
                    if (!v.startsWith("+")) v = "+" + v;
                    setMomoDialCode(v.slice(0, 5));
                  }}
                  placeholder="+237"
                  maxLength={5}
                  aria-label="Indicatif"
                  className="px-3 py-3 rounded-2xl text-sm font-bold text-center outline-none w-20 shrink-0"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "2px solid var(--gold)",
                    color: "var(--text-primary)",
                  }}
                />
                <input type="tel" placeholder={momoDialCode === "+237" ? "6XXXXXXXX" : t("pp.your_number")} value={momoPhone}
                  maxLength={momoDialCode === "+237" ? 9 : 15}
                  aria-label="Numéro Mobile Money"
                  onChange={e => { setMomoPhone(e.target.value.replace(/\D/g, "")); setErrors(p => p ? { ...p, momoPhone: "" } : undefined); }}
                  className="flex-1 px-4 py-3 rounded-2xl text-white text-sm outline-none"
                  style={errors?.momoPhone ? inputErr : inputBase}
                />
              </div>
              )}
            </div>
          </Field>

          {/* ── Compte marchand Orange Money : QR + code marchand (achat uniquement) ── */}
          {momoOp === "orange" && direction === "buy" && (
            <div className="rounded-2xl p-4" style={{ background: "#FF660010", border: "1px solid #FF660044" }}>
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: "#FF6600" }}>
                🟠 Compte marchand Orange Money
              </p>
              <div className="flex gap-4 items-start">
                <a
                  href={ORANGE_MONEY_COMMERCE.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-40 h-40 rounded-xl overflow-hidden shrink-0 block"
                  style={{ background: "#FFFFFF" }}
                  aria-label="Agrandir le QR code marchand Orange Money"
                >
                  <Image src={ORANGE_MONEY_COMMERCE.image} alt="QR code marchand Orange Money CHREOL EMPIRE" fill style={{ objectFit: "contain" }} unoptimized />
                </a>
                <div className="text-xs flex flex-col gap-1.5" style={{ color: "var(--text-secondary)" }}>
                  <p><span style={{ color: "var(--text-muted)" }}>Code marchand : </span><strong className="tabular-nums" style={{ color: "#FF6600" }}>{ORANGE_MONEY_COMMERCE.merchantCode}</strong></p>
                  <p><span style={{ color: "var(--text-muted)" }}>Nom : </span><strong>{ORANGE_MONEY_COMMERCE.merchantName}</strong></p>
                  <p><span style={{ color: "var(--text-muted)" }}>Réf. QR : </span><strong className="tabular-nums">{ORANGE_MONEY_COMMERCE.qrCode}</strong></p>
                  <p><span style={{ color: "var(--text-muted)" }}>USSD : </span><strong className="tabular-nums">{ORANGE_MONEY_COMMERCE.ussd}</strong></p>
                </div>
              </div>
              <p className="text-[11px] mt-3" style={{ color: "var(--text-muted)" }}>
                Scannez le QR avec Orange Money / Max it, ou composez <strong>{ORANGE_MONEY_COMMERCE.ussd}</strong> → «&nbsp;Payer un marchand&nbsp;» → code <strong>{ORANGE_MONEY_COMMERCE.merchantCode}</strong>.
              </p>
              <a href={ORANGE_MONEY_COMMERCE.poster} target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] font-bold mt-2" style={{ color: "#FF6600" }}>
                Voir l&apos;affiche complète (Orange Chreol Empire.jpeg)
              </a>
            </div>
          )}

          {momoOp === "mtn" && direction === "buy" && (
            <div className="rounded-2xl p-4 text-xs" style={{ background: "#FFC10710", border: "1px solid #FFC10744" }}>
              <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: "#FFC107" }}>🟡 Dépôt MTN Mobile Money</p>
              <p style={{ color: "var(--text-secondary)" }}>Numéro : <strong className="tabular-nums text-white">{MTN_MONEY.phoneDisplay}</strong></p>
              <p className="mt-1" style={{ color: "var(--text-secondary)" }}>Nom : <strong className="text-white">{MTN_MONEY.accountName}</strong></p>
            </div>
          )}

          {momoOp === "iwopay" && direction === "buy" && (
            <div className="rounded-2xl p-4 text-xs" style={{ background: "#0EA5E910", border: "1px solid #0EA5E944" }}>
              <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: "#0EA5E9" }}>💨 Encaissement Iwopay</p>
              <p style={{ color: "var(--text-secondary)" }}>{IWOPAY_SCOPE} Vous validez la demande reçue sur votre téléphone avec votre code secret.</p>
            </div>
          )}

          {direction === "buy" && isAltPay(momoOp) && (
            <PayInstruction kind={momoOp} fcfa={buyTotal} direction="in" onLine={setPayLine} />
          )}

          {direction === "sell" && momoOp === "crypto" && (
            <>
              <PayInstruction kind="crypto" fcfa={fcfaResult} direction="out" target={payoutWallet} onTarget={setPayoutWallet} onLine={setPayLine} />
              {errors?.payoutWallet && <p className="text-xs font-bold" style={{ color: "#FCA5A5" }}>{errors.payoutWallet}</p>}
            </>
          )}

          {/* ── Identifiant PayPal — affiché après le numéro Mobile Money en mode ACHAT ── */}
          {direction === "buy" && <PaypalIdField
            idFormat={idFormat} setIdFormat={setIdFormat}
            paypalId={paypalId} setPaypalId={setPaypalId}
            errors={errors} setErrors={setErrors}
            label={t("pp.id_buy")}
            inputBase={inputBase} inputErr={inputErr} inputCls={inputCls}
            ID_FORMATS={ID_FORMATS}
          />}

          {/* ── Email de contact — masqué quand l'identifiant PayPal est déjà un email ── */}
          {usesPaypalEmailAsContact ? (
            <p className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <span>✉️</span>
              {t("pp.email_same_as_paypal")}
            </p>
          ) : (
            <Field label={t("f.email.contact")} error={errors?.contactEmail}>
              <input
                type="email"
                placeholder={t("f.email.ph")}
                value={contactEmail}
                onChange={e => { setContactEmail(e.target.value); setErrors(p => p ? { ...p, contactEmail: "" } : undefined); }}
                className={inputCls}
                style={errors?.contactEmail ? inputErr : inputBase}
              />
            </Field>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={handleAddToCart}
          className="w-full py-4 rounded-full font-black text-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
          style={{ background: "var(--gold)" }}
        >
          {t("btn.add_to_cart")}
        </button>
        {direction === "sell" ? (
          <WAPopover
            onBeforeOpen={() => { const ok = validate(); if (!ok) { showToast(t("err.fix"), "error"); return false; } sendNotification(); return true; }}
            getMsg={buildMsgPlain}
            className="w-full py-3 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
            {t("btn.order_wa_direct")}
          </WAPopover>
        ) : (
          <USSDOrderFlow
            total={buyTotal}
            getMsg={buildMsgPlain}
            onBeforeOpen={() => { const ok = validate(); if (!ok) { showToast(t("err.fix"), "error"); return false; } sendNotification(); return true; }}
            availableOps={["orange", "mtn", "iwopay", "gimac", "paypal", "crypto"]}
            merchantOverride={{
              orange: {
                merchant: ORANGE_MONEY_COMMERCE.merchantCode,
                merchantName: ORANGE_MONEY_COMMERCE.merchantName,
                type: "Scan & Pay / Max it",
                ussdFn: () => ORANGE_MONEY_COMMERCE.ussd,
                qrCode: ORANGE_MONEY_COMMERCE.qrCode,
                qrImage: ORANGE_MONEY_COMMERCE.image,
              },
            }}
            className="w-full py-3 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
            {t("btn.order_wa")}
          </USSDOrderFlow>
        )}
      </div>

      <div className="mt-6 rounded-2xl p-4 text-xs flex flex-col gap-1.5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {[t("pp.notes_1"), t("pp.notes_2"), t("pp.notes_3"), t("pp.notes_4")].map(s => (
          <p key={s} style={{ color: "var(--text-secondary)" }}>✅ {s}</p>
        ))}
      </div>
      <StepGuide title={t("pp.guide_title")} steps={STEPS_PAYPAL} />
      <FAQ items={PAGE_FAQ} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_FAQ_SCHEMA) }} />
      <RelatedServices current="paypal" />
    </div>
  );
}

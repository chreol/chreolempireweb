"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { PAYPAL_RATES, PAYPAL_LIMITS, MOMO_OPERATORS, IMAGES } from "@/lib/services";
import { saveClientInfo } from "@/lib/clientInfo";
import WAPopover from "@/components/WAPopover";
import USSDOrderFlow from "@/components/USSDOrderFlow";
import RelatedServices from "@/components/RelatedServices";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import FAQ from "@/components/FAQ";
import StepGuide from "@/components/StepGuide";
import { Field, CalcRow } from "@/components/FormField";

const STEPS_PAYPAL = [
  { icon: "💸", title: "Choisissez l'opération — Vente ou Achat", description: "Vente : vous vendez votre solde PayPal contre FCFA (580 FCFA/€). Achat : vous achetez du solde PayPal avec vos FCFA (700 FCFA/€).", tip: "Votre compte PayPal doit être européen (France, Belgique, Suisse…)." },
  { icon: "💶", title: "Entrez le montant et votre email PayPal", description: "Saisissez le montant, votre email de compte PayPal, votre numéro MoMo et votre email de contact pour la confirmation." },
  { icon: "💬", title: "Confirmez via WhatsApp", description: "Envoyez le message pré-rempli à notre agent. Il vous répond sous 15–30 min avec les instructions précises." },
  { icon: "🔄", title: "Effectuez le transfert PayPal ou MoMo", description: "Vente : envoyez le montant à notre compte PayPal communiqué, puis partagez la capture de confirmation. Achat : réglez via MoMo selon les instructions." },
  { icon: "✅", title: "Recevez vos FCFA ou votre solde PayPal", description: "Après confirmation du transfert, les fonds sont envoyés dans les 15–30 minutes. Taux garanti au moment de la transaction.", tip: "Gardez la capture de confirmation PayPal jusqu'à réception des fonds." },
];

const PAGE_FAQ = [
  { q: "Comment vendre son solde PayPal en FCFA au Cameroun ?", a: "3 étapes simples : (1) envoyez le montant en € à notre compte PayPal communiqué sur WhatsApp, (2) partagez la capture de confirmation d'envoi, (3) recevez votre FCFA sur MTN MoMo ou Orange Money en moins de 30 minutes. Taux garanti au moment de la transaction." },
  { q: "Quel est le taux de change PayPal en FCFA en 2026 ?", a: "Nous achetons votre solde PayPal à 580 FCFA par euro et vendons à 700 FCFA par euro. Ces taux sont mis à jour régulièrement selon le marché. Consultez notre ticker en haut de page pour le cours en temps réel." },
  { q: "Peut-on acheter du solde PayPal avec Orange Money au Cameroun ?", a: "Oui, minimum 10 000 FCFA (environ 14€). Payez via Orange Money, MTN MoMo ou Express Union et recevez le solde PayPal correspondant dans les 30 minutes. Votre compte PayPal doit être européen (France, Belgique, Suisse…)." },
  { q: "Chreol Empire travaille-t-il avec les comptes PayPal camerounais ?", a: "Non. Nous travaillons uniquement avec des comptes PayPal européens (France, Belgique, Italie, Espagne, Suisse…). Les comptes africains ou camerounais ne sont pas éligibles en raison des restrictions PayPal sur les transferts internationaux." },
];

const PAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAGE_FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
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
  const [contactDialCode, setContactDialCode] = useState("+237");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [momoOp, setMomoOp]           = useState("orange");
  const [momoPhone, setMomoPhone]     = useState("");
  const [errors, setErrors]           = useState<Record<string, string>>();

  const ID_FORMATS = [
    { id: "email",    label: "Email",      placeholder: "exemple@email.com",  icon: "✉️" },
    { id: "phone",    label: "Téléphone",  placeholder: "+33 6 XX XX XX XX",  icon: "📱" },
    { id: "paypalme", label: "PayPal.me",  placeholder: "PayPal.me/monlien",  icon: "🔗" },
  ] as const;

  const { sellRate, buyRate } = PAYPAL_RATES;

  function switchDirection(d: "sell" | "buy") {
    setDirection(d); setAmount(""); setErrors(undefined);
    setInputCurrency(d === "sell" ? "EUR" : "FCFA");
    setContactEmail(""); setPaypalId(""); setContactPhone(""); setContactDialCode("+237");
  }

  const numAmount = parseFloat(amount) || 0;

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
  const displayFcfa = direction === "sell" ? fcfaResult : buyFcfa;

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || numAmount <= 0) {
      e.amount = "Montant requis";
    } else if (direction === "sell") {
      const inEur = inputCurrency === "EUR" ? numAmount : numAmount / sellRate;
      if (inEur < PAYPAL_LIMITS.sell.min) e.amount = `Minimum ${PAYPAL_LIMITS.sell.min}€ (≈ ${Math.ceil(PAYPAL_LIMITS.sell.min * sellRate).toLocaleString("fr-FR")} FCFA)`;
      else if (inEur > PAYPAL_LIMITS.sell.max) e.amount = `Maximum ${PAYPAL_LIMITS.sell.max}€`;
    } else {
      const inFcfa = inputCurrency === "FCFA" ? numAmount : numAmount * buyRate;
      if (inFcfa < PAYPAL_LIMITS.buy.min) e.amount = `Minimum ${PAYPAL_LIMITS.buy.min.toLocaleString("fr-FR")} FCFA (≈ ${+(PAYPAL_LIMITS.buy.min / buyRate).toFixed(0)}€)`;
    }
    if (!paypalId.trim()) e.paypalId = "Identifiant PayPal requis";
    else if (idFormat === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalId)) e.paypalId = "Email invalide";
    if (!contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) e.contactEmail = "Email de contact valide requis";
    const cpD = contactPhone.replace(/\D/g, "");
    if (direction === "sell" && cpD.length < 6) e.contactPhone = "Numéro trop court";
    if (direction === "buy" && contactPhone && cpD.length < 6) e.contactPhone = "Numéro trop court";
    const mpD = momoPhone.replace(/\D/g, "").replace(/^237/, "");
    if (direction === "sell" && mpD.length < 9) e.momoPhone = "Numéro invalide (9 chiffres)";
    if (direction === "buy" && momoPhone && mpD.length < 9) e.momoPhone = "Numéro invalide (9 chiffres)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const idLabel = ID_FORMATS.find(f => f.id === idFormat)?.label ?? "Email";

  function buildDetails() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const idLine = `PayPal (${idLabel}) : ${paypalId}`;
    if (direction === "sell")
      return `${idLine} | ${displayEur.toFixed(2)}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA\n${op} +237 ${momoPhone}\nContact : ${contactDialCode} ${contactPhone}`;
    return `${idLine} | ${buyFcfa.toLocaleString("fr-FR")} FCFA → ${eurResult}€\n${op} +237 ${momoPhone}\nContact : ${contactDialCode} ${contactPhone}`;
  }

  function buildMsgPlain() {
    const op  = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const ref = orderIdRef.current ? ` — Réf #${orderIdRef.current.slice(-8).toUpperCase()}` : "";
    if (direction === "sell")
      return `💸 VENTE PAYPAL${ref}\nCompte PayPal (${idLabel}) : ${paypalId}\nMontant : ${displayEur.toFixed(2)}€\nÀ recevoir : ${fcfaResult.toLocaleString("fr-FR")} FCFA\nTaux : 1€ = ${sellRate} FCFA\n\n💰 Réception MoMo\nOpérateur : ${op}\nNuméro : +237 ${momoPhone}\n\n📱 Contact WhatsApp : ${contactDialCode} ${contactPhone}`;
    return `💳 ACHAT PAYPAL${ref}\nCompte PayPal (${idLabel}) : ${paypalId}\nJe paie : ${buyFcfa.toLocaleString("fr-FR")} FCFA\nÀ recevoir : ${eurResult}€\nTaux : 1€ = ${buyRate} FCFA\n\n💰 Paiement MoMo\nOpérateur : ${op}\nNuméro : +237 ${momoPhone}\n\n📱 Contact WhatsApp : ${contactDialCode} ${contactPhone}`;
  }

  function sendNotification() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: (() => { const id = `paypal-${direction}-${Date.now()}`; orderIdRef.current = id; return id; })(),
        clientName: contactEmail.split("@")[0],
        clientEmail: contactEmail,
        clientPhone: contactPhone || momoPhone,
        paymentMethod: op,
        items: [{
          name: direction === "sell" ? "Vente PayPal Europe" : "Achat PayPal Europe",
          qty: 1,
          price: direction === "sell" ? fcfaResult : buyFcfa,
          amount: direction === "sell"
            ? `${displayEur.toFixed(2)}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA`
            : `${buyFcfa.toLocaleString("fr-FR")} FCFA → ${eurResult}€`,
          details: buildDetails(),
        }],
        total: direction === "sell" ? fcfaResult : buyFcfa,
        sourceUrl: window.location.pathname,
      }),
    }).catch(() => {});
  }

  function handleAddToCart() {
    if (!validate()) { showToast("Corrigez les erreurs", "error"); return; }
    saveClientInfo({ email: contactEmail, phone: contactPhone, dialCode: contactDialCode, name: contactEmail.split("@")[0] });
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    addItem({
      id: `paypal-${direction}-${Date.now()}`,
      cardName: direction === "sell" ? "Vente PayPal Europe" : "Achat PayPal Europe",
      amount: direction === "sell"
        ? `${displayEur.toFixed(2)}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA via ${op}`
        : `${buyFcfa.toLocaleString("fr-FR")} FCFA → ${eurResult}€`,
      price: direction === "sell" ? fcfaResult : buyFcfa,
      type: direction === "sell" ? "sell" : "buy",
      details: buildDetails(),
    });
    addEntry({
      service: `PayPal — ${direction === "sell" ? "Vente" : "Achat"}`,
      details: direction === "sell" ? `${displayEur.toFixed(2)}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA` : `${buyFcfa.toLocaleString("fr-FR")} FCFA → ${eurResult}€`,
      amount: direction === "sell" ? fcfaResult : buyFcfa,
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
        <a href="/services" className="hover:text-white transition-colors">Services</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>PayPal Europe</span>
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
            {d === "sell" ? "💰 Je vends mon PayPal" : "💳 J'achète du solde"}
          </button>
        ))}
      </div>

      {/* Rate card */}
      <div className="rounded-2xl p-4 mb-6" style={{ background: "#003087" + "22", border: "1px solid #003087" + "55" }}>
        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>Taux applicable</p>
            <p className="font-black tabular-nums" style={{ color: "var(--text-primary)" }}>1€ = {direction === "sell" ? sellRate : buyRate} FCFA</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>Saisie en</p>
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
              ? (inputCurrency === "EUR" ? "Montant à vendre (€)" : "Montant à vendre (FCFA)")
              : (inputCurrency === "FCFA" ? "Montant à payer (FCFA)" : "Montant à payer (€)")}
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
                Tableau de calcul
              </p>
              {direction === "sell" ? (
                <>
                  <CalcRow label="Solde PayPal vendu" value={`${displayEur.toFixed(2)}€`} />
                  <CalcRow label="Taux d'achat" value={`1€ = ${sellRate} FCFA`} />
                  <CalcRow label="Commission" value="0 FCFA (0%)" />
                  <CalcRow label="Vous recevez" value={`${fcfaResult.toLocaleString("fr-FR")} FCFA`} highlight />
                </>
              ) : (
                <>
                  <CalcRow label="FCFA à payer" value={`${displayFcfa.toLocaleString("fr-FR")} FCFA`} />
                  <CalcRow label="Taux de vente" value={`1€ = ${buyRate} FCFA`} />
                  <CalcRow label="Commission" value="0 FCFA (0%)" />
                  <CalcRow label="Vous recevez" value={`${eurResult}€`} highlight />
                </>
              )}
            </motion.div>
          )}

          {/* ── Identifiant PayPal — affiché EN PREMIER seulement en mode VENTE ── */}
          {direction === "sell" && <PaypalIdField
            idFormat={idFormat} setIdFormat={setIdFormat}
            paypalId={paypalId} setPaypalId={setPaypalId}
            errors={errors} setErrors={setErrors}
            label="Identifiant du compte PayPal (que vous vendez)"
            inputBase={inputBase} inputErr={inputErr} inputCls={inputCls}
            ID_FORMATS={ID_FORMATS}
          />}

          <Field label={direction === "sell" ? "Réception MoMo" : "Paiement MoMo (optionnel)"} error={errors?.momoPhone}>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                {MOMO_OPERATORS.map(o => (
                  <button type="button" key={o.id} onClick={() => setMomoOp(o.id)}
                    className="flex items-center gap-2 p-2.5 rounded-xl transition-all"
                    style={{ background: momoOp === o.id ? o.color + "20" : "var(--bg-card)", border: `2px solid ${momoOp === o.id ? o.color : "var(--border)"}` }}>
                    {o.image ? (
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0">
                        <Image src={o.image} alt={o.name} fill style={{ objectFit: "cover" }} unoptimized />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-[11px] shrink-0"
                        style={{ background: o.color }}>G</div>
                    )}
                    <span className="text-[10px] font-bold leading-tight" style={{ color: momoOp === o.id ? o.color : "var(--text-secondary)" }}>{o.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center rounded-2xl overflow-hidden" style={errors?.momoPhone ? inputErr : inputBase}>
                <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                <input type="tel" placeholder="6XXXXXXXX" value={momoPhone}
                  maxLength={9}
                  onChange={e => { setMomoPhone(e.target.value.replace(/\D/g, "")); setErrors(p => p ? { ...p, momoPhone: "" } : undefined); }}
                  className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                />
              </div>
            </div>
          </Field>

          {/* ── Numéro WhatsApp contact avec indicatif éditable ── */}
          <Field label={`Votre numéro WhatsApp${direction === "buy" ? " (optionnel)" : ""}`} error={errors?.contactPhone}>
            <div className="flex gap-2">
              {/* Indicatif — champ indépendant, toujours cliquable */}
              <input
                type="text"
                value={contactDialCode}
                onChange={e => {
                  let v = e.target.value.replace(/[^0-9+]/g, "");
                  if (!v.startsWith("+")) v = "+" + v;
                  setContactDialCode(v.slice(0, 5));
                }}
                placeholder="+237"
                maxLength={5}
                className="px-3 py-3 rounded-2xl text-sm font-bold text-center outline-none w-20 shrink-0"
                style={{
                  background: "var(--bg-elevated)",
                  border: "2px solid var(--gold)",
                  color: "var(--text-primary)",
                }}
              />
              {/* Numéro */}
              <input
                type="tel"
                placeholder={contactDialCode === "+237" ? "6XXXXXXXX" : "Votre numéro"}
                value={contactPhone}
                maxLength={contactDialCode === "+237" ? 9 : 15}
                onChange={e => { setContactPhone(e.target.value.replace(/\D/g, "")); setErrors(p => p ? { ...p, contactPhone: "" } : undefined); }}
                className="flex-1 px-4 py-3 rounded-2xl text-white text-sm outline-none"
                style={errors?.contactPhone ? inputErr : inputBase}
              />
            </div>
          </Field>

          {/* ── Identifiant PayPal — affiché APRÈS WhatsApp seulement en mode ACHAT ── */}
          {direction === "buy" && <PaypalIdField
            idFormat={idFormat} setIdFormat={setIdFormat}
            paypalId={paypalId} setPaypalId={setPaypalId}
            errors={errors} setErrors={setErrors}
            label="Compte PayPal à recharger (où recevoir les fonds)"
            inputBase={inputBase} inputErr={inputErr} inputCls={inputCls}
            ID_FORMATS={ID_FORMATS}
          />}

          <Field label="Votre email (pour confirmation de commande)" error={errors?.contactEmail}>
            <input
              type="email"
              placeholder="votre@email.com"
              value={contactEmail}
              onChange={e => { setContactEmail(e.target.value); setErrors(p => p ? { ...p, contactEmail: "" } : undefined); }}
              className={inputCls}
              style={errors?.contactEmail ? inputErr : inputBase}
            />
          </Field>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={handleAddToCart}
          className="w-full py-4 rounded-full font-black text-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
          style={{ background: "var(--gold)" }}
        >
          🛒 Ajouter au panier
        </button>
        {direction === "sell" ? (
          <WAPopover
            onBeforeOpen={() => { const ok = validate(); if (!ok) { showToast("Corrigez les erreurs", "error"); return false; } sendNotification(); return true; }}
            getMsg={buildMsgPlain}
            className="w-full py-3 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
            Commander directement via WhatsApp
          </WAPopover>
        ) : (
          <USSDOrderFlow
            total={buyFcfa}
            getMsg={buildMsgPlain}
            onBeforeOpen={() => { const ok = validate(); if (!ok) { showToast("Corrigez les erreurs", "error"); return false; } sendNotification(); return true; }}
            className="w-full py-3 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
            Commander via WhatsApp
          </USSDOrderFlow>
        )}
      </div>

      <div className="mt-6 rounded-2xl p-4 text-xs flex flex-col gap-1.5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {["PayPal Europe uniquement (France, Belgique, Italie…)", "Comptes Cameroun ou USA non acceptés", "Transfert vers Mobile Money MTN / Orange", "Traitement en 15–30 min"].map(s => (
          <p key={s} style={{ color: "var(--text-secondary)" }}>✅ {s}</p>
        ))}
      </div>
      <StepGuide title="Comment vendre / acheter du solde PayPal — Étape par étape" steps={STEPS_PAYPAL} />
      <FAQ items={PAGE_FAQ} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_FAQ_SCHEMA) }} />
      <RelatedServices current="paypal" />
    </div>
  );
}

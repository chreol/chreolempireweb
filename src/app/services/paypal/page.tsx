"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PAYPAL_RATES, PAYPAL_LIMITS, MOMO_OPERATORS, IMAGES } from "@/lib/services";
import WAPopover from "@/components/WAPopover";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import FAQ from "@/components/FAQ";

const PAGE_FAQ = [
  { q: "Comment vendre mon solde PayPal ?", a: "Envoyez le montant en € à notre compte PayPal (communiqué sur WhatsApp), partagez la capture de confirmation, et nous vous virons le FCFA équivalent sur votre Mobile Money sous 30 minutes." },
  { q: "Mon compte PayPal doit-il être vérifié ?", a: "Recommandé pour les montants supérieurs à 100€. Pour les petits montants un compte basique suffit. Les comptes américains ou africains non vérifiés peuvent être refusés." },
  { q: "Quels sont les montants minimum et maximum ?", a: "Vente (PayPal → FCFA) : minimum 20€, maximum 500€. Achat (FCFA → PayPal) : minimum 10 000 FCFA, maximum 500 000 FCFA par transaction." },
  { q: "PayPal Europe uniquement — qu'est-ce que ça signifie ?", a: "Nous travaillons avec des comptes PayPal européens (France, Belgique, Italie, Espagne…). Les comptes américains, camerounais ou d'autres régions ne sont pas éligibles." },
];

export default function PaypalPage() {
  const { addItem } = useCart();
  const { addEntry } = useHistory();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [direction, setDirection]     = useState<"sell" | "buy">("sell");
  const [inputCurrency, setInputCurrency] = useState<"EUR" | "FCFA">("EUR");
  const [amount, setAmount]           = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [momoOp, setMomoOp]           = useState("orange");
  const [momoPhone, setMomoPhone]     = useState("");
  const [errors, setErrors]           = useState<Record<string, string>>({});

  const { sellRate, buyRate } = PAYPAL_RATES;

  function switchDirection(d: "sell" | "buy") {
    setDirection(d); setAmount(""); setErrors({});
    setInputCurrency(d === "sell" ? "EUR" : "FCFA");
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
    if (!paypalEmail.trim()) e.paypalEmail = "Email ou nom PayPal requis";
    if (!momoPhone || momoPhone.length !== 9) e.momoPhone = "Numéro invalide (9 chiffres)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildDetails() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    if (direction === "sell")
      return `PayPal : ${paypalEmail} | ${displayEur.toFixed(2)}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA\n${op} +237 ${momoPhone}`;
    return `PayPal : ${paypalEmail} | ${buyFcfa.toLocaleString("fr-FR")} FCFA → ${eurResult}€\n${op} +237 ${momoPhone}`;
  }

  function buildMsgPlain() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    if (direction === "sell")
      return `💸 VENTE PAYPAL\nCompte PayPal : ${paypalEmail}\nMontant : ${displayEur.toFixed(2)}€\nÀ recevoir : ${fcfaResult.toLocaleString("fr-FR")} FCFA\nTaux : 1€ = ${sellRate} FCFA\n\n💰 Réception MoMo\nOpérateur : ${op}\nNuméro : +237 ${momoPhone}`;
    return `💳 ACHAT PAYPAL\nCompte PayPal : ${paypalEmail}\nJe paie : ${buyFcfa.toLocaleString("fr-FR")} FCFA\nÀ recevoir : ${eurResult}€\nTaux : 1€ = ${buyRate} FCFA\n\n💰 Paiement MoMo\nOpérateur : ${op}\nNuméro : +237 ${momoPhone}`;
  }

  function handleAddToCart() {
    if (!validate()) { showToast("Corrigez les erreurs", "error"); return; }
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

  function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</label>
        {children}
        {error && <span className="text-xs font-semibold" style={{ color: "#EF4444" }}>{error}</span>}
      </div>
    );
  }

  function CalcRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
      <div className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
        <span className="text-sm font-bold tabular-nums" style={highlight ? { color: "var(--gold)" } : { color: "#fff" }}>{value}</span>
      </div>
    );
  }

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
                <button key={c} type="button" onClick={() => { setInputCurrency(c); setAmount(""); setErrors({}); }}
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
            error={errors.amount}
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
                className={`${inputCls} pr-16`} style={errors.amount ? inputErr : inputBase}
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

          <Field label={direction === "sell" ? "Email / nom du compte PayPal" : "Email PayPal à recharger"} error={errors.paypalEmail}>
            <input
              type="email" placeholder="exemple@email.com"
              value={paypalEmail}
              onChange={e => { setPaypalEmail(e.target.value); setErrors(p => ({ ...p, paypalEmail: "" })); }}
              className={inputCls} style={errors.paypalEmail ? inputErr : inputBase}
            />
          </Field>

          <Field label={direction === "sell" ? "Réception MoMo" : "Paiement MoMo"} error={errors.momoPhone}>
            <div className="flex flex-col gap-2">
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
              <div className="flex items-center rounded-2xl overflow-hidden" style={errors.momoPhone ? inputErr : inputBase}>
                <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                <input type="tel" placeholder="6XXXXXXXX" value={momoPhone}
                  onChange={e => { setMomoPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setErrors(p => ({ ...p, momoPhone: "" })); }}
                  className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                />
              </div>
            </div>
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
        <WAPopover
          onBeforeOpen={() => { const ok = validate(); if (!ok) showToast("Corrigez les erreurs", "error"); return ok; }}
          getMsg={buildMsgPlain}
          className="w-full py-3 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
          style={{ background: "#25D366" }}
        >
          <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
          {direction === "sell" ? "Commander directement via WhatsApp" : "Commander via WhatsApp"}
        </WAPopover>
      </div>

      <div className="mt-6 rounded-2xl p-4 text-xs flex flex-col gap-1.5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {["PayPal Europe uniquement (France, Belgique, Italie…)", "Comptes Cameroun ou USA non acceptés", "Transfert vers Mobile Money MTN / Orange", "Traitement en 15–30 min"].map(s => (
          <p key={s} style={{ color: "var(--text-secondary)" }}>✅ {s}</p>
        ))}
      </div>
      <FAQ items={PAGE_FAQ} />
    </div>
  );
}

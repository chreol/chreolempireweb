"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PAYPAL_RATES, PAYPAL_LIMITS, CONTACT, MOMO_OPERATORS } from "@/lib/services";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";

export default function PaypalPage() {
  const { addEntry } = useHistory();
  const { showToast } = useToast();

  const [direction, setDirection] = useState<"sell" | "buy">("sell");
  const [amount, setAmount]       = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [momoOp, setMomoOp]       = useState("orange");
  const [momoPhone, setMomoPhone] = useState("");
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const { sellRate, buyRate } = PAYPAL_RATES;
  const limits = direction === "sell" ? PAYPAL_LIMITS.sell : PAYPAL_LIMITS.buy;

  const numAmount = parseFloat(amount) || 0;
  const fcfaResult = direction === "sell" ? Math.round(numAmount * sellRate) : 0;
  const eurResult  = direction === "buy"  ? +(numAmount / buyRate).toFixed(2) : 0;

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || numAmount <= 0) {
      e.amount = "Montant requis";
    } else if (direction === "sell" && numAmount < PAYPAL_LIMITS.sell.min) {
      e.amount = `Minimum ${PAYPAL_LIMITS.sell.min}€`;
    } else if (direction === "sell" && numAmount > PAYPAL_LIMITS.sell.max) {
      e.amount = `Maximum ${PAYPAL_LIMITS.sell.max}€`;
    } else if (direction === "buy" && numAmount < PAYPAL_LIMITS.buy.min) {
      e.amount = `Minimum ${PAYPAL_LIMITS.buy.min.toLocaleString("fr-FR")} FCFA`;
    }
    if (!paypalEmail.trim()) e.paypalEmail = "Email ou nom PayPal requis";
    if (!momoPhone || momoPhone.length !== 9) e.momoPhone = "Numéro invalide (9 chiffres)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildWAMsg() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    if (direction === "sell") {
      return encodeURIComponent(
        `Bonjour Chreol Empire,\n\n` +
        `💸 VENTE PAYPAL\n` +
        `Compte PayPal : ${paypalEmail}\n` +
        `Montant : ${amount}€\n` +
        `À recevoir : ${fcfaResult.toLocaleString("fr-FR")} FCFA\n` +
        `Taux : 1€ = ${sellRate} FCFA\n\n` +
        `💰 Réception MoMo\n` +
        `Opérateur : ${op}\n` +
        `Numéro : +237 ${momoPhone}`,
      );
    }
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\n` +
      `💳 ACHAT PAYPAL\n` +
      `Compte PayPal à recharger : ${paypalEmail}\n` +
      `Je paie : ${numAmount.toLocaleString("fr-FR")} FCFA\n` +
      `À recevoir : ${eurResult}€\n` +
      `Taux : 1€ = ${buyRate} FCFA\n\n` +
      `💰 Paiement MoMo\n` +
      `Opérateur : ${op}\n` +
      `Numéro : +237 ${momoPhone}`,
    );
  }

  function handleOrder() {
    if (!validate()) { showToast("Corrigez les erreurs", "error"); return; }
    addEntry({
      service: `PayPal — ${direction === "sell" ? "Vente" : "Achat"}`,
      details: direction === "sell"
        ? `${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA`
        : `${numAmount.toLocaleString("fr-FR")} FCFA → ${eurResult}€`,
      amount: direction === "sell" ? fcfaResult : numAmount,
      currency: "FCFA",
      status: "pending",
      waText: buildWAMsg(),
    });
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${buildWAMsg()}`, "_blank");
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

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/services" className="hover:text-white transition-colors">Services</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>PayPal Europe</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">PayPal Europe</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Vendez votre solde PayPal contre FCFA ou rechargez votre compte PayPal Europe.
      </p>

      {/* Direction toggle */}
      <div className="flex rounded-2xl p-1 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {(["sell", "buy"] as const).map(d => (
          <button
            key={d}
            onClick={() => { setDirection(d); setErrors({}); setAmount(""); }}
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

      {/* Rate + limits info */}
      <div className="rounded-2xl p-4 mb-6" style={{ background: "#003087" + "22", border: "1px solid #003087" + "55" }}>
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>Taux applicable</p>
            <p className="font-black text-white">1€ = {direction === "sell" ? sellRate : buyRate} FCFA</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>Limite</p>
            <p className="font-black text-white">{limits.min.toLocaleString("fr-FR")} – {limits.max.toLocaleString("fr-FR")} {limits.currency}</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={direction}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col gap-5"
        >
          {/* Amount */}
          <Field label={direction === "sell" ? "Montant à vendre (€)" : "Montant à payer (FCFA)"} error={errors.amount}>
            <input
              type="number"
              min="0"
              placeholder={direction === "sell" ? `ex: 50 (min ${PAYPAL_LIMITS.sell.min}€)` : `ex: 50 000 FCFA`}
              value={amount}
              onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
              className={inputCls}
              style={errors.amount ? inputErr : inputBase}
            />
          </Field>

          {/* Result */}
          {numAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-4"
              style={{ background: "#003087" + "18", border: "1px solid #003087" + "55" }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: "#5B8FE8" }}>
                {direction === "sell" ? "Vous recevez" : "Vous obtenez"}
              </p>
              <p className="text-2xl font-black text-white">
                {direction === "sell" ? `${fcfaResult.toLocaleString("fr-FR")} FCFA` : `${eurResult}€`}
              </p>
            </motion.div>
          )}

          {/* PayPal email */}
          <Field label={direction === "sell" ? "Email / nom du compte PayPal" : "Email PayPal à recharger"} error={errors.paypalEmail}>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={paypalEmail}
              onChange={e => { setPaypalEmail(e.target.value); setErrors(p => ({ ...p, paypalEmail: "" })); }}
              className={inputCls}
              style={errors.paypalEmail ? inputErr : inputBase}
            />
          </Field>

          {/* MoMo */}
          <Field label={direction === "sell" ? "Réception MoMo" : "Paiement MoMo"} error={errors.momoPhone}>
            <div className="flex gap-2">
              <select
                value={momoOp}
                onChange={e => setMomoOp(e.target.value)}
                className="px-3 py-3 rounded-2xl text-white text-sm outline-none shrink-0"
                style={inputBase}
              >
                {MOMO_OPERATORS.slice(0, 2).map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
              <div className="flex flex-1 items-center rounded-2xl overflow-hidden" style={errors.momoPhone ? inputErr : inputBase}>
                <span className="px-3 text-sm font-bold shrink-0" style={{ color: "var(--text-muted)" }}>+237</span>
                <input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={momoPhone}
                  onChange={e => { setMomoPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setErrors(p => ({ ...p, momoPhone: "" })); }}
                  className="flex-1 py-3 pr-4 bg-transparent text-white text-sm outline-none"
                />
              </div>
            </div>
          </Field>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={handleOrder}
        className="w-full mt-8 py-4 rounded-full font-black text-white text-sm transition-opacity hover:opacity-85"
        style={{ background: "#25D366" }}
      >
        💬 {direction === "sell" ? "Envoyer ma demande de vente" : "Commander via WhatsApp"}
      </button>

      {/* Info box */}
      <div className="mt-6 rounded-2xl p-4 text-xs flex flex-col gap-1.5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {["PayPal Europe uniquement (France, Belgique, Italie…)", "Comptes Cameroun ou USA non acceptés", "Transfert vers Mobile Money MTN / Orange", "Traitement en 15–30 min"].map(s => (
          <p key={s} style={{ color: "var(--text-secondary)" }}>✅ {s}</p>
        ))}
      </div>
    </div>
  );
}

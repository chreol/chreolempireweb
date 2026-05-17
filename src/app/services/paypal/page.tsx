"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PAYPAL_RATES, PAYPAL_LIMITS, CONTACT, MOMO_OPERATORS, IMAGES } from "@/lib/services";
import { useCart } from "@/contexts/CartContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";

export default function PaypalPage() {
  const { addItem } = useCart();
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

  const numAmount  = parseFloat(amount) || 0;
  const fcfaResult = direction === "sell" ? Math.round(numAmount * sellRate) : 0;
  const eurResult  = direction === "buy"  ? +(numAmount / buyRate).toFixed(2)  : 0;

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

  function buildDetails() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    if (direction === "sell") {
      return `PayPal : ${paypalEmail} | ${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA\n${op} +237 ${momoPhone}`;
    }
    return `PayPal à recharger : ${paypalEmail} | ${numAmount.toLocaleString("fr-FR")} FCFA → ${eurResult}€\n${op} +237 ${momoPhone}`;
  }

  function buildWAMsg() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    if (direction === "sell") {
      return encodeURIComponent(
        `Bonjour Chreol Empire,\n\n💸 VENTE PAYPAL\nCompte PayPal : ${paypalEmail}\nMontant : ${amount}€\nÀ recevoir : ${fcfaResult.toLocaleString("fr-FR")} FCFA\nTaux : 1€ = ${sellRate} FCFA\n\n💰 Réception MoMo\nOpérateur : ${op}\nNuméro : +237 ${momoPhone}`,
      );
    }
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\n💳 ACHAT PAYPAL\nCompte PayPal à recharger : ${paypalEmail}\nJe paie : ${numAmount.toLocaleString("fr-FR")} FCFA\nÀ recevoir : ${eurResult}€\nTaux : 1€ = ${buyRate} FCFA\n\n💰 Paiement MoMo\nOpérateur : ${op}\nNuméro : +237 ${momoPhone}`,
    );
  }

  function handleAddToCart() {
    if (!validate()) { showToast("Corrigez les erreurs", "error"); return; }
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    addItem({
      id: `paypal-${direction}-${Date.now()}`,
      cardName: direction === "sell" ? "Vente PayPal Europe" : "Achat PayPal Europe",
      amount: direction === "sell"
        ? `${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA via ${op}`
        : `${numAmount.toLocaleString("fr-FR")} FCFA → ${eurResult}€`,
      price: direction === "sell" ? fcfaResult : numAmount,
      type: direction === "sell" ? "sell" : "buy",
      details: buildDetails(),
    });
    addEntry({
      service: `PayPal — ${direction === "sell" ? "Vente" : "Achat"}`,
      details: direction === "sell" ? `${amount}€ → ${fcfaResult.toLocaleString("fr-FR")} FCFA` : `${numAmount.toLocaleString("fr-FR")} FCFA → ${eurResult}€`,
      amount: direction === "sell" ? fcfaResult : numAmount,
      currency: "FCFA",
      status: "pending",
    });
    showToast("PayPal ajouté au panier !", "success");
  }

  function handleWhatsApp() {
    if (!validate()) { showToast("Corrigez les erreurs", "error"); return; }
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

      {/* Rate card */}
      <div className="rounded-2xl p-4 mb-6" style={{ background: "#003087" + "22", border: "1px solid #003087" + "55" }}>
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>Taux applicable</p>
            <p className="font-black text-white tabular-nums">1€ = {direction === "sell" ? sellRate : buyRate} FCFA</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>Limite</p>
            <p className="font-black text-white tabular-nums">{limits.min.toLocaleString("fr-FR")} – {limits.max.toLocaleString("fr-FR")} {limits.currency}</p>
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
          <Field label={direction === "sell" ? "Montant à vendre (€)" : "Montant à payer (FCFA)"} error={errors.amount}>
            <input
              type="number" min="0"
              placeholder={direction === "sell" ? `ex: 50 (min ${PAYPAL_LIMITS.sell.min}€)` : "ex: 50 000 FCFA"}
              value={amount}
              onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
              className={inputCls} style={errors.amount ? inputErr : inputBase}
            />
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
                  <CalcRow label="Solde PayPal vendu" value={`${amount}€`} />
                  <CalcRow label="Taux d'achat" value={`1€ = ${sellRate} FCFA`} />
                  <CalcRow label="Commission" value="0 FCFA (0%)" />
                  <CalcRow label="Vous recevez" value={`${fcfaResult.toLocaleString("fr-FR")} FCFA`} highlight />
                </>
              ) : (
                <>
                  <CalcRow label="FCFA à payer" value={`${numAmount.toLocaleString("fr-FR")} FCFA`} />
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
        <button
          onClick={handleWhatsApp}
          className="w-full py-3 rounded-full font-black text-white text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
          style={{ background: "#25D366" }}
        >
          <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
          {direction === "sell" ? "Commander directement via WhatsApp" : "Commander via WhatsApp"}
        </button>
      </div>

      <div className="mt-6 rounded-2xl p-4 text-xs flex flex-col gap-1.5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {["PayPal Europe uniquement (France, Belgique, Italie…)", "Comptes Cameroun ou USA non acceptés", "Transfert vers Mobile Money MTN / Orange", "Traitement en 15–30 min"].map(s => (
          <p key={s} style={{ color: "var(--text-secondary)" }}>✅ {s}</p>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT, CRYPTO_RATES, CRYPTO_NETWORKS, MOMO_OPERATORS } from "@/lib/services";
import { useHistory } from "@/contexts/HistoryContext";
import { useToast } from "@/components/Toast";

export default function CryptoPage() {
  const { addEntry } = useHistory();
  const { showToast } = useToast();

  const [direction, setDirection] = useState<"sell" | "buy">("sell");
  const [cryptoId, setCryptoId]   = useState("usdt");
  const [network, setNetwork]     = useState(CRYPTO_NETWORKS["usdt"][0]);
  const [amount, setAmount]       = useState("");
  const [txid, setTxid]           = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [momoOp, setMomoOp]       = useState("orange");
  const [momoPhone, setMomoPhone] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [howOpen, setHowOpen]     = useState(false);

  const crypto   = CRYPTO_RATES.find(c => c.id === cryptoId)!;
  const networks = CRYPTO_NETWORKS[cryptoId] ?? [];

  function selectCrypto(id: string) {
    setCryptoId(id);
    setNetwork(CRYPTO_NETWORKS[id][0]);
    setAmount("");
    setErrors({});
  }

  const numAmount = parseFloat(amount) || 0;
  const fcfaReceived = direction === "sell" ? Math.round(numAmount * crypto.buyRate) : 0;
  const cryptoReceived = direction === "buy" && numAmount > 0 ? numAmount / crypto.sellRate : 0;

  function copyWallet(addr: string) {
    navigator.clipboard.writeText(addr).then(() => showToast("Adresse copiée !", "success"));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || numAmount <= 0) e.amount = "Montant requis";
    if (direction === "sell") {
      if (!txid || txid.length < 20) e.txid = "Hash requis (min 20 caractères)";
      if (!beneficiary.trim()) e.beneficiary = "Nom requis";
      if (!momoPhone || momoPhone.length !== 9) e.momoPhone = "Numéro invalide (9 chiffres sans indicatif)";
    } else {
      if (!walletAddr.trim()) e.walletAddr = "Adresse wallet requise";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildWAMsg() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    if (direction === "sell") {
      return encodeURIComponent(
        `Bonjour Chreol Empire,\n\n` +
        `📤 VENTE CRYPTO\n` +
        `Crypto : ${crypto.name} (${crypto.fullName})\n` +
        `Réseau : ${network}\n` +
        `Montant envoyé : ${amount} ${crypto.unit}\n` +
        `À recevoir : ${fcfaReceived.toLocaleString("fr-FR")} FCFA\n\n` +
        `TxID / Hash : ${txid}\n\n` +
        `💰 Réception MoMo\n` +
        `Opérateur : ${op}\n` +
        `Numéro : +237 ${momoPhone}\n` +
        `Nom bénéficiaire : ${beneficiary}`,
      );
    }
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\n` +
      `📥 ACHAT CRYPTO\n` +
      `Crypto : ${crypto.name} (${crypto.fullName})\n` +
      `Réseau : ${network}\n` +
      `Je paie : ${numAmount.toLocaleString("fr-FR")} FCFA\n` +
      `À recevoir : ${cryptoReceived.toFixed(6)} ${crypto.unit}\n\n` +
      `Adresse wallet : ${walletAddr}`,
    );
  }

  function handleOrder() {
    if (!validate()) {
      showToast("Corrigez les erreurs avant de continuer", "error");
      return;
    }
    addEntry({
      service: `Crypto — ${direction === "sell" ? "Vente" : "Achat"} ${crypto.name}`,
      details: direction === "sell"
        ? `${amount} ${crypto.unit} → ${fcfaReceived.toLocaleString("fr-FR")} FCFA`
        : `${numAmount.toLocaleString("fr-FR")} FCFA → ${cryptoReceived.toFixed(6)} ${crypto.unit}`,
      amount: direction === "sell" ? fcfaReceived : numAmount,
      currency: "FCFA",
      status: "pending",
      waText: buildWAMsg(),
    });
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${buildWAMsg()}`, "_blank");
  }

  const inputCls = "w-full px-4 py-3 rounded-2xl text-white text-sm outline-none transition-colors";
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/services" className="hover:text-white transition-colors">Services</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Crypto & Échange MoMo</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">Crypto &amp; Échange MoMo</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Achetez ou vendez vos cryptomonnaies contre FCFA via Mobile Money — 0% commission, 15–30 min.
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
            {d === "sell" ? "💰 Je vends ma crypto" : "💳 J'achète de la crypto"}
          </button>
        ))}
      </div>

      {/* Crypto selector — 3 cols mobile, 5 desktop */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Choisir la crypto</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {CRYPTO_RATES.map(c => (
            <button
              key={c.id}
              onClick={() => selectCrypto(c.id)}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl text-center transition-all hover:-translate-y-0.5"
              style={{
                background: cryptoId === c.id ? c.color + "22" : "var(--bg-card)",
                border: `2px solid ${cryptoId === c.id ? c.color : "var(--border)"}`,
              }}
            >
              <span className="text-lg font-black" style={{ color: c.color }}>{c.icon}</span>
              <span className="text-xs font-black text-white">{c.name}</span>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {(direction === "sell" ? c.buyRate : c.sellRate).toLocaleString("fr-FR")} F
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={direction + cryptoId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col gap-5"
        >
          {/* Network */}
          <Field label="Réseau blockchain">
            <select value={network} onChange={e => setNetwork(e.target.value)} className={inputCls} style={inputBase}>
              {networks.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>

          {/* Amount */}
          <Field
            label={direction === "sell" ? `Montant à vendre (${crypto.unit})` : "Montant FCFA à dépenser"}
            error={errors.amount}
          >
            <input
              type="number"
              min="0"
              placeholder={direction === "sell" ? "ex: 10" : "ex: 50 000"}
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
              style={{ background: crypto.color + "15", border: `1px solid ${crypto.color}44` }}
            >
              <p className="text-xs font-bold mb-1" style={{ color: crypto.color }}>
                {direction === "sell" ? "Vous recevez" : "Vous obtenez"}
              </p>
              <p className="text-2xl font-black text-white">
                {direction === "sell"
                  ? `${fcfaReceived.toLocaleString("fr-FR")} FCFA`
                  : `${cryptoReceived.toFixed(6)} ${crypto.unit}`}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Taux : 1 {crypto.unit} = {(direction === "sell" ? crypto.buyRate : crypto.sellRate).toLocaleString("fr-FR")} FCFA
              </p>
            </motion.div>
          )}

          {/* SELL — extra fields */}
          {direction === "sell" && (
            <>
              <Field label="TxID / Hash de la transaction" error={errors.txid}>
                <input
                  type="text"
                  placeholder="Collez votre hash de transaction ici…"
                  value={txid}
                  onChange={e => { setTxid(e.target.value); setErrors(p => ({ ...p, txid: "" })); }}
                  className={inputCls}
                  style={errors.txid ? inputErr : inputBase}
                />
              </Field>

              <Field label="Nom du bénéficiaire" error={errors.beneficiary}>
                <input
                  type="text"
                  placeholder="Votre nom complet"
                  value={beneficiary}
                  onChange={e => { setBeneficiary(e.target.value); setErrors(p => ({ ...p, beneficiary: "" })); }}
                  className={inputCls}
                  style={errors.beneficiary ? inputErr : inputBase}
                />
              </Field>

              <Field label="Réception Mobile Money" error={errors.momoPhone}>
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
            </>
          )}

          {/* BUY — wallet */}
          {direction === "buy" && (
            <Field label="Adresse wallet de réception" error={errors.walletAddr}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Adresse ${crypto.name} réseau ${network}…`}
                  value={walletAddr}
                  onChange={e => { setWalletAddr(e.target.value); setErrors(p => ({ ...p, walletAddr: "" })); }}
                  className={inputCls + " pr-12"}
                  style={errors.walletAddr ? inputErr : inputBase}
                />
                {walletAddr && (
                  <button
                    onClick={() => copyWallet(walletAddr)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-lg font-bold hover:bg-white/10 transition-colors"
                    style={{ color: "var(--gold)" }}
                  >
                    📋
                  </button>
                )}
              </div>
            </Field>
          )}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <button
        onClick={handleOrder}
        className="w-full mt-8 py-4 rounded-full font-black text-white text-sm transition-opacity hover:opacity-85"
        style={{ background: "#25D366" }}
      >
        💬 {direction === "sell" ? "Envoyer ma demande de vente" : "Commander via WhatsApp"}
      </button>

      {/* Trust */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        {[["0%", "Commission"], ["15–30 min", "Traitement"], ["Sécurisé", "Mobile Money"]].map(([v, l]) => (
          <div key={l} className="flex items-center gap-2 text-xs px-3 py-2 rounded-full" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <span className="font-black" style={{ color: "var(--gold)" }}>{v}</span>
            <span style={{ color: "var(--text-secondary)" }}>{l}</span>
          </div>
        ))}
      </div>

      {/* How it works collapsible */}
      <div className="mt-8 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <button
          onClick={() => setHowOpen(p => !p)}
          className="w-full flex items-center justify-between px-5 py-4 font-bold text-sm text-white"
          style={{ background: "var(--bg-card)" }}
        >
          <span>Comment ça marche ?</span>
          <span style={{ color: "var(--gold)" }}>{howOpen ? "−" : "+"}</span>
        </button>
        {howOpen && (
          <div className="px-5 py-4 flex flex-col gap-3" style={{ background: "var(--bg-elevated)" }}>
            {(direction === "sell"
              ? ["Sélectionnez votre crypto et entrez le montant", "Envoyez la crypto à notre adresse et copiez le TxID", "Remplissez vos informations MoMo et envoyez via WhatsApp", "Recevez vos FCFA sur votre Mobile Money en 15–30 min"]
              : ["Choisissez la crypto, le réseau et le montant FCFA", "Entrez votre adresse wallet de réception", "Confirmez la commande via WhatsApp", "Payez via MoMo et recevez votre crypto en 15–30 min"]
            ).map((s, i) => (
              <div key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
                  {i + 1}
                </span>
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

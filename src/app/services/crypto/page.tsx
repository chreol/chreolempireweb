"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { CRYPTO_RATES, CRYPTO_NETWORKS, CRYPTO_WALLETS, MOMO_OPERATORS, IMAGES } from "@/lib/services";
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

const STEPS_CRYPTO = [
  { icon: "₿", title: "Choisissez votre crypto et réseau", description: "Sélectionnez la cryptomonnaie (USDT, BTC, TRX…) et le réseau. TRC20 est recommandé pour USDT : frais quasi nuls et confirmation en 1-2 minutes.", tip: "Évitez ERC20 pour USDT — frais de gas très élevés." },
  { icon: "📧", title: "Renseignez votre email", description: "Entrez votre adresse email pour recevoir la confirmation et le suivi de la transaction automatiquement." },
  { icon: "📬", title: "Copiez notre adresse wallet", description: "Notre adresse de dépôt s'affiche. Copiez-la avec précision — une erreur peut faire perdre vos fonds définitivement.", tip: "Double-vérifiez les 4 premiers et 4 derniers caractères." },
  { icon: "📤", title: "Envoyez vos cryptos + partagez le TxID", description: "Effectuez le virement et partagez le hash de transaction (TxID) sur WhatsApp avec la capture de l'envoi.", tip: "Le TxID est visible dans votre wallet sous 'Historique des transactions'." },
  { icon: "💰", title: "Recevez vos FCFA sur MoMo", description: "Après confirmation blockchain, nous virons le montant en FCFA. Délai total : 15 à 30 min. Taux garanti au moment de l'accord.", tip: "BTC peut prendre jusqu'à 1h selon la congestion réseau." },
];

const PAGE_FAQ = [
  { q: "Quel est le taux USDT en FCFA aujourd'hui au Cameroun ?", a: "Le taux USDT/FCFA est mis à jour en temps réel dans notre ticker en haut de page. Nous achetons à 580 FCFA/$ et vendons à 700 FCFA/$. Ce taux est garanti au moment de votre transaction, sans aucune commission cachée." },
  { q: "Comment vendre ses crypto en FCFA au Cameroun sans arnaque ?", a: "Chreol Empire opère depuis 2012 à Douala. Processus sécurisé en 3 étapes : (1) envoyez vos crypto à notre adresse vérifiée, (2) partagez le TxID sur WhatsApp avec capture de l'envoi, (3) recevez votre FCFA sur MTN MoMo ou Orange Money sous 30 min post-confirmation blockchain." },
  { q: "Quelle blockchain utiliser pour envoyer de l'USDT au Cameroun ?", a: "TRC20 (réseau Tron) est recommandé : frais proches de zéro et confirmations en 1-2 minutes. BEP20 (BNB Chain) est aussi accepté. Évitez ERC20 pour l'USDT — les frais de gas Ethereum peuvent dépasser 10$." },
  { q: "Combien de temps pour recevoir son MoMo après vente crypto ?", a: "En général 15 à 30 minutes après la première confirmation blockchain. Pour BTC, jusqu'à 1 heure selon la congestion du réseau. Partagez votre TxID dès l'envoi pour que nous surveillions l'arrivée en temps réel." },
];

const PAGE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAGE_FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function CryptoPage() {
  useEffect(() => { track("service_view", { service: "crypto" }); }, []);
  const { addItem } = useCart();
  const { addEntry } = useHistory();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [direction, setDirection] = useState<"sell" | "buy">("sell");
  const [cryptoId, setCryptoId]   = useState("usdt");
  const [network, setNetwork]     = useState(CRYPTO_NETWORKS["usdt"][0]);
  const [amount, setAmount]       = useState("");
  const [txid, setTxid]           = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [momoOp, setMomoOp]       = useState("orange");
  const [momoPhone, setMomoPhone] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [email, setEmail]           = useState("");
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [howOpen, setHowOpen]     = useState(false);

  const crypto   = CRYPTO_RATES.find(c => c.id === cryptoId)!;
  const networks = CRYPTO_NETWORKS[cryptoId] ?? [];
  const numAmount = parseFloat(amount) || 0;

  const fcfaReceived   = direction === "sell" ? Math.round(numAmount * crypto.buyRate)  : 0;
  const cryptoReceived = direction === "buy"  ? numAmount / crypto.sellRate             : 0;

  function selectCrypto(id: string) {
    setCryptoId(id);
    setNetwork(CRYPTO_NETWORKS[id][0]);
    setAmount("");
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!amount || numAmount <= 0) e.amount = "Montant requis";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Adresse email valide requise";
    if (direction === "sell") {
      if (txid && txid.length < 20) e.txid = "Hash invalide (min 20 caractères)";
      if (!beneficiary.trim()) e.beneficiary = "Nom requis";
      const mpD = momoPhone.replace(/\D/g, "").replace(/^237/, "");
      if (mpD.length < 9) e.momoPhone = "Numéro invalide (9 chiffres)";
    } else {
      if (!walletAddr.trim()) e.walletAddr = "Adresse wallet requise";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildDetails() {
    const op          = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const depositAddr = CRYPTO_WALLETS[cryptoId]?.[network] ?? "—";
    if (direction === "sell") {
      return [
        `Crypto : ${crypto.name} | Réseau : ${network} | Montant : ${amount} ${crypto.unit}`,
        `Wallet Chreol Empire (${network}) : ${depositAddr}`,
        txid ? `TxID : ${txid}` : `TxID : en attente`,
        `Bénéficiaire : ${beneficiary} | ${op} +237 ${momoPhone}`,
        `Email : ${email}`,
      ].join("\n");
    }
    return `Crypto : ${crypto.name} | Réseau : ${network} | Je paie : ${numAmount.toLocaleString("fr-FR")} FCFA\nWallet : ${walletAddr}\nEmail : ${email}`;
  }

  function buildMsgPlain() {
    const op          = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    const depositAddr = CRYPTO_WALLETS[cryptoId]?.[network] ?? "—";
    if (direction === "sell") {
      return [
        `📤 VENTE CRYPTO`,
        `Crypto : ${crypto.name} (${crypto.fullName})`,
        `Réseau : ${network}`,
        `Montant : ${amount} ${crypto.unit}`,
        `À recevoir : ${fcfaReceived.toLocaleString("fr-FR")} FCFA`,
        ``,
        `📬 Envoyez à ce wallet (${network}) :`,
        depositAddr,
        txid ? `\n🔗 TxID : ${txid}` : `\n⏳ TxID : à fournir après envoi`,
        ``,
        `💰 Réception MoMo`,
        `Opérateur : ${op}`,
        `Numéro : +237 ${momoPhone}`,
        `Nom : ${beneficiary}`,
        `Email : ${email}`,
      ].join("\n");
    }
    return `📥 ACHAT CRYPTO\nCrypto : ${crypto.name} (${crypto.fullName})\nRéseau : ${network}\nJe paie : ${numAmount.toLocaleString("fr-FR")} FCFA\nÀ recevoir : ${cryptoReceived.toFixed(6)} ${crypto.unit}\n\nWallet : ${walletAddr}\nEmail : ${email}`;
  }

  function sendNotification() {
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: `crypto-${cryptoId}-${Date.now()}`,
        clientName: direction === "sell" ? beneficiary : email.split("@")[0],
        clientEmail: email,
        clientPhone: direction === "sell" ? momoPhone : "",
        paymentMethod: direction === "sell" ? op : "Via WhatsApp",
        items: [{
          name: direction === "sell" ? `Vente ${crypto.name} (${network})` : `Achat ${crypto.name} (${network})`,
          qty: 1,
          price: direction === "sell" ? fcfaReceived : numAmount,
          amount: direction === "sell"
            ? `${amount} ${crypto.unit} → ${fcfaReceived.toLocaleString("fr-FR")} FCFA`
            : `${numAmount.toLocaleString("fr-FR")} FCFA → ${cryptoReceived.toFixed(6)} ${crypto.unit}`,
          details: buildDetails(),
        }],
        total: direction === "sell" ? fcfaReceived : numAmount,
        sourceUrl: window.location.pathname,
      }),
    }).catch(() => {});
  }

  function handleAddToCart() {
    if (!validate()) { showToast("Corrigez les erreurs avant d'ajouter au panier", "error"); return; }
    const op = MOMO_OPERATORS.find(o => o.id === momoOp)?.name ?? momoOp;
    addItem({
      id: `crypto-${cryptoId}-${Date.now()}`,
      cardName: direction === "sell" ? `Vente ${crypto.name} (${network})` : `Achat ${crypto.name} (${network})`,
      amount: direction === "sell"
        ? `${amount} ${crypto.unit} → ${fcfaReceived.toLocaleString("fr-FR")} FCFA via ${op}`
        : `${numAmount.toLocaleString("fr-FR")} FCFA → ${cryptoReceived.toFixed(6)} ${crypto.unit}`,
      price: direction === "sell" ? fcfaReceived : numAmount,
      type: direction === "sell" ? "sell" : "buy",
      details: buildDetails(),
    });
    addEntry({
      service: `Crypto — ${direction === "sell" ? "Vente" : "Achat"} ${crypto.name}`,
      details: direction === "sell"
        ? `${amount} ${crypto.unit} → ${fcfaReceived.toLocaleString("fr-FR")} FCFA`
        : `${numAmount.toLocaleString("fr-FR")} FCFA → ${cryptoReceived.toFixed(6)} ${crypto.unit}`,
      amount: direction === "sell" ? fcfaReceived : numAmount,
      currency: "FCFA",
      status: "pending",
    });
    showToast(`${direction === "sell" ? "Vente" : "Achat"} ${crypto.name} ajouté au panier !`, "success");
  }


  const inputCls  = "w-full px-4 py-3 rounded-2xl text-white text-sm outline-none transition-colors";
  const inputBase = { background: "var(--bg-elevated)", border: "1px solid var(--border)" };
  const inputErr  = { ...inputBase, borderColor: "#EF4444" };

  return (
    <div className="max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/services" className="hover:text-white transition-colors">Services</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Crypto & coins</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">{t("p.crypto.title")}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        {t("p.crypto.sub")}
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

      {/* Crypto selector */}
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
              <span className="text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                {(direction === "sell" ? c.buyRate : c.sellRate).toLocaleString("fr-FR")} F
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
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
              type="number" min="0"
              placeholder={direction === "sell" ? "ex: 10" : "ex: 50 000"}
              value={amount}
              onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
              className={inputCls}
              style={errors.amount ? inputErr : inputBase}
            />
          </Field>

          {/* Tableau de calcul */}
          {numAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-4"
              style={{ background: crypto.color + "12", border: `1px solid ${crypto.color}44` }}
            >
              <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: crypto.color }}>
                Tableau de calcul
              </p>
              {direction === "sell" ? (
                <>
                  <CalcRow label="Crypto envoyée" value={`${amount} ${crypto.unit}`} />
                  <CalcRow label="Réseau" value={network} />
                  <CalcRow label={`Taux d'achat`} value={`1 ${crypto.unit} = ${crypto.buyRate.toLocaleString("fr-FR")} FCFA`} />
                  <CalcRow label="Commission" value="0 FCFA (0%)" />
                  <CalcRow label="Vous recevez" value={`${fcfaReceived.toLocaleString("fr-FR")} FCFA`} highlight />
                </>
              ) : (
                <>
                  <CalcRow label="FCFA à payer" value={`${numAmount.toLocaleString("fr-FR")} FCFA`} />
                  <CalcRow label="Réseau" value={network} />
                  <CalcRow label="Taux de vente" value={`1 ${crypto.unit} = ${crypto.sellRate.toLocaleString("fr-FR")} FCFA`} />
                  <CalcRow label="Commission" value="0 FCFA (0%)" />
                  <CalcRow label="Vous recevez" value={`${cryptoReceived.toFixed(6)} ${crypto.unit}`} highlight />
                </>
              )}
            </motion.div>
          )}

          {/* Email — commun aux deux directions */}
          <Field label="Adresse email" error={errors.email}>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
              className={inputCls}
              style={errors.email ? inputErr : inputBase}
            />
          </Field>

          {/* SELL — extra fields */}
          {direction === "sell" && (
            <>
              {/* Wallet Chreol Empire à afficher */}
              {CRYPTO_WALLETS[cryptoId]?.[network] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-4"
                  style={{ background: "var(--gold)15", border: "1px solid var(--gold)44" }}
                >
                  <p className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: "var(--gold)" }}>
                    📤 Envoyez à cette adresse
                  </p>
                  <p className="text-[11px] mb-3" style={{ color: "var(--text-secondary)" }}>
                    Réseau : <span className="font-bold text-white">{network}</span> — vérifiez le réseau avant d&apos;envoyer
                  </p>
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                  >
                    <span className="flex-1 text-xs font-mono text-white break-all select-all">
                      {CRYPTO_WALLETS[cryptoId][network]}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard
                          .writeText(CRYPTO_WALLETS[cryptoId][network])
                          .then(() => showToast("Adresse copiée !", "success"))
                      }
                      className="shrink-0 text-xs px-2 py-1 rounded-lg font-bold hover:bg-white/10 transition-colors"
                      style={{ color: "var(--gold)" }}
                    >
                      📋 Copier
                    </button>
                  </div>
                </motion.div>
              )}

              <Field label="TxID / Hash de la transaction (optionnel — à fournir après envoi)" error={errors.txid}>
                <input
                  type="text" placeholder="Collez votre hash de transaction ici… (peut être ajouté plus tard)"
                  value={txid}
                  onChange={e => { setTxid(e.target.value); setErrors(p => ({ ...p, txid: "" })); }}
                  className={inputCls} style={errors.txid ? inputErr : inputBase}
                />
              </Field>
              <Field label="Nom du bénéficiaire" error={errors.beneficiary}>
                <input
                  type="text" placeholder="Votre nom complet"
                  value={beneficiary}
                  onChange={e => { setBeneficiary(e.target.value); setErrors(p => ({ ...p, beneficiary: "" })); }}
                  className={inputCls} style={errors.beneficiary ? inputErr : inputBase}
                />
              </Field>
              <Field label="Réception Mobile Money" error={errors.momoPhone}>
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
                      maxLength={9}
                      onChange={e => { setMomoPhone(e.target.value); setErrors(p => ({ ...p, momoPhone: "" })); }}
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
                  type="text" placeholder={`Adresse ${crypto.name} réseau ${network}…`}
                  value={walletAddr}
                  onChange={e => { setWalletAddr(e.target.value); setErrors(p => ({ ...p, walletAddr: "" })); }}
                  className={inputCls + " pr-12"} style={errors.walletAddr ? inputErr : inputBase}
                />
                {walletAddr && (
                  <button
                    onClick={() => navigator.clipboard.writeText(walletAddr).then(() => showToast("Adresse copiée !", "success"))}
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
            prefillPrenom={beneficiary}
            className="w-full py-3 rounded-full font-black text-white text-sm flex items-center justify-center gap-2 transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="" width={20} height={20} unoptimized className="shrink-0" />
            Commander directement via WhatsApp
          </WAPopover>
        ) : (
          <USSDOrderFlow
            total={numAmount}
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

      {/* Trust */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        {[["0%", "Commission"], ["15–30 min", "Traitement"], ["Sécurisé", "Mobile Money"]].map(([v, l]) => (
          <div key={l} className="flex items-center gap-2 text-xs px-3 py-2 rounded-full" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <span className="font-black" style={{ color: "var(--gold)" }}>{v}</span>
            <span style={{ color: "var(--text-secondary)" }}>{l}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
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
              ? ["Sélectionnez votre crypto et entrez le montant", "Envoyez la crypto à notre adresse et copiez le TxID", "Remplissez vos informations MoMo et ajoutez au panier", "Confirmez la commande — recevez vos FCFA en 15–30 min"]
              : ["Choisissez la crypto, le réseau et le montant FCFA", "Entrez votre adresse wallet de réception", "Ajoutez au panier et confirmez via WhatsApp", "Payez via MoMo — recevez votre crypto en 15–30 min"]
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
      <StepGuide title="Comment vendre/acheter des cryptos — Étape par étape" steps={STEPS_CRYPTO} />
      <FAQ items={PAGE_FAQ} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_FAQ_SCHEMA) }} />
      <RelatedServices current="crypto" />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CONTACT,
  CRYPTO_NETWORKS,
  CRYPTO_RATES,
  CRYPTO_WALLETS,
  MTN_MONEY,
  PAYPAL_RATES,
  cryptoPayUsdRate,
  fcfaToCryptoUnits,
  fcfaToPayUsd,
  fcfaToPaypalEur,
  formatCryptoUnits,
} from "@/lib/services";

export type AltPayKind = "gimac" | "paypal" | "crypto";

interface Props {
  kind: AltPayKind;
  /** Montant de la commande en FCFA. 0 = adresses seules, sans conversion. */
  fcfa: number;
  /** in = le client paie la boutique. out = la boutique paie le client. */
  direction: "in" | "out";
  target?: string;
  onTarget?: (value: string) => void;
  onLine?: (line: string) => void;
}

export default function PayInstruction({ kind, fcfa, direction, target, onTarget, onLine }: Props) {
  const [cryptoId, setCryptoId] = useState("usdt");
  const [network, setNetwork] = useState(CRYPTO_NETWORKS.usdt.includes("TRC20") ? "TRC20" : CRYPTO_NETWORKS.usdt[0]);
  const [ownTarget, setOwnTarget] = useState("");
  const value = target ?? ownTarget;
  const setValue = onTarget ?? setOwnTarget;

  const crypto = CRYPTO_RATES.find(c => c.id === cryptoId) ?? CRYPTO_RATES[0];
  const networks = CRYPTO_NETWORKS[crypto.id] ?? [];
  const activeNetwork = networks.includes(network) ? network : networks[0];
  const wallet = CRYPTO_WALLETS[crypto.id]?.[activeNetwork] ?? "";
  const units = fcfaToCryptoUnits(fcfa, crypto.id, direction);
  const payUsd = fcfaToPayUsd(fcfa);
  const euros = fcfaToPaypalEur(fcfa, direction);
  const paypalRate = direction === "in" ? PAYPAL_RATES.sellRate : PAYPAL_RATES.buyRate;
  const cryptoRate = crypto.sellRate;

  const line = useMemo(() => {
    if (kind === "gimac") {
      return [
        "Paiement GIMAC (transfert CEMAC vers le Cameroun)",
        `Destinataire : ${MTN_MONEY.phoneDisplay}`,
        `Nom : ${MTN_MONEY.accountName}`,
        fcfa > 0 ? `Montant : ${fcfa.toLocaleString("fr-FR")} FCFA` : "",
      ].filter(Boolean).join("\n");
    }
    if (kind === "paypal") {
      const who = direction === "in" ? CONTACT.paypalEmail : (value || "email à indiquer");
      return [
        `PayPal « Proches et Familles » uniquement`,
        direction === "in" ? `Envoyez à : ${who}` : `Recevoir sur : ${who}`,
        fcfa > 0 ? `Montant : ${euros.toFixed(2)} € (${fcfa.toLocaleString("fr-FR")} FCFA, 1 € = ${paypalRate} FCFA)` : "",
      ].filter(Boolean).join("\n");
    }
    const addr = direction === "in" ? wallet : (value || "wallet à indiquer");
    return [
      `Crypto : ${crypto.name} · ${activeNetwork}`,
      direction === "in" ? `Wallet boutique : ${addr}` : `Wallet de réception : ${addr}`,
      fcfa > 0
        ? direction === "in"
          ? `Montant : ${payUsd.toFixed(2)} USD (${fcfa.toLocaleString("fr-FR")} FCFA, 1 USD = ${cryptoPayUsdRate().toLocaleString("fr-FR")} FCFA)`
          : `Montant : ${formatCryptoUnits(units, crypto.unit)} ${crypto.unit} (1 ${crypto.unit} = ${cryptoRate.toLocaleString("fr-FR")} FCFA)`
        : "",
    ].filter(Boolean).join("\n");
  }, [kind, direction, fcfa, value, euros, paypalRate, crypto, activeNetwork, wallet, units, cryptoRate, payUsd]);

  useEffect(() => { onLine?.(line); }, [line, onLine]);

  function copy(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  if (kind === "gimac") {
    return (
      <div className="rounded-2xl p-4 text-xs" style={{ background: "#006B3D14", border: "1px solid #006B3D44" }}>
        <p className="font-black mb-2" style={{ color: "#00A65A" }}>GIMAC — transfert CEMAC vers le Cameroun</p>
        <p style={{ color: "var(--text-secondary)" }}>Pays de destination : Cameroun. Destinataire déjà publié sur nos dépôts MTN.</p>
        <p className="mt-2 font-black tabular-nums text-white">{MTN_MONEY.phoneDisplay}</p>
        <p style={{ color: "var(--text-secondary)" }}>{MTN_MONEY.accountName}</p>
        {fcfa > 0 && <p className="mt-2 font-black text-white">{fcfa.toLocaleString("fr-FR")} FCFA</p>}
        <p className="mt-2" style={{ color: "var(--text-muted)" }}>Pas de commission boutique. Les frais de votre opérateur GIMAC restent à votre charge.</p>
      </div>
    );
  }

  if (kind === "paypal") {
    return (
      <div className="rounded-2xl p-4 text-xs" style={{ background: "#00308718", border: "1px solid #00308755" }}>
        <p className="font-black mb-2" style={{ color: "#5B8FE8" }}>
          PayPal — uniquement « Proches et Familles »
        </p>
        {direction === "in" ? (
          <>
            <p style={{ color: "var(--text-secondary)" }}>Envoyez sur cette adresse, type d&apos;envoi Proches et Familles :</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="font-black break-all text-white">{CONTACT.paypalEmail}</p>
              <button type="button" onClick={() => copy(CONTACT.paypalEmail)} className="shrink-0 text-[10px] font-black px-2 py-1 rounded-lg" style={{ color: "#5B8FE8" }}>Copier</button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2" style={{ color: "var(--text-secondary)" }}>Email PayPal qui doit recevoir le virement Proches et Familles :</p>
            <input
              type="email"
              value={value}
              placeholder="email@exemple.com"
              onChange={e => setValue(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            />
          </>
        )}
        {fcfa > 0 && (
          <p className="mt-2 font-black text-white">
            {euros.toFixed(2)} € · 1 € = {paypalRate.toLocaleString("fr-FR")} FCFA
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 text-xs" style={{ background: "#26A17B14", border: "1px solid #26A17B44" }}>
      <p className="font-black mb-2" style={{ color: "#26A17B" }}>
        {direction === "in" ? "Crypto — envoyez sur le wallet boutique" : "Crypto — wallet où recevoir"}
      </p>
      <div className="flex flex-col gap-2 mb-2">
        <select
          value={crypto.id}
          onChange={e => {
            const id = e.target.value;
            setCryptoId(id);
            const nets = CRYPTO_NETWORKS[id] ?? [];
            setNetwork(nets.includes("TRC20") ? "TRC20" : (nets[0] ?? ""));
          }}
          className="px-3 py-2 rounded-xl text-white text-xs outline-none"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          {CRYPTO_RATES.map(c => (
            <option key={c.id} value={c.id}>{c.name} — {c.fullName}</option>
          ))}
        </select>
        {networks.length > 1 && (
          <select
            value={activeNetwork}
            onChange={e => setNetwork(e.target.value)}
            className="px-3 py-2 rounded-xl text-white text-xs outline-none"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            {networks.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        )}
      </div>
      {direction === "in" ? (
        <div className="flex items-start gap-2">
          <p className="font-mono text-[11px] break-all text-white flex-1">{wallet || "Adresse indisponible sur ce réseau"}</p>
          {wallet && (
            <button type="button" onClick={() => copy(wallet)} className="shrink-0 text-[10px] font-black px-2 py-1 rounded-lg" style={{ color: "#26A17B" }}>Copier</button>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          placeholder="Votre adresse de réception"
          onChange={e => setValue(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        />
      )}
      {fcfa > 0 && direction === "in" && (
        <p className="mt-2 font-black text-white">
          {payUsd.toFixed(2)} USD · 1 USD = {cryptoPayUsdRate().toLocaleString("fr-FR")} FCFA
        </p>
      )}
      {fcfa > 0 && direction === "out" && (
        <p className="mt-2 font-black text-white">
          {formatCryptoUnits(units, crypto.unit)} {crypto.unit} · 1 {crypto.unit} = {cryptoRate.toLocaleString("fr-FR")} FCFA
        </p>
      )}
      <p className="mt-2" style={{ color: "var(--text-muted)" }}>Vérifiez le réseau avant l&apos;envoi. Un mauvais réseau perd les fonds.</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { CONTACT, IMAGES, IWOPAY_SCOPE } from "@/lib/services";
import { saveIwopayReceipt } from "@/lib/iwopayReceipts";
import IwopayStatusCard from "@/components/IwopayStatusCard";

type IwopayOperator = "om" | "momo";

const OPERATORS: ReadonlyArray<{ id: IwopayOperator; label: string }> = [
  { id: "om", label: "Orange Money" },
  { id: "momo", label: "MTN MoMo" },
];

interface Props {
  amount: number;
  motif?: string;
}

interface CollectOk {
  orderId: string;
  internalId?: string;
  status: string;
  message?: string;
}

export default function IwopayDebitForm({ amount, motif }: Props) {
  const [operator, setOperator] = useState<IwopayOperator>("om");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<CollectOk | null>(null);

  const local = phone.replace(/\D/g, "").replace(/^237/, "");
  const opLabel = OPERATORS.find(o => o.id === operator)?.label ?? operator;

  async function submit() {
    setError("");
    if (local.length !== 9) {
      setError("Entrez les 9 chiffres du numéro, sans indicatif.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/iwopay-collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, phone: local, operator, motif }),
      });
      const data = await res.json().catch(() => ({})) as CollectOk & { error?: string };
      if (!res.ok || !data.orderId) {
        setError(data.error ?? "La demande de débit n'a pas abouti.");
        return;
      }
      saveIwopayReceipt({
        ref: data.orderId,
        internalId: data.internalId,
        amount,
        motif,
        at: new Date().toISOString(),
      });
      setDone({ orderId: data.orderId, internalId: data.internalId, status: data.status, message: data.message });
    } catch {
      setError("Connexion impossible. Réessayez dans un instant.");
    } finally {
      setBusy(false);
    }
  }

  function openWhatsApp() {
    if (!done) return;
    const text = encodeURIComponent(
      `Bonjour Chreol Empire, preuve de débit Iwopay.\nRéf. ${done.orderId}\n${opLabel} : +237 ${local}\nMontant : ${amount.toLocaleString("fr-FR")} FCFA\n${motif ? `Commande : ${motif}\n` : ""}Je joins la capture du débit.`,
    );
    const wa = CONTACT.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${wa}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  if (done) {
    return (
      <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "#0EA5E918", border: "1px solid #0EA5E955" }}>
        <p className="text-sm font-black text-white">Demande de débit envoyée</p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Référence <strong className="text-white tabular-nums">{done.orderId}</strong>.
          Validez la demande reçue sur <strong className="text-white">+237 {local}</strong> ({opLabel}) avec votre code secret.
        </p>
        <IwopayStatusCard
          orderRef={done.orderId}
          queryRef={done.internalId || done.orderId}
          amount={amount}
          motif={motif}
        />
        <button
          type="button"
          onClick={openWhatsApp}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-black text-white text-sm"
          style={{ background: "#25D366" }}
        >
          <Image src={IMAGES.whatsapp} alt="" width={18} height={18} unoptimized />
          Envoyer la preuve sur WhatsApp
        </button>
        <a href="/historique" className="text-center text-[11px] font-bold" style={{ color: "var(--gold)" }}>
          Retrouver cet état dans Historique
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{IWOPAY_SCOPE}</p>
      <p className="text-xs font-bold text-white">Compte à débiter</p>
      <div className="grid grid-cols-2 gap-2">
        {OPERATORS.map(o => (
          <button
            key={o.id}
            type="button"
            onClick={() => setOperator(o.id)}
            className="py-2.5 rounded-xl text-xs font-black"
            style={{
              background: operator === o.id ? "#0EA5E922" : "var(--bg-card)",
              border: `2px solid ${operator === o.id ? "#0EA5E9" : "var(--border)"}`,
              color: operator === o.id ? "#7DD3FC" : "var(--text-secondary)",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <span className="px-3 py-3 rounded-2xl text-sm font-black shrink-0" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>+237</span>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="6XXXXXXXX"
          value={phone}
          maxLength={9}
          onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setError(""); }}
          className="flex-1 px-4 py-3 rounded-2xl text-white text-sm outline-none"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        />
      </div>
      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
        Iwopay retire <strong className="text-white">{amount.toLocaleString("fr-FR")} FCFA</strong> sur ce numéro. Vous confirmez avec votre code secret.
      </p>
      {error && <p className="text-xs font-bold" style={{ color: "#FCA5A5" }}>{error}</p>}
      <button
        type="button"
        disabled={busy}
        onClick={submit}
        className="w-full py-3.5 rounded-full font-black text-sm text-white disabled:opacity-60"
        style={{ background: "#0EA5E9" }}
      >
        {busy ? "Envoi de la demande…" : "Débiter ce numéro"}
      </button>
    </div>
  );
}

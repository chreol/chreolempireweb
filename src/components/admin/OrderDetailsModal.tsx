"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/admin/Modal";
import { patchForWorkflow, workflowOf, type OrderWorkflow } from "@/lib/orderWorkflow";

export interface AdminOrderView {
  id: string;
  summary: string;
  total: number;
  payment_method: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: string;
  payment_status?: string | null;
  created_at: string;
  details?: unknown;
}

const OPTIONS: { value: OrderWorkflow; label: string }[] = [
  { value: "PENDING", label: "En attente" },
  { value: "PAID", label: "Payée" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
];

function asRecord(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === "string") {
    try { return asRecord(JSON.parse(value)); } catch { return {}; }
  }
  return typeof value === "object" ? value as Record<string, unknown> : {};
}

export default function OrderDetailsModal({
  order,
  onClose,
  onUpdated,
}: {
  order: AdminOrderView;
  onClose: () => void;
  onUpdated: (order: AdminOrderView) => void;
}) {
  const details = useMemo(() => asRecord(order.details), [order.details]);
  const items = Array.isArray(details.items) ? details.items : [];
  const sourceUrl = typeof details.sourceUrl === "string" ? details.sourceUrl : "";
  const [note, setNote] = useState(typeof details.internalNote === "string" ? details.internalNote : "");
  const [workflow, setWorkflow] = useState<OrderWorkflow>(workflowOf(order.status, order.payment_status));
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function changeStatus(next: OrderWorkflow) {
    setWorkflow(next);
    setBusy("status");
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, workflow: next }),
      });
      if (!res.ok) {
        setError("Statut non mis à jour.");
        setWorkflow(workflowOf(order.status, order.payment_status));
        return;
      }
      const patch = patchForWorkflow(next);
      onUpdated({ ...order, status: patch.status, payment_status: patch.payment_status });
      setMessage("Statut mis à jour.");
    } catch {
      setError("Statut non mis à jour.");
    } finally {
      setBusy("");
    }
  }

  async function saveNote() {
    setBusy("note");
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, internalNote: note }),
      });
      if (!res.ok) {
        setError("Note non enregistrée.");
        return;
      }
      const nextDetails = { ...details, internalNote: note };
      onUpdated({ ...order, details: nextDetails });
      setMessage("Note interne enregistrée.");
    } catch {
      setError("Note non enregistrée.");
    } finally {
      setBusy("");
    }
  }

  async function sendInvoice() {
    setBusy("invoice");
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Envoi de la facture impossible.");
        return;
      }
      setMessage("Facture envoyée au client.");
    } catch {
      setError("Envoi de la facture impossible.");
    } finally {
      setBusy("");
    }
  }

  const dateLabel = order.created_at
    ? new Date(order.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <Modal title={`Commande #${order.id.slice(-8).toUpperCase()}`} onClose={onClose}>
      <dl className="flex flex-col gap-2 text-sm">
        {[
          ["Nom", order.client_name || "—"],
          ["Email", order.client_email || "—"],
          ["Téléphone", order.client_phone || "—"],
          ["Moyen de paiement", order.payment_method || "—"],
          ["Date", dateLabel],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt style={{ color: "var(--text-muted)" }}>{label}</dt>
            <dd className="text-right text-white font-bold break-all">{value}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-3">
          <dt style={{ color: "var(--text-muted)" }}>Total</dt>
          <dd className="font-black" style={{ color: "var(--gold)", fontVariantNumeric: "tabular-nums" }}>
            {Number(order.total || 0).toLocaleString("fr-FR")} FCFA
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Articles</p>
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{order.summary || "Commande"}</p>
        ) : items.map((item, i) => {
          const row = asRecord(item);
          const qty = Number(row.qty ?? 1);
          const price = Number(row.price ?? row.amount ?? 0);
          return (
            <div key={i} className="flex justify-between gap-3 text-sm py-1" style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              <span>{String(row.name ?? "Article")} ×{qty}</span>
              <span className="font-bold" style={{ color: "var(--gold)", fontVariantNumeric: "tabular-nums" }}>
                {(price * (Number.isFinite(qty) ? qty : 1)).toLocaleString("fr-FR")} F
              </span>
            </div>
          );
        })}
      </div>

      {sourceUrl && (
        <p className="text-xs mt-3 break-all" style={{ color: "var(--text-muted)" }}>
          Lien source : <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--gold)" }}>{sourceUrl}</a>
        </p>
      )}

      <label className="block mt-4 text-xs font-bold" style={{ color: "var(--text-muted)" }}>
        STATUT
        <select
          value={workflow}
          disabled={busy === "status"}
          onChange={e => changeStatus(e.target.value as OrderWorkflow)}
          className="mt-1 w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          {OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </label>

      <label className="block mt-4 text-xs font-bold" style={{ color: "var(--text-muted)" }}>
        NOTE INTERNE
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Commentaire privé, invisible du client"
          className="mt-1 w-full px-4 py-3 rounded-xl text-sm text-white outline-none resize-y"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        />
      </label>
      <button
        type="button"
        onClick={saveNote}
        disabled={busy === "note"}
        className="mt-2 w-full py-2.5 rounded-xl text-sm font-black text-black disabled:opacity-50 active:scale-[0.96]"
        style={{ background: "var(--gold)", transition: "scale 150ms" }}
      >
        {busy === "note" ? "Enregistrement..." : "Enregistrer la note"}
      </button>

      <button
        type="button"
        onClick={sendInvoice}
        disabled={busy === "invoice" || !order.client_email}
        className="mt-3 w-full py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-50 active:scale-[0.96]"
        style={{ background: "#1D4ED8", transition: "scale 150ms" }}
      >
        {busy === "invoice" ? "Envoi..." : "Envoyer la facture par email"}
      </button>

      {error && <p className="text-xs mt-3" style={{ color: "#EF4444" }}>{error}</p>}
      {message && <p className="text-xs mt-3" style={{ color: "#10B981" }}>{message}</p>}
    </Modal>
  );
}

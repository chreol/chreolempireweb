"use client";

import { useCallback, useEffect, useState } from "react";
import { loadIwopayReceipts, type IwopayReceipt } from "@/lib/iwopayReceipts";

type ViewState = "pending" | "paid" | "refused" | "cancelled" | "unknown";

interface StatusView {
  state: ViewState;
  label: string;
  detail: string;
  code?: string;
}

const COLORS: Record<ViewState, { bg: string; border: string; color: string }> = {
  pending:   { bg: "#1A1500", border: "#C9A84C55", color: "#C9A84C" },
  paid:      { bg: "#0D1A0F", border: "#25D36655", color: "#25D366" },
  refused:   { bg: "#1A0A0A", border: "#EF444455", color: "#FCA5A5" },
  cancelled: { bg: "#1A0A0A", border: "#EF444455", color: "#FCA5A5" },
  unknown:   { bg: "#111",    border: "#ffffff22", color: "#A3A3A3" },
};

interface Props {
  /** Référence marchand affichée au client. */
  orderRef: string;
  /** Référence à interroger chez Iwopay (internal_id de préférence). */
  queryRef: string;
  amount?: number;
  motif?: string;
}

export default function IwopayStatusCard({ orderRef, queryRef, amount, motif }: Props) {
  const [view, setView] = useState<StatusView | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (): Promise<StatusView | null> => {
    setError("");
    try {
      const res = await fetch(`/api/iwopay-collect?ref=${encodeURIComponent(queryRef)}`);
      const data = await res.json().catch(() => ({})) as StatusView & { error?: string };
      if (!res.ok || !data.state) {
        setError(data.error ?? "Statut indisponible");
        return null;
      }
      const next = { state: data.state, label: data.label, detail: data.detail, code: data.code };
      setView(next);
      return next;
    } catch {
      setError("Connexion impossible");
      return null;
    } finally {
      setLoading(false);
    }
  }, [queryRef]);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function load() {
      const next = await refresh();
      if (!alive) return;
      if (next && next.state !== "pending" && next.state !== "unknown" && timer) {
        clearInterval(timer);
      }
    }

    void load();
    timer = setInterval(() => { void load(); }, 15000);
    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, [refresh]);

  const tone = COLORS[view?.state ?? "unknown"];

  return (
    <div className="rounded-2xl p-4" style={{ background: tone.bg, border: `1px solid ${tone.border}` }}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: tone.color }}>Paiement Iwopay</p>
        <span className="text-xs font-black" style={{ color: tone.color }}>
          {loading && !view ? "Vérification…" : view?.label ?? "—"}
        </span>
      </div>
      <p className="text-sm font-black text-white tabular-nums mt-1">{orderRef}</p>
      {(amount || motif) && (
        <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
          {motif ? `${motif} · ` : ""}{amount ? `${amount.toLocaleString("fr-FR")} FCFA` : ""}
        </p>
      )}
      <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
        {error || view?.detail || "Lecture du statut…"}
      </p>
      <button
        type="button"
        onClick={() => { setLoading(true); void refresh(); }}
        className="mt-3 text-[11px] font-black uppercase tracking-wider"
        style={{ color: tone.color }}
      >
        Actualiser
      </button>
    </div>
  );
}

export function IwopayStatusList() {
  const [items, setItems] = useState<IwopayReceipt[]>([]);
  const [refInput, setRefInput] = useState("");
  const [manual, setManual] = useState<string | null>(null);

  useEffect(() => { setItems(loadIwopayReceipts()); }, []);

  return (
    <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <h2 className="text-base font-black text-white">Suivi Iwopay</h2>
      <p className="text-xs mt-1 mb-4" style={{ color: "var(--text-secondary)" }}>
        Validé, en attente, refusé ou annulé. Le statut se met à jour tant que le débit n&apos;est pas terminé.
      </p>
      {items.length === 0 && !manual && (
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Aucun débit Iwopay sur cet appareil.</p>
      )}
      <div className="flex flex-col gap-3">
        {manual && <IwopayStatusCard orderRef={manual} queryRef={manual} />}
        {items.map(item => (
          <IwopayStatusCard
            key={item.ref}
            orderRef={item.ref}
            queryRef={item.internalId || item.ref}
            amount={item.amount}
            motif={item.motif}
          />
        ))}
      </div>
      <form
        className="flex gap-2 mt-4"
        onSubmit={e => {
          e.preventDefault();
          const ref = refInput.trim();
          if (ref.length >= 4) setManual(ref);
        }}
      >
        <input
          value={refInput}
          onChange={e => setRefInput(e.target.value)}
          placeholder="Référence, ex. CE…"
          className="flex-1 px-3 py-2 rounded-xl text-sm text-white outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        />
        <button type="submit" className="px-4 py-2 rounded-xl text-xs font-black text-black" style={{ background: "var(--gold)" }}>
          Voir
        </button>
      </form>
    </div>
  );
}

"use client";

import { useHistory } from "@/contexts/HistoryContext";
import { CONTACT } from "@/lib/services";
import Link from "next/link";

const STATUS_STYLES = {
  pending:   { label: "En attente", bg: "#1A1500", border: "#C9A84C44", color: "#C9A84C" },
  completed: { label: "Complété",   bg: "#0D1A0F", border: "#25D36644", color: "#25D366" },
  cancelled: { label: "Annulé",     bg: "#1A0A0A", border: "#EF444444", color: "#EF4444" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function HistoriquePage() {
  const { entries, clearHistory } = useHistory();

  if (entries.length === 0) {
    return (
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-6xl mb-4">📋</p>
        <h1 className="text-2xl font-black text-white mb-2">Aucun historique</h1>
        <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
          Vos transactions apparaîtront ici après chaque commande passée via WhatsApp.
        </p>
        <Link
          href="/services"
          className="inline-block px-6 py-3 rounded-full font-black text-black text-sm"
          style={{ background: "var(--gold)" }}
        >
          Voir les services →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <a href="/" className="hover:text-white transition-colors">Accueil</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Historique</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Historique</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {entries.length} transaction{entries.length > 1 ? "s" : ""} enregistrée{entries.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Effacer tout l'historique ?")) clearHistory();
          }}
          className="text-xs px-4 py-2 rounded-full transition-colors hover:text-white"
          style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
        >
          Tout effacer
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map(entry => {
          const s = STATUS_STYLES[entry.status];
          return (
            <div
              key={entry.id}
              className="rounded-2xl p-5"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-black text-white text-sm">{entry.service}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
                    {entry.details}
                  </p>
                </div>
                <span
                  className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black"
                  style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                >
                  {s.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-lg font-black" style={{ color: "var(--gold)" }}>
                    {entry.amount.toLocaleString("fr-FR")} {entry.currency}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {formatDate(entry.date)}
                  </p>
                </div>

                {entry.waText && (
                  <a
                    href={`https://wa.me/${CONTACT.whatsapp}?text=${entry.waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-full font-bold transition-opacity hover:opacity-80 shrink-0"
                    style={{ background: "#25D36622", color: "#25D366", border: "1px solid #25D36644" }}
                  >
                    Recommander
                  </a>
                )}
              </div>

              <p className="text-[10px] mt-2 font-mono" style={{ color: "var(--text-muted)" }}>
                Réf: {entry.id}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

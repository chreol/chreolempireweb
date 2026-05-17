"use client";

import { useHistory } from "@/contexts/HistoryContext";
import { useLanguage } from "@/contexts/LanguageContext";
import WAPopover from "@/components/WAPopover";
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
  const { t } = useLanguage();

  if (entries.length === 0) {
    return (
      <div className="max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-6xl mb-4">📋</p>
        <h1 className="text-2xl font-black text-white mb-2">{t("history.none")}</h1>
        <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
          {t("history.none.desc")}
        </p>
        <Link
          href="/services"
          className="inline-block px-6 py-3 rounded-full font-black text-black text-sm"
          style={{ background: "var(--gold)" }}
        >
          {t("btn.see_all")}
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
          <h1 className="text-3xl font-black text-white">{t("history.title")}</h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {entries.length} {entries.length > 1 ? t("history.tx.p") : t("history.tx.s")}
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm(t("history.confirm"))) clearHistory();
          }}
          className="text-xs px-4 py-2 rounded-full transition-colors hover:text-white"
          style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
        >
          {t("history.clear")}
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
                  <WAPopover
                    prefill={entry.waText}
                    align="right"
                    dropDown={false}
                    className="text-xs px-3 py-1.5 rounded-full font-bold transition-opacity hover:opacity-80 shrink-0"
                    style={{ background: "#25D36622", color: "#25D366", border: "1px solid #25D36644" }}
                  >
                    {t("history.reorder")}
                  </WAPopover>
                )}
              </div>

              <p className="text-[10px] mt-2 font-mono" style={{ color: "var(--text-muted)" }}>
                {t("history.ref")} {entry.id}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

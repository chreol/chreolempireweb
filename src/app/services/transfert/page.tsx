"use client";

import React from "react";
import { useToast } from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TransfertPage() {
  const { showToast } = useToast();
  const { t } = useLanguage();

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-2">{t("p.transfert.title")}</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{t("p.transfert.sub")}</p>

      <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <p className="mb-4">{t("p.transfert.intro")}</p>
        <button className="px-4 py-3 rounded-2xl font-black bg-var text-white" onClick={() => showToast(t("p.transfert.request_sent"), "success")}>{t("p.transfert.cta")}</button>
      </div>
    </div>
  );
}

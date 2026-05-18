"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PROMOS } from "@/lib/promos";

const DISMISS_KEY = "promo_banner_dismissed";

function findActivePrimary() {
  const now = Date.now();
  return PROMOS.find(p => {
    const expired = p.expiresAt ? new Date(p.expiresAt).getTime() < now : false;
    const soldOut = p.remaining !== null && p.remaining === 0;
    return !expired && !soldOut && p.expiresAt !== null;
  }) ?? null;
}

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState("");

  const promo = findActivePrimary();

  const calcCountdown = useCallback(() => {
    if (!promo?.expiresAt) return "";
    const diff = new Date(promo.expiresAt).getTime() - Date.now();
    if (diff <= 0) { setVisible(false); return ""; }
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [promo]);

  useEffect(() => {
    if (!promo) return;
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed === promo.id) return;
    setVisible(true);
    setCountdown(calcCountdown());
    const id = setInterval(() => setCountdown(calcCountdown()), 1000);
    return () => clearInterval(id);
  }, [promo, calcCountdown]);

  function dismiss() {
    if (promo) sessionStorage.setItem(DISMISS_KEY, promo.id);
    setVisible(false);
  }

  if (!visible || !promo) return null;

  return (
    <div
      role="banner"
      className="flex items-center justify-between gap-2 px-4 py-2 text-xs font-bold select-none"
      style={{ background: promo.badgeColor, color: "#000" }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-center flex-wrap">
        <span>{promo.badge}</span>
        <span className="truncate">{promo.title} — {promo.promoPrice.toLocaleString("fr-FR")} {promo.currency}</span>
        {countdown && (
          <span className="font-black tabular-nums px-2 py-0.5 rounded-full text-[10px]"
            style={{ background: "rgba(0,0,0,0.18)" }}>
            ⏱ {countdown}
          </span>
        )}
        <Link href="/promo"
          className="underline underline-offset-2 whitespace-nowrap transition-opacity hover:opacity-75">
          Voir l&apos;offre →
        </Link>
      </div>
      <button
        onClick={dismiss}
        aria-label="Fermer la bannière"
        className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
        style={{ background: "rgba(0,0,0,0.15)" }}>
        ×
      </button>
    </div>
  );
}

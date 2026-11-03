"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { NAV_SERVICES } from "@/lib/services";

export default function ServicesMenu() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = pathname.startsWith("/services");

  // Nettoie les timers au démontage
  useEffect(() => () => { if (openTimer.current) clearTimeout(openTimer.current); if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  // Fermer : Escape + clic extérieur
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(false); } }
    function onDown(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(false); } }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [open]);

  // Fermer après navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fermeture du menu au changement de route
    setOpen(false);
  }, [pathname]);

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    setOpen(true);
  }
  function handleLeave() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    // 800 ms : le temps de viser un lien après avoir quitté le bouton.
    closeTimer.current = setTimeout(() => setOpen(false), 800);
  }
  function handleToggle() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(o => !o);
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors"
        style={{
          color: isActive ? "var(--bg-primary)" : "var(--text-secondary)",
          background: isActive ? "var(--gold)" : "transparent",
        }}
      >
        {t("nav.services")}
        <span className="text-[9px] font-black" style={{ color: isActive ? "var(--bg-primary)" : "var(--text-muted)" }}>▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 pt-3" onMouseEnter={handleEnter}>
        <div
          className="w-[min(440px,calc(100vw-2rem))] rounded-2xl p-2"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
        >
          <div className="flex items-center justify-between px-2 pb-2 pt-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--gold)" }}>{t("nav.services")}</p>
            <Link href="/services" onClick={() => setOpen(false)} className="text-[10px] font-black uppercase tracking-widest transition-opacity hover:opacity-70" style={{ color: "var(--text-muted)" }}>
              {t("btn.see_all")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {NAV_SERVICES.map(s => (
              <Link
                key={s.slug}
                href={s.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-left transition-colors hover:bg-[var(--bg-elevated)]"
                style={{ background: "var(--bg-elevated)", border: `1px solid ${s.color}33` }}
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${s.color}18` }}>{s.emoji}</span>
                <span className="min-w-0">
                  <span className="block text-xs font-black text-white truncate">{t(`${s.tk}.title`)}</span>
                  <span className="block text-[10px] font-bold truncate" style={{ color: "var(--text-muted)" }}>{t(`${s.tk}.sub`)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

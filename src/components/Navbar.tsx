"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lang } from "@/lib/i18n/translations";
import { IMAGES } from "@/lib/services";
import WAPopover from "./WAPopover";

const NAV_KEYS = [
  { href: "/",           key: "nav.home" },
  { href: "/services",   key: "nav.services" },
  { href: "/paiement",   key: "nav.payment" },
  { href: "/historique", key: "nav.history" },
  { href: "/a-propos",   key: "nav.about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  return (
    <header
      style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden">
            <Image src={IMAGES.logo} alt="Chreol Empire" fill style={{ objectFit: "cover" }} className="outline outline-1 -outline-offset-1 outline-white/10" unoptimized />
          </div>
          <span className="font-black text-[var(--text-primary)] text-lg leading-tight hidden sm:block">
            Chreol<span style={{ color: "var(--gold)" }}>Empire</span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_KEYS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
              style={{
                color: pathname === l.href ? "var(--bg-primary)" : "var(--text-secondary)",
                background: pathname === l.href ? "var(--gold)" : "transparent",
              }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        {/* Right: toggles + WA + Cart */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Lang toggle */}
          <div className="hidden sm:flex items-center gap-0.5 rounded-full p-0.5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            {(["fr", "en"] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="px-2 py-1 rounded-full text-xs font-black transition-all"
                style={{
                  background: lang === l ? "var(--gold)" : "transparent",
                  color: lang === l ? "var(--bg-primary)" : "var(--text-muted)",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full text-base transition-[opacity,transform] duration-150 ease-out hover:opacity-80 active:scale-[0.92]"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            title={theme === "dark" ? "Mode clair" : "Mode sombre"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* WhatsApp */}
          <WAPopover
            dropDown
            align="right"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-[opacity,transform] duration-150 ease-out hover:opacity-80 active:scale-[0.96]"
            style={{ background: "#25D366" }}
          >
            <Image src={IMAGES.whatsapp} alt="WhatsApp" width={18} height={18} unoptimized className="shrink-0" />
            <span>WhatsApp</span>
          </WAPopover>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full transition-[opacity,transform] duration-150 ease-out hover:opacity-80 active:scale-[0.96]"
            style={{ background: "var(--bg-elevated)" }}
          >
            <span className="text-xl">🛒</span>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-black text-white px-1"
                style={{ background: "#E50914" }}
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className="lg:hidden flex overflow-x-auto gap-1 px-4 pb-3 pt-1 no-scrollbar"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {NAV_KEYS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
            style={{
              color: pathname === l.href ? "var(--bg-primary)" : "var(--text-secondary)",
              background: pathname === l.href ? "var(--gold)" : "var(--bg-elevated)",
            }}
          >
            {t(l.key)}
          </Link>
        ))}
        {/* Mobile lang + theme */}
        <div className="shrink-0 flex items-center gap-1 ml-auto">
          {(["fr", "en"] as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="px-2 py-1.5 rounded-full text-xs font-black transition-all"
              style={{
                background: lang === l ? "var(--gold)" : "var(--bg-elevated)",
                color: lang === l ? "var(--bg-primary)" : "var(--text-muted)",
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            className="w-7 h-7 flex items-center justify-center rounded-full text-xs"
            style={{ background: "var(--bg-elevated)" }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}

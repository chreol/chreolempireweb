"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lang } from "@/lib/i18n/translations";
import { IMAGES, NAV_SERVICES } from "@/lib/services";
import ServicesMenu from "./ServicesMenu";
import WAPopover from "./WAPopover";
import GlobalSearch from "./GlobalSearch";

const NAV_KEYS = [
  { href: "/",           key: "nav.home" },
  { href: "/services",   key: "nav.services" },
  { href: "/blog",       key: "nav.blog" },
  { href: "/promo",      key: "nav.promo", highlight: true },
  { href: "/paiement",   key: "nav.payment" },
  { href: "/historique", key: "nav.history" },
  { href: "/a-propos",   key: "nav.about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const isServicesActive = pathname.startsWith("/services");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
    {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    <header
      style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}
      className=""
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="chreol-logo-wrap w-9 h-9">
            <span className="chreol-logo-stars" aria-hidden="true"><span>✦</span><span>✦</span></span>
            <Image src={IMAGES.logo} alt="Chreol Empire" fill style={{ objectFit: "contain" }} className="chreol-logo-spin" unoptimized />
          </div>
          <span className="flex flex-col leading-tight">
            <span className="font-black text-[var(--text-primary)] text-lg whitespace-nowrap">
              Chreol<span style={{ color: "var(--gold)" }}>Empire</span>
            </span>
            <span className="hidden sm:block text-[8px] font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
              Premium digital · Since 2012
            </span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_KEYS.map(l => l.href === "/services" ? (
            /* Services — sous-menu (dropdown) */
            <ServicesMenu key="services" />
          ) : (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors"
              style={{
                color: pathname === l.href ? "var(--bg-primary)" : ("highlight" in l && l.highlight && pathname !== l.href) ? "#F87171" : "var(--text-secondary)",
                background: pathname === l.href ? "var(--gold)" : "transparent",
                fontWeight: "highlight" in l && l.highlight ? 800 : undefined,
              }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        {/* Right: toggles + WA + Cart */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Lang toggle — visible on all screen sizes */}
          <div className="flex items-center gap-0.5 rounded-full p-0.5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
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

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            title="Rechercher (Ctrl+K)"
            className="flex items-center gap-2 w-9 h-9 sm:w-auto sm:px-3 sm:py-2 justify-center rounded-full text-sm font-semibold transition-[opacity,transform] duration-150 ease-out hover:opacity-80 active:scale-[0.96]"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            <span className="text-base leading-none">🔍</span>
            <span className="hidden md:inline text-xs" style={{ color: "var(--text-muted)" }}>Ctrl+K</span>
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
      <div>
        <div
          className="lg:hidden flex overflow-x-auto gap-1 px-4 pb-3 pt-1 no-scrollbar"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {NAV_KEYS.map(l => l.href === "/services" ? (
            /* Services — sous-menu (panneau expansible) */
            <button
              key="services"
              type="button"
              onClick={() => setServicesOpen(v => !v)}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
              style={{
                color: isServicesActive ? "var(--bg-primary)" : "var(--text-secondary)",
                background: isServicesActive ? "var(--gold)" : "var(--bg-elevated)",
              }}
            >
              {t(l.key)}
              <span className="text-[9px] font-black" style={{ color: isServicesActive ? "var(--bg-primary)" : "var(--text-muted)" }}>▾</span>
            </button>
          ) : (
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
          {/* Mobile search + theme */}
          <div className="shrink-0 flex items-center gap-1 ml-auto">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-xs"
              style={{ background: "var(--bg-elevated)" }}
            >
              🔍
            </button>
            <button
              onClick={toggleTheme}
              className="w-7 h-7 flex items-center justify-center rounded-full text-xs"
              style={{ background: "var(--bg-elevated)" }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Services — sous-menu : liste flexible des services */}
        {servicesOpen && (
          <div className="lg:hidden px-4 pb-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {NAV_SERVICES.map(s => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => { setServicesOpen(false); router.push(s.href); }}
                  className="flex items-center gap-3 p-3 rounded-2xl text-left transition-colors min-h-[44px]"
                  style={{ background: "var(--bg-card)", border: `1px solid ${s.color}33` }}
                >
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${s.color}18` }}>{s.emoji}</span>
                  <span className="min-w-0">
                    <span className="block text-xs font-black text-white truncate">{t(`${s.tk}.title`)}</span>
                    <span className="block text-[10px] font-bold truncate" style={{ color: "var(--text-muted)" }}>{t(`${s.tk}.sub`)}</span>
                  </span>
                </button>
              ))}
            </div>
            <Link
              href="/services"
              onClick={() => setServicesOpen(false)}
              className="mt-3 w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center transition-opacity hover:opacity-85"
              style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            >
              {t("btn.see_all")}
            </Link>
          </div>
        )}
      </div>
    </header>
    </>
  );
}

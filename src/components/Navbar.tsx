"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { CONTACT, IMAGES } from "@/lib/services";

const LINKS = [
  { href: "/",                    label: "Accueil" },
  { href: "/services",            label: "Services" },
  { href: "/services/cartes-cadeaux", label: "Cartes Cadeaux" },
  { href: "/services/crypto",     label: "Crypto" },
  { href: "/services/coupons",    label: "Coupons" },
  { href: "/services/uba",        label: "UBA" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header
      style={{ background: "#141414", borderBottom: "1px solid #2A2A2A" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            style={{ background: "var(--gold)", borderRadius: 8 }}
            className="w-8 h-8 flex items-center justify-center text-black font-black text-sm"
          >
            CE
          </div>
          <span className="font-black text-white text-lg leading-tight hidden sm:block">
            Chreol<span style={{ color: "var(--gold)" }}>Empire</span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
              style={{
                color: pathname === l.href ? "#0A0A0A" : "#A0A0A0",
                background: pathname === l.href ? "var(--gold)" : "transparent",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: WhatsApp + Cart */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-80"
            style={{ background: "#25D366" }}
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </a>

          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors"
            style={{ background: "#222" }}
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
        style={{ borderTop: "1px solid #1F1F1F" }}
      >
        {LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
            style={{
              color: pathname === l.href ? "#0A0A0A" : "#A0A0A0",
              background: pathname === l.href ? "var(--gold)" : "#1A1A1A",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

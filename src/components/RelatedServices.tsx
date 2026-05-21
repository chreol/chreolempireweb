import Link from "next/link";

const ALL_SERVICES = [
  { id: "cartes-cadeaux", label: "Cartes Cadeaux", emoji: "🎮", href: "/services/cartes-cadeaux", color: "#C9A84C" },
  { id: "crypto",         label: "Crypto & MoMo",  emoji: "₿",  href: "/services/crypto",         color: "#26A17B" },
  { id: "coupons",        label: "Coupons",         emoji: "🎫", href: "/services/coupons",         color: "#25D366" },
  { id: "uba",            label: "UBA Cameroun",    emoji: "💳", href: "/services/uba",             color: "#8B0000" },
  { id: "paypal",         label: "PayPal Europe",   emoji: "💸", href: "/services/paypal",          color: "#003087" },
  { id: "factures",       label: "Paiement Factures", emoji: "🔄", href: "/services/factures",      color: "#FF6B00" },
];

export default function RelatedServices({ current }: { current: string }) {
  const related = ALL_SERVICES.filter(s => s.id !== current).slice(0, 3);

  return (
    <section className="mt-14 mb-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <p className="text-xs font-black uppercase tracking-widest shrink-0" style={{ color: "var(--text-muted)" }}>
          Vous pourriez aussi aimer
        </p>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map(s => (
          <Link
            key={s.id}
            href={s.href}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "var(--bg-card)", border: `1px solid ${s.color}33` }}
          >
            <span className="text-2xl shrink-0">{s.emoji}</span>
            <span className="font-black text-sm text-white">{s.label}</span>
            <span className="ml-auto text-xs font-bold" style={{ color: s.color }}>→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { CONTACT } from "@/lib/services";

const BILLERS = [
  { icon: "📺", name: "Canal+",    desc: "Abonnement Canal+ Cameroun — toutes offres" },
  { icon: "💡", name: "Eneo",      desc: "Facture d'électricité Eneo Cameroun" },
  { icon: "💧", name: "Camwater",  desc: "Facture d'eau Camwater" },
  { icon: "📡", name: "StarTimes", desc: "Abonnement StarTimes — toutes offres" },
  { icon: "📱", name: "MTN",       desc: "Recharge airtime MTN Cameroun" },
  { icon: "🟠", name: "Orange",    desc: "Recharge airtime Orange Cameroun" },
];

export default function FacturesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        <Link href="/services" className="hover:text-white">Services</Link>
        <span>›</span>
        <span className="text-white">Paiement Factures</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-1">Paiement Factures</h1>
      <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
        Payez vos factures camerounaises sans déplacement — rapide et sécurisé.
      </p>

      <div className="space-y-3 mb-8">
        {BILLERS.map(b => (
          <a
            key={b.name}
            href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Bonjour, je souhaite payer ma facture ${b.name}`)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <span className="text-3xl">{b.icon}</span>
            <div className="flex-1">
              <p className="font-black text-white">{b.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{b.desc}</p>
            </div>
            <span style={{ color: "var(--gold)", fontSize: 20 }}>›</span>
          </a>
        ))}
      </div>

      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}
      >
        <p className="text-xl font-black text-white mb-2">Autre facture ?</p>
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Contactez-nous sur WhatsApp pour tout autre paiement.
        </p>
        <a
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-white text-sm"
          style={{ background: "#25D366" }}
        >
          💬 Nous contacter
        </a>
      </div>
    </div>
  );
}

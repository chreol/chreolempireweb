"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabase";
import { CONTACT, IMAGES } from "@/lib/services";
import Link from "next/link";

const PAY_METHODS = [
  { id: "mtn",      label: "MTN MoMo",    image: IMAGES.mtn,    campay: true  },
  { id: "orange",   label: "Orange Money", image: IMAGES.orange, campay: true  },
  { id: "whatsapp", label: "Via WhatsApp", image: null,          campay: false },
] as const;
type PayId = (typeof PAY_METHODS)[number]["id"];

export default function CartPage() {
  const { items, total, removeItem, clearCart } = useCart();
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [phone, setPhone]             = useState("");
  const [payMethod, setPayMethod]     = useState<PayId>("whatsapp");
  const [campayPhone, setCampayPhone] = useState("");
  const [loading, setLoading]         = useState(false);
  const [done, setDone]               = useState<string | null>(null);

  const canCampay = payMethod === "mtn" || payMethod === "orange";
  const summary   = items.map(i => `${i.cardName} ×${i.qty} (${i.amount})`).join(", ");

  function buildWAMsg() {
    const lines = items
      .map(i => `• ${i.cardName} — ${i.amount} × ${i.qty} = ${(i.price * i.qty).toLocaleString("fr-FR")} FCFA`)
      .join("\n");
    const payLabel = payMethod === "mtn" ? "MTN MoMo" : payMethod === "orange" ? "Orange Money" : "WhatsApp";
    return encodeURIComponent(
      `Bonjour Chreol Empire,\n\nJe souhaite commander :\n${lines}\n\nTotal : ${total.toLocaleString("fr-FR")} FCFA\nPaiement : ${payLabel}\n\nNom : ${name}\nTél : ${phone}`,
    );
  }

  async function handleCampayOrder() {
    const rawPhone = campayPhone.replace(/\s/g, "").replace(/^0/, "");
    if (rawPhone.length !== 9) { alert("Numéro invalide — entrez 9 chiffres sans l'indicatif"); return; }
    if (!email)                { alert("Email requis pour recevoir la confirmation"); return; }

    setLoading(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          summary, total,
          payment_method: payMethod,
          status: "pending",
          payment_status: "pending",
          client_name: name || "Client web",
          client_email: email,
        })
        .select("id")
        .single();

      if (error || !order) throw new Error(error?.message ?? "Erreur lors de la création de la commande");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/initiate-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({ order_id: order.id, phone: `237${rawPhone}` }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur Campay");

      setDone(order.id);
      clearCart();
    } catch (err: any) {
      alert(err.message ?? "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }

  /* ── Empty state ── */
  if (items.length === 0 && !done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="text-2xl font-black text-white mb-2">Panier vide</h1>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>Ajoutez des articles depuis nos services</p>
        <Link href="/services" className="inline-block px-6 py-3 rounded-full font-black text-black text-sm" style={{ background: "var(--gold)" }}>
          Voir les services →
        </Link>
      </div>
    );
  }

  /* ── Success state ── */
  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">⚡</p>
        <h1 className="text-2xl font-black text-white mb-2">Demande de paiement envoyée !</h1>
        <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
          Approuvez la demande Mobile Money sur votre téléphone.
        </p>
        <p className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>
          Réf : {done.slice(-8).toUpperCase()}
        </p>
        <Link href="/services" className="inline-block px-6 py-3 rounded-full font-black text-black text-sm" style={{ background: "var(--gold)" }}>
          Continuer mes achats
        </Link>
      </div>
    );
  }

  /* ── Cart ── */
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-white mb-8">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Left: items + total ── */}
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-sm truncate">{item.cardName}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {item.amount} × {item.qty}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black" style={{ color: "var(--gold)" }}>
                  {(item.price * item.qty).toLocaleString("fr-FR")} F
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs mt-1 transition-colors hover:text-red-400"
                  style={{ color: "var(--text-muted)" }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          <div
            className="flex justify-between items-center p-4 rounded-2xl"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-strong)" }}
          >
            <span className="font-black text-white">Total</span>
            <span className="text-2xl font-black" style={{ color: "var(--gold)" }}>
              {total.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>

        {/* ── Right: checkout ── */}
        <div className="flex flex-col gap-5">

          {/* Infos client */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              Vos informations
            </p>
            <div className="flex flex-col gap-3">
              <input type="text"  placeholder="Votre nom"              value={name}  onChange={e => setName(e.target.value)}  className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
              <input type="email" placeholder="Email (confirmation)"   value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
              <input type="tel"   placeholder="Téléphone"              value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-2xl text-white text-sm outline-none" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
            </div>
          </div>

          {/* Mode de paiement */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
              Mode de paiement
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PAY_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  className="p-3 rounded-2xl text-center transition-all flex flex-col items-center gap-2"
                  style={{
                    background: payMethod === m.id ? "var(--bg-elevated)" : "var(--bg-card)",
                    border: `2px solid ${payMethod === m.id ? "var(--gold)" : "var(--border)"}`,
                  }}
                >
                  {m.image ? (
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                      <Image src={m.image} alt={m.label} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                  ) : (
                    <span className="text-2xl">💬</span>
                  )}
                  <span
                    className="text-[10px] font-bold leading-tight text-center"
                    style={{ color: payMethod === m.id ? "var(--gold)" : "var(--text-secondary)" }}
                  >
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Campay automatique */}
          {canCampay && (
            <div
              className="rounded-2xl p-4"
              style={{ background: "#0D1525", border: "1px solid #3B82F633" }}
            >
              <p className="text-sm font-bold mb-1" style={{ color: "#93C5FD" }}>
                ⚡ Paiement automatique Campay
              </p>
              <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
                Entrez votre numéro {payMethod === "mtn" ? "MTN" : "Orange"} (9 chiffres). Vous recevrez
                une demande directement sur votre téléphone.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-3 rounded-xl text-sm font-bold shrink-0" style={{ background: "#1A2040", color: "#93C5FD" }}>
                  +237
                </span>
                <input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={campayPhone}
                  onChange={e => setCampayPhone(e.target.value.replace(/\D/g, ""))}
                  maxLength={9}
                  className="flex-1 px-3 py-3 rounded-xl text-white text-sm outline-none"
                  style={{ background: "#1A2040", border: "1px solid #3B82F644" }}
                />
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col gap-3">
            {canCampay && (
              <button
                onClick={handleCampayOrder}
                disabled={loading}
                className="w-full py-4 rounded-full font-black text-black text-sm transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{ background: "var(--gold)" }}
              >
                {loading ? "Envoi en cours…" : "⚡ Payer maintenant (Mobile Money)"}
              </button>
            )}
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=${buildWAMsg()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-full font-black text-white text-center text-sm transition-opacity hover:opacity-85"
              style={{ background: "#25D366" }}
            >
              💬 Commander via WhatsApp
            </a>
          </div>

          {/* Info sécurité */}
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>🔒</span>
            <span>Paiement sécurisé · Livraison 15–30 min · Support WhatsApp 7j/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}

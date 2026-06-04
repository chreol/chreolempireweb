"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/services";
import WAPopover from "@/components/WAPopover";

interface OrderInfo {
  id: string;
  summary: string;
  total: number;
  status: string;
  payment_method: string;
  proof_url: string | null;
  created_at: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function ConfirmerPaiementContent() {
  const params  = useSearchParams();
  const orderId = params.get("order") ?? "";

  const [order,    setOrder]    = useState<OrderInfo | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [file,      setFile]      = useState<File | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded,  setUploaded]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!orderId) { setLoading(false); setNotFound(true); return; }
    fetch(`/api/order-info?id=${encodeURIComponent(orderId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setNotFound(true); }
        else { setOrder(data); if (data.proof_url) setUploaded(true); }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [orderId]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
    if (f) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  async function handleUpload() {
    if (!file || !orderId) return;
    if (file.size > 5 * 1024 * 1024) { setError("Fichier trop lourd (max 5 Mo)"); return; }

    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append("orderId", orderId);
    fd.append("file", file);

    try {
      const res  = await fetch("/api/upload-proof", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur lors de l'envoi"); }
      else {
        setUploaded(true);
        setOrder(prev => prev ? { ...prev, proof_url: data.url } : prev);
      }
    } catch {
      setError("Erreur réseau — réessayez");
    } finally {
      setUploading(false);
    }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4 animate-pulse">⏳</p>
        <p style={{ color: "var(--text-muted)" }}>Chargement…</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">❓</p>
        <h1 className="text-xl font-black text-white mb-2">Commande introuvable</h1>
        <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>
          Vérifiez le lien reçu ou contactez notre équipe.
        </p>
        <WAPopover
          prefill="Bonjour, j'ai un problème avec ma confirmation de paiement."
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-white text-sm"
          style={{ background: "#25D366" }}
        >
          <Image src={IMAGES.whatsapp} alt="" width={18} height={18} unoptimized />
          Nous contacter
        </WAPopover>
      </div>
    );
  }

  const ref = order.id.slice(-8).toUpperCase();

  return (
    <div className="max-w-lg mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Confirmer paiement</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-4" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
          📎 Preuve de paiement
        </span>
        <h1 className="text-2xl font-black text-white mb-1">Confirmer votre paiement</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Envoyez la capture d&apos;écran de votre paiement Mobile Money pour valider votre commande.
        </p>
      </div>

      {/* Récap commande */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Référence</p>
            <p className="text-xl font-black" style={{ color: "var(--gold)" }}>#{ref}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
            order.status === "done" ? "text-green-300" : "text-amber-300"
          }`} style={{
            background: order.status === "done" ? "#10B98122" : "#F59E0B22",
          }}>
            {order.status === "done" ? "✅ Traité" : "⏳ En attente"}
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>{order.summary}</p>
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDate(order.created_at)}</span>
          <span className="text-base font-black" style={{ color: "var(--gold)" }}>{Number(order.total).toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>

      {/* Upload zone */}
      {uploaded ? (
        /* ── Déjà envoyée ── */
        <div className="rounded-2xl p-6 text-center mb-6" style={{ background: "#10B98114", border: "1.5px solid #10B98144" }}>
          <p className="text-3xl mb-3">✅</p>
          <p className="font-black text-white text-base mb-1">Preuve envoyée avec succès</p>
          <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
            Notre agent a été notifié et va traiter votre commande dans les 15–30 minutes.
          </p>
          {order.proof_url && (
            <a href={order.proof_url} target="_blank" rel="noopener noreferrer"
              className="inline-block text-xs font-bold underline mb-4"
              style={{ color: "#10B981" }}>
              Voir ma capture d&apos;écran →
            </a>
          )}
          <div className="flex flex-col gap-2">
            <WAPopover
              prefill={`Bonjour, j'ai envoyé ma preuve de paiement pour la commande #${ref}.`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-black text-white text-sm"
              style={{ background: "#25D366" }}
            >
              <Image src={IMAGES.whatsapp} alt="" width={18} height={18} unoptimized />
              Contacter l&apos;agent
            </WAPopover>
            <Link href="/services"
              className="w-full flex items-center justify-center py-3 rounded-full font-black text-sm"
              style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
              Retour aux services
            </Link>
          </div>
        </div>
      ) : (
        /* ── Upload ── */
        <div className="flex flex-col gap-4 mb-6">
          {/* Zone de dépôt */}
          <div
            onClick={() => inputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all hover:opacity-80"
            style={{ borderColor: preview ? "var(--gold)" : "var(--border)", background: preview ? "var(--gold)08" : "var(--bg-card)" }}
          >
            {preview ? (
              <div className="flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Prévisualisation" className="max-h-48 rounded-xl object-contain" />
                <p className="text-xs font-bold" style={{ color: "var(--gold)" }}>{file?.name}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Cliquez pour changer</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <p className="text-4xl">📷</p>
                <p className="font-bold text-white text-sm">Cliquez pour choisir une image</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Screenshot MoMo · JPG, PNG, WEBP · Max 5 Mo
                </p>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          {error && (
            <p className="text-xs font-bold px-4 py-2 rounded-xl" style={{ background: "#EF444422", color: "#EF4444" }}>
              ⚠️ {error}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full py-4 rounded-full font-black text-sm transition-[opacity,transform] duration-150 ease-out hover:opacity-85 active:scale-[0.96] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: file ? "var(--gold)" : "var(--bg-elevated)", color: file ? "#0A0A0A" : "var(--text-muted)" }}
          >
            {uploading ? "⏳ Envoi en cours…" : "📤 Envoyer ma preuve de paiement"}
          </button>
        </div>
      )}

      {/* Instructions rapides */}
      {!uploaded && (
        <div className="rounded-2xl p-4 text-xs" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="font-black text-white mb-3">Comment obtenir la capture d&apos;écran ?</p>
          {[
            "Après votre paiement MTN ou Orange, une notification de confirmation apparaît",
            "Faites une capture d'écran (bouton Volume ↓ + Power sur la plupart des téléphones)",
            "Sélectionnez cette image ici et cliquez Envoyer",
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: "var(--gold)", color: "#0A0A0A" }}>{i + 1}</span>
              <p style={{ color: "var(--text-secondary)" }}>{s}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ConfirmerPaiementPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4 animate-pulse">⏳</p>
        <p style={{ color: "var(--text-muted)" }}>Chargement…</p>
      </div>
    }>
      <ConfirmerPaiementContent />
    </Suspense>
  );
}

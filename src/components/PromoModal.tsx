"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CONTACT } from "@/lib/services";

const SHARE_URL = "https://shop.chreolempire.com/services/cartes-cadeaux";
const PROMO_STOCK = 3;
const REFERRAL_URL = "https://refer.zobo.money/blonm2wjlqorft";
const REFERRAL_CODE = "blonm2wjlqorft";
const PRICE_UPDATES = [
  { amount: "10€ / 10$", oldPrice: 8900, newPrice: 8500 },
  { amount: "20€ / 20$", oldPrice: 16800, newPrice: 15800 },
  { amount: "50€ / 50$", oldPrice: 39500, newPrice: 35800 },
  { amount: "100€ / 100$", oldPrice: 76500, newPrice: 72500 },
];

export default function PromoModal() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isGiftCardPage = pathname === "/services/cartes-cadeaux";

  useEffect(() => {
    setOpen(pathname === "/" || isGiftCardPage);
  }, [isGiftCardPage, pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  function closeAndPersist() {
    // Do not persist closure: modal will reappear on next page refresh
    setOpen(false);
  }

  async function shareOffer() {
    const text = "🎁 Geste de la maison chez Chreol Empire : nouveaux tarifs des cartes cadeaux. Profitez-en vite !";
    if (navigator.share) {
      await navigator.share({ title: "Nouveaux tarifs Chreol Empire", text, url: SHARE_URL }).catch(() => {});
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${SHARE_URL}`)}`, "_blank", "noopener,noreferrer");
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
      alert("Code copié : " + REFERRAL_CODE);
    } catch {
      alert("Impossible de copier le code. Copiez-le manuellement : " + REFERRAL_CODE);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-2 sm:py-4" role="dialog" aria-modal="true" aria-label={isGiftCardPage ? "Promotion des cartes cadeaux" : "Promotion Zobo"}>
      <div className="absolute inset-0 bg-black/60" onClick={closeAndPersist} aria-hidden="true" />

      <div className="relative w-full max-w-2xl max-h-[calc(100dvh-1rem)] overflow-y-auto bg-white rounded-2xl shadow-xl text-gray-900">
        <div className="sticky top-0 z-20 flex justify-end p-2 pointer-events-none">
          <button
            aria-label="Fermer la fenêtre publicitaire"
            onClick={closeAndPersist}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/95 shadow-md hover:bg-gray-100 p-2 text-gray-700 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {!isGiftCardPage ? (
          <div className="flex flex-col md:flex-row items-center gap-4 p-6 md:p-8">
            <div className="w-full md:w-1/2">
              <div className="mb-4 flex items-center gap-3">
                <span className="chreol-logo-wrap w-12 h-12">
                  <span className="chreol-logo-stars" aria-hidden="true"><span>✦</span><span>✦</span></span>
                  <Image src="/assets/Logo_Chreol_Empire_revue-removebg-preview.png" alt="Chreol Empire" width={48} height={48} className="chreol-logo-spin object-contain" unoptimized />
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Chreol Empire</span>
              </div>
              <h2 className="text-2xl font-extrabold mb-2">🚀 Envoyez plus avec Zobo</h2>
              <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-base font-black text-amber-800">🔥 Taux spécial : 1 € = 680 FCFA</p>
              <p className="mb-3">✅ Frais d’envoi : 0 €</p>
              <p className="mb-4">Mon secret ? J’utilise <strong>Zobo</strong> pour envoyer de l’argent : c’est rapide, simple et les taux de change sont excellents.</p>
              <a href={REFERRAL_URL} target="_blank" rel="noopener noreferrer" className="inline-block w-full md:w-auto text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg mr-2">
                Télécharger l’application
              </a>
              <button onClick={copyCode} className="mt-3 md:mt-0 inline-block w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg">
                Copier le code : {REFERRAL_CODE}
              </button>
              <p className="mt-3 text-xs text-gray-600">Recevez <strong>10 €</strong> après votre premier transfert de <strong>50 €</strong> ou plus. Le taux et les frais peuvent varier.</p>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="relative h-64 w-full max-w-xs sm:h-80">
                <Image src="/assets/Promo_Zobo.webp" alt="Promotion Zobo" fill style={{ objectFit: "contain" }} sizes="(max-width: 640px) 80vw, 280px" />
              </div>
            </div>
          </div>
        ) : (
        <div className="p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600 mb-2">🎁 Geste de la maison</p>
          <h2 className="text-2xl font-extrabold mb-2">Nouveaux tarifs, même service rapide</h2>
          <p className="mb-5 text-sm text-gray-600">Pour vous remercier, nous appliquons une mise à jour avantageuse sur les cartes cadeaux EUR et USD.</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {PRICE_UPDATES.map(price => (
              <div key={price.amount} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-bold text-gray-700">Carte {price.amount}</p>
                <p className="mt-1 text-xs text-gray-500 line-through">{price.oldPrice.toLocaleString("fr-FR")} FCFA</p>
                <p className="text-lg font-black text-emerald-700">{price.newPrice.toLocaleString("fr-FR")} FCFA</p>
              </div>
            ))}
          </div>

          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">⏳ Plus que {PROMO_STOCK} cartes disponibles à ces conditions.</p>
          <p className="mb-5 text-xs text-gray-600">Les tarifs affichés concernent les montants disponibles du catalogue. Le prix est confirmé avant paiement selon la carte et la région choisies.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Bonjour, je souhaite profiter des nouveaux tarifs des cartes cadeaux.")}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-lg">
              ⚡ Commander maintenant
            </a>
            <button onClick={shareOffer} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-5 rounded-lg">
              📤 Partager l'offre
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

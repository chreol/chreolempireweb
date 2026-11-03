"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
const REFERRAL_URL = "https://refer.zobo.money/blonm2wjlqorft";
const REFERRAL_CODE = "blonm2wjlqorft";

export default function PromoModal() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // La promo cartes-cadeaux ne s'ouvre plus : elle couvrait le catalogue.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation de l'ouverture avec la route courante
    setOpen(pathname === "/");
  }, [pathname]);

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
    setOpen(false);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-2 sm:py-4" role="dialog" aria-modal="true" aria-label="Promotion Zobo">
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

        {(
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
        )}
      </div>
    </div>
  );
}

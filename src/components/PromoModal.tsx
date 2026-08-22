"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const REFERRAL_URL = "https://refer.zobo.money/blonm2wjlqorft";
const REFERRAL_CODE = "blonm2wjlqorft";

export default function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const closed = localStorage.getItem("promoClosed_v1");
      if (!closed) setOpen(true);
    } catch (e) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  function closeAndPersist() {
    try {
      localStorage.setItem("promoClosed_v1", "1");
    } catch (e) {}
    setOpen(false);
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
      // simple feedback: change button text briefly
      alert("Code copié: " + REFERRAL_CODE);
    } catch (e) {
      alert("Impossible de copier le code. Copiez-le manuellement: " + REFERRAL_CODE);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={closeAndPersist} />

      <div className="relative w-full max-w-3xl bg-gradient-to-br from-white/95 to-white/95 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex justify-end p-3">
          <button
            aria-label="Fermer la fenêtre publicitaire"
            onClick={closeAndPersist}
            className="rounded-lg hover:bg-gray-100 p-2 text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 p-6 md:p-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-extrabold mb-2">🚀 Envoi d’argent rapide au pays avec Zobo !</h2>
            <p className="mb-3 text-sm">Aujourd’hui, le taux est incroyable : <strong>1 € = 680 F CFA</strong></p>
            <p className="mb-3">✅ Frais d’envoi : 0 €</p>
            <p className="mb-4">Mon secret ? J’utilise <strong>Zobo</strong> pour envoyer de l’argent : c’est rapide, simple et les taux de change sont excellents.</p>

            <a
              href={REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full md:w-auto text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg mr-2"
            >
              Télécharger l'application
            </a>

            <button
              onClick={copyCode}
              className="mt-3 md:mt-0 inline-block w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg"
            >
              Copier le code: {REFERRAL_CODE}
            </button>

            <p className="mt-3 text-xs text-gray-600">Recevez <strong>10 €</strong> lorsque vous effectuez votre premier transfert de <strong>50 €</strong> ou plus. Le taux et les frais peuvent varier.</p>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="w-56 h-80 relative">
              {/* Placeholder image: if you want a custom image, replace src with the uploaded asset path */}
              <Image src="/assets/Promo_Zobo.webp" alt="Zobo promo" fill style={{ objectFit: "contain" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

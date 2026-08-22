"use client";

import React, { useEffect, useState } from "react";

export default function TransferRatesModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden text-gray-900">
        <div className="flex justify-end p-3">
          <button
            aria-label="Fermer les tarifs"
            onClick={() => setOpen(false)}
            className="rounded-lg hover:bg-gray-100 p-2 text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-extrabold mb-3">📊 Tarifs d'envoi — Chreol Empire Transfer</h2>
          <p className="mb-4 text-sm text-gray-700">Voici nos frais par tranche de montant. Ils sont affichés avant validation et peuvent varier légèrement selon le canal.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm">
              <li>5 000 – 25 000 FCFA : <strong>2 500 FCFA</strong></li>
              <li>25 001 – 50 000 FCFA : <strong>3 500 FCFA</strong></li>
              <li>50 001 – 100 000 FCFA : <strong>5 000 FCFA</strong></li>
              <li>100 001 – 200 000 FCFA : <strong>8 000 FCFA</strong></li>
            </ul>

            <ul className="space-y-2 text-sm">
              <li>200 001 – 300 000 FCFA : <strong>10 000 FCFA</strong></li>
              <li>300 001 – 500 000 FCFA : <strong>3 %</strong></li>
              <li>500 001 – 1 000 000 FCFA : <strong>2,8 %</strong></li>
              <li>Plus de 1 000 000 FCFA : <strong>Tarif personnalisé — contactez-nous</strong></li>
            </ul>
          </div>

          <p className="mt-4 text-xs text-gray-600">Frais affichés avant validation du transfert. Zéro surprise.</p>

          <div className="mt-6 flex gap-3">
            <a href="#formulaire" onClick={() => setOpen(false)} className="inline-block bg-var text-white font-bold py-2 px-4 rounded-lg">Voir le formulaire</a>
            <button onClick={() => setOpen(false)} className="inline-block border font-semibold py-2 px-4 rounded-lg">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

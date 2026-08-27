"use client";

import { SOCIAL_LINKS } from "@/lib/services";

interface Props {
  productName?: string;
  compact?: boolean;
}

export default function GoogleReviewPrompt({ productName = "votre commande", compact = false }: Props) {
  const message = `Bonjour, je souhaite laisser un avis concernant ${productName}.`;
  const whatsappUrl = `https://wa.me/237697657734?text=${encodeURIComponent(message)}`;

  return (
    <section
      aria-labelledby="review-prompt-title"
      className={compact ? "rounded-xl p-4" : "rounded-2xl p-5 sm:p-6"}
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p id="review-prompt-title" className="font-black text-white text-sm">
            ⭐ Votre avis compte
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Après votre achat de {productName}, partagez votre expérience sur Google. Votre avis sera publié directement sur votre compte Google.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <a
            href={SOCIAL_LINKS.googleReview}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-10 px-4 py-2 rounded-xl text-xs font-black text-white transition-opacity hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#EA4335" }}
          >
            ⭐ Laisser mon avis Google
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-10 px-4 py-2 rounded-xl text-xs font-black text-white transition-opacity hover:opacity-85 active:scale-[0.96]"
            style={{ background: "#25D366" }}
          >
            💬 Besoin d'aide ?
          </a>
        </div>
      </div>
    </section>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--text-muted)" }}>
        <a href="/" className="hover:text-white transition-colors">Accueil</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Mentions légales</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-2">Mentions légales</h1>
      <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        Dernière mise à jour : janvier 2025
      </p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            1. Éditeur du site
          </h2>
          <div className="flex flex-col gap-1 pl-4">
            <p><span className="font-bold text-white">Dénomination :</span> Chreol Empire</p>
            <p><span className="font-bold text-white">Forme :</span> Entreprise individuelle</p>
            <p><span className="font-bold text-white">Responsable de publication :</span> Chreol Empire</p>
            <p><span className="font-bold text-white">Adresse :</span> Vallée 3, Boutiques Deido, Douala, Cameroun</p>
            <p><span className="font-bold text-white">Téléphone / WhatsApp :</span> +237 694 360 978</p>
            <p><span className="font-bold text-white">Email :</span> chreolempire00@gmail.com</p>
            <p><span className="font-bold text-white">Activité depuis :</span> 2012</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            2. Hébergement
          </h2>
          <div className="flex flex-col gap-1 pl-4">
            <p><span className="font-bold text-white">Hébergeur :</span> Vercel Inc.</p>
            <p><span className="font-bold text-white">Adresse :</span> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
            <p><span className="font-bold text-white">Site :</span> vercel.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            3. Propriété intellectuelle
          </h2>
          <p className="pl-4">
            L&apos;ensemble des contenus présents sur le site chreolempire.com (textes, images, logos, graphismes, icônes) sont la propriété exclusive de Chreol Empire et sont protégés par les lois en vigueur au Cameroun et les conventions internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification ou exploitation non autorisée est strictement interdite.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            4. Limitation de responsabilité
          </h2>
          <p className="pl-4">
            Chreol Empire s&apos;efforce de maintenir les informations du site à jour et exactes. Toutefois, l&apos;éditeur ne saurait être tenu responsable des erreurs, omissions ou résultats qui pourraient être obtenus par un mauvais usage des informations diffusées. Chreol Empire se réserve le droit de modifier les contenus du site à tout moment et sans préavis.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            5. Liens hypertextes
          </h2>
          <p className="pl-4">
            Le site peut contenir des liens vers des sites tiers. Chreol Empire n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leurs politiques de confidentialité ou leurs pratiques.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            6. Droit applicable
          </h2>
          <p className="pl-4">
            Le présent site et les présentes mentions légales sont soumis au droit camerounais. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents de Douala seront seuls habilités.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            7. Contact
          </h2>
          <p className="pl-4">
            Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter via WhatsApp au{" "}
            <a href="https://wa.me/237694360978" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: "var(--gold)" }}>
              +237 694 360 978
            </a>{" "}
            ou par email à{" "}
            <a href="mailto:chreolempire00@gmail.com" className="font-bold hover:underline" style={{ color: "var(--gold)" }}>
              chreolempire00@gmail.com
            </a>.
          </p>
        </section>

      </div>

      {/* Legal links */}
      <div className="mt-12 pt-6 flex flex-wrap gap-4 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
        <a href="/cgu" className="hover:text-white transition-colors">Conditions générales d&apos;utilisation</a>
        <a href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</a>
      </div>
    </div>
  );
}

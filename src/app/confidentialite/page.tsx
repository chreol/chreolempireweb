export default function ConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--text-muted)" }}>
        <a href="/" className="hover:text-white transition-colors">Accueil</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>Politique de confidentialité</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-2">Politique de Confidentialité</h1>
      <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        Dernière mise à jour : janvier 2025 — Chreol Empire respecte votre vie privée.
      </p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            1. Responsable du traitement
          </h2>
          <div className="flex flex-col gap-1 pl-4">
            <p><span className="font-bold text-white">Entité :</span> Chreol Empire</p>
            <p><span className="font-bold text-white">Adresse :</span> Vallée 3, Boutiques Deido, Douala, Cameroun</p>
            <p><span className="font-bold text-white">Contact :</span> contact@chreolempire.com / +237 694 360 978</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            2. Données collectées
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Dans le cadre de nos services, nous collectons uniquement les informations nécessaires au traitement de votre commande :</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><span className="font-bold text-white">Nom et prénom</span> du bénéficiaire</li>
              <li><span className="font-bold text-white">Numéro de téléphone</span> Mobile Money (+237)</li>
              <li><span className="font-bold text-white">Opérateur Mobile Money</span> (MTN ou Orange)</li>
              <li><span className="font-bold text-white">Adresse email</span> (pour les services PayPal uniquement)</li>
              <li><span className="font-bold text-white">Adresse wallet</span> (pour les transactions crypto)</li>
              <li><span className="font-bold text-white">Hash de transaction</span> (TxID, pour les ventes crypto)</li>
              <li><span className="font-bold text-white">Données de navigation</span> anonymisées via Vercel Analytics</li>
            </ul>
            <p>Nous ne collectons pas de données bancaires telles que numéros de carte complète (sauf les 6 premiers et 4 derniers chiffres pour la recharge UBA, qui ne permettent pas d&apos;identification bancaire complète).</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            3. Finalités du traitement
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Les données collectées sont utilisées exclusivement pour :</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Traiter et livrer votre commande</li>
              <li>Vous contacter en cas de problème sur votre commande</li>
              <li>Améliorer nos services (analytics anonymes)</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            4. Durée de conservation
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Vos données de commande sont conservées pendant une durée de <span className="font-bold text-white">12 mois</span> à compter de la transaction, puis supprimées, sauf obligation légale contraire.</p>
            <p>L&apos;historique local stocké sur votre appareil (via localStorage) est sous votre contrôle : vous pouvez le supprimer à tout moment depuis la page <a href="/historique" className="font-bold hover:underline" style={{ color: "var(--gold)" }}>Historique</a>.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            5. Partage des données
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Chreol Empire <span className="font-bold text-white">ne vend, ne loue et ne partage jamais</span> vos données personnelles avec des tiers à des fins commerciales.</p>
            <p>Des données peuvent être transmises à des prestataires techniques strictement nécessaires à l&apos;exécution du service :</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><span className="font-bold text-white">Vercel</span> (hébergement et analytics anonymes)</li>
              <li><span className="font-bold text-white">Supabase</span> (base de données sécurisée)</li>
              <li><span className="font-bold text-white">WhatsApp / Meta</span> (canal de communication principal)</li>
            </ul>
            <p>Ces prestataires agissent en qualité de sous-traitants et sont tenus au respect de la confidentialité.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            6. Cookies et traceurs
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Le site utilise uniquement :</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><span className="font-bold text-white">localStorage</span> : pour sauvegarder vos préférences de thème, de langue et votre historique local (aucune donnée transmise à des serveurs)</li>
              <li><span className="font-bold text-white">Vercel Analytics</span> : données de navigation entièrement anonymisées, sans cookies de traçage cross-site</li>
            </ul>
            <p>Aucun cookie publicitaire, aucun pixel de suivi tiers n&apos;est utilisé.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            7. Vos droits
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Conformément aux lois applicables sur la protection des données personnelles, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><span className="font-bold text-white">Droit d&apos;accès</span> : obtenir une copie de vos données</li>
              <li><span className="font-bold text-white">Droit de rectification</span> : corriger des données inexactes</li>
              <li><span className="font-bold text-white">Droit à l&apos;effacement</span> : demander la suppression de vos données</li>
              <li><span className="font-bold text-white">Droit d&apos;opposition</span> : vous opposer au traitement de vos données</li>
            </ul>
            <p>Pour exercer ces droits, contactez-nous via WhatsApp au +237 694 360 978 ou par email à contact@chreolempire.com. Nous répondrons dans un délai de 30 jours.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            8. Sécurité
          </h2>
          <p className="pl-4">
            Chreol Empire met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation. Les communications avec nos serveurs sont chiffrées via HTTPS/TLS.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            9. Contact
          </h2>
          <p className="pl-4">
            Pour toute question relative à la protection de vos données personnelles, contactez-nous via WhatsApp au{" "}
            <a href="https://wa.me/237694360978" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: "var(--gold)" }}>
              +237 694 360 978
            </a>{" "}
            ou par email à{" "}
            <a href="mailto:contact@chreolempire.com" className="font-bold hover:underline" style={{ color: "var(--gold)" }}>
              contact@chreolempire.com
            </a>.
          </p>
        </section>

      </div>

      {/* Legal links */}
      <div className="mt-12 pt-6 flex flex-wrap gap-4 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
        <a href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</a>
        <a href="/cgu" className="hover:text-white transition-colors">Conditions générales d&apos;utilisation</a>
      </div>
    </div>
  );
}

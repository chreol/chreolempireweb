export default function CGUPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--text-muted)" }}>
        <a href="/" className="hover:text-white transition-colors">Accueil</a>
        <span>›</span>
        <span style={{ color: "var(--gold)" }}>CGU</span>
      </div>

      <h1 className="text-3xl font-black text-white mb-2">Conditions Générales d&apos;Utilisation</h1>
      <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        Dernière mise à jour : janvier 2025 — En utilisant nos services, vous acceptez les présentes CGU.
      </p>

      <div className="flex flex-col gap-10 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            1. Présentation
          </h2>
          <p className="pl-4">
            Chreol Empire est une plateforme spécialisée dans la vente de produits numériques (cartes cadeaux PSN, iTunes, Steam, Roblox, Nintendo, Razer), l&apos;échange de cryptomonnaies (USDT, BTC, TRX, ETH et autres) contre des Francs CFA, ainsi que des services financiers de proximité (coupons Transcash et PCS Mastercard, carte UBA Cameroun, PayPal Europe, paiement de factures Canal+, Eneo, Camwater, StarTimes et échange Mobile Money). Le site est accessible à l&apos;adresse chreolempire.com.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            2. Accès aux services
          </h2>
          <p className="pl-4 mb-3">
            L&apos;accès aux services de Chreol Empire est réservé aux personnes physiques majeures (18 ans et plus) ou aux personnes morales légalement constituées. En passant commande, l&apos;utilisateur déclare avoir la capacité juridique de contracter.
          </p>
          <p className="pl-4">
            Chreol Empire se réserve le droit de refuser ou d&apos;annuler toute commande en cas de suspicion de fraude, d&apos;informations erronées ou de non-respect des présentes CGU.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            3. Commande et paiement
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Les commandes sont passées via le site web ou directement par WhatsApp au +237 697 657 734.</p>
            <p>Les moyens de paiement acceptés sont : <span className="font-bold text-white">MTN Mobile Money</span>, <span className="font-bold text-white">Orange Money</span> et tout autre moyen expressément convenu avec le service client.</p>
            <p>Le paiement doit être effectué intégralement avant toute livraison. Aucun crédit n&apos;est accordé.</p>
            <p>Les prix sont affichés en Francs CFA (XAF) et sont susceptibles d&apos;évoluer sans préavis, notamment pour les produits indexés sur des taux de change (cryptomonnaies, PayPal, coupons européens). Le taux appliqué est celui en vigueur au moment de la confirmation de la commande.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            4. Délais de livraison
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Chreol Empire s&apos;engage à livrer les produits numériques dans les délais suivants à compter de la confirmation du paiement :</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li><span className="font-bold text-white">Cartes cadeaux</span> : 5 à 30 minutes (heures ouvrées 7h–23h)</li>
              <li><span className="font-bold text-white">Cryptomonnaies (achat)</span> : 15 à 60 minutes selon la blockchain</li>
              <li><span className="font-bold text-white">Vente crypto → FCFA</span> : 15 à 30 minutes après confirmation blockchain</li>
              <li><span className="font-bold text-white">Coupons Transcash / PCS</span> : 10 à 30 minutes</li>
              <li><span className="font-bold text-white">Carte UBA</span> : 24 à 72 heures ouvrées</li>
              <li><span className="font-bold text-white">PayPal</span> : 15 à 60 minutes</li>
              <li><span className="font-bold text-white">Paiement factures</span> : 15 à 30 minutes</li>
              <li><span className="font-bold text-white">Échange MoMo</span> : 5 à 15 minutes</li>
            </ul>
            <p>Ces délais sont indicatifs. En cas de délai dépassé, l&apos;utilisateur est invité à contacter le service client via WhatsApp.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            5. Droit de rétractation et remboursements
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Conformément aux spécificités du contenu numérique, <span className="font-bold text-white">aucun remboursement ne sera effectué</span> une fois le code ou la clé de produit numérique transmis à l&apos;utilisateur. La nature des produits numériques rend impossible tout retour.</p>
            <p>En cas d&apos;erreur manifeste imputable à Chreol Empire (mauvais produit envoyé, code non fonctionnel), un remplacement ou remboursement sera étudié au cas par cas dans un délai de 48 heures après signalement.</p>
            <p>Pour les services de type échange (crypto, MoMo, PayPal), toute annulation après validation et exécution partielle ou totale ne donnera lieu à aucun remboursement des frais engagés.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            6. Obligations de l&apos;utilisateur
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>L&apos;utilisateur s&apos;engage à :</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Fournir des informations exactes lors de toute commande</li>
              <li>Ne pas utiliser les services à des fins illicites, frauduleuses ou de blanchiment d&apos;argent</li>
              <li>Ne pas revendre les produits acquis sans autorisation expresse</li>
              <li>Respecter les conditions d&apos;utilisation des éditeurs des produits (Sony, Apple, Steam, Valve…)</li>
            </ul>
            <p>Tout manquement pourra entraîner la suspension immédiate du service et, le cas échéant, un signalement aux autorités compétentes.</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            7. Responsabilité
          </h2>
          <div className="pl-4 flex flex-col gap-2">
            <p>Chreol Empire ne saurait être tenu responsable de :</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>L&apos;indisponibilité temporaire du site ou des services tiers (réseaux blockchain, opérateurs Mobile Money)</li>
              <li>Toute perte résultant d&apos;une mauvaise utilisation d&apos;un code ou d&apos;une clé par l&apos;utilisateur</li>
              <li>Des fluctuations de taux de change au-delà de la confirmation de commande</li>
              <li>Des erreurs commises par l&apos;utilisateur dans la saisie de son adresse wallet ou numéro de téléphone</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            8. Modification des CGU
          </h2>
          <p className="pl-4">
            Chreol Empire se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications substantielles via WhatsApp ou par affichage sur le site. L&apos;utilisation continue des services après modification vaut acceptation des nouvelles CGU.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            9. Droit applicable et litiges
          </h2>
          <p className="pl-4">
            Les présentes CGU sont régies par le droit camerounais. En cas de litige, les parties s&apos;engagent à rechercher une solution amiable dans un premier temps. À défaut, les tribunaux compétents de Douala seront saisis.
          </p>
        </section>

        <section>
          <h2 className="text-base font-black text-white mb-3" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "0.75rem" }}>
            10. Contact
          </h2>
          <p className="pl-4">
            Pour toute question concernant les présentes CGU, contactez-nous via WhatsApp au{" "}
            <a href="https://wa.me/237694360978" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: "var(--gold)" }}>
              +237 697 657 734
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
        <a href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</a>
      </div>
    </div>
  );
}

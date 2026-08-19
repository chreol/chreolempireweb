# Index Mainteneur — Chreol Empire (utile pour interventions rapides)

But: Ce fichier sert d'index opérationnel pour intervenir directement sur un fichier sans fouiller le codebase.

---

## Commandes rapides

- Build production :

```powershell
npm run build
```

- Lancer serveur de prod local (après build) :

```powershell
npm run start
# ou
npx next start
```

- Lancer dev :

```powershell
npm run dev
```

- Commit & push :

```powershell
git add -A
git commit -m "message"
git push
```

---

## Variables d'environnement importantes

- `TELEGRAM_BOT_TOKEN` — token du bot Telegram pour notifications.
- `TELEGRAM_CHAT_ID` — id du chat (groupe ou canal) pour envoyer les messages.
- `BREVO_API_KEY` — clé API pour l'envoi d'emails Brevo.
- `MARK_DONE_SECRET` — secret HMAC pour liens de `mark-done`.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — si défini, ajoute le snippet Google Analytics.

---

## Fichiers clés (édition rapide)

- Service taux coupons (changer le taux PCS / Transcash) : [src/lib/services.ts](src/lib/services.ts)
- Traductions centralisées : [src/lib/i18n/translations.ts](src/lib/i18n/translations.ts)
- Page UBA (achat / recharge, Neero) : [src/app/services/uba/page.tsx](src/app/services/uba/page.tsx)
- Page Coupons (FAQ et logique de calcul) : [src/app/services/coupons/page.tsx](src/app/services/coupons/page.tsx)
- Layout coupons (métadonnées) : [src/app/services/coupons/layout.tsx](src/app/services/coupons/layout.tsx)
- Rate ticker fallback : [src/components/RateTicker.tsx](src/components/RateTicker.tsx)
- Mark-done endpoint (statut → email + Telegram) : [src/app/api/mark-done/route.ts](src/app/api/mark-done/route.ts)
- Notify-order endpoint (nouvelle commande) : [src/app/api/notify-order/route.ts](src/app/api/notify-order/route.ts)
- Global layout / head : [src/app/layout.tsx](src/app/layout.tsx)
- Homepage (badge UBA) : [src/app/page.tsx](src/app/page.tsx)
- WA FAQ (bot replies) : [src/lib/waFaq.ts](src/lib/waFaq.ts)

---

## Scénarios d'intervention rapides

1) Modifier le taux PCS → 450 FCFA :
   - Éditer `src/lib/services.ts` (valeur `COUPON_RATES.pcs.rate`) et mettre `rate: 450`.
   - Rechercher et remplacer les mentions textuelles dans `src/lib/i18n/translations.ts`, `src/lib/blog.ts`, `src/lib/waFaq.ts`, `src/components/RateTicker.tsx`, `src/app/services/coupons/layout.tsx`.
   - `npm run build` pour vérifier.

2) Masquer / indiquer "indisponible" pour UBA partout :
   - Mettre à jour `src/app/page.tsx` (hero/badge) — utilise la clé de traduction `u.buy_unavailable_title`.
   - Mettre à jour `src/lib/i18n/translations.ts` si nécessaire.
   - Vérifier tous les endroits référencés par `grep UBA` et adapter.

3) Supprimer le lien public Neero → le donner en privé :
   - `src/app/services/uba/page.tsx` — remplacer l`<a href="...">` par un `button` qui envoie une demande privée (déjà fait dans le code). La clé de toast est `u.neero_request_sent` dans `src/lib/i18n/translations.ts`.

4) Notifications Telegram lors du changement de statut :
   - `src/app/api/mark-done/route.ts` contient `sendTelegramStatus(ref, action, name, email, sourceUrl)`.
   - Variables env `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID` doivent être définies.
   - Pour tester manuellement : générer l'URL de `mark-done` avec bons paramètres et ouvrir dans un navigateur (ou cURL GET). Exemple :

```
https://shop.chreolempire.com/api/mark-done?id=<ORDER_ID>&to=<CLIENT_EMAIL>&n=<CLIENT_NAME>&sig=<SIG>&act=done
```

(Si vous avez besoin, je peux générer le HMAC test pour une commande de test une fois le secret configuré.)

---

## Vérifications post-édition (checklist rapide)

- [ ] `npm run build` passe.
- [ ] Les pages principales (`/`, `/services/coupons`, `/services/uba`) s'affichent sans erreurs client.
- [ ] Les e-mails Brevo continuent d'être envoyés (tester sur un envoi réel ou env de test).
- [ ] Telegram reçoit bien les messages (env vars configurées).

---

## Bonnes pratiques

- Centraliser les taux et textes utilisateurs dans `src/lib/services.ts` et `src/lib/i18n/translations.ts` pour éviter drift et mismatches côté serveur/client.
- Toujours exécuter `npm run build` après modifications critiques.
- Ne pas exposer les liens privés (Neero) publiquement; gérer via demande privée ou via support WA.

---

## Contact rapide

- Tester un changement : ouvrir une issue ou demander directement ici en précisant le fichier et la modification souhaitée.

---

Fichier créé automatiquement pour accélérer les futures interventions.

# PWA et application Android TWA

## PWA locale

1. Lancer `npm run dev`.
2. Ouvrir `http://localhost:3000` dans Chrome.
3. Tester les pages publiques, l'installation et le mode hors connexion.
4. En production, vérifier `https://shop.chreolempire.com/manifest.webmanifest`, `/sw.js` et `/offline.html`.

Le service worker met en cache les pages publiques et les assets statiques. Les paiements, commandes, API, panier, checkout et administration ne sont jamais servis depuis le cache.

## Publication Android avec Bubblewrap

1. Installer Node.js puis Bubblewrap : `npm install -g @bubblewrap/cli`.
2. Vérifier Java 17 : `java -version`.
3. Initialiser depuis le manifest public après déploiement : `bubblewrap init --manifest https://shop.chreolempire.com/manifest.webmanifest`.
4. Lorsque Bubblewrap demande le JDK existant sous Windows, fournir le chemin sans `\bin`, par exemple `C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot`.
5. Vérifier les paramètres avec la configuration de référence [android-twa/twa-manifest.json](android-twa/twa-manifest.json).
6. Générer l'AAB : `bubblewrap build`.
7. Tester l'APK signé : `bubblewrap install`.
8. Publier l'AAB dans Google Play Console.

## Digital Asset Links obligatoire

Le fichier `public/.well-known/assetlinks.json` est un modèle volontairement non publiable. Remplacer impérativement :

- `REPLACE_WITH_ANDROID_APPLICATION_ID` par le package Android final, par exemple `com.example.chreolempire`.
- `REPLACE_WITH_RELEASE_CERTIFICATE_SHA256` par l'empreinte SHA-256 du certificat de signature de production.

Obtenir l'empreinte avec :

```bash
keytool -list -v -keystore release-keystore.jks -alias release
```

Pour Google Play App Signing, utiliser l'empreinte du certificat affichée dans `Play Console > Intégrité de l'application`, et non celle d'un certificat de test local.

Ne pas publier le modèle tant que ces deux valeurs ne sont pas remplacées : une valeur fictive empêcherait la TWA de vérifier le domaine.

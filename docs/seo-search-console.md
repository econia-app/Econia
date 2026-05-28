# Activation Google Search Console + Bing Webmaster

Procédure complète pour activer l'indexation pro de econia.fr après le déploiement du LOT B (sitemap + structured data).

À faire **une seule fois**, idéalement le jour même du push LOT B.

---

## 1. Google Search Console (priorité 1)

URL : <https://search.google.com/search-console>

### Étape 1 — Ajouter la propriété
1. Connecte-toi avec ton compte Google (recommandé : econia.app@gmail.com).
2. Clique sur **« Ajouter une propriété »** en haut à gauche.
3. Choisis **« Préfixe d'URL »** (pas Domaine — plus simple à vérifier).
4. Entre : `https://econia.fr` (avec le https, sans slash final).

### Étape 2 — Vérifier la propriété (méthode : balise HTML)
1. Google te propose plusieurs méthodes. Choisis **« Balise HTML »**.
2. Tu obtiens un code de ce type :
   ```html
   <meta name="google-site-verification" content="abc123XYZ..." />
   ```
3. Copie la valeur du `content` (ex: `abc123XYZ...`).
4. Ouvre `src/app/layout.tsx`, ligne 20 (constante `GOOGLE_SITE_VERIFICATION`) :
   ```ts
   const GOOGLE_SITE_VERIFICATION = "abc123XYZ..."; // ← colle ta valeur ici
   ```
5. Commit + push :
   ```cmd
   cd C:\Users\julie\Desktop\econia
   git add src/app/layout.tsx
   git commit -m "Ajout vérification Google Search Console"
   git push
   ```
6. Attends 1-2 minutes (déploiement Vercel), puis retourne dans Search Console et clique **« Vérifier »**.

### Étape 3 — Soumettre le sitemap
1. Une fois la propriété vérifiée, dans le menu de gauche : **Sitemaps**.
2. Entre : `sitemap.xml` (juste le nom, pas l'URL complète).
3. Clique **« Envoyer »**.
4. Statut attendu : **« Réussite »** sous 24-48h.

### Étape 4 — Tester les rich snippets
1. Va sur <https://search.google.com/test/rich-results>.
2. Teste les 3 URL clés :
   - `https://econia.fr`
   - `https://econia.fr/aides-non-reclamees`
   - `https://econia.fr/guide/loi-lemoine-assurance-emprunteur`
3. Tu dois voir détectés : **Organization**, **WebSite**, **FAQPage** (home), **Article + HowTo + BreadcrumbList** (guides).

---

## 2. Bing Webmaster Tools (priorité 2)

URL : <https://www.bing.com/webmasters>

### Étape 1 — Importation rapide depuis Google
1. Connecte-toi (compte Microsoft ou Google).
2. Choisis **« Importer depuis Google Search Console »** (gain de temps énorme).
3. Autorise l'accès, sélectionne econia.fr.
4. Bing récupère automatiquement le sitemap et la vérification.

### Étape 2 — Vérification manuelle (si l'import ne marche pas)
Si l'import a échoué, méthode alternative :
1. Ajoute manuellement econia.fr.
2. Choisis **« Balise meta »**.
3. Bing te donne un code `<meta name="msvalidate.01" content="ABC123..." />`.
4. Dans `src/app/layout.tsx`, ligne 21 :
   ```ts
   const BING_SITE_VERIFICATION = "ABC123..."; // ← colle ta valeur ici
   ```
5. Commit + push, puis vérifie dans Bing.

---

## 3. Demander l'indexation manuelle des pages clés (Google)

Après vérification du sitemap, force l'indexation des 3 pages prioritaires :

1. Dans Search Console → barre de recherche en haut.
2. Entre l'URL : `https://econia.fr`
3. Clique **« Demander une indexation »** → attend 30 secondes.
4. Répète pour :
   - `https://econia.fr/aides-non-reclamees`
   - `https://econia.fr/guide/loi-lemoine-assurance-emprunteur`
   - `https://econia.fr/guide/prime-activite-2026`
   - `https://econia.fr/guide/cheque-energie-2026`

Limite : Google autorise ~10 demandes manuelles par jour.

---

## 4. Suivi hebdomadaire

Une fois activé, regarde dans Search Console **toutes les semaines** :

- **Performances** → impressions, clics, position moyenne, requêtes les + recherchées.
- **Couverture** → pages indexées vs. erreurs. Idéalement, 100 % des pages du sitemap doivent passer en "Valide".
- **Améliorations** → si Google détecte des problèmes de rich snippets, ils apparaissent ici.

Indicateur de succès à 30 jours : ≥ 200 impressions/jour avec position moyenne < 30.

---

## 5. Bonus — Google Analytics 4 (optionnel)

Pas indispensable car on a déjà Vercel Analytics (qui couvre 80 % du besoin). Si tu veux des analyses + poussées (cohortes, attribution) :

1. <https://analytics.google.com> → créer une propriété GA4 pour econia.fr.
2. Récupère le `Measurement ID` (format `G-XXXXXXX`).
3. À me redemander : on intègrera GA4 via `@next/third-parties/google` dans le layout (pas encore fait pour ne pas multiplier les trackers).

---

**Pour rappel** : les codes de vérification se mettent dans `src/app/layout.tsx`, constantes `GOOGLE_SITE_VERIFICATION` et `BING_SITE_VERIFICATION` (lignes 20-21). Push → attendre déploiement Vercel (1-2 min) → revenir cliquer "Vérifier".

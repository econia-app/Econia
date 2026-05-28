# Setup Stripe pour Econia

Procédure complète pour activer la monétisation. À faire **une seule fois**.

Tu auras besoin de ~30 minutes et de ton compte Stripe (déjà créé selon CLAUDE.md).

Recommandation : commence par activer le **mode Test** de Stripe (clés `sk_test_...`) pour valider tout le flow sans risque. Tu basculeras en `sk_live_...` quand tu auras testé.

---

## 1. Migration SQL Supabase (2 min)

Avant tout : ouvrir Supabase Studio → projet econia → **SQL Editor** → **New query** → coller le contenu de `supabase/migrations/2026-05-26_stripe_columns.sql` → **Run**.

Vérifie ensuite : Table Editor → `profiles` → tu dois voir les 4 nouvelles colonnes : `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`, `subscription_period_end`.

---

## 2. Stripe Dashboard — créer le produit (5 min)

URL : <https://dashboard.stripe.com/products>

1. **Bouton "Ajouter un produit"** en haut à droite.
2. Nom : `Econia Premium Founder`
3. Description : `Accès complet aux guides d'action, scripts de négociation et alertes Econia.`
4. **Prix récurrent** :
   - Modèle de tarification : **Tarification standard**
   - Prix : `6,99 €`
   - Facturation : **Mensuelle**
   - Devise : **EUR**
5. **Bouton "Enregistrer le produit"**.
6. Copie le **Price ID** (format `price_1ABC...`) — tu le mets dans `STRIPE_PRICE_FOUNDER`.

---

## 3. Stripe Dashboard — créer le coupon -50% (3 min)

URL : <https://dashboard.stripe.com/coupons>

1. **Bouton "+ Nouveau"**.
2. ID du coupon : `FOUNDER50` (tu peux choisir, mais reste simple)
3. Type : **Pourcentage**
4. Pourcentage de réduction : `50`
5. Durée : **Plusieurs mois** → `6`
6. Devise : **EUR**
7. (Optionnel) limite d'utilisation : `50` (1 par Founder max)
8. **Enregistrer**.
9. Copie l'ID (`FOUNDER50`) — tu le mets dans `STRIPE_COUPON_FOUNDER`.

Note : la période d'essai de 30 jours (1er mois gratuit) est gérée côté code via `trial_period_days` — pas besoin de coupon spécifique pour ça.

---

## 4. Stripe Dashboard — webhook (5 min)

URL : <https://dashboard.stripe.com/webhooks>

1. **Bouton "+ Ajouter un endpoint"**.
2. URL : `https://econia.fr/api/stripe/webhook`
3. Description : `Econia — sync abonnements`
4. **Sélectionne les événements** (5 à cocher) :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. **Ajouter l'endpoint**.
6. Dans la page du webhook créé → **"Révéler"** la clé de signature → copie la valeur (`whsec_...`).

---

## 5. Stripe Dashboard — Customer Portal (2 min)

URL : <https://dashboard.stripe.com/settings/billing/portal>

1. Active le portail (toggle en haut).
2. Coche les permissions :
   - **Modifier le mode de paiement**
   - **Mettre à jour les informations de facturation**
   - **Annuler un abonnement** → choisis "Immédiate" ou "À la fin de la période" (recommandé)
   - **Consulter l'historique des paiements**
3. Désactive "Mettre à jour leur abonnement" tant qu'il n'y a qu'un seul plan.
4. **Enregistrer**.

---

## 6. Récupérer les clés API (1 min)

URL : <https://dashboard.stripe.com/apikeys>

Copie les deux clés :
- **Clé publiable** (`pk_test_...` ou `pk_live_...`) → variable `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Clé secrète** (`sk_test_...` ou `sk_live_...`) → variable `STRIPE_SECRET_KEY`

⚠️ La clé secrète ne doit JAMAIS être commitée dans Git. Vercel uniquement.

---

## 7. Variables d'environnement Vercel (3 min)

URL : <https://vercel.com/[ton-team]/econia/settings/environment-variables>

Ajoute ces 6 variables (cocher **Production** + **Preview** pour chacune) :

| Nom | Valeur |
|---|---|
| `STRIPE_SECRET_KEY` | sk_live_... (ou sk_test_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_live_... (ou pk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | whsec_... |
| `STRIPE_PRICE_FOUNDER` | price_1ABC... |
| `STRIPE_COUPON_FOUNDER` | FOUNDER50 |
| `STRIPE_PRICE_FOUNDER_TRIAL_DAYS` | 30 |

⚠️ `SUPABASE_SERVICE_ROLE_KEY` doit déjà être configurée (selon CLAUDE.md, c'est le cas).

Après ajout : **Redéploie** (Vercel → Deployments → "..." → Redeploy) pour que les nouvelles variables soient prises en compte.

---

## 8. Test bout en bout en mode Test (10 min)

1. Sur econia.fr → crée un compte avec un mail bidon.
2. Va sur `/mon-compte` → tu dois voir la section "Mon abonnement" avec le bouton "Passer Premium (Founder)".
3. Clique → tu es redirigé vers Stripe Checkout.
4. Carte de test Stripe : `4242 4242 4242 4242`, n'importe quelle date future, n'importe quel CVC.
5. Tu valides → retour sur `/mon-compte?stripe=success`.
6. Sous 5-10s, ton statut devrait passer à **Premium / Période d'essai**.
7. Vérifie dans Stripe Dashboard → Customers → tu vois ton compte + l'abonnement.
8. Vérifie dans Supabase Table Editor → profiles → ton profil a `stripe_customer_id` et `stripe_subscription_id` remplis, `is_premium = true`.

---

## 9. Passage en production (mode Live)

Quand tout marche en mode test :
1. Dans Stripe Dashboard, bascule en mode **Production** (toggle en haut à gauche).
2. Refais les étapes 2 (produit), 3 (coupon), 4 (webhook), 5 (portail) en mode Live.
3. Récupère les clés live (`sk_live_...`, `pk_live_...`, `whsec_...`).
4. Remplace les valeurs Test par les valeurs Live dans Vercel.
5. Redéploie.
6. Test final avec une vraie carte (montant 0€ grâce à la trial — sans risque).

---

## 10. Vérifications à faire chaque semaine

- Stripe Dashboard → **Payments** → tous les paiements doivent être en `Succeeded`.
- Stripe Dashboard → **Customers** → cohérence avec Supabase.
- Stripe Dashboard → **Webhooks** → 0 erreur. Si erreurs → cliquer dessus, lire le détail, débugger.

---

## En cas de problème

- **Webhook qui plante** : aller dans Stripe Dashboard → Webhooks → cliquer sur l'endpoint → onglet "Tentatives". Tu vois l'erreur exacte. Souvent : variable d'env manquante ou nom de colonne SQL faux.
- **Bouton "Passer Premium" inactif** : ouvrir la console du navigateur (F12) → onglet Network → cliquer → voir la réponse de `/api/stripe/checkout`. Le message d'erreur te dira quoi.
- **Premium qui revient à false tout seul** : c'est probablement `customer.subscription.deleted` qui arrive. Va dans Stripe pour comprendre pourquoi l'abonnement a été annulé.

---

## Pour activer un Founder manuellement (sans Stripe)

Tant que tu n'as pas le flow Stripe complet en prod, tu peux activer Premium à la main :
1. Supabase Studio → Table Editor → `profiles`
2. Trouver le profil par email
3. Mettre `is_founder = true` ET `is_premium = true`
4. Save

L'utilisateur verra alors l'accès Premium et le badge FOUNDER, sans passer par Stripe.

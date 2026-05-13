# PROJET ECONIA

## Identité du projet
Tu accompagnes Julien Guillard (entrepreneur, Yonne 89) dans la création d'Econia (econia.fr), un agent IA qui aide les particuliers français à récupérer l'argent qu'ils perdent sans le savoir.

Pitch : "Econia — Découvrez combien vous pourriez récupérer. En moyenne 500€/an."

## Règles absolues

### Comportement
- Sois direct, concret et pragmatique. Pas de blabla ni de propositions inutiles.
- Quand tu modifies un fichier, fais-le directement sans demander confirmation pour chaque ligne.
- Ne propose jamais de solutions jetables — construis pour de vrai, compatible avec le code existant.
- Recherche constante d'améliorations et de valeur ajoutée.
- Sois force de proposition mais reste focus sur la priorité en cours. Pas d'éparpillement.
- Quand tu ne sais pas ou que l'info peut avoir changé, fais une recherche web avant de répondre.
- Les montants d'aides, barèmes et réglementations doivent être vérifiés et à jour (2026).
- Ne gonfle jamais les chiffres. Under-promise, over-deliver.

### Code
- Tout le code doit être complet, prêt à compiler, compatible Next.js + TypeScript + Supabase.
- Toujours vérifier la syntaxe (accolades, parenthèses) avant de proposer un fichier.
- Maintenir la cohérence avec le design V4 existant (couleurs, polices, espacements).
- Aucune référence aux impôts (frais réels, cases personnalisées, crédit d'impôt en tant que gain) — uniquement comme encarts informatifs.

## Profil porteur

- **Nom** : Julien Guillard
- **Adresse** : 89 rue Marie Noël, 89100 Soucy
- **SIRET** : 881 266 266 00025
- **Statut actuel** : Entrepreneur individuel (2 sociétés actives : maçonnerie + SAP)
- **Micro-entreprise SAP** : existe mais NON utilisée pour Econia (activités différentes)
- **TVA** : non applicable, article 293 B du CGI
- **Niveau tech** : intermédiaire, apprend activement
- **Système** : Windows, terminal CMD
- **Email** : econia.app@gmail.com

## Stack technique

- **Frontend** : Next.js (TypeScript) sur Vercel — econia.fr LIVE
- **Base de données** : Supabase (projet pxbntlbtngcecbhcghzu, EU West Irlande)
  - Table `waitlist` : email + scan_data
  - Table `profiles` : id, email, is_premium, is_founder, scan_data, gains_total
- **Auth** : Supabase Auth (email/mdp 8 caractères + Google OAuth)
- **Code source** : github.com/econia-app/Econia (branche main)
- **Déploiement** : automatique via Vercel à chaque git push
- **Domaine** : econia.fr (OVH)
- **Hébergement** : Vercel (USA), Supabase (UE)

## Structure du projet

```
econia/
├── CLAUDE.md                              (instructions persistantes)
├── MEMORY.md                              (décisions clés)
├── docs/                                  (documentation)
├── content/                               (contenus marketing)
├── src/
│   ├── app/
│   │   ├── page.tsx                       (page principale)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── mentions-legales/page.tsx
│   │   ├── confidentialite/page.tsx
│   │   ├── cgu/page.tsx
│   │   └── api/
│   │       └── delete-account/route.ts
│   ├── lib/
│   │   └── guides.ts                      (8 guides Premium définitifs)
│   └── components/
│       ├── Footer.tsx
│       ├── LegalConsent.tsx
│       └── DeleteAccountButton.tsx
├── public/
├── package.json
└── tsconfig.json
```

## Workflow Git

```cmd
cd C:\Users\julie\Desktop\econia
git add .
git commit -m "message"
git push
```

Vercel déploie automatiquement en 1-2 minutes après chaque push.
Branche `main` = production directe.

## Modèle économique

### Tarification
- **50 premiers (Founders)** : 1er mois gratuit + 3,49€/mois pendant 6 mois + 6,99€/mois ensuite
- **Après les 50** : scan 1€ + Premium 6,99€/mois
- **Plan annuel** : 69,99€/an (-35%)
- **Anciens abonnés** : gardent leur tarif à vie

### Stratégie waitlist
- Liste 1 : 50 Founders (tarif spécial à vie)
- Liste 2 : Pré-inscrits Premium (illimitée, tarif standard) — à activer quand 40 Founders atteints

### Marges
- Marge brute : 87-92%
- Coût par utilisateur Premium : ~0,53€/mois

## Les 6 leviers d'économie actuels

1. Aides sociales non réclamées (RSA, prime activité, APL, CSS, ASPA, AAH, ARS, chèque énergie, ASF)
2. Assurances (comparaison + négociation + doublons CB + emprunteur loi Lemoine)
3. Abonnements fantômes + alertes fin d'offre
4. Énergie (comparaison fournisseurs + option tarifaire + puissance + radar prix)
5. Radar Econia (nouvelles aides, aides locales, primes véhicules, changements barèmes)
6. Aides mobilité (leasing social juillet 2026)

**Reportés** : Impôts (avant avril 2027), Module repas (Phase 2), Droits consommateur (à développer)

## Identité légale et conformité

### En ligne sur econia.fr
- `/mentions-legales` ✅ LIVE
- `/confidentialite` ✅ LIVE (RGPD complet)
- `/cgu` ✅ LIVE
- Case CGU obligatoire à l'inscription ✅
- Footer juridique sur toutes les pages ✅

### À activer avant lancement commercial
- Inscription CM2C (médiateur consommation) : 48€/3 ans
- CGV en ligne avec formulaire rétractation
- Bouton "Résilier mon abonnement" en 3 clics (loi 16 août 2022)
- Stripe configuré
- Vérification du SIRET et ajout activité "programmation informatique" si nécessaire

### Statut juridique
- Rester entrepreneur individuel tant que CA Econia < 30-40K€/an
- SASU à créer quand CA > 200€/mois confirmé
- Ne pas mélanger avec la micro SAP existante

## Priorités actuelles

### Court terme (30 jours)
1. Atteindre 50 inscrits Founders via :
   - Entourage WhatsApp (semaine 1, objectif 15-20)
   - Groupes Facebook (semaine 2-3, objectif 15-20)
   - Meta Ads 30€/mois (semaine 2-4, objectif 15-25)
2. Tester le scan avec 3-5 proches
3. Activer Premium manuellement pour eux (Supabase Table Editor → profiles → is_premium=true)
4. Collecter feedbacks réels
5. Récupérer vrais témoignages

### Moyen terme (50 → 200 utilisateurs)
1. Coder la bascule automatique vers "pré-inscription Premium" quand 40 Founders atteints
2. Inscription CM2C
3. Publication CGV
4. Intégration Stripe
5. Lancement commercial
6. Alertes proactives mensuelles
7. Compteur de gains cumulés "vie entière"
8. Calendrier annuel des actions

### Long terme
- Module repas Phase 2
- Guide impôts complet (avant avril 2027)
- Pivot vers coach permanent
- Test B2B2C (CSE, mutuelles)
- Verticales (Famille, Senior, Étudiant, Auto-entrepreneur)

## Décisions clés validées

### Techniques
- Site PWA (pas d'app native ni WhatsApp)
- Branche main = production (pas de staging)
- Vercel free tier suffit (no Development env)
- SUPABASE_SERVICE_ROLE_KEY configurée pour Production + Preview

### Produit
- Scan rapide gratuit → compte gratuit pour sauvegarder → Premium pour les guides détaillés
- Pas de garantie de remboursement (estimation indicative)
- Pitch à 500€/an (prudent, crédible)
- 50 pré-inscriptions (pas 300 — plus exclusif)
- Pas de visage ni voix de Julien dans les contenus vidéo
- Priorité négociation + regroupement assurances (pas changement systématique)
- CMG et crédit d'impôt SAP = encarts informatifs, PAS dans le calcul du gain total
- Abonnements fantômes = 200-500€/an (pas 750€, corrigé)
- Anti-triche : 1 email = 1 profil = 1 abonnement

### Marketing
- Témoignages : ne pas inventer, attendre vrais utilisateurs
- Ton : direct, concret, sans superlatifs
- Pas de promesses garanties
- Tutoiement réseaux sociaux, vouvoiement email officiel

## Comptes et accès

| Service | Accès |
|---|---|
| Email pro | econia.app@gmail.com |
| GitHub | econia-app |
| Vercel | connecté GitHub, projet "econia" |
| Supabase | projet "econia" (pxbntlbtngcecbhcghzu) |
| OVH | domaine econia.fr |
| Facebook/Instagram/TikTok | pages Econia créées |
| Anthropic Console | compte créé (solde 0$) |
| Stripe | compte créé (à configurer) |
| OneSignal | compte créé (à configurer) |

## Approche communication

### Quand Claude propose du code
- Code complet, prêt à coller
- Indiquer le chemin exact du fichier
- Vérifier syntaxe avant de proposer
- Compatible avec les imports existants

### Quand Claude propose une stratégie
- Analyser pour/contre honnêtement
- Ne pas flatter — dire la vérité
- Prioriser les actions à fort ROI temps/argent
- Toujours penser : "valide d'abord, scale ensuite"

### Quand Claude répond à une question simple
- Réponse courte et directe
- Pas de préambule inutile
- Pas de récap général si non demandé

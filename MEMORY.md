# MEMORY ECONIA — Décisions clés et historique

> Index des décisions importantes du projet. À mettre à jour à chaque décision stratégique majeure.

---

## 🎯 VISION

**Mission** : aider les Français à récupérer l'argent qu'ils perdent sans le savoir.
**Pitch** : "En moyenne 500€/an récupérés."
**Marché** : 40 millions de foyers fiscaux, 10 Mds€ d'aides non réclamées par an.

---

## 💼 STATUT JURIDIQUE ET COMMERCIAL

### Décision : Entrepreneur individuel, pas la micro SAP
- Date : Mai 2026
- Raison : la micro SAP (services à la personne) couvre une activité différente. Mélanger les deux serait risqué (perte d'agrément SAP, mauvaise classification).
- Action : utiliser le SIRET 881 266 266 00025 mais en nom propre, sans s'appuyer sur la micro SAP.

### Décision : Reporter la création SASU
- Date : Mai 2026
- Raison : créer une SASU coûte 200-400€ + comptabilité 100€/mois. Pas justifié tant que le CA n'est pas confirmé.
- Seuil de déclenchement : CA Econia > 200€/mois pendant 2 mois consécutifs OU > 30 000€/an projetés.

### Décision : Pas de déclaration administrative avant 1er encaissement
- Date : Mai 2026
- Raison : tant qu'aucun euro encaissé, aucune obligation URSSAF/impôts pour Econia.
- Conséquence : la phase waitlist 50 Founders peut tourner sans aucune démarche administrative.

### Décision : Inscription CM2C comme médiateur
- Date : Mai 2026
- Médiateur choisi : CM2C (Centre de la Médiation de la Consommation de Conciliateurs de Justice)
- Adresse : 49 rue de Ponthieu, 75008 Paris
- Site : cm2c.net
- Coût : 48€ pour 3 ans
- À faire : AVANT le 1er paiement Stripe (obligation légale, amende 3 000€ si absent)

---

## 💰 MODÈLE ÉCONOMIQUE

### Tarification définitive
- **Founders (50 premiers)** : 1er mois gratuit + 3,49€/mois pendant 6 mois + 6,99€/mois ensuite
- **Standard** : scan 1€ + Premium 6,99€/mois
- **Annuel** : 69,99€/an (-35%)
- **Anciens abonnés** : gardent leur tarif à vie

### Décision : Stratégie 2 listes après 50 Founders
- Date : Mai 2026
- Liste 1 : 50 Founders avec tarif spécial à vie
- Liste 2 : Pré-inscrits Premium illimités, tarif standard
- Déclenchement : la bascule automatique se fait quand le compteur atteint 50

### Décision : Pas de tarif "gratuit à vie"
- Date : Mai 2026
- Raison : casser la valeur perçue dès le départ détruit le business
- Maintenu : seul le scan reste gratuit + résultats indicatifs

---

## 🎨 PRODUIT

### Décision : Site PWA, pas d'app native ni WhatsApp
- Date : Mai 2026
- Raison : WhatsApp Business coûte cher à grande échelle. Une app native demande un store et une équipe.
- Stack confirmée : Next.js + Supabase + Vercel

### Décision : 6 leviers d'économie (pas 7)
- Date : Mai 2026
- Retiré : Impôts (frais réels + cases personnalisées)
- Raison : développer correctement le contenu fiscal demande beaucoup de travail. Reporté à avant avril 2027 pour la prochaine campagne de déclaration.
- Conséquence : aucune mention "frais réels" ou "cases impôts" dans le scan/résultats actuels.

### Décision : Module repas reporté Phase 2
- Date : Mai 2026
- Raison : éviter l'éparpillement. Valider d'abord les 6 leviers actuels.
- Réactivation : quand 200+ utilisateurs et churn validé.

### Décision : Guides verrouillés par défaut
- Date : Mai 2026
- Comportement : guides accessibles uniquement si is_premium=true OU is_founder=true dans Supabase
- Test 24h : possible en activant manuellement is_premium dans Supabase Table Editor

### Décision : 8 guides Premium définitifs validés
- Date : Mai 2026
- Guides intégrés dans src/lib/guides.ts :
  1. assurance_compare (7 étapes, 45 min)
  2. doublons_cb (6 étapes, 20 min)
  3. assurance_emprunteur (7 étapes, 1h)
  4. abonnements (6 étapes, 30 min)
  5. alertes_offre (6 étapes, 15 min)
  6. energie (7 étapes, 30 min)
  7. aides_sociales (7 étapes, 30 min/aide)
  8. leasing_social (8 étapes, 20 min)
- Scores : 9-10/10 chacun

---

## ⚖️ CONFORMITÉ LÉGALE

### En place et fonctionnel
- Mentions légales (econia.fr/mentions-legales)
- Politique de confidentialité RGPD (econia.fr/confidentialite)
- CGU (econia.fr/cgu)
- Case à cocher CGU obligatoire à l'inscription
- Bouton "Supprimer mon compte" (route API /api/delete-account)
- Footer juridique sur toutes les pages
- Adresse postale correcte : 89 rue Marie Noël, 89100 Soucy

### À activer avant lancement commercial
- CGV en ligne avec formulaire de rétractation type
- Inscription CM2C (48€/3 ans)
- Bouton "Résilier mon abonnement" en 3 clics
- Configuration Stripe avec PCI-DSS
- Ajout activité "programmation informatique" sur SIRET si nécessaire

### Documents juridiques V2 disponibles
- Document complet : Econia_Documents_Juridiques_V2.md
- 4 documents : Mentions légales + Confidentialité + CGU + CGV
- Tous audités, conformes au droit français 2026

---

## 🎯 STRATÉGIE D'ACQUISITION

### Plan 30 jours pour 50 Founders
- **Semaine 1** : 30 messages WhatsApp entourage (objectif 15-20 inscrits)
- **Semaine 2-3** : Posts groupes Facebook (objectif 15-20 inscrits)
- **Semaine 2-4** : Meta Ads à 1€/jour, ciblage France 25-55 ans (objectif 15-25 inscrits)

### Budget pub validé
- 10-30€/mois sur Meta Ads
- KPI : CPC < 0,30€, coût par inscription 5-10€
- À arrêter si pas de résultats après 30€ dépensés

### Décision : Pas de témoignages inventés
- Date : Mai 2026
- Action : retirer les témoignages fictifs Sophie/Marc/Laura du site quand on les ajoutera
- Stratégie : récolter vrais témoignages auprès des 5-10 premiers utilisateurs

---

## 🔧 TECHNIQUE

### Décision : Branche main = production directe
- Date : Mai 2026
- Raison : projet solo, pas besoin de staging. Vercel auto-déploie main.
- Conséquence : tester en local avant chaque push (npm run dev sur http://localhost:3000)

### Décision : Pas d'environnement Development sur Vercel
- Date : Mai 2026
- Raison : cadenas sur plan Hobby, pas nécessaire
- Variables d'environnement : Production + Preview suffisent
- SUPABASE_SERVICE_ROLE_KEY configurée et opérationnelle

### Décision : Fichier guides.ts séparé
- Date : Mai 2026
- Localisation : src/lib/guides.ts
- Raison : éviter un page.tsx de 150 Ko, faciliter la maintenance des guides
- Import dans page.tsx : `import { guides, gainToGuide } from "@/lib/guides";`

### Décision : Police Fraunces + Inter
- Date : Mai 2026
- Avant : Syne (trop lourde et massive)
- Maintenant : Fraunces (titres, serif élégant) + Inter (texte, sans-serif moderne)
- Style : fintech premium type Stripe/Notion/Linear

---

## 📊 KPI ET MÉTRIQUES

### À mesurer
- Inscriptions/jour
- Coût par inscription (CPI)
- Taux complétion scan
- Taux conversion compte créé
- Churn à 3 mois (le KPI critique)
- LTV moyen
- Témoignages collectés

### Seuils de décision
- Si CPI > 15€ → pivoter le messaging
- Si taux complétion scan < 60% → simplifier les questions
- Si churn 3 mois > 70% → pivoter vers coach permanent (alertes mensuelles)

---

## 🚫 PIÈGES À ÉVITER (leçons apprises)

### Ne pas ajouter de coach IA dès le départ
- Risque : valeur perçue chute après inscription
- Risque juridique : requalification conseiller financier (ACPR)
- Coût : API Anthropic à crédit + dev complexe
- Validation marché manquante
- Phase optimale : 1000+ utilisateurs

### Ne pas tout donner gratuitement
- Casser la valeur perçue dès le départ détruit le business
- Les Founders gardent un tarif spécial MAIS payent
- Le scan reste gratuit, les guides restent Premium

### Ne pas négliger le churn
- Le plus gros risque structurel d'Econia
- LTV estimé sans pivot : 21-28€ (3-4 mois × 6,99€)
- Solution : alertes proactives + compteur cumulé + calendrier annuel

### Ne pas faire grossir les réseaux pour faire grossir les réseaux
- 200 followers en 6 mois sans clients = échec
- Objectif : 50 personnes intéressées qui voient le message, pas 10K followers

---

## 📅 HISTORIQUE DES MILESTONES

### Mai 2026
- ✅ Site econia.fr live
- ✅ Scan 19 questions fonctionnel
- ✅ Authentification Supabase (email + Google)
- ✅ 4 pages juridiques en ligne
- ✅ Footer juridique
- ✅ Case CGU obligatoire à l'inscription
- ✅ Bouton suppression compte (RGPD)
- ✅ 8 guides Premium définitifs intégrés
- ✅ Design V4 déployé
- ⏳ Migration vers Cowork (en cours)

### À venir
- Atteinte 50 Founders
- Inscription CM2C
- Configuration Stripe
- Lancement commercial
- Mesure du churn à 3 mois
- Décision pivot Phase 2

---

## 🤝 CONTEXTE PERSONNEL JULIEN

- Marié, 2 enfants 3-5 ans
- 2 sociétés actives (maçonnerie + SAP avec agrément)
- Micro-entreprise existante
- Salarié + activités indépendantes
- Revenus fonciers (micro-foncier)
- Localisation : Yonne (89), Soucy
- Niveau IA : intermédiaire, apprend activement
- Travaille parfois sur téléphone (besoin de réponses adaptées)
- Budget disponible pour Econia : 10-30€/mois maximum

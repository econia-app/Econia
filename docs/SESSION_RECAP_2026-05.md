# Récap session Econia — mai 2026

Document de référence pour reprendre le projet sans relire toute la conversation.

---

## ✅ Ce qui a été fait (par ordre chronologique)

### Lot 1 — Fondations SEO & branding
- `src/app/layout.tsx` : metadata FR complète (title, description, OpenGraph, Twitter card, lang=fr, manifest)
- `src/app/globals.css` : tokens design en CSS variables, virage Geist + dark mode auto, contrastes WCAG AA, support `prefers-reduced-motion`
- Pack visuel créé dans `public/` :
  - `favicon.svg` + `favicon.ico` + 5 tailles PNG (16/32/48/64/96)
  - `apple-touch-icon.png` (180×180), `android-chrome-192/512.png`
  - `og-image.png` (1200×630) pour partages sociaux
  - `site.webmanifest` PWA
- Direction visuelle favicon : **disque plein dégradé bleu→violet + € blanc** (variante A choisie)
- Wordmark og-image : "ec[o]nia" en serif avec "o" en dégradé

### Lot 2 — Décomposition page.tsx (730 lignes → 155)
- `src/lib/theme.ts` : tokens (T, fonts, MAX_WAITLIST, faqs, catLabels/Colors)
- `src/lib/questions.ts` : 19 questions du scan global
- `src/lib/analyze.ts` : `analyzeProfile()` + types Gain/Info/ScanResult
- `src/lib/supabase.ts` : client + types Profile + ActionState
- 13 composants extraits dans `src/components/` :
  ```
  Navbar.tsx, AuthModal.tsx, GuideModal.tsx
  landing/  Hero, TrustBar, HowItWorks, Levers, Pricing,
            FaqSection, FinalCta, LandingFooter, ResumeScanBanner
  scan/     ScanFlow, ResultsView
  ```
- `src/app/page.tsx` devient orchestrateur pur

### Lot 3 — Corrections UX mobile
- Burger menu mobile (Navbar) + drawer avec ancres pour visiteurs
- Floating cards hero repositionnées (ne débordent plus < 640px)
- Leviers : 2 colonnes compactes ≤ 900px (au lieu de 1 col scroll interminable)
- Boutons FAQ tactiles 44×44px
- TrustBar et Footer grids responsives
- Ancres nav (Fonctionnement / Économies / Tarifs / FAQ) desktop + mobile

### Lot 4 — Fix 8 bugs critiques + extras
- B1 : Compteur scan dynamique X/Y (selon questions visibles, plus le "17/19" cassé)
- B2 : Mockup hero `520€/an` (cohérent pitch 500€, plus le "+200€/mois" trompeur)
- B3 : Route `/scan` deep-link publique (avec query `?start=scan`)
- B4 : CTA Premium en haut de la page résultats
- B5 : Fix singulier/pluriel "1 piste / X pistes"
- B6 : Fourchette resserrée — `≈ X€/an` + fourchette en sous-titre
- B7 : Ancres nav (cf Lot 3)
- B8 : OG description courte (124 cars au lieu de 181)
- Bonus : `src/app/not-found.tsx` page 404 brandée

### Dashboard utilisateur `/mon-compte`
- Page perso connectée : welcome + badge FONDATEUR + gain potentiel + compteur "déjà récupéré"
- 3 statuts interactifs par levier : À faire / En cours / Terminé
- Modal de déclaration du montant récupéré → alimente le compteur lifetime
- Section paramètres (refaire scan, déconnexion, suppression compte)
- Bandeau "Reprendre mon analyse" sur la home si user revenant avec scan_data
- Migration Supabase requise : `actions_state JSONB` + `gains_total NUMERIC` + RLS policies + trigger auto-création profile (cf `docs/supabase/migrations/2026-05-add-actions-state.sql`)

### Mini-scans dédiés par aide (gros)
Système entièrement modulaire :
- `src/lib/baremes-2026.ts` : barèmes officiels centralisés + sources Légifrance
- `src/lib/mini-scans/` : 1 fichier par aide (questions + calcul)
- `src/components/mini-scan/MiniScanFlow.tsx` + `MiniScanResult.tsx` : UI générique réutilisable
- `src/app/aide/` : pages publiques SEO-friendly

**7 mini-scans en production** (chacun avec page `/aide/[slug]` + intro SEO + 3-5 questions + résultat + CTA Premium) :
1. `/aide/prime-activite` — Prime d'activité (5 Q)
2. `/aide/rsa` — RSA (5 Q)
3. `/aide/apl` — APL (5 Q, formule simplifiée)
4. `/aide/ars` — Allocation rentrée scolaire (4 Q)
5. `/aide/complementaire-sante` — CSS (3 Q)
6. `/aide/cheque-energie` — Chèque énergie (3 Q)
7. `/aide/aspa` — Minimum vieillesse (3 Q)

Sur le dashboard, chaque levier détecté affiche le bouton **"🎯 Calculer mon montant exact"** qui redirige vers le mini-scan correspondant.

---

## ⚠️ À VÉRIFIER avant promo des mini-scans

Les barèmes 2026 utilisés dans `src/lib/baremes-2026.ts` proviennent de :
- Décret n° 2026-222 (Prime activité)
- Décret n° 2026-220 (RSA)
- Décret n° 2025-1401 (APL)
- complementaire-sante-solidaire.gouv.fr (CSS)
- chequeenergie.gouv.fr
- service-public.fr/F16871 (ASPA)
- caf.fr (ARS — chiffres rentrée 2025-2026, revalo attendue août 2026)

**Action recommandée** : valider chaque chiffre principal manuellement contre les sources officielles avant de promouvoir les pages sur les réseaux. Marge d'erreur observée ±30€/mois sur Prime activité / RSA, ±100€ sur APL.

---

## 📦 État actuel du projet

### Stack
- Frontend : Next.js 16.2.4 (App Router) + TypeScript + Tailwind 4 (utilisé peu)
- Hébergement : Vercel (auto-deploy `main`)
- BDD : Supabase (projet `pxbntlbtngcecbhcghzu`)
- Auth : Supabase Auth (email/mdp + Google OAuth)

### Modèle économique
- Free : scan gratuit + résultats généraux
- Founders (50 premiers) : 1er mois gratuit + 3,49€/mois × 6 mois + 6,99€/mois ensuite
- Premium standard : 6,99€/mois ou 69,99€/an (-17%)
- Stripe **pas encore branché** — activation manuelle via Supabase Table Editor :
  `UPDATE profiles SET is_premium=true, is_founder=true WHERE email='...'`

### URL clés
- Home : `econia.fr`
- Scan : `econia.fr/scan` (deep-link)
- Mon espace : `econia.fr/mon-compte`
- Aides : `econia.fr/aide/{prime-activite,rsa,apl,ars,complementaire-sante,cheque-energie,aspa}`
- Légal : `/mentions-legales`, `/confidentialite`, `/cgu`

---

## 🚧 Reste à faire (priorité décroissante)

### Critique avant les premiers paiements
1. **Stripe** : compte à créer + branchement checkout (Founder Pass 99€ à vie, pack annuel 69,99€, Premium mensuel)
2. **Inscription CM2C** (médiateur conso, 48€/3 ans, obligatoire dès 1er paiement)
3. **CGV en ligne** + bouton "Résilier en 3 clics" (loi 16/08/2022)
4. **Création micro-entreprise/SASU** (10-15 jours délai)

### Importante (acquisition)
5. **Tracking analytics** : Vercel Analytics + Plausible/GA4 + Pixel Meta + Pixel TikTok + UTM
6. **Sitemap.xml + robots.txt** pour indexation Google
7. **3-5 articles SEO de fond** ("Comment toucher la prime d'activité 2026", "Loi Lemoine assurance emprunteur", etc.)
8. **Système de parrainage** (1 ami parrainé = 1 mois Premium offert)

### Mini-scans restants à coder
- AAH / PCH (allocation handicap) — barème complexe
- Leasing social — comparatif coût véhicule
- Assurance emprunteur (loi Lemoine) — gain ponctuel ÉNORME
- MaPrimeRénov' (très complexe, multi-aides + travaux)

### Long terme
- Module repas Phase 2
- Guide impôts complet (avant avril 2027)
- Affiliation comparateurs (Réassurez-moi, LesFurets, énergie)
- App PWA si justifié
- Vraies vidéos format avant/après pour TikTok organique

---

## 🎯 Objectif clarifié

Stratégie **mix** validée :
- **Phase 1 (4 semaines)** : 50 préinscriptions Founders. Focus acquisition gratuite (groupes FB, témoignages, lead magnet) + bugs/tracking.
- **Phase 2 (semaines 5-12)** : bascule monétisation. Stripe, Founder Pass 99€ à vie limité 100 places, parrainage.
- **Phase 3 (semaines 13+)** : scale. Blog SEO, affiliation, Meta Ads 50-200€/mois.

Budget disponible : **0-200€/mois** selon avancement.

---

## 📐 Architecture mini-scan (pattern à suivre)

Pour créer un nouveau mini-scan (ex: AAH) :

1. Ajouter le barème dans `src/lib/baremes-2026.ts` avec sources
2. Créer `src/lib/mini-scans/aah.ts` (questions + fonction `estimerAah(a)`)
3. Créer `src/app/aide/aah/page.tsx` (utilise `MiniScanFlow` + `MiniScanResult`)
4. Créer `src/app/aide/aah/layout.tsx` (metadata SEO)
5. Ajouter dans `src/components/dashboard/LeverCard.tsx` :
   ```ts
   const MINI_SCAN_URL: Record<string, string> = {
     // ... existants
     "AAH / PCH": "/aide/aah",
   };
   ```

Template à copier : `src/app/aide/cheque-energie/page.tsx` (le plus simple).

---

*Document créé le 25 mai 2026 pour reprise rapide du projet en nouvelle session.*

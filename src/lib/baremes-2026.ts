/**
 * Econia — Barèmes officiels 2026 (revalorisés au 1er avril 2026, +0,8%)
 *
 * Source unique de vérité pour tous les calculs d'aides et estimations.
 * Chaque valeur est sourcée. À mettre à jour à chaque revalorisation (avril chaque année).
 *
 * ⚠️ NE PAS MODIFIER les valeurs sans vérifier la source officielle.
 * 📅 Prochaine vérification obligatoire : avril 2027
 *
 * Sources officielles :
 *   - Décret n° 2026-222 du 30 mars 2026 (Prime activité)
 *     https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053733855
 *   - Décret n° 2026-220 du 30 mars 2026 (RSA)
 *     https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053733826
 *   - Décret n° 2025-1401 du 28 décembre 2025 (APL)
 *     https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053202812
 *   - service-public.fr/particuliers/actualites/A15599 (synthèse revalorisation)
 */

// ============================================================
// CONSTANTES TRANSVERSES
// ============================================================
export const SMIC_NET_2026 = 1442.4; // €/mois net
export const SMIC_NET_BONUS_MAX = 1658.76; // 1,15 × SMIC (plafond bonus prime activité)
export const TAUX_REVALORISATION_2026 = 0.008; // +0,8% au 1er avril 2026

// ============================================================
// PRIME D'ACTIVITÉ — Barème CAF avril 2026
// Source : Décret n° 2026-222 + caf.fr/allocataires/actualites
// ============================================================
export const PRIME_ACTIVITE_2026 = {
  /** Montant forfaitaire de base (personne seule, sans enfant) — €/mois (au 1er avril 2026) */
  forfaitBase: 638.28,

  /** Coefficient parent isolé (forfait × 1,28412) */
  coeffParentIsole: 1.28412,

  /** Majoration pour 1ère personne supplémentaire (conjoint/concubin) — facteur multiplicatif */
  majorationConjoint: 0.5, // +50%

  /** Majoration par enfant à charge (1er et 2ème) — facteur multiplicatif */
  majorationEnfant1et2: 0.3, // +30%

  /** Majoration par enfant supplémentaire (3ème et +) — facteur multiplicatif */
  majorationEnfant3plus: 0.4, // +40%

  /**
   * Forfait logement déduit si logé gratuitement ou propriétaire sans crédit — €/mois
   * Valeurs au 1er avril 2026 : 12% du forfait pour 1 pers, 24% pour 2, 30% pour 3+
   */
  forfaitLogementSeul: 76.59, // 12% de 638,28
  forfaitLogementCouple: 153.19, // 24%
  forfaitLogementFamille: 191.48, // 30%

  /** Bonus individuel maximum versé en plus du forfait (selon revenus du travail) — €/mois
   *  Réforme avril 2026 : gain moyen +50€/mois pour bénéficiaires entre SMIC et 1,15 SMIC */
  bonusMax: 232.61,

  /** Salaire minimum pour déclencher le bonus (~ 0,5 du SMIC net) — €/mois */
  seuilBonusMin: 721.2, // 0,5 × SMIC 2026

  /** Salaire pour bonus maximum (~ 1,15 SMIC net) — €/mois */
  seuilBonusMax: SMIC_NET_BONUS_MAX,

  /** Taux de prise en compte des revenus pro dans le calcul (déduction) */
  tauxRevenusPro: 0.61, // 61%

  /** Plafond de revenu mensuel au-delà duquel on perd toute prime (indicatif personne seule) */
  plafondRessourcesSeul: 1900,

  /** Source officielle pour redirection utilisateur */
  simulateurUrl: "https://wwwd.caf.fr/wps/portal/caffr/simulateurpa/",
  infoUrl: "https://www.service-public.fr/particuliers/vosdroits/F2882",
  decretUrl: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053733855",

  dateBareme: "2026-04-01",
  prochaineRevalorisation: "2027-04-01",
} as const;

// ============================================================
// RSA — Barème avril 2026
// Source : Décret n° 2026-220 du 30 mars 2026
// ============================================================
export const RSA_2026 = {
  forfaitBase: 651.69,

  /** Coefficient parent isolé (RSA majoré) : forfait × 1,28412 sur même base que Prime activité */
  coeffParentIsole: 1.28412,

  /** Majorations identiques à la Prime d'activité */
  majorationConjoint: 0.5,
  majorationEnfant1et2: 0.3,
  majorationEnfant3plus: 0.4,

  /** Forfait logement (mêmes pourcentages que Prime activité) */
  forfaitLogementSeul: 78.2, // 12% de 651,69
  forfaitLogementCouple: 156.41,
  forfaitLogementFamille: 195.51,

  /** Plafond ressources : revenus du foyer (3 derniers mois moyenne) */
  plafondRessourcesSeul: 651.69,
  plafondRessourcesCouple: 977.54, // 1,5 × forfait

  simulateurUrl: "https://www.mesdroitssociaux.gouv.fr/dnpf-portail-public/accueil",
  infoUrl: "https://www.service-public.fr/particuliers/vosdroits/F19778",
  decretUrl: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053733826",

  dateBareme: "2026-04-01",
  prochaineRevalorisation: "2027-04-01",
} as const;

// ============================================================
// APL — Aide Personnalisée au Logement (calcul complexe)
// Source : Décret n° 2025-1401 du 28 décembre 2025
// ============================================================
export const APL_2026 = {
  /**
   * Le calcul officiel de l'APL est complexe et dépend de :
   *  - Loyer plafonné selon la zone (1, 2, 3)
   *  - Composition du foyer
   *  - Ressources (3 derniers mois)
   *  - Patrimoine > 30 000€
   *
   * On utilise une approximation par paliers pour l'estimation MVP.
   * Marge d'erreur ±50€/mois — toujours rediriger vers le simulateur officiel.
   */

  /** Loyers plafonds mensuels par zone (personne seule, parc privé) — €/mois (2026) */
  loyerPlafond: {
    zone1: 326.07, // Paris + petite couronne
    zone2: 284.0, // Grandes agglos + Île-de-France hors zone 1
    zone3: 266.18, // reste de la France
  },

  /** Majoration loyer plafond pour couple */
  majorationLoyerCouple: 1.21, // +21%

  /** Majoration par personne à charge */
  majorationLoyerEnfant: 0.105, // +10,5% par enfant

  /** Patrimoine pris en compte au-dessus de ce seuil */
  seuilPatrimoine: 30000,

  simulateurUrl: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement",
  infoUrl: "https://www.service-public.fr/particuliers/vosdroits/F12006",
  decretUrl: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053202812",

  dateBareme: "2026-01-01",
  prochaineRevalorisation: "2027-01-01",
} as const;

// ============================================================
// ASPA — Minimum vieillesse 2026 (revalorisation +0,8% au 1er avril)
// Source : service-public.fr/particuliers/vosdroits/F16871
// ============================================================
export const ASPA_2026 = {
  montantSeul: 1052.47, // €/mois
  montantCouple: 1634.27, // €/mois
  plafondRessourcesSeul: 12629.6, // €/an
  plafondRessourcesCouple: 19611.21, // €/an
  ageMin: 65, // 60 ans si inaptitude au travail / handicap
  simulateurUrl: "https://www.lassuranceretraite.fr/portail-info/home/salaries/aides-allocations/aspa-spa.html",
  infoUrl: "https://www.service-public.fr/particuliers/vosdroits/F16871",
  dateBareme: "2026-04-01",
} as const;

// ============================================================
// ARS — Allocation de Rentrée Scolaire 2025-2026
// Source : caf.fr (versement août 2025, revalorisation prochaine août 2026)
// ============================================================
export const ARS_2025 = {
  /** Montants par tranche d'âge */
  montants: {
    "6-10": 416.4,
    "11-14": 439.38,
    "15-18": 454.6,
  },
  /** Plafond RFR (revenu fiscal de référence N-2) */
  plafondBase: 27141, // 1 enfant
  plafondParEnfantSupp: 6264, // +6264€ par enfant supplémentaire
  /** Versement différentiel possible si RFR juste au-dessus du plafond */
  margeVersementDifferentiel: 2000,
  simulateurUrl: "https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lafamille",
  infoUrl: "https://www.service-public.fr/particuliers/vosdroits/F1878",
  dateBareme: "2025-08-01",
  prochaineRevalorisation: "2026-08-01",
} as const;

// ============================================================
// CSS — Complémentaire Santé Solidaire 2026
// Source : complementaire-sante-solidaire.gouv.fr (plafonds 1er avril 2026)
// ============================================================
export const CSS_2026 = {
  /** Plafond ressources annuel pour CSS gratuite (sans participation) */
  plafondsGratuite: {
    "1": 10166, // 1 personne
    "2": 15249, // couple
    "3": 18299, // + 1 enfant
    "4": 21349, // + 2 enfants
  },
  /** Plafond ressources pour CSS avec participation (max 1€/jour/personne) */
  /** = plafond gratuit × 1,35 */
  coeffParticipation: 1.35,
  /** Participation journalière max selon âge (€/jour/personne) */
  participationParAge: {
    "moins29": 0.27,
    "30-49": 0.4,
    "50-59": 0.58,
    "60-69": 0.81,
    "70plus": 1.0,
  },
  simulateurUrl: "https://www.complementaire-sante-solidaire.gouv.fr/",
  infoUrl: "https://www.complementaire-sante-solidaire.gouv.fr/",
  dateBareme: "2026-04-01",
} as const;

// ============================================================
// LOI LEMOINE — Assurance emprunteur 2026
// Source : observatoires assurance emprunteur 2026 (Magnolia, Réassurez-moi, Meilleurtaux)
// ============================================================
export const LEMOINE_2026 = {
  /** Taux moyen contrat groupe bancaire en 2026 — TAEA (% du capital/an) */
  tauxBancaireMoyen: 0.4,

  /** Taux cible moyen en délégation 2026 — TAEA (% du capital/an)
   *  Représente un profil mixte (35-45 ans, fumeur ou non). À ajuster par âge/santé en pratique. */
  tauxDelegationCible: 0.25,

  /** Repères par profil (informatif — non utilisé dans le calcul simple) */
  reperesProfil: {
    "30nf": 0.07, // 30 ans non-fumeur
    "30f": 0.11, // 30 ans fumeur
    "40nf": 0.13, // 40 ans non-fumeur
    "40f": 0.19,
    "50nf": 0.3, // 50 ans non-fumeur
    "50f": 0.41,
  },

  /** Plafond loi Lemoine pour dispense de questionnaire médical */
  plafondSansQuestionnaire: 200000, // €/personne, remboursement avant 60 ans

  /** Référence légale loi Lemoine */
  loiLemoineDate: "2022-02-28",
  loiLemoineRef: "Loi n° 2022-270 du 28 février 2022",

  simulateurUrl: "https://reassurez-moi.fr/comparateur/assurance-emprunteur",
  infoUrl: "https://www.service-public.fr/particuliers/vosdroits/F32873",

  dateBareme: "2026-01-01",
  prochaineRevalorisation: "2027-01-01",
} as const;

// ============================================================
// CHÈQUE ÉNERGIE 2026
// Source : chequeenergie.gouv.fr (versement avril)
// ============================================================
export const CHEQUE_ENERGIE_2026 = {
  /** Plafond Revenu Fiscal de Référence par Unité de Consommation (RFR/UC) */
  plafondRfrParUc: 11000, // €/an
  /** Montants selon RFR/UC + nombre d'UC du foyer (table simplifiée) */
  /** UC = 1 (1er adulte) + 0,5 (2e adulte) + 0,3 (autres) */
  montants: {
    /** Très modestes (RFR/UC < 5 600€) */
    tresModeste: {
      "1uc": 194,
      "1.3uc": 240,
      "1.5uc": 277,
      "2uc": 277,
    },
    /** Modestes (5 600€ ≤ RFR/UC < 7 700€) */
    modeste: {
      "1uc": 146,
      "1.3uc": 176,
      "1.5uc": 202,
      "2uc": 202,
    },
    /** Limite haute (7 700€ ≤ RFR/UC < 11 000€) */
    limite: {
      "1uc": 48,
      "1.3uc": 63,
      "1.5uc": 76,
      "2uc": 76,
    },
  },
  simulateurUrl: "https://chequeenergie.gouv.fr/beneficiaire/eligibilite",
  infoUrl: "https://chequeenergie.gouv.fr/",
  dateBareme: "2026-04-01",
} as const;

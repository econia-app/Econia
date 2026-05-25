/**
 * Mini-scan Prime d'activité — barème CAF 2026
 *
 * 5 questions ciblées pour estimer le montant mensuel de Prime d'activité
 * auquel l'utilisateur pourrait avoir droit.
 *
 * ⚠️ AVERTISSEMENT : l'algorithme est une approximation simplifiée. Le calcul
 * officiel est plus complexe (revenus 3 derniers mois, autres aides, etc.).
 * Marge d'erreur ~±30€/mois. Toujours rediriger vers le simulateur officiel CAF
 * pour la confirmation. Documenter visiblement "estimation indicative".
 */
import { PRIME_ACTIVITE_2026 } from "@/lib/baremes-2026";

export type MiniScanQuestion = {
  id: string;
  q: string;
  sub?: string;
  options: { value: string; label: string }[];
};

export const primeActiviteQuestions: MiniScanQuestion[] = [
  {
    id: "situation",
    q: "Votre situation familiale ?",
    options: [
      { value: "seul", label: "Seul·e" },
      { value: "couple_1actif", label: "En couple (1 seul revenu)" },
      { value: "couple_2actifs", label: "En couple (2 revenus)" },
    ],
  },
  {
    id: "enfants",
    q: "Combien d'enfants à charge ?",
    sub: "(moins de 25 ans, à charge fiscalement)",
    options: [
      { value: "0", label: "Aucun" },
      { value: "1", label: "1 enfant" },
      { value: "2", label: "2 enfants" },
      { value: "3+", label: "3 enfants ou plus" },
    ],
  },
  {
    id: "salaire",
    q: "Salaire net mensuel (foyer entier) ?",
    sub: "Si vous êtes en couple, additionnez les deux salaires",
    options: [
      { value: "moins800", label: "Moins de 800€" },
      { value: "800-1200", label: "800 — 1 200€" },
      { value: "1200-1500", label: "1 200 — 1 500€" },
      { value: "1500-1900", label: "1 500 — 1 900€" },
      { value: "1900-2400", label: "1 900 — 2 400€" },
      { value: "2400-3000", label: "2 400 — 3 000€" },
      { value: "plus3000", label: "Plus de 3 000€" },
    ],
  },
  {
    id: "statut",
    q: "Votre statut professionnel ?",
    options: [
      { value: "salarie", label: "Salarié·e" },
      { value: "independant", label: "Indépendant·e / auto-entrepreneur" },
      { value: "cumul", label: "Salarié·e + activité indépendante" },
      { value: "autre", label: "Autre (étudiant·e, intérim, chômage…)" },
    ],
  },
  {
    id: "logement",
    q: "Votre logement ?",
    options: [
      { value: "locataire", label: "Locataire (avec ou sans APL)" },
      { value: "proprio_credit", label: "Propriétaire avec crédit" },
      { value: "proprio_sans", label: "Propriétaire sans crédit" },
      { value: "heberge", label: "Hébergé gratuitement" },
    ],
  },
];

export type PrimeActiviteEstimation = {
  /** Montant mensuel estimé en € (arrondi à la dizaine) */
  montantMensuel: number;
  /** Montant annuel estimé */
  montantAnnuel: number;
  /** Tu es éligible ? (montant > 0) */
  eligible: boolean;
  /** Code d'éligibilité pour message contextuel */
  cas: "eligible_fort" | "eligible_moyen" | "eligible_faible" | "non_eligible_revenus" | "non_eligible_statut";
  /** Notes pédagogiques selon le profil */
  notes: string[];
};

/**
 * Calcule l'estimation de Prime d'activité à partir des réponses.
 *
 * Méthode : barème forfaitaire majoré selon composition foyer, déduction
 * 61% des ressources (formule simplifiée du décret 2025).
 * Sources : service-public.fr/F2882 + caf.fr.
 */
export function estimerPrimeActivite(a: Record<string, string>): PrimeActiviteEstimation {
  const B = PRIME_ACTIVITE_2026;
  const notes: string[] = [];

  // Filtre statut non éligible
  if (a.statut === "autre") {
    return {
      montantMensuel: 0,
      montantAnnuel: 0,
      eligible: false,
      cas: "non_eligible_statut",
      notes: [
        "La Prime d'activité s'adresse aux personnes ayant une activité professionnelle (salariée ou indépendante).",
        "Si vous êtes au chômage ou étudiant·e, regardez plutôt vers le RSA, l'ARE ou les aides spécifiques étudiants.",
      ],
    };
  }

  // === Estimation du salaire mensuel (médian du segment) ===
  const segments: Record<string, number> = {
    moins800: 600,
    "800-1200": 1000,
    "1200-1500": 1350,
    "1500-1900": 1700,
    "1900-2400": 2150,
    "2400-3000": 2700,
    plus3000: 3300,
  };
  const salaire = segments[a.salaire] ?? 1500;

  // === Forfait de base majoré ===
  let forfait = B.forfaitBase;

  const enCouple = a.situation === "couple_1actif" || a.situation === "couple_2actifs";
  if (enCouple) forfait += B.forfaitBase * B.majorationConjoint;

  const nbEnfants = a.enfants === "3+" ? 3 : parseInt(a.enfants ?? "0", 10);
  if (nbEnfants >= 1) forfait += B.forfaitBase * B.majorationEnfant1et2;
  if (nbEnfants >= 2) forfait += B.forfaitBase * B.majorationEnfant1et2;
  if (nbEnfants >= 3) forfait += (nbEnfants - 2) * B.forfaitBase * B.majorationEnfant3plus;

  // === Forfait logement (déduit si pas de loyer à payer) ===
  if (a.logement === "proprio_sans" || a.logement === "heberge") {
    const taillefoyer = (enCouple ? 1 : 0) + 1 + nbEnfants;
    if (taillefoyer >= 3) forfait -= B.forfaitLogementFamille;
    else if (taillefoyer === 2) forfait -= B.forfaitLogementCouple;
    else forfait -= B.forfaitLogementSeul;
  }

  // === Bonus individuel selon revenus du travail ===
  // Réparti entre les actifs si couple 2 actifs
  const nbActifs = a.situation === "couple_2actifs" ? 2 : 1;
  const salaireParActif = salaire / nbActifs;
  let bonusParActif = 0;
  if (salaireParActif >= B.seuilBonusMax) {
    bonusParActif = B.bonusMax;
  } else if (salaireParActif >= B.seuilBonusMin) {
    bonusParActif =
      B.bonusMax * ((salaireParActif - B.seuilBonusMin) / (B.seuilBonusMax - B.seuilBonusMin));
  }
  const bonusTotal = bonusParActif * nbActifs;

  // === Formule finale ===
  const prime = Math.max(0, forfait + bonusTotal - B.tauxRevenusPro * salaire);

  // === Arrondi à la dizaine pour ne pas suggérer une fausse précision ===
  const montantMensuel = Math.round(prime / 10) * 10;
  const montantAnnuel = montantMensuel * 12;

  // === Notes pédagogiques selon le profil ===
  if (a.logement === "locataire") {
    notes.push("💡 Si vous touchez l'APL, votre Prime d'activité peut être un peu inférieure à cette estimation (forfait logement déduit).");
  }
  if (a.statut === "independant" || a.statut === "cumul") {
    notes.push("📊 Pour les indépendants, la Prime d'activité se calcule sur le bénéfice (et non le chiffre d'affaires). Le résultat ici est basé sur votre revenu net déclaré.");
  }
  if (nbEnfants > 0 && montantMensuel > 0) {
    notes.push("👶 Si vous gardez vos enfants chez une assistante maternelle, pensez à vérifier le CMG (Complément de mode de garde) sur urssaf.fr.");
  }
  if (montantMensuel === 0 && salaire > 1700) {
    notes.push("Votre revenu dépasse le seuil d'éligibilité. La Prime d'activité décroît progressivement avec les revenus.");
  }

  // === Catégorisation du cas ===
  let cas: PrimeActiviteEstimation["cas"];
  if (montantMensuel === 0) {
    cas = salaire > 2000 ? "non_eligible_revenus" : "non_eligible_statut";
  } else if (montantMensuel >= 250) {
    cas = "eligible_fort";
  } else if (montantMensuel >= 100) {
    cas = "eligible_moyen";
  } else {
    cas = "eligible_faible";
  }

  return {
    montantMensuel,
    montantAnnuel,
    eligible: montantMensuel > 0,
    cas,
    notes,
  };
}

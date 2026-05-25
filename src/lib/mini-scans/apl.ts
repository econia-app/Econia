/**
 * Mini-scan APL — barème CAF 2026
 *
 * 5 questions ciblées pour estimer l'APL mensuelle.
 * Source : Décret n° 2025-1401 du 28 décembre 2025.
 *
 * ⚠️ AVERTISSEMENT : le calcul officiel de l'APL est extrêmement complexe
 * (loyer plafond par zone, ressources sur 12 mois glissants, patrimoine,
 * abattement spécifique étudiant, etc.). Cette estimation utilise une
 * formule très simplifiée — marge d'erreur ±100€/mois. Toujours rediriger
 * vers le simulateur officiel CAF pour la confirmation.
 */
import { APL_2026 } from "@/lib/baremes-2026";

export type MiniScanQuestion = {
  id: string;
  q: string;
  sub?: string;
  options: { value: string; label: string }[];
};

export const aplQuestions: MiniScanQuestion[] = [
  {
    id: "statutLogement",
    q: "Votre situation logement ?",
    options: [
      { value: "locataire", label: "Locataire (parc privé ou social)" },
      { value: "colocation", label: "Colocation (chacun avec son bail)" },
      { value: "residence_etudiante", label: "Résidence étudiante / Crous" },
      { value: "autre", label: "Hébergé / propriétaire / autre" },
    ],
  },
  {
    id: "zone",
    q: "Dans quelle zone se trouve votre logement ?",
    sub: "La zone est définie par la commune. Voir caf.fr en cas de doute.",
    options: [
      { value: "zone1", label: "Paris + petite couronne (75, 92)" },
      { value: "zone2", label: "Grandes agglos (Lyon, Marseille, Toulouse…) + Île-de-France hors zone 1" },
      { value: "zone3", label: "Reste de la France (villes moyennes, rural)" },
    ],
  },
  {
    id: "loyer",
    q: "Quel est votre loyer mensuel (hors charges) ?",
    options: [
      { value: "moins300", label: "Moins de 300€" },
      { value: "300-500", label: "300 — 500€" },
      { value: "500-700", label: "500 — 700€" },
      { value: "700-1000", label: "700 — 1 000€" },
      { value: "plus1000", label: "Plus de 1 000€" },
    ],
  },
  {
    id: "foyer",
    q: "Combien de personnes vivent dans le logement ?",
    sub: "Vous-même + conjoint·e + enfants à charge",
    options: [
      { value: "1", label: "1 personne (seul·e)" },
      { value: "2", label: "2 personnes" },
      { value: "3", label: "3 personnes" },
      { value: "4plus", label: "4 personnes ou plus" },
    ],
  },
  {
    id: "ressources",
    q: "Ressources mensuelles du foyer ?",
    sub: "Salaires + autres revenus (12 derniers mois moyenne mensuelle)",
    options: [
      { value: "moins800", label: "Moins de 800€" },
      { value: "800-1200", label: "800 — 1 200€" },
      { value: "1200-1700", label: "1 200 — 1 700€" },
      { value: "1700-2300", label: "1 700 — 2 300€" },
      { value: "2300-3000", label: "2 300 — 3 000€" },
      { value: "plus3000", label: "Plus de 3 000€" },
    ],
  },
];

export type AplEstimation = {
  montantMensuel: number;
  montantAnnuel: number;
  eligible: boolean;
  cas: "eligible_fort" | "eligible_moyen" | "eligible_faible" | "non_eligible_statut" | "non_eligible_ressources";
  notes: string[];
};

export function estimerApl(a: Record<string, string>): AplEstimation {
  const B = APL_2026;
  const notes: string[] = [];

  // === Exclusion statut non éligible (propriétaire / hébergé) ===
  if (a.statutLogement === "autre") {
    return {
      montantMensuel: 0,
      montantAnnuel: 0,
      eligible: false,
      cas: "non_eligible_statut",
      notes: [
        "L'APL concerne les locataires (parc privé ou social). Si vous êtes propriétaire de votre résidence principale avec un crédit conventionné, vérifiez plutôt l'APL accession.",
        "Si vous êtes hébergé gratuitement, vous n'avez pas droit à l'APL.",
      ],
    };
  }

  // === Loyer plafonné selon zone + composition ===
  const zone = (a.zone || "zone3") as keyof typeof B.loyerPlafond;
  let loyerPlafond = B.loyerPlafond[zone];

  const nbPersonnes = a.foyer === "4plus" ? 4 : parseInt(a.foyer ?? "1", 10);
  if (nbPersonnes >= 2) {
    loyerPlafond *= B.majorationLoyerCouple;
  }
  if (nbPersonnes >= 3) {
    loyerPlafond *= 1 + (nbPersonnes - 2) * B.majorationLoyerEnfant;
  }

  // === Loyer réel (médian du segment) ===
  const segmentsLoyer: Record<string, number> = {
    moins300: 250,
    "300-500": 400,
    "500-700": 600,
    "700-1000": 850,
    plus1000: 1200,
  };
  const loyerReel = segmentsLoyer[a.loyer] ?? 600;
  const loyerPrisEnCompte = Math.min(loyerReel, loyerPlafond);

  // === Ressources mensuelles ===
  const segmentsRessources: Record<string, number> = {
    moins800: 600,
    "800-1200": 1000,
    "1200-1700": 1450,
    "1700-2300": 2000,
    "2300-3000": 2650,
    plus3000: 3500,
  };
  const ressources = segmentsRessources[a.ressources] ?? 1500;

  // === Formule très simplifiée (approximation) ===
  // APL ≈ loyer plafonné - taux d'effort sur ressources
  // Taux d'effort varie selon ressources : ~0.30 si revenus bas, ~0.45 si moyens, ~0.55 si élevés
  let tauxEffort: number;
  if (ressources < 1000) tauxEffort = 0.15;
  else if (ressources < 1500) tauxEffort = 0.27;
  else if (ressources < 2000) tauxEffort = 0.38;
  else if (ressources < 2500) tauxEffort = 0.48;
  else tauxEffort = 0.58;

  const partRessources = ressources * tauxEffort;
  const apl = Math.max(0, loyerPrisEnCompte - partRessources);

  // === Bonus colocation / résidence étudiante : -10% (formule réduite officielle)
  let aplAjustee = apl;
  if (a.statutLogement === "colocation" || a.statutLogement === "residence_etudiante") {
    aplAjustee *= 0.9;
  }

  const montantMensuel = Math.round(aplAjustee / 10) * 10;
  const montantAnnuel = montantMensuel * 12;

  // === Notes ===
  if (loyerReel > loyerPlafond) {
    notes.push(`💡 Votre loyer (~${loyerReel}€) dépasse le plafond pris en compte pour votre zone (${Math.round(loyerPlafond)}€). L'APL ne couvrira pas la totalité.`);
  }
  if (a.statutLogement === "residence_etudiante") {
    notes.push("🎓 Pour les étudiants en résidence Crous, l'APL est versée directement au logeur. Démarche via le Crous.");
  }
  if (a.statutLogement === "colocation") {
    notes.push("🤝 En colocation avec baux séparés, chaque colocataire fait sa propre demande sur caf.fr.");
  }
  if (ressources < 800) {
    notes.push("Vous pourriez aussi être éligible au RSA ou à la Prime d'activité. Faites un scan complet sur Econia.");
  }

  let cas: AplEstimation["cas"];
  if (montantMensuel === 0) {
    cas = "non_eligible_ressources";
  } else if (montantMensuel >= 250) {
    cas = "eligible_fort";
  } else if (montantMensuel >= 100) {
    cas = "eligible_moyen";
  } else {
    cas = "eligible_faible";
  }

  return { montantMensuel, montantAnnuel, eligible: montantMensuel > 0, cas, notes };
}

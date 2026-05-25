/**
 * Mini-scan RSA — barème CAF avril 2026
 *
 * 5 questions ciblées pour estimer le RSA mensuel.
 * Source : Décret n° 2026-220 du 30 mars 2026.
 *
 * ⚠️ Estimation indicative — calcul officiel sur mesdroitssociaux.gouv.fr
 */
import { RSA_2026 } from "@/lib/baremes-2026";

export type MiniScanQuestion = {
  id: string;
  q: string;
  sub?: string;
  options: { value: string; label: string }[];
};

export const rsaQuestions: MiniScanQuestion[] = [
  {
    id: "age",
    q: "Quel âge avez-vous ?",
    sub: "Le RSA est ouvert à partir de 25 ans (ou avant sous conditions spécifiques)",
    options: [
      { value: "moins25_parent", label: "Moins de 25 ans, parent d'1 enfant" },
      { value: "moins25_actif", label: "Moins de 25 ans, ayant travaillé ≥ 2 ans" },
      { value: "moins25_autre", label: "Moins de 25 ans, autre cas" },
      { value: "25plus", label: "25 ans ou plus" },
    ],
  },
  {
    id: "situation",
    q: "Votre situation familiale ?",
    options: [
      { value: "seul", label: "Seul·e" },
      { value: "parent_isole", label: "Parent isolé·e (vit seul·e avec enfants)" },
      { value: "couple", label: "En couple" },
    ],
  },
  {
    id: "enfants",
    q: "Combien d'enfants à charge ?",
    sub: "Enfants de moins de 25 ans à charge fiscalement",
    options: [
      { value: "0", label: "Aucun" },
      { value: "1", label: "1 enfant" },
      { value: "2", label: "2 enfants" },
      { value: "3+", label: "3 enfants ou plus" },
    ],
  },
  {
    id: "ressources",
    q: "Ressources mensuelles du foyer ?",
    sub: "Salaires, allocations chômage, pensions, AAH, retraites… (3 derniers mois)",
    options: [
      { value: "0", label: "Aucune ressource" },
      { value: "moins300", label: "Moins de 300€" },
      { value: "300-600", label: "300 — 600€" },
      { value: "600-900", label: "600 — 900€" },
      { value: "900-1200", label: "900 — 1 200€" },
      { value: "plus1200", label: "Plus de 1 200€" },
    ],
  },
  {
    id: "logement",
    q: "Votre logement ?",
    options: [
      { value: "locataire", label: "Locataire (avec ou sans APL)" },
      { value: "proprio_credit", label: "Propriétaire avec crédit en cours" },
      { value: "proprio_sans", label: "Propriétaire sans crédit" },
      { value: "heberge", label: "Hébergé gratuitement" },
    ],
  },
];

export type RsaEstimation = {
  montantMensuel: number;
  montantAnnuel: number;
  eligible: boolean;
  cas: "eligible_fort" | "eligible_moyen" | "eligible_faible" | "non_eligible_age" | "non_eligible_ressources";
  notes: string[];
};

export function estimerRsa(a: Record<string, string>): RsaEstimation {
  const B = RSA_2026;
  const notes: string[] = [];

  // === Vérification d'âge ===
  if (a.age === "moins25_autre") {
    return {
      montantMensuel: 0,
      montantAnnuel: 0,
      eligible: false,
      cas: "non_eligible_age",
      notes: [
        "Le RSA n'est ouvert qu'à partir de 25 ans, sauf si vous êtes parent ou avez travaillé au moins 2 ans à temps plein dans les 3 dernières années.",
        "Si vous êtes étudiant·e ou jeune actif·ve, regardez le RSA jeune actif, la Garantie jeunes ou le contrat d'engagement jeune.",
      ],
    };
  }

  // === Forfait majoré selon composition ===
  let forfait = B.forfaitBase;

  const enCouple = a.situation === "couple";
  const parentIsole = a.situation === "parent_isole";
  if (enCouple) forfait += B.forfaitBase * B.majorationConjoint;

  const nbEnfants = a.enfants === "3+" ? 3 : parseInt(a.enfants ?? "0", 10);
  if (nbEnfants >= 1) forfait += B.forfaitBase * B.majorationEnfant1et2;
  if (nbEnfants >= 2) forfait += B.forfaitBase * B.majorationEnfant1et2;
  if (nbEnfants >= 3) forfait += (nbEnfants - 2) * B.forfaitBase * B.majorationEnfant3plus;

  if (parentIsole) {
    forfait *= B.coeffParentIsole;
  }

  // === Forfait logement ===
  if (a.logement === "proprio_sans" || a.logement === "heberge") {
    const taillefoyer = (enCouple ? 1 : 0) + 1 + nbEnfants;
    if (taillefoyer >= 3) forfait -= B.forfaitLogementFamille;
    else if (taillefoyer === 2) forfait -= B.forfaitLogementCouple;
    else forfait -= B.forfaitLogementSeul;
  }

  // === Ressources du foyer (médian du segment) ===
  const segmentsRessources: Record<string, number> = {
    "0": 0,
    moins300: 150,
    "300-600": 450,
    "600-900": 750,
    "900-1200": 1050,
    plus1200: 1500,
  };
  const ressources = segmentsRessources[a.ressources] ?? 0;

  // === RSA = forfait majoré - ressources (formule simplifiée)
  const rsa = Math.max(0, forfait - ressources);
  const montantMensuel = Math.round(rsa / 10) * 10;
  const montantAnnuel = montantMensuel * 12;

  // === Notes ===
  if (a.logement === "locataire") {
    notes.push("💡 Si vous touchez l'APL, le forfait logement est déduit (environ 78€/mois pour 1 personne).");
  }
  if (parentIsole) {
    notes.push("👨‍👧 Le RSA majoré parent isolé est versé pendant 12 mois (renouvelable selon situation).");
  }
  if (montantMensuel === 0 && ressources > 600) {
    notes.push("Vos ressources dépassent le seuil. Pensez à vérifier la Prime d'activité si vous travaillez.");
  }
  if (a.age === "moins25_parent" || a.age === "moins25_actif") {
    notes.push("🎯 Vous êtes éligible au RSA jeune actif sous conditions. Vérifiez avec la CAF.");
  }

  let cas: RsaEstimation["cas"];
  if (montantMensuel === 0) {
    cas = "non_eligible_ressources";
  } else if (montantMensuel >= 500) {
    cas = "eligible_fort";
  } else if (montantMensuel >= 250) {
    cas = "eligible_moyen";
  } else {
    cas = "eligible_faible";
  }

  return { montantMensuel, montantAnnuel, eligible: montantMensuel > 0, cas, notes };
}

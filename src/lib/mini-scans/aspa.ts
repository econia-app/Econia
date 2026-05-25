/**
 * Mini-scan ASPA — Minimum vieillesse 2026
 * Source : service-public.fr/F16871
 */
import { ASPA_2026 } from "@/lib/baremes-2026";

export type MiniScanQuestion = {
  id: string;
  q: string;
  sub?: string;
  options: { value: string; label: string }[];
};

export const aspaQuestions: MiniScanQuestion[] = [
  {
    id: "age",
    q: "Quel âge avez-vous ?",
    sub: "L'ASPA est ouverte à partir de 65 ans (60 ans en cas d'inaptitude au travail)",
    options: [
      { value: "moins60", label: "Moins de 60 ans" },
      { value: "60-64_inapte", label: "60 à 64 ans, en situation de handicap/inaptitude" },
      { value: "60-64_autre", label: "60 à 64 ans, autre situation" },
      { value: "65plus", label: "65 ans ou plus" },
    ],
  },
  {
    id: "situation",
    q: "Votre situation familiale ?",
    options: [
      { value: "seul", label: "Seul·e (ou veuf·ve)" },
      { value: "couple", label: "En couple (marié, pacsé, concubinage)" },
    ],
  },
  {
    id: "ressources",
    q: "Ressources mensuelles totales du foyer ?",
    sub: "Retraites + revenus + pensions + capitaux placés (3 derniers mois en moyenne)",
    options: [
      { value: "moins500", label: "Moins de 500€" },
      { value: "500-800", label: "500 — 800€" },
      { value: "800-1000", label: "800 — 1 000€" },
      { value: "1000-1300", label: "1 000 — 1 300€" },
      { value: "1300-1600", label: "1 300 — 1 600€" },
      { value: "plus1600", label: "Plus de 1 600€" },
    ],
  },
];

export type AspaEstimation = {
  montantMensuel: number;
  montantAnnuel: number;
  eligible: boolean;
  cas: "eligible_complet" | "eligible_differentiel" | "non_eligible_age" | "non_eligible_ressources";
  notes: string[];
};

export function estimerAspa(a: Record<string, string>): AspaEstimation {
  const B = ASPA_2026;
  const notes: string[] = [];

  // Vérification d'âge
  if (a.age === "moins60" || a.age === "60-64_autre") {
    return {
      montantMensuel: 0,
      montantAnnuel: 0,
      eligible: false,
      cas: "non_eligible_age",
      notes: [
        "L'ASPA est versée à partir de 65 ans (ou 60 ans en cas d'inaptitude au travail reconnue).",
        "Avant 65 ans, vérifiez vos droits à l'ASI (Allocation Supplémentaire d'Invalidité) ou l'AAH.",
      ],
    };
  }

  const enCouple = a.situation === "couple";
  const plafondMensuel = enCouple ? B.montantCouple : B.montantSeul;

  // Estimation ressources mensuelles
  const ressourcesSegments: Record<string, number> = {
    moins500: 300,
    "500-800": 650,
    "800-1000": 900,
    "1000-1300": 1150,
    "1300-1600": 1450,
    plus1600: 1800,
  };
  const ressources = ressourcesSegments[a.ressources] ?? 1000;

  // ASPA = plafond - ressources (versement différentiel)
  const aspa = Math.max(0, plafondMensuel - ressources);
  const montantMensuel = Math.round(aspa / 10) * 10;
  const montantAnnuel = montantMensuel * 12;

  // Catégorisation
  let cas: AspaEstimation["cas"];
  if (montantMensuel === 0) {
    cas = "non_eligible_ressources";
    notes.push(`Le plafond mensuel ${enCouple ? "couple" : "seul"} est de ${Math.round(plafondMensuel)}€. Tes ressources le dépassent.`);
  } else if (montantMensuel >= plafondMensuel * 0.5) {
    cas = "eligible_complet";
    notes.push("✅ Versement mensuel à demander auprès de ta caisse de retraite (CNAV, MSA, etc.).");
  } else {
    cas = "eligible_differentiel";
    notes.push("💡 ASPA différentielle : elle complète tes ressources pour atteindre le plafond.");
  }

  notes.push("⚠️ Important : l'ASPA est récupérable sur succession au-delà de 39 000€ (héritage). À considérer avant de la demander.");

  if (a.age === "60-64_inapte") {
    notes.push("📋 Pour une demande avant 65 ans, il faut une reconnaissance d'inaptitude par la CPAM (taux ≥ 50%).");
  }

  return { montantMensuel, montantAnnuel, eligible: montantMensuel > 0, cas, notes };
}

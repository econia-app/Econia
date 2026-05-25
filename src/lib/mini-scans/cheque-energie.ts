/**
 * Mini-scan Chèque énergie 2026
 * Source : chequeenergie.gouv.fr (versement avril, plafond RFR/UC = 11 000€)
 */
import { CHEQUE_ENERGIE_2026 } from "@/lib/baremes-2026";

export type MiniScanQuestion = {
  id: string;
  q: string;
  sub?: string;
  options: { value: string; label: string }[];
};

export const chequeEnergieQuestions: MiniScanQuestion[] = [
  {
    id: "foyer",
    q: "Combien d'adultes au foyer ?",
    options: [
      { value: "1", label: "1 adulte (seul·e)" },
      { value: "2", label: "2 adultes (couple)" },
      { value: "3plus", label: "3 adultes ou plus" },
    ],
  },
  {
    id: "enfants",
    q: "Combien d'enfants à charge ?",
    options: [
      { value: "0", label: "Aucun" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3plus", label: "3 ou plus" },
    ],
  },
  {
    id: "rfr",
    q: "Revenu fiscal de référence N-1 du foyer ?",
    sub: "En bas de ton avis d'imposition 2025 sur les revenus 2024",
    options: [
      { value: "moins10k", label: "Moins de 10 000€" },
      { value: "10-15k", label: "10 000 — 15 000€" },
      { value: "15-20k", label: "15 000 — 20 000€" },
      { value: "20-25k", label: "20 000 — 25 000€" },
      { value: "25-30k", label: "25 000 — 30 000€" },
      { value: "plus30k", label: "Plus de 30 000€" },
    ],
  },
];

export type ChequeEnergieEstimation = {
  montant: number;
  eligible: boolean;
  cas: "tres_modeste" | "modeste" | "limite" | "non_eligible";
  rfrParUc: number;
  uc: number;
  notes: string[];
};

export function estimerChequeEnergie(a: Record<string, string>): ChequeEnergieEstimation {
  const B = CHEQUE_ENERGIE_2026;
  const notes: string[] = [];

  // Calcul des Unités de Consommation (UC)
  // 1er adulte = 1 UC, 2e adulte = 0,5 UC, enfants = 0,3 UC chacun
  const nbAdultes = a.foyer === "3plus" ? 3 : parseInt(a.foyer ?? "1", 10);
  const nbEnfants = a.enfants === "3plus" ? 3 : parseInt(a.enfants ?? "0", 10);
  let uc = 1; // 1er adulte
  if (nbAdultes >= 2) uc += 0.5;
  if (nbAdultes >= 3) uc += (nbAdultes - 2) * 0.3;
  uc += nbEnfants * 0.3;

  // RFR
  const rfrSegments: Record<string, number> = {
    moins10k: 8000,
    "10-15k": 12500,
    "15-20k": 17500,
    "20-25k": 22500,
    "25-30k": 27500,
    plus30k: 35000,
  };
  const rfr = rfrSegments[a.rfr] ?? 20000;
  const rfrParUc = rfr / uc;

  // Détermine le segment du barème
  // Très modeste : RFR/UC < 5 600€
  // Modeste : 5 600 — 7 700€
  // Limite : 7 700 — 11 000€
  // Non éligible : > 11 000€
  let segment: keyof typeof B.montants | null = null;
  let cas: ChequeEnergieEstimation["cas"];

  if (rfrParUc < 5600) {
    segment = "tresModeste";
    cas = "tres_modeste";
  } else if (rfrParUc < 7700) {
    segment = "modeste";
    cas = "modeste";
  } else if (rfrParUc < B.plafondRfrParUc) {
    segment = "limite";
    cas = "limite";
  } else {
    cas = "non_eligible";
  }

  // Détermine la tranche UC
  let trancheUc: "1uc" | "1.3uc" | "1.5uc" | "2uc";
  if (uc < 1.3) trancheUc = "1uc";
  else if (uc < 1.5) trancheUc = "1.3uc";
  else if (uc < 2) trancheUc = "1.5uc";
  else trancheUc = "2uc";

  const montant = segment ? B.montants[segment][trancheUc] : 0;

  // Notes pédagogiques
  if (montant > 0) {
    notes.push("✅ Versement automatique en avril si tu déclares tes revenus à l'administration fiscale.");
    notes.push("💡 Le chèque peut être utilisé pour ton électricité, ton gaz, ton fioul, ou des travaux d'isolation.");
  } else {
    notes.push(`Ton RFR/UC est de ${Math.round(rfrParUc).toLocaleString()}€. Le plafond éligible est de 11 000€/UC.`);
    notes.push("Pense au chèque énergie exceptionnel ou aux tarifs sociaux EDF/Engie si tu es en difficulté ponctuelle.");
  }

  return { montant, eligible: montant > 0, cas, rfrParUc: Math.round(rfrParUc), uc, notes };
}

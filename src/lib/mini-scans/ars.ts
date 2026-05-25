/**
 * Mini-scan ARS — Allocation de Rentrée Scolaire 2025-2026
 * Source : caf.fr + service-public.fr/F1878
 */
import { ARS_2025 } from "@/lib/baremes-2026";

export type MiniScanQuestion = {
  id: string;
  q: string;
  sub?: string;
  options: { value: string; label: string }[];
};

export const arsQuestions: MiniScanQuestion[] = [
  {
    id: "enfants_6_10",
    q: "Enfants de 6 à 10 ans à charge ?",
    options: [
      { value: "0", label: "Aucun" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3+", label: "3 ou plus" },
    ],
  },
  {
    id: "enfants_11_14",
    q: "Enfants de 11 à 14 ans à charge ?",
    options: [
      { value: "0", label: "Aucun" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3+", label: "3 ou plus" },
    ],
  },
  {
    id: "enfants_15_18",
    q: "Adolescents de 15 à 18 ans à charge ?",
    options: [
      { value: "0", label: "Aucun" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3+", label: "3 ou plus" },
    ],
  },
  {
    id: "rfr",
    q: "Revenu fiscal de référence N-2 (2023) ?",
    sub: "Trouvable en bas de votre avis d'imposition 2024 sur les revenus 2023",
    options: [
      { value: "moins25k", label: "Moins de 25 000€" },
      { value: "25-30k", label: "25 000 — 30 000€" },
      { value: "30-40k", label: "30 000 — 40 000€" },
      { value: "40-50k", label: "40 000 — 50 000€" },
      { value: "plus50k", label: "Plus de 50 000€" },
    ],
  },
];

export type ArsEstimation = {
  montantUnique: number; // versement annuel ponctuel
  montantAnnuel: number; // = montantUnique pour ARS
  eligible: boolean;
  cas: "eligible_complet" | "eligible_differentiel" | "non_eligible_revenus" | "non_eligible_enfants";
  notes: string[];
};

function parseEnfants(v?: string): number {
  if (!v) return 0;
  if (v === "3+") return 3;
  return parseInt(v, 10);
}

export function estimerArs(a: Record<string, string>): ArsEstimation {
  const B = ARS_2025;
  const notes: string[] = [];

  const n6_10 = parseEnfants(a.enfants_6_10);
  const n11_14 = parseEnfants(a.enfants_11_14);
  const n15_18 = parseEnfants(a.enfants_15_18);
  const nbEnfants = n6_10 + n11_14 + n15_18;

  if (nbEnfants === 0) {
    return {
      montantUnique: 0,
      montantAnnuel: 0,
      eligible: false,
      cas: "non_eligible_enfants",
      notes: [
        "L'ARS est versée pour chaque enfant scolarisé de 6 à 18 ans (ou inscrit en CFA/apprentissage).",
        "Pas d'enfant dans cette tranche d'âge ? Pas d'ARS pour vous cette année.",
      ],
    };
  }

  // Plafond ressources selon nombre d'enfants
  const plafond = B.plafondBase + (nbEnfants - 1) * B.plafondParEnfantSupp;

  // Estimation du RFR
  const rfrSegments: Record<string, number> = {
    moins25k: 22000,
    "25-30k": 27500,
    "30-40k": 35000,
    "40-50k": 45000,
    plus50k: 60000,
  };
  const rfr = rfrSegments[a.rfr] ?? 30000;

  // Calcul du montant total (versement intégral si sous plafond)
  const montantTotal =
    n6_10 * B.montants["6-10"] +
    n11_14 * B.montants["11-14"] +
    n15_18 * B.montants["15-18"];

  let montantUnique = 0;
  let cas: ArsEstimation["cas"];

  if (rfr <= plafond) {
    // Versement intégral
    montantUnique = Math.round(montantTotal);
    cas = "eligible_complet";
    notes.push("✅ Versement automatique entre le 20 août et début septembre, sans démarche si vous êtes déjà allocataire CAF.");
  } else if (rfr <= plafond + B.margeVersementDifferentiel) {
    // Versement différentiel (cas rares)
    const ratio = (plafond + B.margeVersementDifferentiel - rfr) / B.margeVersementDifferentiel;
    montantUnique = Math.round(montantTotal * ratio);
    cas = "eligible_differentiel";
    notes.push("📉 Vos revenus dépassent légèrement le plafond. Vous recevrez un versement différentiel (montant réduit).");
  } else {
    montantUnique = 0;
    cas = "non_eligible_revenus";
    notes.push(`Le plafond pour ${nbEnfants} enfant(s) est de ${plafond.toLocaleString()}€. Vos revenus dépassent ce seuil.`);
  }

  if (n15_18 > 0 && cas !== "non_eligible_revenus") {
    notes.push("💡 Pour les 16-18 ans, pensez à confirmer la scolarisation auprès de la CAF (déclaration en ligne).");
  }

  return {
    montantUnique,
    montantAnnuel: montantUnique,
    eligible: montantUnique > 0,
    cas,
    notes,
  };
}

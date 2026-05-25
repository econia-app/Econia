/**
 * Mini-scan CSS — Complémentaire Santé Solidaire 2026
 * Source : complementaire-sante-solidaire.gouv.fr (plafonds 1er avril 2026)
 */
import { CSS_2026 } from "@/lib/baremes-2026";

export type MiniScanQuestion = {
  id: string;
  q: string;
  sub?: string;
  options: { value: string; label: string }[];
};

export const cssQuestions: MiniScanQuestion[] = [
  {
    id: "foyer",
    q: "Combien de personnes vivent au foyer ?",
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
    q: "Ressources annuelles du foyer (12 derniers mois) ?",
    sub: "Salaires + allocations + retraites + autres revenus",
    options: [
      { value: "moins10k", label: "Moins de 10 000€" },
      { value: "10-15k", label: "10 000 — 15 000€" },
      { value: "15-20k", label: "15 000 — 20 000€" },
      { value: "20-25k", label: "20 000 — 25 000€" },
      { value: "25-30k", label: "25 000 — 30 000€" },
      { value: "plus30k", label: "Plus de 30 000€" },
    ],
  },
  {
    id: "age_principal",
    q: "Quel âge avez-vous ?",
    sub: "L'âge détermine la participation journalière maximum si vous êtes éligible avec participation",
    options: [
      { value: "moins29", label: "Moins de 29 ans" },
      { value: "30-49", label: "30 — 49 ans" },
      { value: "50-59", label: "50 — 59 ans" },
      { value: "60-69", label: "60 — 69 ans" },
      { value: "70plus", label: "70 ans ou plus" },
    ],
  },
];

export type CssEstimation = {
  /** Économie annuelle moyenne (€) si CSS gratuite, ou différence si CSS avec participation */
  economieAnnuelle: number;
  /** Participation mensuelle moyenne si éligible avec participation */
  participationMensuelle: number;
  eligible: boolean;
  type: "gratuite" | "participation" | "non_eligible";
  notes: string[];
};

export function estimerCss(a: Record<string, string>): CssEstimation {
  const B = CSS_2026;
  const notes: string[] = [];

  // Détermine la taille du foyer pour les plafonds
  const taille = a.foyer === "4plus" ? "4" : (a.foyer ?? "1");
  const plafondGratuite = B.plafondsGratuite[taille as keyof typeof B.plafondsGratuite] ?? B.plafondsGratuite["4"];
  const plafondParticipation = plafondGratuite * B.coeffParticipation;

  // Estimation des ressources annuelles
  const ressourcesSegments: Record<string, number> = {
    moins10k: 8000,
    "10-15k": 12500,
    "15-20k": 17500,
    "20-25k": 22500,
    "25-30k": 27500,
    plus30k: 35000,
  };
  const ressources = ressourcesSegments[a.ressources] ?? 20000;

  // Économie moyenne grâce à la CSS (vs mutuelle privée moyenne)
  // Une mutuelle privée moyenne coûte ~50€/mois pour 1 personne = 600€/an
  // Pour un foyer : ~50€/personne/mois
  const nbPersonnes = a.foyer === "4plus" ? 4 : parseInt(taille, 10);
  const economieGratuite = nbPersonnes * 600; // €/an évités en cotisation mutuelle

  // Participation journalière selon âge (max 1€/jour)
  const participationJour =
    B.participationParAge[a.age_principal as keyof typeof B.participationParAge] ?? 0.4;
  const participationAnnuelle = participationJour * 365 * nbPersonnes;
  const economieParticipation = Math.max(0, economieGratuite - participationAnnuelle);

  if (ressources <= plafondGratuite) {
    notes.push("✅ CSS gratuite : aucune cotisation, prise en charge 100% des soins courants (consultations, médicaments, hôpital).");
    notes.push("Démarche en ligne sur ameli.fr ou auprès de ta CPAM. Réponse sous 2 mois.");
    return {
      economieAnnuelle: economieGratuite,
      participationMensuelle: 0,
      eligible: true,
      type: "gratuite",
      notes,
    };
  } else if (ressources <= plafondParticipation) {
    notes.push(`💸 CSS avec participation : ${participationJour}€/jour/personne (selon ton âge).`);
    notes.push("Tu paies moins cher qu'une mutuelle classique tout en gardant la même couverture.");
    return {
      economieAnnuelle: Math.round(economieParticipation),
      participationMensuelle: Math.round((participationJour * 30 * nbPersonnes) * 10) / 10,
      eligible: true,
      type: "participation",
      notes,
    };
  } else {
    notes.push(`Tes revenus dépassent le plafond CSS pour ${nbPersonnes} personne(s) (${Math.round(plafondParticipation).toLocaleString()}€/an).`);
    notes.push("💡 Pense aux complémentaires santé d'entreprise (obligatoires) ou aux comparateurs pour réduire ta cotisation.");
    return {
      economieAnnuelle: 0,
      participationMensuelle: 0,
      eligible: false,
      type: "non_eligible",
      notes,
    };
  }
}

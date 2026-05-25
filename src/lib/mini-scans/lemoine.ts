/**
 * Mini-scan Loi Lemoine — Assurance emprunteur 2026
 *
 * 3 questions seulement (capital restant / durée restante / taux actuel TAEA).
 * On affiche le GAIN TOTAL restant sur la durée du prêt — c'est l'argument choc Lemoine.
 *
 * Formule simplifiée :
 *   Économie totale ≈ (taux_actuel − taux_cible) × capital_restant × durée_restante / 100
 *
 * Pourquoi simple : la loi Lemoine permet de changer à tout moment depuis 2022.
 * Le calcul exact dépendrait du profil (âge, santé, type de prêt) — on prend une cible moyenne 0,25 %.
 * Marge d'erreur ±20 % — toujours rediriger vers un courtier pour le chiffre exact.
 *
 * Source : observatoires assurance emprunteur 2026 + Légifrance loi n° 2022-270.
 */
import { LEMOINE_2026 } from "@/lib/baremes-2026";

export type MiniScanQuestion = {
  id: string;
  q: string;
  sub?: string;
  options: { value: string; label: string }[];
};

export const lemoineQuestions: MiniScanQuestion[] = [
  {
    id: "capital",
    q: "Quel est ton capital restant dû ?",
    sub: "Montant encore à rembourser sur ton crédit immobilier (tu le trouves sur ton dernier relevé de prêt)",
    options: [
      { value: "moins50k", label: "Moins de 50 000€" },
      { value: "50-100k", label: "50 000 — 100 000€" },
      { value: "100-150k", label: "100 000 — 150 000€" },
      { value: "150-200k", label: "150 000 — 200 000€" },
      { value: "200-300k", label: "200 000 — 300 000€" },
      { value: "plus300k", label: "Plus de 300 000€" },
    ],
  },
  {
    id: "duree",
    q: "Combien d'années te restent à rembourser ?",
    sub: "Approximatif — la durée restante du prêt à partir d'aujourd'hui",
    options: [
      { value: "moins5", label: "Moins de 5 ans" },
      { value: "5-10", label: "5 — 10 ans" },
      { value: "10-15", label: "10 — 15 ans" },
      { value: "15-20", label: "15 — 20 ans" },
      { value: "plus20", label: "Plus de 20 ans" },
    ],
  },
  {
    id: "taux",
    q: "Tu paies combien d'assurance emprunteur ?",
    sub: "Le TAEA (taux annuel effectif d'assurance) figure sur ton tableau d'amortissement. Si tu ne sais pas, choisis « Je ne sais pas »",
    options: [
      { value: "inconnu", label: "Je ne sais pas (estimation moyenne)" },
      { value: "moins020", label: "Moins de 0,20 %" },
      { value: "020-030", label: "0,20 % — 0,30 %" },
      { value: "030-040", label: "0,30 % — 0,40 %" },
      { value: "040-050", label: "0,40 % — 0,50 %" },
      { value: "plus050", label: "Plus de 0,50 %" },
    ],
  },
];

export type LemoineEstimation = {
  /** Économie totale estimée sur toute la durée restante (€) */
  gainTotal: number;
  /** Économie annuelle moyenne (€/an) */
  gainAnnuel: number;
  /** L'utilisateur est-il éligible à un gain ? */
  eligible: boolean;
  /** Capital restant médian retenu pour le calcul */
  capitalRetenu: number;
  /** Durée restante médiane retenue */
  dureeRetenue: number;
  /** Taux actuel médian retenu (%) */
  tauxActuel: number;
  /** Taux cible moyen visé en délégation (%) */
  tauxCible: number;
  /** Notes pédagogiques */
  notes: string[];
};

export function estimerLemoine(a: Record<string, string>): LemoineEstimation {
  const B = LEMOINE_2026;
  const notes: string[] = [];

  // Médianes par segment
  const capitalSegments: Record<string, number> = {
    moins50k: 35000,
    "50-100k": 75000,
    "100-150k": 125000,
    "150-200k": 175000,
    "200-300k": 250000,
    plus300k: 350000,
  };
  const dureeSegments: Record<string, number> = {
    moins5: 3,
    "5-10": 7.5,
    "10-15": 12.5,
    "15-20": 17.5,
    plus20: 22,
  };
  const tauxSegments: Record<string, number> = {
    inconnu: B.tauxBancaireMoyen, // 0,40 % par défaut
    moins020: 0.15,
    "020-030": 0.25,
    "030-040": 0.35,
    "040-050": 0.45,
    plus050: 0.6,
  };

  const capitalRetenu = capitalSegments[a.capital] ?? 100000;
  const dureeRetenue = dureeSegments[a.duree] ?? 10;
  const tauxActuel = tauxSegments[a.taux] ?? B.tauxBancaireMoyen;
  const tauxCible = B.tauxDelegationCible;

  // Calcul économie totale
  // Note : l'assurance bancaire s'applique généralement sur le capital INITIAL (constant).
  // En délégation, elle s'applique sur le capital RESTANT (décroissant).
  // Pour rester prudent et lisible, on calcule sur capital_restant fixe — sous-estimation.
  const ecartTaux = Math.max(0, tauxActuel - tauxCible);
  const gainAnnuel = Math.round((ecartTaux * capitalRetenu) / 100);
  const gainTotal = Math.round(gainAnnuel * dureeRetenue);

  const eligible = gainTotal >= 500; // seuil pour afficher un gain pertinent
  const capitalSousPlafond = capitalRetenu < B.plafondSansQuestionnaire;

  if (eligible) {
    notes.push(
      `Tu paies aujourd'hui ~${tauxActuel.toFixed(2)} %. Un contrat délégué moyen 2026 tourne autour de ${tauxCible.toFixed(2)} % pour un profil standard.`
    );
    if (capitalSousPlafond) {
      notes.push(
        "✅ Capital sous 200 000€ : pas de questionnaire médical si le prêt est remboursé avant tes 60 ans (loi Lemoine)."
      );
    } else {
      notes.push(
        "⚠️ Au-delà de 200 000€, un questionnaire médical simplifié peut être demandé selon ton âge."
      );
    }
    notes.push(
      "💡 Ta banque ne peut pas refuser le changement si les garanties sont équivalentes (grille officielle 18 critères)."
    );
    notes.push(
      "Estimation indicative ±20 %. Le taux exact dépend de ton âge, ton statut fumeur et ton métier. Demande 2-3 devis pour confirmer."
    );
  } else if (tauxActuel <= tauxCible) {
    notes.push(
      `Ton taux actuel (~${tauxActuel.toFixed(2)} %) est déjà au niveau du marché en délégation. Pas d'économie significative à attendre côté assurance.`
    );
    notes.push(
      "💡 Pense quand même à comparer tous les 2-3 ans : les tarifs évoluent et un autre assureur peut être plus compétitif sur ton profil exact."
    );
  } else {
    notes.push(
      "L'écart est faible sur la durée restante. Le changement reste possible mais le gain ne couvrira peut-être pas les démarches."
    );
  }

  return {
    gainTotal,
    gainAnnuel,
    eligible,
    capitalRetenu,
    dureeRetenue,
    tauxActuel,
    tauxCible,
    notes,
  };
}

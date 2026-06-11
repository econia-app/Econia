/**
 * Mini-scan Abonnements — diagnostic d'économie + plan d'action
 *
 * Pas de formule officielle : on estime le surcoût des abonnements "fantômes"
 * (payés mais non/peu utilisés) selon le nombre d'abonnements et la qualité du
 * suivi, et on génère un plan d'action (lister ses prélèvements, résilier en 3
 * clics, surveiller les fins d'essai).
 *
 * ⚠️ Estimations indicatives et PRUDENTES (plafonnées) — voir ABONNEMENTS_2026.
 */
import { ABONNEMENTS_2026 } from "@/lib/baremes-2026";
import type { MiniScanQuestion } from "@/lib/mini-scans/prime-activite";

export type { MiniScanQuestion };

export const abonnementsQuestions: MiniScanQuestion[] = [
  {
    id: "nombre",
    q: "Combien d'abonnements payants as-tu (environ) ?",
    sub: "Streaming, presse, salle de sport, cloud, apps, mobile, box, livraisons…",
    options: [
      { value: "peu", label: "1 à 4" },
      { value: "moyen", label: "5 à 9" },
      { value: "beaucoup", label: "10 ou plus" },
      { value: "inconnu", label: "Aucune idée" },
    ],
  },
  {
    id: "suivi",
    q: "Sais-tu exactement ce que tu paies chaque mois en abonnements ?",
    options: [
      { value: "oui", label: "Oui, je suis ça de près" },
      { value: "apeupres", label: "À peu près" },
      { value: "non", label: "Non, pas vraiment" },
    ],
  },
  {
    id: "inutilise",
    q: "Y a-t-il des abonnements que tu n'utilises (presque) plus ?",
    options: [
      { value: "oui", label: "Oui, au moins un" },
      { value: "peutetre", label: "Peut-être, à vérifier" },
      { value: "non", label: "Non, tout me sert" },
    ],
  },
  {
    id: "essai",
    q: "As-tu des essais gratuits ou promos en cours ?",
    sub: "Ceux qui se transforment en paiement automatique si on oublie de résilier.",
    options: [
      { value: "plusieurs", label: "Oui, plusieurs" },
      { value: "un", label: "Un ou deux" },
      { value: "non", label: "Non" },
    ],
  },
  {
    id: "releve",
    q: "À quelle fréquence vérifies-tu tes prélèvements bancaires ?",
    options: [
      { value: "souvent", label: "Souvent (chaque mois)" },
      { value: "parfois", label: "De temps en temps" },
      { value: "jamais", label: "Quasiment jamais" },
    ],
  },
];

export type AbonnementsDiagnostic = {
  /** Fourchette d'économie annuelle estimée (€/an) */
  economieMin: number;
  economieMax: number;
  /** Y a-t-il une économie significative à aller chercher ? */
  eligible: boolean;
  /** Nombre de pistes d'économie détectées */
  nbPistes: number;
  /** Plan d'action concret (affiché aux abonnés ; verrouillé pour les autres) */
  actions: string[];
};

/** Arrondi à la dizaine. */
function round10(n: number): number {
  return Math.round(n / 10) * 10;
}

export function diagnostiquerAbonnements(a: Record<string, string>): AbonnementsDiagnostic {
  const B = ABONNEMENTS_2026;
  const actions: string[] = [];
  let nbPistes = 0;

  // === Base : potentiel selon le nombre d'abonnements ===
  const base =
    B.potentielParNombre[a.nombre as keyof typeof B.potentielParNombre] ??
    B.potentielParNombre.inconnu;
  let min = base[0];
  let max = base[1];

  // === Facteur "qualité du suivi" (moins on suit, plus il y a de fantômes) ===
  // Combine suivi + inutilise + fréquence de vérification du relevé.
  let facteur = 0.6;
  if (a.inutilise === "oui") facteur = 1;
  else if (a.inutilise === "peutetre") facteur = 0.7;
  else if (a.inutilise === "non") facteur = 0.3;
  // Un mauvais suivi augmente le risque de fantômes
  if (a.suivi === "non" || a.releve === "jamais") facteur = Math.min(1, facteur + 0.25);
  if (a.suivi === "oui" && a.releve === "souvent") facteur = Math.max(0.15, facteur - 0.15);

  min = min * facteur;
  max = max * facteur;
  if (max >= 20) {
    nbPistes += 1;
    actions.push(
      "📋 Liste tous tes prélèvements récurrents sur ton relevé bancaire des 3 derniers mois (dans l'appli de ta banque, cherche les montants identiques chaque mois)."
    );
    actions.push(
      "🗑️ Résilie ce que tu n'utilises plus : 1 Français sur 3 paie un abonnement fantôme. Depuis 2023, la résiliation en ligne est obligatoire « en 3 clics » pour tout ce que tu as souscrit sur internet."
    );
  }

  // === Piste essais gratuits / promos (risque de bascule en paiement) ===
  if (a.essai === "plusieurs" || a.essai === "un") {
    const bonus = a.essai === "plusieurs" ? [20, 60] : [10, 30];
    min += bonus[0];
    max += bonus[1];
    nbPistes += 1;
    actions.push(
      "⏰ Note les dates de fin d'essai gratuit / de promo dans ton agenda, et résilie AVANT le passage au tarif plein (souvent automatique et silencieux)."
    );
  }

  actions.push(
    "🔁 Regroupe ce qui peut l'être (offres famille, forfaits combinés) et garde un seul service par usage (un seul cloud, une seule plateforme vidéo active à la fois)."
  );

  // Plafond anti sur-promesse
  const economieMin = round10(Math.min(min, B.plafond));
  const economieMax = round10(Math.min(max, B.plafond));
  const eligible = economieMax >= B.seuilSignificatif;

  return { economieMin, economieMax, eligible, nbPistes, actions };
}

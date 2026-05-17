/**
 * Econia — Définition du scan (19 questions adaptatives)
 */

export type Question = {
  id: string;
  q: string;
  sub?: string;
  options: { value: string; label: string }[];
  showIf?: (a: Record<string, string>) => boolean;
};

export const questions: Question[] = [
  {
    id: "marital",
    q: "Votre situation maritale ?",
    options: [
      { value: "marie", label: "Marié(e)" },
      { value: "pacse", label: "Pacsé(e)" },
      { value: "concubin", label: "En concubinage" },
      { value: "celibataire", label: "Célibataire" },
      { value: "divorce", label: "Divorcé(e)" },
      { value: "veuf", label: "Veuf/Veuve" },
    ],
  },
  {
    id: "age",
    q: "Votre tranche d'âge ?",
    options: [
      { value: "18-25", label: "18-25 ans" },
      { value: "26-34", label: "26-34 ans" },
      { value: "35-49", label: "35-49 ans" },
      { value: "50-61", label: "50-61 ans" },
      { value: "62plus", label: "62 ans et plus" },
    ],
  },
  {
    id: "statut",
    q: "Votre situation professionnelle ?",
    options: [
      { value: "salarie", label: "Salarié(e)" },
      { value: "independant", label: "Indépendant" },
      { value: "cumul", label: "Salarié + activité indépendante" },
      { value: "chomage", label: "Demandeur d'emploi" },
      { value: "retraite", label: "Retraité(e)" },
      { value: "etudiant", label: "Étudiant(e)" },
    ],
  },
  {
    id: "handicap",
    q: "Situation de handicap (vous ou votre foyer) ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
    ],
  },
  {
    id: "enfants",
    q: "Enfants à charge (moins de 20 ans) ?",
    options: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3+", label: "3 ou plus" },
    ],
  },
  {
    id: "ageEnfant",
    q: "Âge de votre enfant le plus jeune ?",
    options: [
      { value: "moins3", label: "Moins de 3 ans" },
      { value: "3-5", label: "3 à 5 ans" },
      { value: "6-10", label: "6 à 10 ans" },
      { value: "11-17", label: "11 à 17 ans" },
    ],
    showIf: (a) => a.enfants !== "0",
  },
  {
    id: "garde",
    q: "Mode de garde utilisé ?",
    options: [
      { value: "creche", label: "Crèche" },
      { value: "nounou", label: "Nounou" },
      { value: "periscolaire", label: "Périscolaire" },
      { value: "famille", label: "Famille / aucun" },
    ],
    showIf: (a) =>
      a.enfants !== "0" && (a.ageEnfant === "moins3" || a.ageEnfant === "3-5"),
  },
  {
    id: "revenus",
    q: "Revenus nets mensuels du foyer ?",
    options: [
      { value: "moins1500", label: "Moins de 1 500€" },
      { value: "1500-2500", label: "1 500 — 2 500€" },
      { value: "2500-4000", label: "2 500 — 4 000€" },
      { value: "4000-6000", label: "4 000 — 6 000€" },
      { value: "plus6000", label: "Plus de 6 000€" },
    ],
  },
  {
    id: "epargne",
    q: "Épargne et patrimoine approximatif ?",
    options: [
      { value: "moins10k", label: "Moins de 10 000€" },
      { value: "10-50k", label: "10 000 — 50 000€" },
      { value: "50-150k", label: "50 000 — 150 000€" },
      { value: "plus150k", label: "Plus de 150 000€" },
      { value: "secret", label: "Je préfère ne pas répondre" },
    ],
  },
  {
    id: "imposable",
    q: "Payez-vous des impôts sur le revenu ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "sais_pas", label: "Je ne sais pas" },
    ],
  },
  {
    id: "logement",
    q: "Votre logement ?",
    options: [
      { value: "proprio_credit", label: "Propriétaire avec crédit" },
      { value: "proprio_sans", label: "Propriétaire sans crédit" },
      { value: "locataire", label: "Locataire" },
      { value: "heberge", label: "Hébergé gratuitement" },
    ],
  },
  {
    id: "logementAge",
    q: "Votre logement a plus de 15 ans ?",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" },
      { value: "sais_pas", label: "Je ne sais pas" },
    ],
    showIf: (a) => a.logement === "proprio_credit" || a.logement === "proprio_sans",
  },
  {
    id: "assurances",
    q: "Assurances comparées ces 12 derniers mois ?",
    options: [
      { value: "oui_tout", label: "Oui, toutes" },
      { value: "certaines", label: "Certaines" },
      { value: "non", label: "Non, jamais" },
    ],
  },
  {
    id: "abonnements",
    q: "Connaissez-vous vos abonnements récurrents ?",
    options: [
      { value: "oui_precis", label: "Oui, précisément" },
      { value: "a_peu_pres", label: "À peu près" },
      { value: "aucune_idee", label: "Aucune idée" },
    ],
  },
  {
    id: "sap",
    q: "Utilisez-vous des services à domicile ?",
    sub: "(ménage, jardinage, garde, soutien scolaire)",
    options: [
      { value: "oui_cesu", label: "Oui, avec CESU" },
      { value: "oui_sans_cesu", label: "Oui, sans CESU" },
      { value: "non", label: "Non" },
    ],
  },
  {
    id: "credit",
    q: "Avez-vous un crédit immobilier en cours ?",
    options: [
      { value: "oui_5", label: "Oui, depuis moins de 5 ans" },
      { value: "oui_15", label: "Oui, depuis 5-15 ans" },
      { value: "oui_15plus", label: "Oui, depuis plus de 15 ans" },
      { value: "non", label: "Non" },
    ],
  },
  {
    id: "vehicule",
    q: "Votre véhicule principal ?",
    options: [
      { value: "thermique", label: "Thermique (essence/diesel)" },
      { value: "electrique", label: "Électrique / hybride" },
      { value: "aucun", label: "Pas de véhicule" },
    ],
  },
  {
    id: "distance",
    q: "Distance domicile-travail ?",
    options: [
      { value: "moins15", label: "Moins de 15 km" },
      { value: "15-30", label: "15 à 30 km" },
      { value: "30-50", label: "30 à 50 km" },
      { value: "50plus", label: "Plus de 50 km" },
      { value: "na", label: "Pas concerné" },
    ],
  },
  {
    id: "changement",
    q: "Changement prévu dans les 12 mois ?",
    options: [
      { value: "demenagement", label: "Déménagement" },
      { value: "naissance", label: "Naissance" },
      { value: "vehicule_change", label: "Changement de véhicule" },
      { value: "retraite_change", label: "Départ en retraite" },
      { value: "rien", label: "Rien de prévu" },
    ],
  },
];

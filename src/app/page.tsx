"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pxbntlbtngcecbhcghzu.supabase.co",
  "sb_publishable_RK6hui-9UQCUy5H36tj9_A_gcGNtfIQ"
);

const T = {
  bg: "#FAFBFD", card: "#FFFFFF", accent: "#1B6EF3", accentLight: "#EBF2FF",
  green: "#059669", greenLight: "#ECFDF5", orange: "#D97706", orangeLight: "#FFFBEB",
  purple: "#7C3AED", text: "#1A1D23", textSoft: "#5F6980", textMuted: "#9CA3AF",
  border: "#E5E7EB", red: "#DC2626",
};

// ─── GUIDES DATA ───
const guides: Record<string, { title: string; time: string; difficulty: string; steps: { title: string; content: string }[] }> = {
  assurance_compare: {
    title: "Comparer et renégocier vos assurances", time: "30 min", difficulty: "Facile",
    steps: [
      { title: "Listez vos contrats", content: "Pour chaque assurance (auto, habitation, mutuelle), notez : l'assureur, le type de garantie, le montant annuel, la date d'échéance et la franchise. Ou prenez en photo chaque contrat — Econia extraira les données automatiquement." },
      { title: "Vérifiez l'adéquation", content: "Véhicule de plus de 8 ans valant moins de 5 000€ ? Le tous risques est inutile — passez en tiers+ (économie 200-300€/an). Franchise à 150€ ? La passer à 300€ réduit la prime de 10-15%. Mutuelle avec optique élevé sans lunettes ? Réduisez le niveau." },
      { title: "Comparez en ligne", content: "Allez sur lelynx.fr ou lesfurets.com. Pour l'auto : immatriculation, date du permis, bonus/malus, km/an, sinistres 3 ans. Pour l'habitation : surface, pièces, étage, capital mobilier. Pour la mutuelle : lelynx.fr/mutuelle." },
      { title: "Négociez avec votre assureur", content: "Script : \"Bonjour, client depuis [X ans]. J'ai un devis chez [concurrent] à [montant]€ pour les mêmes garanties. Pouvez-vous vous aligner ? Je regroupe auto + habitation si vous faites un geste.\" Demandez le service fidélisation, pas le standard." },
      { title: "Changez si nécessaire", content: "Loi Hamon : changement auto/habitation à tout moment après 1 an. Le nouvel assureur résilie pour vous. Mutuelle : résiliation infra-annuelle après 1 an. Regroupement multi-contrats = remise 10-15%." },
      { title: "Programmez l'alerte annuelle", content: "Econia programme une alerte 2 mois avant votre échéance pour refaire la comparaison. Les assurances augmentent de 5-8% chaque année." },
    ],
  },
  doublons_cb: {
    title: "Vérifier les doublons carte bancaire", time: "15 min", difficulty: "Facile",
    steps: [
      { title: "Trouvez vos conditions CB", content: "App bancaire → \"Ma carte\" ou \"Conditions\". Ou appelez votre banque. Ou photographiez le document — Econia l'analyse." },
      { title: "Identifiez les assurances incluses", content: "Carte Premier/Gold : assurance annulation voyage, bagages, location véhicule, téléphone (achat <6 mois payé avec la carte), responsabilité civile étranger, garantie achats. Carte Platinum : tout avec plafonds plus élevés + assurance ski." },
      { title: "Comparez avec vos contrats séparés", content: "Pour chaque garantie CB, vérifiez si vous payez un contrat séparé. Doublons fréquents : assurance téléphone (120€/an), assurance voyage, extension garantie magasin. Résiliez les doublons." },
      { title: "Attention aux conditions", content: "L'assurance téléphone CB couvre souvent jusqu'à 800€ et exige l'achat avec cette carte. L'assurance voyage nécessite que le billet soit payé avec la carte. Certaines garanties ne couvrent que le titulaire, pas la famille." },
    ],
  },
  assurance_emprunteur: {
    title: "Changer d'assurance emprunteur (loi Lemoine)", time: "45 min", difficulty: "Moyen",
    steps: [
      { title: "Rassemblez vos infos", content: "Montant emprunté, capital restant dû, durée restante, taux du prêt, taux assurance actuelle, montant mensuel assurance, garanties exigées par la banque (fiche standardisée)." },
      { title: "Calculez ce que vous payez", content: "Exemple : prêt 200 000€, assurance banque 0,34% = 680€/an soit 56,67€/mois." },
      { title: "Comparez en ligne", content: "magnolia.fr, reassurez-moi.fr ou empruntis.com. Taux proposé : souvent 0,08-0,20% pour un profil <45 ans. Exemple : 200 000€ à 0,12% = 240€/an → économie 440€/an." },
      { title: "Vérifiez l'équivalence des garanties", content: "Le nouveau contrat doit couvrir : décès, PTIA, ITT, IPP/IPT. Les comparateurs vérifient automatiquement." },
      { title: "Souscrivez le nouveau contrat", content: "Signature en ligne. Prêts <200 000€ remboursés avant 60 ans : pas de questionnaire médical." },
      { title: "Envoyez la demande à votre banque", content: "Courrier recommandé ou messagerie sécurisée : nouveau contrat signé + attestation d'équivalence + lettre mentionnant la loi du 28 février 2022. La banque a 10 jours ouvrés pour répondre." },
      { title: "C'est fait", content: "Acceptation → tableau d'amortissement mis à jour, économie dès la prochaine échéance. Refus → doit être motivé par écrit → corrigez et renvoyez." },
    ],
  },
  abonnements: {
    title: "Détecter vos abonnements fantômes", time: "20 min", difficulty: "Facile",
    steps: [
      { title: "Identifiez vos prélèvements", content: "Banque en ligne → 3 derniers mois → listez TOUS les prélèvements récurrents. Ou iPhone : Réglages → [nom] → Abonnements. Android : Play Store → photo → Paiements → Abonnements." },
      { title: "Classez en 3 colonnes", content: "GARDER : utilisé, bon prix. RÉDUIRE : utilisé mais trop cher (Netflix Premium→Standard -5€/mois, forfait 100Go→5Go -20€/mois). RÉSILIER : non utilisé depuis 30+ jours." },
      { title: "Résiliez", content: "Netflix : netflix.com/cancelplan. Disney+ : compte → Annuler. Spotify : support.spotify.com/fr/cancel-premium. IMPORTANT : supprimer une app NE résilie PAS l'abonnement via Apple/Google Play." },
      { title: "Econia surveille", content: "Chaque abonnement conservé est noté avec sa date de fin d'offre. Alerte 1 mois avant que le prix augmente." },
    ],
  },
  alertes_offre: {
    title: "Ne plus voir son forfait doubler de prix", time: "5 min", difficulty: "Facile",
    steps: [
      { title: "Econia enregistre vos dates", content: "Chaque contrat avec offre promo est enregistré : prix actuel, prix après, date de fin. Ex: Free Mobile 9,99€ → 19,99€ le 15/09/2026." },
      { title: "L'alerte 1 mois avant", content: "Notification avec 3 options : renégocier (script fourni), changer (meilleure offre concurrente), ou garder." },
      { title: "Scripts de négociation par opérateur", content: "Free (3244) : \"Client depuis [X] mois, offre à 9,99€ se termine, devis Bouygues à 11,99€. Offre fidélisation ?\" Orange (3900) : \"Engagement terminé, transférez-moi au service résiliation.\" Astuce : le service rétention a toujours des offres cachées." },
      { title: "Box internet", content: "\"Mon offre box à [X]€ se termine, passe à [Y]€. Free propose 29,99€. Pouvez-vous aligner ?\" Le changement de box est gratuit, le nouvel opérateur gère tout." },
    ],
  },
  energie: {
    title: "Réduire vos factures d'énergie", time: "15 min", difficulty: "Facile",
    steps: [
      { title: "Identifiez votre situation", content: "Sur votre facture : fournisseur, type de contrat, option tarifaire (Base ou HP/HC), puissance compteur (6/9/12 kVA), consommation annuelle kWh. Ou photographiez la facture." },
      { title: "Vérifiez l'option tarifaire", content: "Base : même prix jour/nuit. HP/HC : prix réduit la nuit. Si HP/HC mais pas de consommation nocturne → passez en Base (économie 50-100€/an). Changement gratuit." },
      { title: "Vérifiez la puissance", content: "6 kVA : appart sans chauffage élec. 9 kVA : maison chauffage élec. Si jamais de disjonction → puissance surdimensionnée. 9→6 kVA = ~30€/an d'économie." },
      { title: "Comparez les fournisseurs", content: "energie-info.fr/comparateur/ (site officiel). Changement gratuit, sans coupure, sans engagement. Le nouveau fournisseur gère tout." },
      { title: "Radar Econia", content: "Alerte quand les tarifs changent, quand votre fournisseur augmente ses prix, quand une offre promo apparaît." },
    ],
  },
  frais_reels: {
    title: "Frais réels vs abattement 10%", time: "10 min", difficulty: "Moyen",
    steps: [
      { title: "Econia calcule pour vous", content: "Avec votre distance, puissance véhicule et mode de restauration, Econia compare l'abattement 10% avec les frais réels." },
      { title: "Frais kilométriques 2026", content: "Barème (ex 5CV) : jusqu'à 5 000 km → ×0,636€. 5 001-20 000 km → (×0,357)+1 395€. Au-delà → ×0,427€. Véhicule électrique : +20%. Limité à 40 km aller sauf justification." },
      { title: "Frais de repas", content: "Restaurant sans ticket resto : (prix - 5,45€)/repas, max 15,65€. Gamelle sans ticket resto : 5,45€/jour forfaitaire sans justificatif. Avec ticket resto : déduire la part employeur. 220 jours gamelle = 1 199€ déductibles." },
      { title: "Autres frais déductibles", content: "Péages, stationnement, télétravail (2,70€/jour max ~603€/an), double résidence, vêtements pro spécifiques, formation, matériel pro, cotisations syndicales." },
      { title: "Comment déclarer", content: "Case 1AK : montant total frais réels. Conservez justificatifs 3 ans. Econia génère le détail du calcul." },
    ],
  },
  droits_conso: {
    title: "Récupérer de l'argent grâce à vos droits", time: "Variable", difficulty: "Facile",
    steps: [
      { title: "Garantie légale 2 ans", content: "Panne dans les 2 ans → le VENDEUR répare ou remplace gratuitement. Script : \"Conformément à l'article L217-4, je demande réparation ou remplacement.\" Il NE PEUT PAS vous renvoyer vers le fabricant." },
      { title: "Bonus réparation", content: "10 à 60€ de réduction chez les réparateurs QualiRépar. ecosystem.eco/bonus-reparation" },
      { title: "Indemnisation train", content: "TGV : 25% (30-60min), 50% (60-120min), 75% (+2h). Demande : oui.sncf/aide/indemnisation, sous 60 jours." },
      { title: "Indemnisation avion (EU 261)", content: "Retard >3h ou annulation : 250€ (<1500km), 400€ (1500-3500km), 600€ (>3500km). Vol au départ/vers l'UE." },
      { title: "Colis non reçu", content: "Le vendeur est responsable jusqu'à livraison. Script : \"Conformément à l'article L216-1, remboursement sous 14 jours.\" Il NE PEUT PAS dire \"voyez avec le transporteur\"." },
      { title: "Rétractation 14 jours", content: "Achat en ligne ou démarchage → retour sans motif sous 14 jours. Remboursement sous 14 jours." },
    ],
  },
  aides_sociales: {
    title: "Obtenir vos aides sociales", time: "15 min/aide", difficulty: "Facile",
    steps: [
      { title: "Simulez vos droits", content: "RSA/Prime activité/APL → caf.fr/simulateur. CSS → ameli.fr. ASPA → lassuranceretraite.fr. AAH → MDPH de votre département." },
      { title: "Faites la demande", content: "caf.fr → \"Faire une demande de prestation\". Documents : pièce d'identité, justificatif domicile, RIB, avis d'imposition, ressources 3 derniers mois." },
      { title: "Renseignez correctement", content: "Salaire NET (pas brut). Micro-entreprise : CA brut (la CAF applique l'abattement). Concubinage : revenus du conjoint comptent. Revenus fonciers pris en compte." },
      { title: "Suivez votre dossier", content: "Réponse sous 1-2 mois. Versement le 5 du mois. Econia rappelle la déclaration trimestrielle (obligatoire RSA/prime activité)." },
      { title: "Pièges à éviter", content: "Prime activité : PAS automatique, il faut la demander. RSA : obligations d'insertion (15h/semaine). APL : calculée sur revenus actuels. Tout changement → mettre à jour sur caf.fr immédiatement." },
    ],
  },
  leasing_social: {
    title: "Leasing social — voiture électrique à 100€/mois", time: "10 min", difficulty: "Facile",
    steps: [
      { title: "Vérifiez votre éligibilité", content: "RFR par part ≤ 16 300€, habiter à +15 km du travail OU +8 000 km/an. Ouvert aux professions essentielles (infirmières, aides à domicile, artisans)." },
      { title: "Calculez votre RFR par part", content: "RFR ÷ nombre de parts. Ex : RFR 45 000€, marié + 2 enfants = 3 parts → 15 000€/part → éligible. Avis d'imposition page 1 en haut." },
      { title: "Calculez le gain", content: "Diesel moyen : ~3 800€/an. Leasing social : ~1 200€/an. Économie : ~2 600€/an. Aide jusqu'à 9 500€ si batterie européenne." },
      { title: "Alerte Econia", content: "Ouverture juillet 2026, 50 000 véhicules. Econia vous alerte dès l'ouverture avec le lien direct." },
    ],
  },
  impots_cases: {
    title: "Vos cases d'impôts personnalisées", time: "15 min", difficulty: "Moyen",
    steps: [
      { title: "Vérifiez les pré-remplis", content: "Cases 1AJ-1DJ : salaires. Vérifiez vs bulletin de décembre, ligne \"Net imposable\". Erreurs fréquentes sur primes et heures sup." },
      { title: "Revenus complémentaires", content: "Micro-entreprise : 5KO/5KP (vente), 5HQ/5HN (prestations), 5HY (BNC). Versement libératoire : 5TA/5TB/5TE. Micro-foncier : case 4BE (loyers bruts, abattement 30% auto)." },
      { title: "Services à la personne (CESU)", content: "Case 7DB : dépenses SAP. 7DR : aides à déduire. 7DQ : cocher si 1ère année (plafond 15 000€). Attestation sur cesu.urssaf.fr. Même non imposable = remboursement." },
      { title: "Garde d'enfants hors domicile", content: "7GA : 1er enfant, 7GB : 2ème. Plafond 3 500€/enfant. Inclure : salaire net + cotisations + entretien 2,65€/jour + garderie (hors repas). Déduire CMG + aides employeur." },
      { title: "Réductions à ne pas oublier", content: "Dons : 7UF (66%), 7UD (75% aide personnes, max 1 000€). Scolarité : 7EA collège 61€, 7EC lycée 153€, 7EF sup 183€. PER : 6NS. Borne VE : 7ZQ/7ZR (75%, max 500€). Parent isolé : case T (demi-part souvent oubliée !)." },
    ],
  },
};

const gainToGuide: Record<string, string> = {
  "Assurances non comparées": "assurance_compare", "Doublons carte bancaire": "doublons_cb",
  "Assurance emprunteur (loi Lemoine)": "assurance_emprunteur", "Abonnements fantômes": "abonnements",
  "Alertes fin d'offre": "alertes_offre", "Optimisation énergie": "energie",
  "Frais réels vs abattement 10%": "frais_reels", "RSA": "aides_sociales",
  "Prime d'activité": "aides_sociales", "APL": "aides_sociales",
  "ASPA (minimum vieillesse)": "aides_sociales", "Complémentaire Santé Solidaire": "aides_sociales",
  "Chèque énergie": "aides_sociales", "AAH / PCH": "aides_sociales",
  "Aides jeunes / étudiants": "aides_sociales", "Allocation rentrée scolaire": "aides_sociales",
  "MaPrimeRénov' + CEE": "aides_sociales", "Leasing social": "leasing_social",
};

const questions = [
  { id: "marital", q: "Votre situation maritale ?", options: [{ value: "marie", label: "Marié(e)" }, { value: "pacse", label: "Pacsé(e)" }, { value: "concubin", label: "En concubinage" }, { value: "celibataire", label: "Célibataire" }, { value: "divorce", label: "Divorcé(e)" }, { value: "veuf", label: "Veuf/Veuve" }] },
  { id: "age", q: "Votre tranche d'âge ?", options: [{ value: "18-25", label: "18-25 ans" }, { value: "26-34", label: "26-34 ans" }, { value: "35-49", label: "35-49 ans" }, { value: "50-61", label: "50-61 ans" }, { value: "62plus", label: "62 ans et plus" }] },
  { id: "statut", q: "Votre situation professionnelle ?", options: [{ value: "salarie", label: "Salarié(e)" }, { value: "independant", label: "Indépendant" }, { value: "cumul", label: "Salarié + activité indépendante" }, { value: "chomage", label: "Demandeur d'emploi" }, { value: "retraite", label: "Retraité(e)" }, { value: "etudiant", label: "Étudiant(e)" }] },
  { id: "handicap", q: "Situation de handicap (vous ou votre foyer) ?", options: [{ value: "oui", label: "Oui" }, { value: "non", label: "Non" }] },
  { id: "enfants", q: "Enfants à charge (moins de 20 ans) ?", options: [{ value: "0", label: "0" }, { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3+", label: "3 ou plus" }] },
  { id: "ageEnfant", q: "Âge de votre enfant le plus jeune ?", options: [{ value: "moins3", label: "Moins de 3 ans" }, { value: "3-5", label: "3 à 5 ans" }, { value: "6-10", label: "6 à 10 ans" }, { value: "11-17", label: "11 à 17 ans" }], showIf: (a: Record<string,string>) => a.enfants !== "0" },
  { id: "garde", q: "Mode de garde utilisé ?", options: [{ value: "creche", label: "Crèche" }, { value: "nounou", label: "Nounou" }, { value: "periscolaire", label: "Périscolaire" }, { value: "famille", label: "Famille / aucun" }], showIf: (a: Record<string,string>) => a.enfants !== "0" && (a.ageEnfant === "moins3" || a.ageEnfant === "3-5") },
  { id: "revenus", q: "Revenus nets mensuels du foyer ?", options: [{ value: "moins1500", label: "Moins de 1 500€" }, { value: "1500-2500", label: "1 500 — 2 500€" }, { value: "2500-4000", label: "2 500 — 4 000€" }, { value: "4000-6000", label: "4 000 — 6 000€" }, { value: "plus6000", label: "Plus de 6 000€" }] },
  { id: "epargne", q: "Épargne et patrimoine approximatif ?", options: [{ value: "moins10k", label: "Moins de 10 000€" }, { value: "10-50k", label: "10 000 — 50 000€" }, { value: "50-150k", label: "50 000 — 150 000€" }, { value: "plus150k", label: "Plus de 150 000€" }, { value: "secret", label: "Je préfère ne pas répondre" }] },
  { id: "imposable", q: "Payez-vous des impôts sur le revenu ?", options: [{ value: "oui", label: "Oui" }, { value: "non", label: "Non" }, { value: "sais_pas", label: "Je ne sais pas" }] },
  { id: "logement", q: "Votre logement ?", options: [{ value: "proprio_credit", label: "Propriétaire avec crédit" }, { value: "proprio_sans", label: "Propriétaire sans crédit" }, { value: "locataire", label: "Locataire" }, { value: "heberge", label: "Hébergé gratuitement" }] },
  { id: "logementAge", q: "Votre logement a plus de 15 ans ?", options: [{ value: "oui", label: "Oui" }, { value: "non", label: "Non" }, { value: "sais_pas", label: "Je ne sais pas" }], showIf: (a: Record<string,string>) => a.logement === "proprio_credit" || a.logement === "proprio_sans" },
  { id: "assurances", q: "Assurances comparées ces 12 derniers mois ?", options: [{ value: "oui_tout", label: "Oui, toutes" }, { value: "certaines", label: "Certaines" }, { value: "non", label: "Non, jamais" }] },
  { id: "abonnements", q: "Connaissez-vous vos abonnements récurrents ?", options: [{ value: "oui_precis", label: "Oui, précisément" }, { value: "a_peu_pres", label: "À peu près" }, { value: "aucune_idee", label: "Aucune idée" }] },
  { id: "sap", q: "Utilisez-vous des services à domicile ?", sub: "(ménage, jardinage, garde, soutien scolaire)", options: [{ value: "oui_cesu", label: "Oui, avec CESU" }, { value: "oui_sans_cesu", label: "Oui, sans CESU" }, { value: "non", label: "Non" }] },
  { id: "credit", q: "Avez-vous un crédit immobilier en cours ?", options: [{ value: "oui_5", label: "Oui, depuis moins de 5 ans" }, { value: "oui_15", label: "Oui, depuis 5-15 ans" }, { value: "oui_15plus", label: "Oui, depuis plus de 15 ans" }, { value: "non", label: "Non" }] },
  { id: "vehicule", q: "Votre véhicule principal ?", options: [{ value: "thermique", label: "Thermique (essence/diesel)" }, { value: "electrique", label: "Électrique / hybride" }, { value: "aucun", label: "Pas de véhicule" }] },
  { id: "distance", q: "Distance domicile-travail ?", options: [{ value: "moins15", label: "Moins de 15 km" }, { value: "15-30", label: "15 à 30 km" }, { value: "30-50", label: "30 à 50 km" }, { value: "50plus", label: "Plus de 50 km" }, { value: "na", label: "Pas concerné" }] },
  { id: "changement", q: "Changement prévu dans les 12 mois ?", options: [{ value: "demenagement", label: "Déménagement" }, { value: "naissance", label: "Naissance" }, { value: "vehicule_change", label: "Changement de véhicule" }, { value: "retraite_change", label: "Départ en retraite" }, { value: "rien", label: "Rien de prévu" }] },
];

type Gain = { cat: string; icon: string; title: string; desc: string; montant: string; annuel: number[] };
type Info = { icon: string; title: string; desc: string };
type Profile = { id: string; email: string; is_premium: boolean; is_founder: boolean; scan_data: Record<string,string> | null; gains_total: number };

function analyzeProfile(a: Record<string,string>): { gains: Gain[]; infos: Info[]; gainMin: number; gainMax: number } {
  const gains: Gain[] = []; const infos: Info[] = [];
  const isModeste = a.revenus === "moins1500" || a.revenus === "1500-2500";
  const hasKids = a.enfants && a.enfants !== "0";
  const youngKids = a.ageEnfant === "moins3" || a.ageEnfant === "3-5";
  if (a.revenus === "moins1500" && a.statut !== "retraite") gains.push({ cat: "aide", icon: "🏛️", title: "RSA", desc: "Revenu minimum garanti.", montant: "jusqu'à 651€/mois", annuel: [3500, 7820] });
  if (isModeste && !["retraite","etudiant","chomage"].includes(a.statut)) gains.push({ cat: "aide", icon: "💰", title: "Prime d'activité", desc: "Complément pour travailleurs modestes. +50€ exceptionnels en 2026.", montant: "100 à 350€/mois", annuel: [1200, 4200] });
  if (a.logement === "locataire" && isModeste) gains.push({ cat: "aide", icon: "🏠", title: "APL", desc: "Aide pour réduire votre loyer.", montant: "50 à 400€/mois", annuel: [600, 4800] });
  if (hasKids && ["6-10","11-17"].includes(a.ageEnfant) && isModeste) gains.push({ cat: "aide", icon: "🎒", title: "Allocation rentrée scolaire", desc: "Versée en août. 429-468€/enfant selon l'âge.", montant: "429 à 468€/enfant", annuel: [429, 936] });
  if (a.statut === "retraite" && isModeste) gains.push({ cat: "aide", icon: "🧓", title: "ASPA (minimum vieillesse)", desc: "Complément pour petites retraites.", montant: "jusqu'à 1 044€/mois", annuel: [2000, 12516] });
  if (isModeste) gains.push({ cat: "aide", icon: "🏥", title: "Complémentaire Santé Solidaire", desc: "Mutuelle gratuite ou à moins de 1€/jour.", montant: "30 à 100€/mois", annuel: [360, 1200] });
  if (isModeste) gains.push({ cat: "aide", icon: "🔥", title: "Chèque énergie", desc: "Aide au paiement des factures.", montant: "48 à 277€/an", annuel: [48, 277] });
  if (a.handicap === "oui") gains.push({ cat: "aide", icon: "♿", title: "AAH / PCH", desc: "Allocations liées au handicap.", montant: "jusqu'à 1 042€/mois", annuel: [3000, 12504] });
  if (a.age === "18-25" || a.statut === "etudiant") gains.push({ cat: "aide", icon: "🎓", title: "Aides jeunes / étudiants", desc: "Bourse, Visale, aide au permis.", montant: "variable", annuel: [500, 5000] });
  if (a.assurances !== "oui_tout") { gains.push({ cat: "assurance", icon: "🛡️", title: "Assurances non comparées", desc: "Hausse 5-8%/an. Vous surpayez probablement.", montant: "150 à 400€/an", annuel: [150, 400] }); gains.push({ cat: "assurance", icon: "💳", title: "Doublons carte bancaire", desc: "Votre CB inclut des assurances. Vérifiez les doublons.", montant: "80 à 200€/an", annuel: [80, 200] }); }
  if (["oui_5","oui_15","oui_15plus"].includes(a.credit)) gains.push({ cat: "assurance", icon: "🏦", title: "Assurance emprunteur (loi Lemoine)", desc: "Changez à tout moment. Économie 5 000-15 000€.", montant: "400 à 1 200€/an", annuel: [400, 1200] });
  if (a.abonnements !== "oui_precis") gains.push({ cat: "abonnement", icon: "📱", title: "Abonnements fantômes", desc: "1 Français sur 3 paie un abonnement oublié.", montant: "200 à 500€/an", annuel: [200, 500] });
  gains.push({ cat: "abonnement", icon: "⏰", title: "Alertes fin d'offre", desc: "Econia vous prévient avant que vos promos expirent.", montant: "100 à 400€/an", annuel: [100, 400] });
  if (a.logement !== "heberge") gains.push({ cat: "energie", icon: "⚡", title: "Optimisation énergie", desc: "Comparaison fournisseurs et option tarifaire.", montant: "100 à 300€/an", annuel: [100, 300] });
  if (["salarie","cumul"].includes(a.statut) && ["15-30","30-50","50plus"].includes(a.distance)) gains.push({ cat: "impot", icon: "🚗", title: "Frais réels vs abattement 10%", desc: "Les frais réels sont potentiellement plus avantageux.", montant: "200 à 1 500€/an", annuel: [200, 1500] });
  if (["proprio_credit","proprio_sans"].includes(a.logement) && a.logementAge === "oui") gains.push({ cat: "aide", icon: "🏗️", title: "MaPrimeRénov' + CEE", desc: "Aides rénovation cumulables.", montant: "1 000 à 10 000€", annuel: [0, 0] });
  if (a.vehicule === "thermique" && isModeste) gains.push({ cat: "aide", icon: "🚗", title: "Leasing social", desc: "Voiture électrique à ~100€/mois.", montant: "~2 800€/an vs diesel", annuel: [1500, 2800] });
  if (hasKids && youngKids) infos.push({ icon: "👶", title: "Vérifiez votre CMG", desc: "Depuis 2025, jusqu'à 997€/mois. Plus de reste à charge 15%. Simulation sur urssaf.fr." });
  infos.push({ icon: "💡", title: "Crédit d'impôt Services à la Personne", desc: "50% remboursé : ménage, jardinage, garde, soutien scolaire... Plafond 12 000€/an. MÊME SANS PAYER D'IMPÔTS. Cases 7DB et 7GA." });
  if (a.sap === "oui_sans_cesu") infos.push({ icon: "📋", title: "CESU — Vous perdez 50%", desc: "Services sans CESU = pas de crédit d'impôt. Avance Immédiate CESU+ : ne payez que la moitié. cesu.urssaf.fr." });
  let gainMin = 0, gainMax = 0;
  gains.forEach(g => { gainMin += g.annuel[0]; gainMax += g.annuel[1]; });
  return { gains, infos, gainMin: Math.min(gainMin, 12000), gainMax: Math.min(gainMax, 20000) };
}

const MAX_WAITLIST = 50;

// ─── AUTH MODAL ───
function AuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [mode, setMode] = useState<"login"|"signup">("signup");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    if (!email.includes("@") || password.length < 6) { setError(password.length < 8 ? "Mot de passe : 8 caractères minimum." : "Email invalide."); setLoading(false); return; }
    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message === "User already registered" ? "Cet email est déjà inscrit. Connectez-vous." : err.message); setLoading(false); return; }
      setSuccess(true);
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError("Email ou mot de passe incorrect."); setLoading(false); return; }
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ background: T.card, borderRadius: "16px", maxWidth: "400px", width: "100%", padding: "32px" }}>
        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📧</div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Vérifiez vos emails</h2>
            <p style={{ color: T.textSoft, fontSize: "14px", marginBottom: "20px" }}>Un lien de confirmation a été envoyé à <strong>{email}</strong>. Cliquez dessus pour activer votre compte.</p>
            <button onClick={onClose} style={{ padding: "10px 24px", background: T.accent, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Compris</button>
          </div>
        ) : (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>{mode === "signup" ? "Créer un compte" : "Connexion"}</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", color: T.textMuted, cursor: "pointer" }}>✕</button>
          </div>
          {mode === "signup" && (
            <div style={{ background: T.greenLight, border: `1px solid ${T.green}33`, borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: T.green }}>
              🎁 Les 50 premiers inscrits : 1er mois gratuit + 3,49€/mois pendant 6 mois (-50%)
            </div>
          )}
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "13px", color: T.textSoft, display: "block", marginBottom: "4px" }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="vous@email.com" style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = T.border} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", color: T.textSoft, display: "block", marginBottom: "4px" }}>Mot de passe</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="8 caractères minimum" style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${T.border}`, borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }} onKeyDown={e => e.key === "Enter" && handleSubmit()} onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = T.border} />
          </div>
          {error && <p style={{ color: T.red, fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "12px", background: T.accent, color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "..." : mode === "signup" ? "Créer mon compte gratuit" : "Me connecter"}
          </button>
<div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}><div style={{ flex: 1, height: "1px", background: T.border }} /><span style={{ fontSize: "12px", color: T.textMuted }}>ou</span><div style={{ flex: 1, height: "1px", background: T.border }} /></div>
          <button onClick={async () => { await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } }); }} style={{ width: "100%", padding: "11px", background: T.card, color: T.text, border: `1.5px solid ${T.border}`, borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuer avec Google
          </button>
          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: T.textMuted }}>
            {mode === "signup" ? "Déjà inscrit ?" : "Pas encore de compte ?"}{" "}
            <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} style={{ background: "none", border: "none", color: T.accent, cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
              {mode === "signup" ? "Se connecter" : "Créer un compte"}
            </button>
          </p>
          <p style={{ textAlign: "center", fontSize: "11px", color: T.textMuted, marginTop: "12px", lineHeight: 1.5 }}>
            En créant un compte, vous acceptez nos <a href="/cgu" target="_blank" style={{ color: T.accent, textDecoration: "none" }}>CGU</a> et notre <a href="/confidentialite" target="_blank" style={{ color: T.accent, textDecoration: "none" }}>politique de confidentialité</a>.
          </p>
        </>)}
      </div>
    </div>
  );
}

// ─── GUIDE MODAL ───
function GuideModal({ guideKey, onClose }: { guideKey: string; onClose: () => void }) {
  const guide = guides[guideKey]; if (!guide) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px", overflowY: "auto" }}>
      <div style={{ background: T.card, borderRadius: "16px", maxWidth: "560px", width: "100%", marginTop: "60px", marginBottom: "40px" }}>
        <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div><h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>{guide.title}</h2><div style={{ fontSize: "12px", color: T.textMuted }}>⏱ {guide.time} · 📊 {guide.difficulty}</div></div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", color: T.textMuted, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: "20px" }}>
          {guide.steps.map((s, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "start", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 600 }}>{s.title}</h3>
              </div>
              <p style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.65, marginLeft: "34px" }}>{s.content}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 20px 20px", textAlign: "center" }}>
          <button onClick={onClose} style={{ padding: "10px 24px", background: T.accent, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ───
export default function Home() {
  const [step, setStep] = useState<"hero"|"scan"|"results">("hero");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [data, setData] = useState<ReturnType<typeof analyzeProfile>|null>(null);
  const [visNum, setVisNum] = useState(0);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [openGuide, setOpenGuide] = useState<string|null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{id:string;email:string}|null>(null);
  const [profile, setProfile] = useState<Profile|null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data: p } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (p) setProfile(p as Profile);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser({ id: session.user.id, email: session.user.email || "" }); fetchProfile(session.user.id); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser({ id: session.user.id, email: session.user.email || "" }); fetchProfile(session.user.id); }
      else { setUser(null); setProfile(null); }
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  useEffect(() => {
    supabase.from("profiles").select("*", { count: "exact", head: true }).then(({ count }) => setWaitlistCount(count || 0));
  }, []);

  const isPremium = profile?.is_premium || profile?.is_founder || false;

  const handleAnswer = (id: string, value: string) => {
    const next = { ...answers, [id]: value }; setAnswers(next);
    let ni = qIdx + 1;
    while (ni < questions.length) { const nq = questions[ni]; if (nq.showIf && !nq.showIf(next)) { next[nq.id] = "na"; ni++; } else break; }
    if (ni >= questions.length) {
      const result = analyzeProfile(next); setData(result); setStep("results");
      if (user) { supabase.from("profiles").update({ scan_data: next }).eq("id", user.id); }
    } else { setQIdx(ni); setVisNum(p => p + 1); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); };
  const reset = () => { setStep("hero"); setQIdx(0); setAnswers({}); setData(null); setVisNum(0); setOpenGuide(null); };
  const catLabels: Record<string,string> = { aide: "Aides & prestations", assurance: "Assurances", abonnement: "Abonnements & contrats", impot: "Impôts", energie: "Énergie" };
  const catColors: Record<string,string> = { aide: T.accent, assurance: T.purple, abonnement: T.orange, impot: T.green, energie: T.red };
  const spotsLeft = Math.max(0, MAX_WAITLIST - waitlistCount);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", color: T.text }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100, background: `${T.bg}EE`, backdropFilter: "blur(16px)", borderBottom: "1px solid #E5E7EB44" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, cursor: "pointer" }} onClick={reset}>Ec<span style={{ color: T.accent }}>o</span>nia</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {user ? (<>
            <span style={{ fontSize: "12px", color: T.textMuted, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{user.email}</span>
            {profile?.is_founder && <span style={{ fontSize: "10px", background: T.orangeLight, color: T.orange, padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>FONDATEUR</span>}
            <button onClick={handleLogout} style={{ padding: "6px 12px", background: "transparent", color: T.textMuted, border: `1px solid ${T.border}`, borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>Déconnexion</button>
          </>) : (
            <button onClick={() => setShowAuth(true)} style={{ padding: "8px 18px", background: T.accent, color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Connexion</button>
          )}
        </div>
      </nav>

      {/* HERO */}
      {step === "hero" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px 20px", background: `linear-gradient(180deg, ${T.accentLight} 0%, ${T.bg} 50%)` }}>
          <div style={{ fontSize: "42px", marginBottom: "16px" }}>🔍</div>
          <h1 style={{ fontSize: "clamp(30px, 7vw, 52px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "16px", maxWidth: "600px", letterSpacing: "-1px" }}>Découvrez combien vous pourriez <span style={{ color: T.accent }}>récupérer</span></h1>
          <p style={{ fontSize: "16px", color: T.textSoft, maxWidth: "440px", lineHeight: 1.6, marginBottom: "24px" }}>Econia analyse votre situation en 3 minutes et identifie les aides, économies et optimisations que vous ne percevez probablement pas.</p>
          <div style={{ padding: "8px 16px", borderRadius: "8px", background: spotsLeft > 0 ? T.orangeLight : "#FEE2E2", border: `1px solid ${spotsLeft > 0 ? T.orange : T.red}33`, marginBottom: "24px", fontSize: "13px", color: spotsLeft > 0 ? T.orange : T.red, fontWeight: 600 }}>
            {spotsLeft > 0 ? `🎁 Accès gratuit — Plus que ${spotsLeft} places sur ${MAX_WAITLIST}` : "Les 50 places gratuites sont prises !"}
          </div>
          <button onClick={() => { setStep("scan"); setVisNum(1); }} style={{ padding: "16px 40px", background: T.accent, color: "#fff", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(27,110,243,0.3)" }}>Lancer mon scan gratuit</button>
          <div style={{ display: "flex", gap: "32px", marginTop: "48px", flexWrap: "wrap", justifyContent: "center" }}>
            {[{ n: "10 Mds€", t: "d'aides non réclamées/an" }, { n: "500€", t: "d'abonnements oubliés/foyer" }, { n: "+5 à 8%", t: "hausse assurances/an" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: "22px", fontWeight: 700 }}>{s.n}</div><div style={{ fontSize: "12px", color: T.textMuted, marginTop: "2px" }}>{s.t}</div></div>
            ))}
          </div>
          <div style={{ marginTop: "48px", maxWidth: "500px", background: T.card, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "20px", textAlign: "left" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px", textAlign: "center" }}>🎁 Offre 50 premiers inscrits</h3>
            {["1er mois entièrement gratuit", "6 premiers mois à 3,49€/mois au lieu de 6,99€ (-50%)", "Accès complet : guides pas à pas, scripts de négociation, alertes", "Cases d'impôts personnalisées", "Accompagnement pour chaque économie détectée"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", fontSize: "13px", color: T.textSoft, padding: "4px 0" }}><span style={{ color: T.green }}>✓</span> {t}</div>
            ))}
          </div>
        </div>
      )}

      {/* SCAN */}
      {step === "scan" && qIdx < questions.length && (() => {
        const q = questions[qIdx];
        return (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
            <div style={{ width: "100%", maxWidth: "480px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <span style={{ fontSize: "13px", color: T.textMuted }}>{visNum}/19</span>
                <div style={{ width: "120px", height: "4px", background: "#F3F4F6", borderRadius: "2px", overflow: "hidden" }}><div style={{ width: `${(visNum/19)*100}%`, height: "100%", background: T.accent, borderRadius: "2px", transition: "width 0.3s" }} /></div>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "6px", lineHeight: 1.3 }}>{q.q}</h2>
              {"sub" in q && q.sub && <p style={{ fontSize: "13px", color: T.textMuted, marginBottom: "16px" }}>{q.sub as string}</p>}
              {!("sub" in q && q.sub) && <div style={{ height: "16px" }} />}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {q.options.map((o, i) => (
                  <button key={i} onClick={() => handleAnswer(q.id, o.value)} style={{ padding: "14px 18px", background: T.card, border: `1.5px solid ${T.border}`, borderRadius: "10px", fontSize: "15px", color: T.text, cursor: "pointer", textAlign: "left" as const, fontWeight: 500, transition: "all 0.15s" }}
                    onMouseOver={e => { (e.target as HTMLElement).style.borderColor = T.accent; (e.target as HTMLElement).style.background = T.accentLight; }}
                    onMouseOut={e => { (e.target as HTMLElement).style.borderColor = T.border; (e.target as HTMLElement).style.background = T.card; }}
                  >{o.label}</button>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* RESULTS */}
      {step === "results" && data && (() => {
        const grouped: Record<string, Gain[]> = {};
        data.gains.forEach(g => { if (!grouped[g.cat]) grouped[g.cat] = []; grouped[g.cat].push(g); });
        const avg = Math.round((data.gainMin + data.gainMax) / 2 / 12);
        const pleasures: string[] = [];
        if (avg >= 30) pleasures.push(`${Math.floor(avg/35)} dîner${Math.floor(avg/35)>1?"s":""} au restaurant`);
        if (avg >= 80) pleasures.push(`${Math.floor(avg/80)} sortie${Math.floor(avg/80)>1?"s":""} en famille`);
        if (avg >= 150) pleasures.push("1 week-end par trimestre");
        if (avg >= 50) pleasures.push(`${avg*12}€/an sur un livret d'épargne`);

        return (
          <div style={{ minHeight: "100vh", padding: "80px 20px 40px" }}>
            <div style={{ maxWidth: "560px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎯</div>
                <h2 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "6px" }}>Votre analyse Econia</h2>
                <p style={{ color: T.textSoft, fontSize: "14px" }}>{data.gains.length} pistes d&apos;économies identifiées</p>
              </div>
              <div style={{ background: `linear-gradient(135deg, ${T.accent}, #1550C0)`, borderRadius: "16px", padding: "24px", color: "#fff", textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Gain potentiel estimé</div>
                <div style={{ fontSize: "34px", fontWeight: 800 }}>{data.gainMin.toLocaleString()}€ — {data.gainMax.toLocaleString()}€<span style={{ fontSize: "15px", fontWeight: 400 }}>/an</span></div>
                <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "6px" }}>Hors crédits d&apos;impôt et aides déjà perçues</div>
              </div>
              {pleasures.length > 0 && (
                <div style={{ background: T.orangeLight, border: `1px solid ${T.orange}33`, borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: T.orange, marginBottom: "8px" }}>💛 Ce que ça représente chaque mois</div>
                  <div style={{ fontSize: "13px", lineHeight: 1.6 }}>{pleasures.map((p, i) => <div key={i}>• {p}</div>)}</div>
                  <div style={{ fontSize: "12px", color: T.textSoft, marginTop: "8px", fontStyle: "italic" }}>Des plaisirs cachés dans vos factures.</div>
                </div>
              )}
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: catColors[cat] || T.accent }} />
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{catLabels[cat] || cat}</h3>
                  </div>
                  {items.map((g, i) => {
                    const gk = gainToGuide[g.title]; const gd = gk ? guides[gk] : null;
                    return (
                      <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "14px", marginBottom: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}><span>{g.icon}</span><span style={{ fontSize: "14px", fontWeight: 600 }}>{g.title}</span></div>
                            <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5, margin: 0 }}>{g.desc}</p>
                          </div>
                          <div style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: catColors[g.cat] || T.accent, background: (catColors[g.cat] || T.accent) + "12", whiteSpace: "nowrap" as const }}>{g.montant}</div>
                        </div>
                        {gd && (
                          <div style={{ marginTop: "10px", borderTop: `1px solid ${T.border}`, paddingTop: "10px" }}>
                            {isPremium ? (
                              <button onClick={() => setOpenGuide(gk)} style={{ width: "100%", padding: "8px", background: T.accentLight, color: T.accent, border: `1px solid ${T.accent}33`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>📖 Voir le guide pas à pas ({gd.steps.length} étapes)</button>
                            ) : (
                              <button onClick={() => user ? undefined : setShowAuth(true)} style={{ width: "100%", padding: "8px", background: "#F9FAFB", color: T.textMuted, border: `1px dashed ${T.border}`, borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>🔒 Guide pas à pas ({gd.steps.length} étapes) — {user ? "Econia Premium" : "Créez un compte"}</button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              {(answers.statut === "salarie" || answers.statut === "cumul" || answers.enfants !== "0" || answers.sap !== "non") && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: T.green }} />
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const }}>Déclaration d&apos;impôts personnalisée</h3>
                  </div>
                  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}><span>📋</span><span style={{ fontSize: "14px", fontWeight: 600 }}>Vos cases d&apos;impôts à remplir</span></div>
                    <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5, margin: "0 0 10px" }}>Guide personnalisé : cases exactes, montants, erreurs à éviter.</p>
                    {isPremium ? (
                      <button onClick={() => setOpenGuide("impots_cases")} style={{ width: "100%", padding: "8px", background: T.greenLight, color: T.green, border: `1px solid ${T.green}33`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>📖 Voir mes cases ({guides.impots_cases.steps.length} sections)</button>
                    ) : (
                      <button onClick={() => user ? undefined : setShowAuth(true)} style={{ width: "100%", padding: "8px", background: "#F9FAFB", color: T.textMuted, border: `1px dashed ${T.border}`, borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>🔒 Mes cases personnalisées — {user ? "Premium" : "Créez un compte"}</button>
                    )}
                  </div>
                </div>
              )}
              {data.infos.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, marginBottom: "10px" }}>💡 Bon à savoir</h3>
                  {data.infos.map((info, i) => (
                    <div key={i} style={{ background: T.accentLight, border: `1px solid ${T.accent}22`, borderRadius: "10px", padding: "14px", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}><span>{info.icon}</span><span style={{ fontSize: "14px", fontWeight: 600, color: T.accent }}>{info.title}</span></div>
                      <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              {!user && (
                <div style={{ background: T.greenLight, border: `1px solid ${T.green}33`, borderRadius: "12px", padding: "20px", textAlign: "center", marginTop: "24px" }}>
                  <p style={{ fontSize: "15px", color: T.green, fontWeight: 600, marginBottom: "6px" }}>Créez votre compte pour sauvegarder vos résultats</p>
                  <p style={{ fontSize: "13px", color: T.textSoft, marginBottom: "14px" }}>
                    {spotsLeft > 0 ? `50 premiers : 1er mois gratuit + 3,49€/mois pendant 6 mois. Plus que ${spotsLeft} places.` : "Inscrivez-vous pour être prévenu(e) des prochaines offres."}
                  </p>
                  <button onClick={() => setShowAuth(true)} style={{ padding: "11px 28px", background: T.green, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Créer mon compte gratuit</button>
                </div>
              )}
              <div style={{ textAlign: "center", marginTop: "20px" }}><button onClick={reset} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>Refaire un scan</button></div>
              <p style={{ textAlign: "center", fontSize: "10px", color: T.textMuted, marginTop: "20px", lineHeight: 1.5 }}>Estimations indicatives basées sur les barèmes avril 2026. Seuls les organismes compétents peuvent confirmer vos droits.</p>
            </div>
          </div>
        );
      })()}

     {step === "hero" && (
        <footer style={{ textAlign: "center", padding: "32px 20px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Ec<span style={{ color: T.accent }}>o</span>nia</div>
          <p style={{ fontSize: "12px", color: T.textMuted }}>Découvrez combien vous pourriez récupérer</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
            <a href="/mentions-legales" style={{ fontSize: "12px", color: T.textMuted, textDecoration: "none" }}
              onMouseOver={e => (e.target as HTMLElement).style.color = T.accent}
              onMouseOut={e => (e.target as HTMLElement).style.color = T.textMuted}>Mentions légales</a>
            <a href="/confidentialite" style={{ fontSize: "12px", color: T.textMuted, textDecoration: "none" }}
              onMouseOver={e => (e.target as HTMLElement).style.color = T.accent}
              onMouseOut={e => (e.target as HTMLElement).style.color = T.textMuted}>Confidentialité</a>
            <a href="/cgu" style={{ fontSize: "12px", color: T.textMuted, textDecoration: "none" }}
              onMouseOver={e => (e.target as HTMLElement).style.color = T.accent}
              onMouseOut={e => (e.target as HTMLElement).style.color = T.textMuted}>CGU</a>
          </div>
          <p style={{ fontSize: "11px", color: T.textMuted, marginTop: "12px" }}>© 2026 Econia — Estimations indicatives basées sur les barèmes officiels</p>
        </footer>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
      {openGuide && <GuideModal guideKey={openGuide} onClose={() => setOpenGuide(null)} />}
    </div>
  );
}

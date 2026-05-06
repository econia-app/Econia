"use client";
import { useState, useEffect } from "react";
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
    title: "Comparer et renégocier vos assurances",
    time: "30 min par assurance", difficulty: "Facile",
    steps: [
      { title: "Listez vos contrats", content: "Pour chaque assurance (auto, habitation, mutuelle), notez : l'assureur, le type de garantie (tiers/tiers+/tous risques), le montant annuel, la date d'échéance et la franchise. Ou prenez en photo chaque contrat — Econia extraira les données automatiquement." },
      { title: "Vérifiez l'adéquation", content: "Votre véhicule a plus de 8 ans et vaut moins de 5 000€ ? Le tous risques est probablement inutile — passez en tiers+ (économie 200-300€/an). Votre franchise est à 150€ ? La passer à 300€ réduit la prime de 10-15%. Votre mutuelle a un niveau optique élevé alors que vous n'avez pas de lunettes ? Réduisez." },
      { title: "Comparez en ligne", content: "Allez sur lelynx.fr ou lesfurets.com. Pour l'auto, préparez : immatriculation, date du permis, bonus/malus (sur votre relevé d'information), km/an, sinistres des 3 dernières années. Pour l'habitation : surface, nombre de pièces, étage, capital mobilier estimé." },
      { title: "Négociez avec votre assureur", content: "Script d'appel : \"Bonjour, je suis client depuis [X ans]. Mon contrat arrive à échéance. J'ai un devis chez [concurrent] à [montant]€ pour des garanties équivalentes. Pouvez-vous vous aligner ? Je suis prêt à regrouper auto + habitation chez vous.\" Demandez le service fidélisation, pas le standard." },
      { title: "Changez si nécessaire", content: "Loi Hamon : changement auto/habitation à tout moment après 1 an. Le nouvel assureur s'occupe de la résiliation — vous n'avez rien à faire. Mutuelle : résiliation infra-annuelle après 1 an." },
      { title: "Programmez l'alerte annuelle", content: "Econia programme une alerte 2 mois avant votre prochaine échéance pour refaire la comparaison l'année prochaine. Les assurances augmentent de 5-8% chaque année — sans comparaison régulière, vous surpayez." },
    ],
  },
  doublons_cb: {
    title: "Vérifier les doublons avec votre carte bancaire",
    time: "15 min", difficulty: "Facile",
    steps: [
      { title: "Trouvez vos conditions CB", content: "Dans votre app bancaire : rubrique \"Ma carte\" ou \"Conditions\". Ou appelez votre banque et demandez les conditions d'assurance de votre carte. Ou photographiez le document — Econia extraira les assurances automatiquement." },
      { title: "Identifiez les assurances incluses", content: "Carte classique : assurance décès voyage basique. Carte Premier/Gold : assurance annulation voyage, bagages, location véhicule, téléphone (achat < 6 mois payé avec la carte), responsabilité civile étranger, garantie achats. Carte Platinum : tout avec des plafonds plus élevés + assurance ski." },
      { title: "Comparez avec vos contrats séparés", content: "Créez un tableau : pour chaque garantie incluse dans votre CB, vérifiez si vous payez un contrat séparé pour la même chose. Exemples fréquents de doublons : assurance téléphone (9,99€/mois = 120€/an), assurance voyage, extension de garantie en magasin." },
      { title: "Résiliez les doublons", content: "Pour chaque doublon identifié, résiliez le contrat séparé (le moins avantageux). Attention : vérifiez les plafonds de votre CB (assurance téléphone souvent limitée à 800€) et les conditions (le billet d'avion doit avoir été payé avec la carte pour l'assurance voyage)." },
    ],
  },
  assurance_emprunteur: {
    title: "Changer d'assurance de prêt immobilier (loi Lemoine)",
    time: "45 min", difficulty: "Moyen",
    steps: [
      { title: "Rassemblez vos infos", content: "Retrouvez votre offre de prêt : montant initial emprunté, capital restant dû, durée restante, taux du prêt, taux de l'assurance actuelle (ex: 0,34%), montant mensuel de l'assurance, et la liste des garanties exigées par la banque (fiche standardisée d'information)." },
      { title: "Calculez ce que vous payez", content: "Exemple : prêt 200 000€, assurance banque à 0,34% = 680€/an soit 56,67€/mois. C'est ce montant qu'on va réduire." },
      { title: "Comparez en ligne", content: "Allez sur magnolia.fr, reassurez-moi.fr ou empruntis.com. Renseignez votre prêt, votre âge et votre santé. Le taux proposé sera souvent entre 0,08% et 0,20% pour un profil standard de moins de 45 ans. Exemple : 200 000€ à 0,12% = 240€/an → économie de 440€/an." },
      { title: "Vérifiez l'équivalence des garanties", content: "Le nouveau contrat doit couvrir au moins les mêmes garanties : décès, PTIA, ITT, IPP/IPT. Les comparateurs vérifient automatiquement et délivrent une attestation d'équivalence." },
      { title: "Souscrivez le nouveau contrat", content: "Signature en ligne. Pour les prêts < 200 000€ par emprunteur remboursés avant 60 ans : pas de questionnaire médical (droit à l'oubli)." },
      { title: "Envoyez la demande à votre banque", content: "Par courrier recommandé ou messagerie sécurisée, envoyez : le nouveau contrat signé, l'attestation d'équivalence, et une lettre mentionnant la loi du 28 février 2022. La banque a 10 jours ouvrés pour accepter ou refuser (le refus doit être motivé par écrit)." },
      { title: "C'est fait", content: "La banque accepte, met à jour votre tableau d'amortissement. L'économie apparaît dès la prochaine échéance. L'ancien contrat est résilié automatiquement. Econia met à jour votre compteur de gains." },
    ],
  },
  abonnements: {
    title: "Détecter et supprimer vos abonnements fantômes",
    time: "20 min", difficulty: "Facile",
    steps: [
      { title: "Identifiez tous vos prélèvements", content: "Méthode 1 : connectez-vous à votre banque en ligne et listez TOUS les prélèvements récurrents des 3 derniers mois (même ceux de 1,99€). Méthode 2 : vérifiez vos stores — iPhone : Réglages → [votre nom] → Abonnements. Android : Play Store → photo → Paiements → Abonnements." },
      { title: "Classez en 3 colonnes", content: "GARDER : utilisé régulièrement, bon rapport qualité/prix. RÉDUIRE : utilisé mais formule trop chère (Netflix Premium → Standard = -5€/mois, forfait 100 Go → 5 Go = -20€/mois). RÉSILIER : non utilisé depuis plus de 30 jours (salle de sport, app testée 1 fois, cloud surdimensionné)." },
      { title: "Résiliez chaque abonnement inutile", content: "Netflix : netflix.com/cancelplan. Disney+ : compte → Abonnement → Annuler. Spotify : support.spotify.com/fr/cancel-premium. Salle de sport : souvent lettre recommandée obligatoire. IMPORTANT : supprimer une app NE résilie PAS l'abonnement si le paiement passe par Apple/Google Play." },
      { title: "Econia stocke et surveille", content: "Chaque abonnement conservé est noté dans votre profil avec son montant et sa date de fin d'offre promo. Econia vous alertera 1 mois avant que le prix augmente." },
    ],
  },
  alertes_offre: {
    title: "Ne plus jamais voir son forfait doubler de prix",
    time: "5 min (Econia fait le reste)", difficulty: "Facile",
    steps: [
      { title: "Econia enregistre vos dates", content: "Lors de l'audit abonnements, chaque contrat avec offre promo est enregistré : le prix actuel, le prix après promo, et la date de fin. Exemple : Free Mobile 9,99€ → 19,99€ le 15/09/2026." },
      { title: "L'alerte 1 mois avant", content: "Econia vous envoie une notification : \"Votre forfait Free passe de 9,99€ à 19,99€ dans 30 jours.\" avec 3 options : renégocier (script d'appel fourni), changer (meilleure offre concurrente du moment), ou garder." },
      { title: "Le script de négociation", content: "Free (3244) : \"Bonjour, je suis client depuis [X] mois. Mon offre à 9,99€ se termine. J'ai un devis chez Bouygues à 11,99€. Pouvez-vous me proposer une offre ?\" Orange (3900) : \"Mon engagement se termine. Mon forfait passe de [X]€ à [Y]€. Transférez-moi au service résiliation.\" Astuce : le service rétention a toujours des offres que le standard n'a pas." },
      { title: "Box internet — même principe", content: "\"Mon offre box à [X]€ se termine. Le tarif passe à [Y]€. Free propose une Freebox Pop à 29,99€. Pouvez-vous vous aligner ?\" Le changement de box est gratuit — le nouvel opérateur s'occupe de tout, y compris la résiliation." },
    ],
  },
  energie: {
    title: "Réduire vos factures d'énergie",
    time: "15 min", difficulty: "Facile",
    steps: [
      { title: "Identifiez votre situation", content: "Sur votre facture ou espace client, trouvez : votre fournisseur, votre type de contrat (tarif réglementé ou offre de marché), votre option tarifaire (Base ou Heures Pleines/Creuses), votre puissance compteur (6, 9 ou 12 kVA), et votre consommation annuelle en kWh. Ou photographiez votre facture." },
      { title: "Vérifiez votre option tarifaire", content: "Base : même prix jour et nuit — adapté si consommation régulière. HP/HC : prix réduit la nuit (22h-6h) — adapté si chauffe-eau programmable. Si vous êtes en HP/HC mais ne consommez pas la nuit → passez en Base (économie 50-100€/an). Changement gratuit." },
      { title: "Vérifiez votre puissance compteur", content: "6 kVA : suffisant pour un appartement sans chauffage électrique. 9 kVA : maison avec chauffage électrique. Si votre compteur ne disjoncte JAMAIS, votre puissance est surdimensionnée. Passer de 9 à 6 kVA = ~30€/an d'économie." },
      { title: "Comparez les fournisseurs", content: "Allez sur energie-info.fr/comparateur/ (site officiel du médiateur de l'énergie). Renseignez votre consommation → les offres s'affichent classées par prix. Le changement est gratuit, sans coupure, sans engagement. Le nouveau fournisseur s'occupe de tout." },
      { title: "Radar Econia", content: "Econia surveille les tarifs et vous alerte : quand le tarif réglementé change, quand votre fournisseur augmente ses prix, quand une offre promotionnelle apparaît. Vous ne ratez plus jamais une opportunité d'économie." },
    ],
  },
  frais_reels: {
    title: "Frais réels — plus avantageux que l'abattement 10% ?",
    time: "10 min", difficulty: "Moyen",
    steps: [
      { title: "Econia calcule pour vous", content: "Avec votre distance domicile-travail, la puissance de votre véhicule et votre mode de restauration, Econia compare automatiquement l'abattement 10% avec les frais réels. Si les frais réels sont plus avantageux, on vous le dit avec le montant exact de l'économie." },
      { title: "Les frais kilométriques", content: "Barème 2026 (exemple 5 CV) : jusqu'à 5 000 km → distance × 0,636€. De 5 001 à 20 000 km → (distance × 0,357) + 1 395€. Au-delà → distance × 0,427€. Véhicule électrique : barème majoré de 20%. Limité à 40 km aller sauf justification." },
      { title: "Les frais de repas", content: "Restaurant sans ticket resto : (prix repas - 5,45€) par jour, max 15,65€/repas. Gamelle sans ticket resto : 5,45€ par jour forfaitaire (sans justificatif). Avec tickets resto : déduire la part employeur. Sur 220 jours avec gamelle : 5,45 × 220 = 1 199€ déductibles." },
      { title: "Autres frais déductibles", content: "Péages (montant réel), stationnement, télétravail (2,70€/jour, max ~603€/an), double résidence professionnelle, vêtements spécifiques (bleus de travail), formation professionnelle, matériel pro (ordinateur au prorata usage pro), cotisations syndicales." },
      { title: "Comment déclarer", content: "Case 1AK : montez le montant total de vos frais réels. Conservez tous les justificatifs pendant 3 ans : bulletins de paie, carte grise, tickets de péage. Econia génère le détail du calcul que vous pouvez joindre à votre déclaration." },
    ],
  },
  droits_conso: {
    title: "Récupérer de l'argent grâce à vos droits",
    time: "Variable", difficulty: "Facile",
    steps: [
      { title: "Garantie légale 2 ans", content: "Votre appareil tombe en panne dans les 2 ans ? Le VENDEUR (pas le fabricant) doit réparer ou remplacer gratuitement. Script : \"Mon [appareil] acheté le [date] présente un défaut. Conformément à l'article L217-4, je demande la réparation ou le remplacement.\" Le vendeur NE PEUT PAS vous renvoyer vers le fabricant." },
      { title: "Bonus réparation", content: "Réduction de 10 à 60€ sur la réparation d'appareils chez les réparateurs labellisés QualiRépar. Plutôt que racheter neuf, réparez pour moins cher. Liste des réparateurs : ecosystem.eco/bonus-reparation" },
      { title: "Indemnisation retard de train", content: "TGV : 25% du billet si retard 30-60 min, 50% si 60-120 min, 75% si +2h. Demande sur oui.sncf/aide/indemnisation ou en gare, dans les 60 jours." },
      { title: "Indemnisation avion", content: "Retard > 3h ou annulation : 250€ (vol < 1 500 km), 400€ (1 500-3 500 km), 600€ (> 3 500 km). Vol au départ de l'UE ou vers l'UE sur compagnie européenne. Demande sur le site de la compagnie." },
      { title: "Colis non reçu", content: "Le vendeur est responsable jusqu'à la livraison. Script : \"Je n'ai pas reçu ma commande n°[X]. Conformément à l'article L216-1, je demande le remboursement intégral sous 14 jours.\" Le vendeur NE PEUT PAS dire \"voyez avec le transporteur\"." },
      { title: "Rétractation 14 jours", content: "Tout achat en ligne ou par démarchage → retour sans motif sous 14 jours. Le vendeur a 14 jours pour rembourser. Script : \"Conformément à l'article L221-18, je me rétracte de mon achat n°[X] du [date].\"" },
    ],
  },
  aides_sociales: {
    title: "Obtenir vos aides sociales",
    time: "15 min par aide", difficulty: "Facile",
    steps: [
      { title: "Simulez vos droits", content: "Pour chaque aide détectée, allez sur le simulateur officiel : RSA et prime d'activité → caf.fr/simulateur. APL → caf.fr/simulateur. CSS → ameli.fr. ASPA → lassuranceretraite.fr. AAH → contactez votre MDPH." },
      { title: "Faites la demande", content: "Si le simulateur confirme votre éligibilité : sur caf.fr → \"Faire une demande de prestation\" → sélectionnez l'aide. Documents généralement nécessaires : pièce d'identité, justificatif de domicile, RIB, avis d'imposition, justificatifs de ressources des 3 derniers mois." },
      { title: "Renseignez correctement", content: "Revenus : utilisez le salaire NET (pas le brut). Si micro-entreprise : déclarez le CA brut, la CAF applique l'abattement. En concubinage : les revenus du conjoint comptent. Les revenus fonciers sont pris en compte." },
      { title: "Attendez et suivez", content: "Réponse sous 1 à 2 mois. Versement le 5 du mois. Econia programme un rappel pour votre déclaration trimestrielle (obligatoire pour RSA et prime d'activité, sinon le versement s'arrête)." },
      { title: "Pièges à éviter", content: "La prime d'activité n'est PAS automatique — il faut la demander. Le RSA est soumis à des obligations d'insertion. L'APL est calculée sur les revenus actuels (pas N-2). Tout changement de situation (séparation, emploi, déménagement) → mettre à jour immédiatement sur caf.fr." },
    ],
  },
  leasing_social: {
    title: "Leasing social — voiture électrique à 100€/mois",
    time: "10 min (quand le dispositif ouvre)", difficulty: "Facile",
    steps: [
      { title: "Vérifiez votre éligibilité", content: "Conditions : RFR par part fiscale ≤ 16 300€, habiter à plus de 15 km du travail OU parcourir plus de 8 000 km/an. Ouvert aussi aux professions essentielles : infirmières, aides à domicile, artisans, agents publics." },
      { title: "Calculez votre RFR par part", content: "RFR ÷ nombre de parts = RFR par part. Exemple : RFR 45 000€, marié + 2 enfants = 3 parts → 45 000 ÷ 3 = 15 000€/part → éligible (< 16 300€). Votre RFR est sur votre avis d'imposition, page 1 en haut." },
      { title: "Calculez votre gain", content: "Véhicule diesel moyen : ~3 800€/an (carburant + entretien + assurance). Leasing social : ~1 200€/an (loyer 100-200€ + électricité + assurance réduite). Économie : environ 2 600€/an. Aide possible jusqu'à 9 500€ si batterie européenne." },
      { title: "Alerte Econia", content: "Le dispositif ouvre en juillet 2026 avec 50 000 véhicules. Les places partent vite. Econia vous enverra une alerte dès l'ouverture des inscriptions avec le lien direct et la marche à suivre." },
    ],
  },
  impots_cases: {
    title: "Vos cases d'impôts personnalisées",
    time: "15 min", difficulty: "Moyen",
    steps: [
      { title: "Vérifiez les montants pré-remplis", content: "Cases 1AJ-1DJ : vos salaires. Vérifiez que le montant correspond à votre bulletin de décembre 2025, ligne \"Net imposable\". Les erreurs sont fréquentes (primes, heures supplémentaires mal reportées)." },
      { title: "Revenus complémentaires", content: "Micro-entreprise → cases 5KO/5KP (vente), 5HQ/5HN (prestations) ou 5HY (BNC). Versement libératoire → cases 5TA/5TB/5TE. Micro-foncier → case 4BE (loyers bruts, abattement 30% automatique). Reportez le CA ou les loyers BRUTS." },
      { title: "Services à la personne (CESU)", content: "Case 7DB : montant total des dépenses SAP (salaire net + cotisations). Case 7DR : aides à déduire (CESU préfinancé employeur, APA). Case 7DQ : cochez si première année (plafond 15 000€ au lieu de 12 000€). Attestation fiscale sur cesu.urssaf.fr." },
      { title: "Garde d'enfants hors domicile", content: "Case 7GA : frais garde 1er enfant (après déduction CMG et aides). Case 7GB : 2ème enfant. Plafond 3 500€/enfant. Incluez : salaire net nounou + cotisations + indemnités d'entretien (2,65€/jour forfait) + garderie/périscolaire (hors repas). Attestation sur pajemploi.urssaf.fr." },
      { title: "Autres réductions à ne pas oublier", content: "Dons associations : case 7UF (66%) et 7UD (75% pour aide aux personnes, jusqu'à 1 000€). Scolarité : 7EA (collège 61€), 7EC (lycée 153€), 7EF (supérieur 183€). PER : case 6NS. Borne VE : case 7ZQ/7ZR (crédit 75%, max 500€). Parent isolé : case T (demi-part souvent oubliée)." },
    ],
  },
};

// Map scan results to guide keys
const gainToGuide: Record<string, string> = {
  "Assurances non comparées": "assurance_compare",
  "Doublons carte bancaire": "doublons_cb",
  "Assurance emprunteur (loi Lemoine)": "assurance_emprunteur",
  "Abonnements fantômes": "abonnements",
  "Alertes fin d'offre": "alertes_offre",
  "Optimisation énergie": "energie",
  "Frais réels vs abattement 10%": "frais_reels",
  "RSA": "aides_sociales",
  "Prime d'activité": "aides_sociales",
  "APL": "aides_sociales",
  "ASPA (minimum vieillesse)": "aides_sociales",
  "Complémentaire Santé Solidaire": "aides_sociales",
  "Chèque énergie": "aides_sociales",
  "AAH / PCH": "aides_sociales",
  "Aides jeunes / étudiants": "aides_sociales",
  "Allocation rentrée scolaire": "aides_sociales",
  "MaPrimeRénov' + CEE": "aides_sociales",
  "Leasing social": "leasing_social",
};

const questions = [
  { id: "marital", q: "Votre situation maritale ?", options: [
    { value: "marie", label: "Marié(e)" }, { value: "pacse", label: "Pacsé(e)" },
    { value: "concubin", label: "En concubinage" }, { value: "celibataire", label: "Célibataire" },
    { value: "divorce", label: "Divorcé(e)" }, { value: "veuf", label: "Veuf/Veuve" },
  ]},
  { id: "age", q: "Votre tranche d'âge ?", options: [
    { value: "18-25", label: "18-25 ans" }, { value: "26-34", label: "26-34 ans" },
    { value: "35-49", label: "35-49 ans" }, { value: "50-61", label: "50-61 ans" },
    { value: "62plus", label: "62 ans et plus" },
  ]},
  { id: "statut", q: "Votre situation professionnelle ?", options: [
    { value: "salarie", label: "Salarié(e)" }, { value: "independant", label: "Indépendant" },
    { value: "cumul", label: "Salarié + activité indépendante" }, { value: "chomage", label: "Demandeur d'emploi" },
    { value: "retraite", label: "Retraité(e)" }, { value: "etudiant", label: "Étudiant(e)" },
  ]},
  { id: "handicap", q: "Situation de handicap (vous ou votre foyer) ?", options: [
    { value: "oui", label: "Oui" }, { value: "non", label: "Non" },
  ]},
  { id: "enfants", q: "Enfants à charge (moins de 20 ans) ?", options: [
    { value: "0", label: "0" }, { value: "1", label: "1" },
    { value: "2", label: "2" }, { value: "3+", label: "3 ou plus" },
  ]},
  { id: "ageEnfant", q: "Âge de votre enfant le plus jeune ?", options: [
    { value: "moins3", label: "Moins de 3 ans" }, { value: "3-5", label: "3 à 5 ans" },
    { value: "6-10", label: "6 à 10 ans" }, { value: "11-17", label: "11 à 17 ans" },
  ], showIf: (a: Record<string,string>) => a.enfants !== "0" },
  { id: "garde", q: "Mode de garde utilisé ?", options: [
    { value: "creche", label: "Crèche" }, { value: "nounou", label: "Nounou" },
    { value: "periscolaire", label: "Périscolaire" }, { value: "famille", label: "Famille / aucun" },
  ], showIf: (a: Record<string,string>) => a.enfants !== "0" && (a.ageEnfant === "moins3" || a.ageEnfant === "3-5") },
  { id: "revenus", q: "Revenus nets mensuels du foyer ?", options: [
    { value: "moins1500", label: "Moins de 1 500€" }, { value: "1500-2500", label: "1 500 — 2 500€" },
    { value: "2500-4000", label: "2 500 — 4 000€" }, { value: "4000-6000", label: "4 000 — 6 000€" },
    { value: "plus6000", label: "Plus de 6 000€" },
  ]},
  { id: "epargne", q: "Épargne et patrimoine approximatif ?", options: [
    { value: "moins10k", label: "Moins de 10 000€" }, { value: "10-50k", label: "10 000 — 50 000€" },
    { value: "50-150k", label: "50 000 — 150 000€" }, { value: "plus150k", label: "Plus de 150 000€" },
    { value: "secret", label: "Je préfère ne pas répondre" },
  ]},
  { id: "imposable", q: "Payez-vous des impôts sur le revenu ?", options: [
    { value: "oui", label: "Oui" }, { value: "non", label: "Non" }, { value: "sais_pas", label: "Je ne sais pas" },
  ]},
  { id: "logement", q: "Votre logement ?", options: [
    { value: "proprio_credit", label: "Propriétaire avec crédit" },
    { value: "proprio_sans", label: "Propriétaire sans crédit" },
    { value: "locataire", label: "Locataire" }, { value: "heberge", label: "Hébergé gratuitement" },
  ]},
  { id: "logementAge", q: "Votre logement a plus de 15 ans ?", options: [
    { value: "oui", label: "Oui" }, { value: "non", label: "Non" }, { value: "sais_pas", label: "Je ne sais pas" },
  ], showIf: (a: Record<string,string>) => a.logement === "proprio_credit" || a.logement === "proprio_sans" },
  { id: "assurances", q: "Assurances comparées ces 12 derniers mois ?", options: [
    { value: "oui_tout", label: "Oui, toutes" }, { value: "certaines", label: "Certaines" }, { value: "non", label: "Non, jamais" },
  ]},
  { id: "abonnements", q: "Connaissez-vous vos abonnements récurrents ?", options: [
    { value: "oui_precis", label: "Oui, précisément" }, { value: "a_peu_pres", label: "À peu près" }, { value: "aucune_idee", label: "Aucune idée" },
  ]},
  { id: "sap", q: "Utilisez-vous des services à domicile ?", sub: "(ménage, jardinage, garde, soutien scolaire)", options: [
    { value: "oui_cesu", label: "Oui, avec CESU" }, { value: "oui_sans_cesu", label: "Oui, sans CESU" }, { value: "non", label: "Non" },
  ]},
  { id: "credit", q: "Avez-vous un crédit immobilier en cours ?", options: [
    { value: "oui_5", label: "Oui, depuis moins de 5 ans" }, { value: "oui_15", label: "Oui, depuis 5-15 ans" },
    { value: "oui_15plus", label: "Oui, depuis plus de 15 ans" }, { value: "non", label: "Non" },
  ]},
  { id: "vehicule", q: "Votre véhicule principal ?", options: [
    { value: "thermique", label: "Thermique (essence/diesel)" }, { value: "electrique", label: "Électrique / hybride" }, { value: "aucun", label: "Pas de véhicule" },
  ]},
  { id: "distance", q: "Distance domicile-travail ?", options: [
    { value: "moins15", label: "Moins de 15 km" }, { value: "15-30", label: "15 à 30 km" },
    { value: "30-50", label: "30 à 50 km" }, { value: "50plus", label: "Plus de 50 km" },
    { value: "na", label: "Pas concerné" },
  ]},
  { id: "changement", q: "Changement prévu dans les 12 mois ?", options: [
    { value: "demenagement", label: "Déménagement" }, { value: "naissance", label: "Naissance" },
    { value: "vehicule_change", label: "Changement de véhicule" }, { value: "retraite_change", label: "Départ en retraite" },
    { value: "rien", label: "Rien de prévu" },
  ]},
];

type Gain = { cat: string; icon: string; title: string; desc: string; montant: string; annuel: number[] };
type Info = { icon: string; title: string; desc: string };

function analyzeProfile(a: Record<string,string>): { gains: Gain[]; infos: Info[]; gainMin: number; gainMax: number } {
  const gains: Gain[] = [];
  const infos: Info[] = [];
  const isModeste = a.revenus === "moins1500" || a.revenus === "1500-2500";
  const hasKids = a.enfants && a.enfants !== "0";
  const youngKids = a.ageEnfant === "moins3" || a.ageEnfant === "3-5";
  if (a.revenus === "moins1500" && a.statut !== "retraite") gains.push({ cat: "aide", icon: "🏛️", title: "RSA", desc: "Revenu minimum garanti pour les personnes sans ressources.", montant: "jusqu'à 651€/mois", annuel: [3500, 7820] });
  if (isModeste && !["retraite","etudiant","chomage"].includes(a.statut)) gains.push({ cat: "aide", icon: "💰", title: "Prime d'activité", desc: "Complément de revenus pour les travailleurs modestes.", montant: "100 à 350€/mois", annuel: [600, 3600] });
  if (a.logement === "locataire" && isModeste) gains.push({ cat: "aide", icon: "🏠", title: "APL", desc: "Aide pour réduire votre loyer.", montant: "50 à 400€/mois", annuel: [600, 4800] });
  if (hasKids && ["6-10","11-17"].includes(a.ageEnfant) && isModeste) gains.push({ cat: "aide", icon: "🎒", title: "Allocation rentrée scolaire", desc: "Versée en août pour les fournitures.", montant: "427 à 466€/enfant", annuel: [427, 932] });
  if (a.statut === "retraite" && isModeste) gains.push({ cat: "aide", icon: "🧓", title: "ASPA (minimum vieillesse)", desc: "Complément pour les petites retraites.", montant: "jusqu'à 1 043€/mois", annuel: [2000, 12516] });
  if (isModeste) gains.push({ cat: "aide", icon: "🏥", title: "Complémentaire Santé Solidaire", desc: "Mutuelle gratuite ou à moins de 1€/jour.", montant: "30 à 100€/mois", annuel: [360, 1200] });
  if (isModeste) gains.push({ cat: "aide", icon: "🔥", title: "Chèque énergie", desc: "Aide au paiement des factures.", montant: "48 à 277€/an", annuel: [48, 277] });
  if (a.handicap === "oui") gains.push({ cat: "aide", icon: "♿", title: "AAH / PCH", desc: "Allocations liées au handicap.", montant: "jusqu'à 1 042€/mois", annuel: [3000, 12492] });
  if (a.age === "18-25" || a.statut === "etudiant") gains.push({ cat: "aide", icon: "🎓", title: "Aides jeunes / étudiants", desc: "Bourse, Visale, aide au permis.", montant: "variable", annuel: [500, 5000] });
  if (a.assurances !== "oui_tout") { gains.push({ cat: "assurance", icon: "🛡️", title: "Assurances non comparées", desc: "Hausse de 5-8%/an. Vous surpayez probablement.", montant: "150 à 400€/an", annuel: [150, 400] }); gains.push({ cat: "assurance", icon: "💳", title: "Doublons carte bancaire", desc: "Votre CB inclut des assurances. Vérifiez les doublons.", montant: "80 à 200€/an", annuel: [80, 200] }); }
  if (["oui_5","oui_15","oui_15plus"].includes(a.credit)) gains.push({ cat: "assurance", icon: "🏦", title: "Assurance emprunteur (loi Lemoine)", desc: "Changez à tout moment. Économie 5 000-15 000€.", montant: "400 à 1 200€/an", annuel: [400, 1200] });
  if (a.abonnements !== "oui_precis") gains.push({ cat: "abonnement", icon: "📱", title: "Abonnements fantômes", desc: "1 Français sur 3 paie un abonnement oublié.", montant: "200 à 500€/an", annuel: [200, 500] });
  gains.push({ cat: "abonnement", icon: "⏰", title: "Alertes fin d'offre", desc: "Econia vous prévient avant que vos promos expirent.", montant: "100 à 400€/an", annuel: [100, 400] });
  if (a.logement !== "heberge") gains.push({ cat: "energie", icon: "⚡", title: "Optimisation énergie", desc: "Comparaison fournisseurs et option tarifaire.", montant: "100 à 300€/an", annuel: [100, 300] });
  if (["salarie","cumul"].includes(a.statut) && ["15-30","30-50","50plus"].includes(a.distance)) gains.push({ cat: "impot", icon: "🚗", title: "Frais réels vs abattement 10%", desc: "Les frais réels sont potentiellement plus avantageux.", montant: "200 à 1 500€/an", annuel: [200, 1500] });
  if (["proprio_credit","proprio_sans"].includes(a.logement) && a.logementAge === "oui") gains.push({ cat: "aide", icon: "🏗️", title: "MaPrimeRénov' + CEE", desc: "Aides rénovation énergétique cumulables.", montant: "1 000 à 10 000€", annuel: [0, 0] });
  if (a.vehicule === "thermique" && isModeste) gains.push({ cat: "aide", icon: "🚗", title: "Leasing social", desc: "Voiture électrique à ~100€/mois.", montant: "~2 800€/an vs diesel", annuel: [1500, 2800] });
  if (hasKids && youngKids) infos.push({ icon: "👶", title: "Vérifiez votre CMG", desc: "Depuis la réforme 2025, le CMG peut atteindre 992€/mois. Plus de reste à charge 15%. Simulation sur urssaf.fr." });
  infos.push({ icon: "💡", title: "Crédit d'impôt Services à la Personne", desc: "50% remboursé : ménage, jardinage, garde, soutien scolaire... Plafond 12 000€/an. MÊME SANS PAYER D'IMPÔTS. Cases 7DB et 7GA." });
  if (a.sap === "oui_sans_cesu") infos.push({ icon: "📋", title: "CESU — Vous perdez 50% de remboursement", desc: "Services à domicile sans CESU = pas de crédit d'impôt. Avec l'Avance Immédiate CESU+, vous ne payez que la moitié. Inscription gratuite sur cesu.urssaf.fr." });
  let gainMin = 0, gainMax = 0;
  gains.forEach(g => { gainMin += g.annuel[0]; gainMax += g.annuel[1]; });
  return { gains, infos, gainMin: Math.min(gainMin, 12000), gainMax: Math.min(gainMax, 20000) };
}

const MAX_WAITLIST = 50;

// ─── GUIDE MODAL ───
function GuideModal({ guideKey, onClose }: { guideKey: string; onClose: () => void }) {
  const guide = guides[guideKey];
  if (!guide) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px", overflowY: "auto" }}>
      <div style={{ background: T.card, borderRadius: "16px", maxWidth: "560px", width: "100%", marginTop: "60px", marginBottom: "40px" }}>
        <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: T.text, marginBottom: "4px" }}>{guide.title}</h2>
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: T.textMuted }}>
              <span>⏱ {guide.time}</span>
              <span>📊 {guide.difficulty}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", color: T.textMuted, cursor: "pointer", padding: "4px" }}>✕</button>
        </div>
        <div style={{ padding: "20px" }}>
          {guide.steps.map((s, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "start", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: T.text }}>{s.title}</h3>
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

// ─── LOCKED GUIDE TEASER ───
function LockedGuide({ title, stepsCount }: { title: string; stepsCount: number }) {
  return (
    <div style={{ background: "#F9FAFB", border: `1px dashed ${T.border}`, borderRadius: "10px", padding: "16px", textAlign: "center" }}>
      <div style={{ fontSize: "24px", marginBottom: "6px" }}>🔒</div>
      <p style={{ fontSize: "13px", fontWeight: 600, color: T.textSoft, marginBottom: "4px" }}>{title}</p>
      <p style={{ fontSize: "12px", color: T.textMuted }}>{stepsCount} étapes détaillées + scripts prêts à l&apos;emploi</p>
      <p style={{ fontSize: "12px", color: T.accent, fontWeight: 600, marginTop: "8px" }}>Disponible avec Econia Premium</p>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<"hero"|"scan"|"results">("hero");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [data, setData] = useState<ReturnType<typeof analyzeProfile>|null>(null);
  const [visNum, setVisNum] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [openGuide, setOpenGuide] = useState<string|null>(null);
  const [isPremium] = useState(false); // Will be connected to Stripe later

  useEffect(() => {
    async function fetchCount() { try { const { count } = await supabase.from("waitlist").select("*", { count: "exact", head: true }); setWaitlistCount(count || 0); } catch { /* */ } }
    fetchCount();
  }, []);

  const handleSubscribe = async () => {
    setEmailError("");
    if (!email.includes("@") || !email.includes(".")) { setEmailError("Entrez un email valide."); return; }
    try {
      const { error } = await supabase.from("waitlist").insert([{ email, scan_data: data ? { gains: data.gains.length, gainMin: data.gainMin, gainMax: data.gainMax, answers } : null }]);
      if (error) { setEmailError(error.code === "23505" ? "Cet email est déjà inscrit !" : "Erreur, réessayez."); return; }
      setSubscribed(true); setWaitlistCount(c => c + 1);
    } catch { setEmailError("Erreur de connexion."); }
  };

  const handleAnswer = (id: string, value: string) => {
    const next = { ...answers, [id]: value }; setAnswers(next);
    let ni = qIdx + 1;
    while (ni < questions.length) { const nq = questions[ni]; if (nq.showIf && !nq.showIf(next)) { next[nq.id] = "na"; ni++; } else break; }
    if (ni >= questions.length) { setData(analyzeProfile(next)); setStep("results"); } else { setQIdx(ni); setVisNum(p => p + 1); }
  };

  const reset = () => { setStep("hero"); setQIdx(0); setAnswers({}); setData(null); setVisNum(0); setEmail(""); setSubscribed(false); setEmailError(""); setOpenGuide(null); };
  const catLabels: Record<string,string> = { aide: "Aides & prestations", assurance: "Assurances", abonnement: "Abonnements & contrats", impot: "Impôts", energie: "Énergie" };
  const catColors: Record<string,string> = { aide: T.accent, assurance: T.purple, abonnement: T.orange, impot: T.green, energie: T.red };
  const spotsLeft = Math.max(0, MAX_WAITLIST - waitlistCount);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", color: T.text }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100, background: `${T.bg}EE`, backdropFilter: "blur(16px)", borderBottom: "1px solid #E5E7EB44" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, cursor: "pointer" }} onClick={reset}>Ec<span style={{ color: T.accent }}>o</span>nia</div>
        {step === "hero" && <button onClick={() => { setStep("scan"); setVisNum(1); }} style={{ padding: "8px 18px", background: T.accent, color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Scan gratuit</button>}
        {step !== "hero" && <button onClick={reset} style={{ padding: "8px 18px", background: "transparent", color: T.textMuted, border: `1px solid ${T.border}`, borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>Accueil</button>}
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
          {/* Offer details */}
          <div style={{ marginTop: "48px", maxWidth: "500px", background: T.card, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "20px", textAlign: "left" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: T.text, marginBottom: "12px", textAlign: "center" }}>🎁 Offre 50 premiers inscrits</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: T.textSoft }}>
              <div style={{ display: "flex", gap: "8px" }}><span style={{ color: T.green }}>✓</span> 1er mois entièrement gratuit</div>
              <div style={{ display: "flex", gap: "8px" }}><span style={{ color: T.green }}>✓</span> Mois 2 à 7 : 3,49€/mois au lieu de 6,99€ (-50%)</div>
              <div style={{ display: "flex", gap: "8px" }}><span style={{ color: T.green }}>✓</span> Accès complet : guides pas à pas, scripts de négociation, alertes</div>
              <div style={{ display: "flex", gap: "8px" }}><span style={{ color: T.green }}>✓</span> Cases d&apos;impôts personnalisées</div>
              <div style={{ display: "flex", gap: "8px" }}><span style={{ color: T.green }}>✓</span> Accompagnement pour chaque économie détectée</div>
            </div>
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
                <div style={{ width: "120px", height: "4px", background: "#F3F4F6", borderRadius: "2px", overflow: "hidden" }}><div style={{ width: `${(visNum / 19) * 100}%`, height: "100%", background: T.accent, borderRadius: "2px", transition: "width 0.3s" }} /></div>
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
        if (avg >= 30) pleasures.push(`${Math.floor(avg / 35)} dîner${Math.floor(avg / 35) > 1 ? "s" : ""} au restaurant`);
        if (avg >= 80) pleasures.push(`${Math.floor(avg / 80)} sortie${Math.floor(avg / 80) > 1 ? "s" : ""} en famille`);
        if (avg >= 150) pleasures.push("1 week-end par trimestre");
        if (avg >= 50) pleasures.push(`${avg * 12}€/an sur un livret d'épargne`);

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
                  <div style={{ fontSize: "12px", color: T.textSoft, marginTop: "8px", fontStyle: "italic" }}>Des plaisirs que vous hésitiez à vous offrir — ils étaient juste cachés dans vos factures.</div>
                </div>
              )}

              {/* GAINS WITH GUIDE ACCESS */}
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: catColors[cat] || T.accent }} />
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{catLabels[cat] || cat}</h3>
                  </div>
                  {items.map((g, i) => {
                    const guideKey = gainToGuide[g.title];
                    const guide = guideKey ? guides[guideKey] : null;
                    return (
                      <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "14px", marginBottom: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                              <span>{g.icon}</span>
                              <span style={{ fontSize: "14px", fontWeight: 600 }}>{g.title}</span>
                            </div>
                            <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5, margin: 0 }}>{g.desc}</p>
                          </div>
                          <div style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: catColors[g.cat] || T.accent, background: (catColors[g.cat] || T.accent) + "12", whiteSpace: "nowrap" as const }}>{g.montant}</div>
                        </div>
                        {guide && (
                          <div style={{ marginTop: "10px", borderTop: `1px solid ${T.border}`, paddingTop: "10px" }}>
                            {isPremium ? (
                              <button onClick={() => setOpenGuide(guideKey)} style={{ width: "100%", padding: "8px", background: T.accentLight, color: T.accent, border: `1px solid ${T.accent}33`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                                📖 Voir le guide pas à pas ({guide.steps.length} étapes)
                              </button>
                            ) : (
                              <button onClick={() => {
                                const el = document.getElementById("waitlist-section");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                              }} style={{ width: "100%", padding: "8px", background: "#F9FAFB", color: T.textMuted, border: `1px dashed ${T.border}`, borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>
                                🔒 Guide pas à pas ({guide.steps.length} étapes) — Econia Premium
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* IMPÔTS GUIDE (always shown for relevant profiles) */}
              {(answers.statut === "salarie" || answers.statut === "cumul" || answers.enfants !== "0" || answers.sap !== "non") && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: T.green }} />
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Déclaration d&apos;impôts personnalisée</h3>
                  </div>
                  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <span>📋</span>
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>Vos cases d&apos;impôts à remplir</span>
                    </div>
                    <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5, margin: "0 0 10px" }}>Guide personnalisé avec les cases exactes à remplir selon votre situation, les montants à déclarer, et les erreurs à éviter.</p>
                    {isPremium ? (
                      <button onClick={() => setOpenGuide("impots_cases")} style={{ width: "100%", padding: "8px", background: T.greenLight, color: T.green, border: `1px solid ${T.green}33`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                        📖 Voir mes cases personnalisées ({guides.impots_cases.steps.length} sections)
                      </button>
                    ) : (
                      <button onClick={() => {
                        const el = document.getElementById("waitlist-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }} style={{ width: "100%", padding: "8px", background: "#F9FAFB", color: T.textMuted, border: `1px dashed ${T.border}`, borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>
                        🔒 Mes cases d&apos;impôts personnalisées — Econia Premium
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* INFOS */}
              {data.infos.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "10px" }}>💡 Bon à savoir</h3>
                  {data.infos.map((info, i) => (
                    <div key={i} style={{ background: T.accentLight, border: `1px solid ${T.accent}22`, borderRadius: "10px", padding: "14px", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}><span>{info.icon}</span><span style={{ fontSize: "14px", fontWeight: 600, color: T.accent }}>{info.title}</span></div>
                      <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* WAITLIST */}
              <div id="waitlist-section" style={{ background: T.greenLight, border: `1px solid ${T.green}33`, borderRadius: "12px", padding: "20px", textAlign: "center", marginTop: "24px" }}>
                {!subscribed ? (<>
                  <p style={{ fontSize: "15px", color: T.green, fontWeight: 600, marginBottom: "6px" }}>Débloquez tous les guides et récupérez votre argent.</p>
                  <p style={{ fontSize: "13px", color: T.textSoft, marginBottom: "6px" }}>
                    {spotsLeft > 0 ? `Offre 50 premiers : 1 mois gratuit + 3,49€/mois pendant 6 mois. Plus que ${spotsLeft} places.` : "Inscrivez-vous pour être prévenu(e) des prochaines offres."}
                  </p>
                  <p style={{ fontSize: "11px", color: T.textMuted, marginBottom: "12px" }}>Puis 6,99€/mois. Sans engagement.</p>
                  <input value={email} onChange={e => { setEmail(e.target.value); setEmailError(""); }} placeholder="Votre email" style={{ width: "100%", maxWidth: "300px", padding: "11px 14px", border: `1.5px solid ${emailError ? T.red : T.border}`, borderRadius: "8px", fontSize: "14px", outline: "none", textAlign: "center" as const, boxSizing: "border-box" as const, marginBottom: "4px" }} />
                  {emailError && <p style={{ fontSize: "12px", color: T.red, margin: "4px 0" }}>{emailError}</p>}
                  <div style={{ marginTop: "8px" }}><button onClick={handleSubscribe} style={{ padding: "11px 28px", background: T.green, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Rejoindre la liste d&apos;attente</button></div>
                </>) : (
                  <div><span style={{ fontSize: "24px" }}>✅</span><p style={{ fontSize: "15px", color: T.green, fontWeight: 600, marginTop: "8px" }}>Vous êtes inscrit(e) ! On vous prévient dès le lancement.</p></div>
                )}
              </div>

              <div style={{ textAlign: "center", marginTop: "20px" }}><button onClick={reset} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>Refaire un scan</button></div>
              <p style={{ textAlign: "center", fontSize: "10px", color: T.textMuted, marginTop: "20px", lineHeight: 1.5 }}>Estimations indicatives basées sur les barèmes 2026. Seuls les organismes compétents peuvent confirmer vos droits.</p>
            </div>
          </div>
        );
      })()}

      {step === "hero" && (
        <footer style={{ textAlign: "center", padding: "32px 20px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Ec<span style={{ color: T.accent }}>o</span>nia</div>
          <p style={{ fontSize: "12px", color: T.textMuted }}>Découvrez combien vous pourriez récupérer</p>
          <p style={{ fontSize: "11px", color: T.textMuted, marginTop: "4px" }}>© 2026 — Estimations indicatives</p>
        </footer>
      )}

      {/* GUIDE MODAL */}
      {openGuide && <GuideModal guideKey={openGuide} onClose={() => setOpenGuide(null)} />}
    </div>
  );
}

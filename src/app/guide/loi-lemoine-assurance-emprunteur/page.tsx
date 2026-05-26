import Link from "next/link";
import { T } from "@/lib/theme";
import GuideLayout, { H2, P, StepCard } from "@/components/seo/GuideLayout";

export default function GuideLemoine() {
  return (
    <GuideLayout
      slug="loi-lemoine-assurance-emprunteur"
      h1Main="Loi Lemoine 2026"
      h1Accent="changer d'assurance emprunteur et économiser jusqu'à 15 000€"
      intro="Depuis février 2022, la loi Lemoine te permet de changer d'assurance emprunteur à tout moment, sans frais ni pénalité. Pour un crédit immobilier moyen, l'économie typique sur la durée du prêt va de 3 000€ à 15 000€. Ta banque ne peut pas refuser le changement si les garanties sont équivalentes."
      miniScanUrl="/aide/loi-lemoine"
      miniScanLabel="🎯 Estimer mon économie en 3 questions"
      miniScanSub="Capital, durée restante, taux actuel. Calcul instantané, anonyme."
      datePublished="2026-05-26"
      sources="Légifrance (Loi n° 2022-270 du 28 février 2022), Service-Public.fr, observatoires assurance emprunteur 2026, ACPR"
      totalTime="PT45M"
      howToSteps={[
        {
          name: "Vérifier le taux actuel sur ton contrat",
          text: "Le TAEA (Taux Annuel Effectif d'Assurance) figure sur ton tableau d'amortissement remis lors du prêt, ou sur ton espace client banque. C'est le repère de comparaison.",
        },
        {
          name: "Demander 2 à 3 devis en délégation",
          text: "Comparateurs spécialisés (Reassurez-moi, Magnolia, Assurland) ou directement auprès d'assureurs alternatifs (April, Cardif, MetLife, Suravenir). Aucun engagement avant signature.",
        },
        {
          name: "Vérifier l'équivalence des garanties",
          text: "Ta banque applique une grille de 18 critères officiels (CCSF). L'assureur alternatif doit cocher toutes les garanties exigées par ta banque (décès, PTIA, IPT/ITT, exonérations).",
        },
        {
          name: "Envoyer la demande de substitution",
          text: "Lettre recommandée à ta banque + nouveau contrat. La banque a 10 jours ouvrés pour répondre. Si refus, la motivation doit être écrite et limitée aux critères d'équivalence.",
        },
      ]}
    >
      <H2>Qu&apos;est-ce que la loi Lemoine ?</H2>
      <P>
        Adoptée le 28 février 2022 et entrée en application en septembre 2022 pour les contrats en cours, la{" "}
        <strong>loi Lemoine</strong> (n° 2022-270) a refondu trois règles majeures de l&apos;assurance emprunteur :
      </P>
      <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "16px", paddingLeft: "20px" }}>
        <li>
          <strong>Résiliation à tout moment</strong> sans frais ni délai d&apos;attente, dès le 1er jour du contrat.
        </li>
        <li>
          <strong>Suppression du questionnaire de santé</strong> pour les prêts inférieurs à 200 000€ par emprunteur,
          remboursés avant les 60 ans de l&apos;emprunteur.
        </li>
        <li>
          <strong>Droit à l&apos;oubli ramené à 5 ans</strong> après guérison pour les anciens malades du cancer ou de
          l&apos;hépatite C.
        </li>
      </ul>
      <P>
        Avant cette loi, tu devais attendre la date anniversaire (loi Hamon, loi Bourquin) ou les 12 premiers mois du prêt
        (loi Lagarde). Aujourd&apos;hui, c&apos;est libre à tout moment.
      </P>

      <H2>Pourquoi ça représente autant d&apos;économies ?</H2>
      <P>
        L&apos;assurance emprunteur représente en moyenne <strong>25 à 35 %</strong> du coût total d&apos;un crédit immobilier.
        Les contrats groupe proposés par les banques tournent autour de <strong>0,35 à 0,50 % du capital initial</strong>{" "}
        (TAEA). En délégation, un emprunteur jeune et en bonne santé peut décrocher un contrat à{" "}
        <strong>0,10 à 0,25 %</strong>.
      </P>
      <P>
        Exemple : sur un capital restant dû de 200 000€, durée restante 15 ans, écart de taux de 0,20 % →{" "}
        <strong>≈ 6 000€ d&apos;économie</strong> sur la durée du prêt. Pour un capital de 350 000€ avec 20 ans restants et un
        écart de 0,25 %, on dépasse facilement <strong>15 000€</strong>.{" "}
        <Link href="/aide/loi-lemoine" style={{ color: T.blue }}>
          Estime ton économie exacte
        </Link>{" "}
        en 3 questions.
      </P>

      <H2>Pour qui c&apos;est intéressant ?</H2>
      <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "16px", paddingLeft: "20px" }}>
        <li>
          <strong>Capital restant {">"} 50 000€</strong> et durée restante {">"} 5 ans : oui, presque toujours.
        </li>
        <li>
          <strong>Profil jeune (≤ 40 ans), non-fumeur, sans antécédent</strong> : économie maximale, contrats délégués très
          agressifs sur ce profil.
        </li>
        <li>
          <strong>Profil senior ou avec problème de santé déclaré</strong> : à étudier au cas par cas — un contrat groupe
          mutualisé peut rester compétitif.
        </li>
        <li>
          <strong>Fin de prêt proche (≤ 3 ans)</strong> : économie marginale, démarches probablement non rentables.
        </li>
      </ul>

      <H2>Les 4 étapes pour changer ton contrat</H2>
      <StepCard num={1} title="Vérifier ton TAEA actuel">
        Sur ton tableau d&apos;amortissement (remis à la signature) ou sur ton espace banque en ligne. Note aussi capital
        restant dû et durée restante. Ce sont les 3 chiffres dont tu as besoin.
      </StepCard>
      <StepCard num={2} title="Demander 2 à 3 devis en délégation">
        Comparateurs spécialisés (Reassurez-moi, Magnolia Assurances, Assurland) ou directement chez les assureurs
        alternatifs (April, Cardif, MetLife, Suravenir, AFI ESCA). 100 % gratuit, aucun engagement avant signature.
      </StepCard>
      <StepCard num={3} title="Vérifier l'équivalence des garanties">
        Ta banque applique une <strong>grille officielle de 18 critères d&apos;équivalence</strong> (Comité Consultatif du
        Secteur Financier). L&apos;assureur alternatif doit cocher TOUS les critères exigés par ta banque, sinon refus
        possible.
      </StepCard>
      <StepCard num={4} title="Envoyer la demande de substitution" locked>
        Modèle de lettre recommandée, calendrier précis (10 jours ouvrés pour la banque), recours en cas de refus injustifié,
        articulation avec ton avenant de prêt. Détaillé dans le guide Premium Econia.
      </StepCard>

      <H2>Ta banque peut-elle refuser ?</H2>
      <P>
        Oui, mais <strong>uniquement si les garanties ne sont pas équivalentes</strong>. Le refus doit être motivé par écrit
        en référence aux critères de la grille CCSF. Dans la pratique, les contrats alternatifs des grands assureurs sont
        calibrés sur cette grille — les refus injustifiés sont rares et contestables auprès de l&apos;ACPR ou via un médiateur
        bancaire.
      </P>

      <H2>Cas particuliers</H2>
      <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "16px", paddingLeft: "20px" }}>
        <li>
          <strong>Co-emprunteur</strong> : chacun peut changer son assurance indépendamment. Calculs séparés mais procédure
          coordonnée recommandée.
        </li>
        <li>
          <strong>Prêt à taux zéro / PTZ</strong> : pas d&apos;assurance obligatoire, donc rien à changer côté assurance.
        </li>
        <li>
          <strong>Pinel, locatif</strong> : la loi Lemoine s&apos;applique aussi.
        </li>
        <li>
          <strong>Capital initial {">"} 200 000€</strong> : questionnaire médical simplifié possible selon ton âge — pas un
          frein automatique.
        </li>
      </ul>
    </GuideLayout>
  );
}

import Link from "next/link";
import { T, fonts } from "@/lib/theme";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schemas";

/**
 * Page pilier SEO — "aides non réclamées France"
 *
 * Cible : le KW principal du marché (10 Mds€/an non réclamés en France).
 * Format : article long format, server component, 100% indexable, liens
 * internes vers les mini-scans /aide/* pour pousser le maillage.
 *
 * Concurrence : Mes-Allocs.fr, Klaro, Aide-Sociale.fr — on se différencie
 * par la transparence des chiffres, le ton direct, et l'outil scan en bonus.
 */

// Server component — pas de "use client" pour rendu statique optimal SEO.

const PUBLISHED = "2026-05-26";

type Aide = {
  slug: string;
  nom: string;
  montant: string;
  qui: string;
  source: string;
};

const AIDES: Aide[] = [
  {
    slug: "rsa",
    nom: "RSA — Revenu de solidarité active",
    montant: "≈ 635€/mois (personne seule sans enfant)",
    qui: "Sans emploi ou revenus faibles, 25 ans et plus (ou parent isolé)",
    source: "CAF / barème 2026",
  },
  {
    slug: "prime-activite",
    nom: "Prime d'activité",
    montant: "Jusqu'à ≈ 600€/mois selon situation",
    qui: "Salarié, indépendant, étudiant salarié avec revenus modestes",
    source: "CAF / barème 2026",
  },
  {
    slug: "apl",
    nom: "APL — Aide personnalisée au logement",
    montant: "≈ 100 à 350€/mois selon loyer et revenus",
    qui: "Locataire (parfois propriétaire) sous plafonds de ressources",
    source: "CAF / barème 2026",
  },
  {
    slug: "complementaire-sante",
    nom: "Complémentaire santé solidaire (CSS)",
    montant: "Mutuelle gratuite ou ≤ 30€/mois (50% de réduction soins)",
    qui: "Ressources sous plafond (8 810€/an personne seule en 2026)",
    source: "Service-Public.fr / Assurance Maladie",
  },
  {
    slug: "cheque-energie",
    nom: "Chèque énergie",
    montant: "48€ à 277€/an automatique",
    qui: "Foyer modeste — envoi automatique sous condition de RFR",
    source: "DGFiP / barème 2026",
  },
  {
    slug: "ars",
    nom: "Allocation de rentrée scolaire (ARS)",
    montant: "≈ 423 à 462€ par enfant scolarisé (6-18 ans)",
    qui: "Familles sous plafond de ressources, enfants en âge scolaire",
    source: "CAF / barème 2025-2026",
  },
  {
    slug: "aspa",
    nom: "ASPA — Allocation de solidarité aux personnes âgées",
    montant: "Jusqu'à ≈ 1 034€/mois (personne seule)",
    qui: "65 ans et plus, retraite faible ou nulle",
    source: "Service-Public.fr / barème 2026",
  },
  {
    slug: "loi-lemoine",
    nom: "Loi Lemoine — Assurance emprunteur",
    montant: "3 000€ à 15 000€ sur la durée du prêt",
    qui: "Tu as un crédit immobilier — tu peux changer d'assurance à tout moment",
    source: "Loi n° 2022-270 du 28 février 2022",
  },
];

export default function AidesNonReclameesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: T.bg,
        padding: "120px 20px 80px",
      }}
    >
      {/* Structured data — Article + Breadcrumb */}
      <JsonLd
        data={articleSchema({
          headline: "Aides non réclamées en France : 10 milliards d'euros oubliés chaque année",
          description:
            "Guide complet 2026 des principales aides sociales non réclamées en France. Liste, montants, conditions d'accès, sources officielles.",
          url: "/aides-non-reclamees",
          datePublished: PUBLISHED,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: "/" },
          { name: "Aides non réclamées", url: "/aides-non-reclamees" },
        ])}
      />

      <article style={{ maxWidth: "780px", margin: "0 auto" }}>
        {/* Fil d'ariane */}
        <nav style={{ fontSize: "12px", color: T.textMuted, marginBottom: "20px" }}>
          <Link href="/" style={{ color: T.textMuted }}>
            Accueil
          </Link>{" "}
          ›{" "}
          <span style={{ color: T.navy }}>Aides non réclamées</span>
        </nav>

        {/* H1 */}
        <h1
          style={{
            fontFamily: fonts.title,
            fontSize: "clamp(32px, 5vw, 46px)",
            fontWeight: 600,
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Aides non réclamées en France :{" "}
          <span style={{ color: T.blue }}>10 milliards d&apos;euros</span> oubliés chaque année
        </h1>

        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.75,
            color: T.textSoft,
            marginBottom: "28px",
          }}
        >
          Selon la Drees et la Cour des comptes, près de <strong>10 milliards d&apos;euros d&apos;aides sociales ne sont pas réclamés</strong>{" "}
          chaque année en France. Le taux de non-recours dépasse 30 % pour le RSA et frôle 50 % pour certaines aides.
          La raison ? Pas le manque d&apos;envie : la complexité administrative, le manque d&apos;information, et le sentiment
          (souvent faux) de ne pas y avoir droit.
        </p>

        <p style={{ fontSize: "16px", lineHeight: 1.75, color: T.textSoft, marginBottom: "32px" }}>
          Cette page liste les principales aides oubliées en 2026, leur montant, qui peut en bénéficier, et comment vérifier ton
          éligibilité en quelques minutes — sans paperasse.
        </p>

        {/* CTA scan */}
        <div
          style={{
            background: T.bgCard,
            border: `2px solid ${T.blue}`,
            borderRadius: "16px",
            padding: "18px 22px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            boxShadow: "0 8px 24px rgba(37,99,235,0.06)",
          }}
        >
          <div style={{ flex: "1 1 220px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: T.navy, marginBottom: "2px" }}>
              🎯 Scan gratuit · 3 minutes
            </div>
            <div style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.4 }}>
              Réponds à 19 questions et découvre exactement ce que tu peux récupérer.
            </div>
          </div>
          <Link
            href="/?start=scan"
            style={{
              padding: "12px 22px",
              background: T.blue,
              color: "#fff",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Lancer le scan →
          </Link>
        </div>

        {/* H2 — Pourquoi tant d'aides non réclamées */}
        <h2
          style={{
            fontFamily: fonts.title,
            fontSize: "26px",
            fontWeight: 600,
            letterSpacing: "-1px",
            marginBottom: "12px",
            marginTop: "24px",
          }}
        >
          Pourquoi autant d&apos;aides ne sont pas réclamées ?
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: T.textSoft, marginBottom: "16px" }}>
          La Drees (Direction de la recherche du ministère des Solidarités) suit le taux de non-recours depuis 2010. Les causes
          principales identifiées :
        </p>
        <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "32px", paddingLeft: "20px" }}>
          <li>
            <strong>Méconnaissance de l&apos;aide</strong> : 40 % des personnes éligibles au RSA ignorent y avoir droit.
          </li>
          <li>
            <strong>Complexité des démarches</strong> : formulaires longs, justificatifs multiples, délais d&apos;instruction.
          </li>
          <li>
            <strong>Stigmatisation perçue</strong> : peur du regard social ou conviction (erronée) que «&nbsp;ce n&apos;est pas
            pour moi&nbsp;».
          </li>
          <li>
            <strong>Surcharge administrative</strong> : une famille type est éligible à 4-7 dispositifs simultanément, jamais
            communiqués de façon coordonnée.
          </li>
        </ul>

        {/* H2 — Les principales aides */}
        <h2
          style={{
            fontFamily: fonts.title,
            fontSize: "26px",
            fontWeight: 600,
            letterSpacing: "-1px",
            marginBottom: "16px",
          }}
        >
          Les 8 principales aides oubliées en 2026
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
          {AIDES.map((aide) => (
            <Link
              key={aide.slug}
              href={`/aide/${aide.slug}`}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: "14px",
                padding: "18px 20px",
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "12px",
                  marginBottom: "6px",
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: T.navy, margin: 0 }}>{aide.nom}</h3>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: T.green,
                    background: T.greenLight,
                    padding: "3px 10px",
                    borderRadius: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {aide.montant}
                </span>
              </div>
              <p style={{ fontSize: "13px", color: T.textSoft, margin: "0 0 4px", lineHeight: 1.6 }}>
                <strong style={{ color: T.navy, fontWeight: 600 }}>Pour qui ?</strong> {aide.qui}
              </p>
              <p style={{ fontSize: "11px", color: T.textMuted, margin: 0 }}>
                Source : {aide.source} · Cliquer pour estimer ton montant exact
              </p>
            </Link>
          ))}
        </div>

        {/* H2 — Autres leviers d'argent perdu */}
        <h2
          style={{
            fontFamily: fonts.title,
            fontSize: "26px",
            fontWeight: 600,
            letterSpacing: "-1px",
            marginBottom: "12px",
          }}
        >
          Au-delà des aides : l&apos;argent perdu chaque mois
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: T.textSoft, marginBottom: "16px" }}>
          Les aides sociales ne sont qu&apos;une partie de l&apos;argent que tu perds. Trois autres leviers représentent en moyenne{" "}
          <strong>400 à 800€/an</strong> récupérables pour un foyer français :
        </p>

        <ul style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "32px", paddingLeft: "20px" }}>
          <li>
            <strong>Assurances mal optimisées</strong> — habitation, auto, emprunteur. L&apos;écart entre l&apos;assurance la
            moins chère et la moyenne du marché est en moyenne de 25-40 % pour un contrat équivalent. Sur l&apos;assurance
            emprunteur, la <Link href="/aide/loi-lemoine" style={{ color: T.blue }}>loi Lemoine</Link> permet de changer à tout
            moment depuis 2022.
          </li>
          <li>
            <strong>Abonnements fantômes</strong> — streaming, salles de sport, applis, services dématérialisés. Un foyer
            français cumule en moyenne <strong>15 à 25€/mois</strong> d&apos;abonnements partiellement ou totalement inutilisés.
          </li>
          <li>
            <strong>Énergie</strong> — fournisseur non comparé, option tarifaire inadaptée, puissance souscrite trop élevée.
            Économie typique : <strong>100 à 300€/an</strong> sans changer ses habitudes.
          </li>
        </ul>

        {/* H2 — Comment vérifier */}
        <h2
          style={{
            fontFamily: fonts.title,
            fontSize: "26px",
            fontWeight: 600,
            letterSpacing: "-1px",
            marginBottom: "12px",
          }}
        >
          Comment savoir à quoi j&apos;ai droit ?
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.75, color: T.textSoft, marginBottom: "20px" }}>
          Trois options, par ordre de simplicité :
        </p>
        <ol style={{ fontSize: "15px", lineHeight: 1.8, color: T.textSoft, marginBottom: "32px", paddingLeft: "22px" }}>
          <li>
            <strong>Mes-Aides du gouvernement</strong> (mesdroitssociaux.gouv.fr) — gratuit, officiel, couvre les aides sociales
            mais pas les assurances ni l&apos;énergie.
          </li>
          <li>
            <strong>Econia</strong> — scan unique qui couvre les 6 leviers (aides + assurances + abonnements + énergie + alertes
            + mobilité), avec montants estimés et guides d&apos;action à chaque étape. <Link href="/?start=scan" style={{ color: T.blue }}>Tester gratuitement</Link>.
          </li>
          <li>
            <strong>Aller voir chaque organisme</strong> — CAF, DGFiP, Assurance Maladie. Précis mais long et fragmenté.
          </li>
        </ol>

        {/* CTA final */}
        <div
          style={{
            background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
            borderRadius: "20px",
            padding: "32px 28px",
            color: "#fff",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontFamily: fonts.title,
              fontSize: "26px",
              fontWeight: 600,
              letterSpacing: "-1px",
              marginBottom: "10px",
              color: "#fff",
            }}
          >
            Voir ce que tu peux récupérer
          </h2>
          <p style={{ fontSize: "14px", opacity: 0.9, marginBottom: "22px", lineHeight: 1.6 }}>
            Scan complet en 3 minutes · gratuit · sans engagement · barèmes officiels 2026
          </p>
          <Link
            href="/?start=scan"
            style={{
              display: "inline-block",
              padding: "14px 30px",
              background: "#fff",
              color: T.navy,
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Lancer le scan →
          </Link>
        </div>

        {/* Sources */}
        <p style={{ fontSize: "11px", color: T.textMuted, lineHeight: 1.6 }}>
          Sources principales : Drees (Direction de la recherche du ministère des Solidarités), Cour des comptes (rapports
          annuels non-recours), CAF, DGFiP, Service-Public.fr, Légifrance. Estimations indicatives basées sur les barèmes 2026.
          Dernière mise à jour : mai 2026.
        </p>
      </article>
    </main>
  );
}

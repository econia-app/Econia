import Link from "next/link";
import { ReactNode } from "react";
import { T, fonts } from "@/lib/theme";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, howToSchema } from "@/lib/schemas";

/**
 * GuideLayout — structure partagée pour les pages /guide/[slug]
 *
 * Server component. Inclut automatiquement :
 *  - JSON-LD Article + Breadcrumb + HowTo
 *  - Fil d'ariane
 *  - Bloc CTA mini-scan
 *  - Section sources
 *
 * Le contenu (children) est laissé libre — chaque guide a sa structure éditoriale.
 */

type Props = {
  slug: string;
  h1Main: string;
  h1Accent?: string;
  intro: string;
  miniScanUrl: string;
  miniScanLabel: string;
  miniScanSub: string;
  howToSteps?: { name: string; text: string }[];
  totalTime?: string; // ISO 8601, ex: "PT30M"
  sources: string;
  datePublished: string; // ISO
  children: ReactNode;
};

export default function GuideLayout({
  slug,
  h1Main,
  h1Accent,
  intro,
  miniScanUrl,
  miniScanLabel,
  miniScanSub,
  howToSteps,
  totalTime,
  sources,
  datePublished,
  children,
}: Props) {
  const url = `/guide/${slug}`;

  return (
    <main style={{ minHeight: "100vh", background: T.bg, padding: "120px 20px 80px" }}>
      <JsonLd
        data={articleSchema({
          headline: h1Accent ? `${h1Main} ${h1Accent}` : h1Main,
          description: intro,
          url,
          datePublished,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: "/" },
          { name: "Guides", url: "/aides-non-reclamees" },
          { name: h1Main, url },
        ])}
      />
      {howToSteps && howToSteps.length > 0 && (
        <JsonLd
          data={howToSchema({
            name: h1Accent ? `${h1Main} ${h1Accent}` : h1Main,
            description: intro,
            url,
            totalTime,
            steps: howToSteps,
          })}
        />
      )}

      <article style={{ maxWidth: "780px", margin: "0 auto" }}>
        <nav style={{ fontSize: "12px", color: T.textMuted, marginBottom: "20px" }}>
          <Link href="/" style={{ color: T.textMuted }}>
            Accueil
          </Link>{" "}
          ›{" "}
          <Link href="/aides-non-reclamees" style={{ color: T.textMuted }}>
            Aides non réclamées
          </Link>{" "}
          ›{" "}
          <span style={{ color: T.navy }}>{h1Main}</span>
        </nav>

        <h1
          style={{
            fontFamily: fonts.title,
            fontSize: "clamp(30px, 5vw, 44px)",
            fontWeight: 600,
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          {h1Main}
          {h1Accent && (
            <>
              <br />
              <span style={{ color: T.blue }}>{h1Accent}</span>
            </>
          )}
        </h1>

        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.75,
            color: T.textSoft,
            marginBottom: "32px",
          }}
        >
          {intro}
        </p>

        {/* CTA mini-scan */}
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
              {miniScanLabel}
            </div>
            <div style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.4 }}>{miniScanSub}</div>
          </div>
          <Link
            href={miniScanUrl}
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
            Estimer mon montant →
          </Link>
        </div>

        {children}

        {/* CTA final */}
        <div
          style={{
            background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`,
            borderRadius: "20px",
            padding: "32px 28px",
            color: "#fff",
            textAlign: "center",
            marginTop: "40px",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontFamily: fonts.title,
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "-1px",
              marginBottom: "10px",
              color: "#fff",
            }}
          >
            Découvre ce que tu peux récupérer
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
            Lancer le scan complet →
          </Link>
        </div>

        <p style={{ fontSize: "11px", color: T.textMuted, lineHeight: 1.6 }}>
          Sources : {sources} · Estimations indicatives basées sur les barèmes 2026. Dernière mise à jour : mai 2026.
        </p>
      </article>
    </main>
  );
}

// ─── Sous-composants utilitaires pour l'éditorial ────────────────

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: fonts.title,
        fontSize: "26px",
        fontWeight: 600,
        letterSpacing: "-1px",
        marginTop: "32px",
        marginBottom: "12px",
        color: T.navy,
      }}
    >
      {children}
    </h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: "15px", lineHeight: 1.75, color: T.textSoft, marginBottom: "16px" }}>
      {children}
    </p>
  );
}

export function StepCard({
  num,
  title,
  children,
  locked = false,
}: {
  num: number;
  title: string;
  children: ReactNode;
  locked?: boolean;
}) {
  return (
    <div
      style={{
        background: locked ? T.bg : T.bgCard,
        border: locked ? `1px dashed ${T.border}` : `1px solid ${T.border}`,
        borderRadius: "14px",
        padding: "18px 20px",
        marginBottom: "12px",
        opacity: locked ? 0.7 : 1,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px" }}>
        <span
          style={{
            fontFamily: fonts.title,
            fontSize: "20px",
            fontWeight: 700,
            color: locked ? T.textMuted : T.blue,
          }}
        >
          {String(num).padStart(2, "0")}
        </span>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: T.navy, margin: 0 }}>
          {title}
          {locked && (
            <span
              style={{
                marginLeft: "8px",
                fontSize: "10px",
                fontWeight: 700,
                background: T.amberLight,
                color: T.amber,
                padding: "3px 8px",
                borderRadius: "6px",
              }}
            >
              🔒 PREMIUM
            </span>
          )}
        </h3>
      </div>
      <div style={{ fontSize: "13px", color: T.textSoft, lineHeight: 1.7, paddingLeft: "30px" }}>
        {children}
      </div>
    </div>
  );
}

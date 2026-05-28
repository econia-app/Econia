import Link from "next/link";
import type { Metadata } from "next";
import { T, fonts } from "@/lib/theme";

/**
 * /partage — page partageable des économies trouvées avec Econia
 *
 * Format URL : /partage?total=520&pistes=7&prenom=Julien
 * Server component → OG dynamique + indexable (utile pour partage social).
 *
 * Note : pas de stockage en DB pour l'instant. La page est self-contained
 * dans son URL, ce qui suffit pour partages Twitter/FB/WhatsApp.
 * V2 (plus tard) : générer un code court via edge function + stats.
 */

type SearchParams = Promise<{
  total?: string;
  pistes?: string;
  prenom?: string;
}>;

function parseTotal(v?: string): number {
  if (!v) return 0;
  const n = parseInt(v, 10);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(n, 99_999); // cap pour éviter chiffres ridicules
}

function parsePistes(v?: string): number {
  if (!v) return 0;
  const n = parseInt(v, 10);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(n, 30);
}

function sanitizePrenom(v?: string): string {
  if (!v) return "";
  // Garder seulement lettres + accents + tiret, 20 caractères max
  return v
    .slice(0, 20)
    .replace(/[^a-zA-ZÀ-ÿ\- ]/g, "")
    .trim();
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const total = parseTotal(sp.total);
  const prenom = sanitizePrenom(sp.prenom);
  const accroche = prenom
    ? `${prenom} a trouvé ${total}€/an d'argent perdu avec Econia`
    : `J'ai trouvé ${total}€/an d'argent perdu avec Econia`;
  const desc = "Scan gratuit en 3 minutes — découvre ce que tu peux récupérer toi aussi.";
  return {
    title: accroche,
    description: desc,
    openGraph: {
      title: accroche,
      description: desc,
      type: "article",
      locale: "fr_FR",
      images: ["/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: accroche,
      description: desc,
      images: ["/og-image.png"],
    },
    // robots: cette page est partagée, mais on ne veut pas que Google
    // l'indexe (paramètres variables = duplicate content)
    robots: { index: false, follow: true },
  };
}

export default async function PartagePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const total = parseTotal(sp.total);
  const pistes = parsePistes(sp.pistes);
  const prenom = sanitizePrenom(sp.prenom);

  const accroche = prenom
    ? `${prenom} a trouvé ${total.toLocaleString()}€/an`
    : `J'ai trouvé ${total.toLocaleString()}€/an`;

  return (
    <main style={{ minHeight: "100vh", background: T.bg, padding: "100px 20px 60px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Card de partage façon "social proof" */}
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 22,
            padding: "32px 28px",
            boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: T.blue,
              marginBottom: 12,
            }}
          >
            🎯 Découverte Econia
          </div>

          <h1
            style={{
              fontFamily: fonts.title,
              fontSize: "clamp(28px, 5vw, 38px)",
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.1,
              marginBottom: 14,
              color: T.navy,
            }}
          >
            {accroche}
            <br />
            <span style={{ color: T.blue }}>d&apos;argent perdu</span>.
          </h1>

          <p style={{ fontSize: 15, color: T.textSoft, lineHeight: 1.7, marginBottom: 20 }}>
            Econia a scanné ma situation en 3 minutes et identifié{" "}
            <strong style={{ color: T.navy }}>
              {pistes > 0 ? `${pistes} ${pistes > 1 ? "pistes d'économies" : "piste d'économie"}` : "des pistes d'économies"}
            </strong>{" "}
            que je ne soupçonnais pas : aides non réclamées, abonnements oubliés, assurances mal optimisées…
          </p>

          {/* Mini jauge décorative */}
          <div
            style={{
              display: "flex",
              height: 12,
              borderRadius: 8,
              overflow: "hidden",
              gap: 2,
              marginBottom: 8,
              background: T.borderLight,
            }}
            aria-hidden
          >
            <div style={{ flex: 38, background: T.blue }} />
            <div style={{ flex: 22, background: T.purple }} />
            <div style={{ flex: 18, background: T.amber }} />
            <div style={{ flex: 10, background: T.red }} />
            <div style={{ flex: 8, background: T.green }} />
            <div style={{ flex: 4, background: T.textLight }} />
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 24 }}>
            Aides · Assurances · Abonnements · Énergie · Fins d&apos;offre · Mobilité
          </div>

          <div
            style={{
              padding: "14px 16px",
              background: T.bg,
              border: `1px solid ${T.borderLight}`,
              borderRadius: 12,
              fontSize: 12,
              color: T.textMuted,
              lineHeight: 1.6,
            }}
          >
            💡 <strong style={{ color: T.navy }}>Important</strong> : ce montant correspond à une estimation indicative
            basée sur le profil partagé. Le tien sera différent.
          </div>
        </div>

        {/* CTA principal */}
        <Link
          href="/?start=scan&source=partage"
          style={{
            display: "block",
            padding: "18px",
            background: T.blue,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(37,99,235,0.18)",
            marginBottom: 12,
          }}
        >
          Voir combien je peux récupérer →
        </Link>
        <p style={{ fontSize: 12, color: T.textMuted, textAlign: "center", marginBottom: 24 }}>
          Scan gratuit · 3 minutes · sans engagement · barèmes 2026
        </p>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/aides-non-reclamees"
            style={{ fontSize: 13, color: T.textSoft, textDecoration: "underline" }}
          >
            En savoir plus sur les 10 Mds€ d&apos;aides non réclamées en France
          </Link>
        </div>
      </div>
    </main>
  );
}

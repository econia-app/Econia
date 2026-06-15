/**
 * POST /api/read-document
 *
 * Lit un document de contrat (PDF ou photo) envoyé par un ABONNÉ et en extrait
 * les informations clés (assureur/fournisseur, type, montant, garanties, échéance…)
 * via l'API Claude. Le fichier est traité EN MÉMOIRE puis jeté — jamais stocké
 * (approche "lire puis supprimer", RGPD-minimale).
 *
 * Sécurité :
 *  - vérifie le token de session Supabase (utilisateur connecté)
 *  - vérifie que l'utilisateur est Premium (contrôle du coût IA)
 *  - la clé ANTHROPIC_API_KEY reste côté serveur (jamais exposée)
 *
 * Choix techniques :
 *  - Modèle "claude-haiku-4-5" : le plus économique, largement suffisant pour de
 *    l'extraction, et capable de lire PDF + images.
 *  - Sortie structurée garantie via un "outil" Claude (tool_choice forcé).
 *  - Appel en HTTP direct (pas de SDK) pour ne pas alourdir le projet.
 */
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-haiku-4-5";

// Limite de taille (base64) ~ 4 Mo de fichier — au-delà, on refuse proprement.
const MAX_BASE64_LEN = 5_500_000;

const ALLOWED_MEDIA = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const SYSTEM = `Tu lis un document de contrat français (assurance, énergie ou abonnement) et tu en extrais les informations clés de façon FIABLE.
Règles strictes :
- N'extrais QUE ce qui est écrit dans le document. Si une information est absente, renvoie une chaîne vide "". N'invente JAMAIS un montant ou une garantie.
- "montant_annuel" : la cotisation/prime ANNUELLE en euros, sous forme de nombre uniquement (ex : "480"). Si seul un montant mensuel figure, multiplie par 12.
- "garanties" : la liste des garanties / couvertures principales réellement mentionnées.
- "categorie" : déduis-la (assurances, energie, abonnements, aides, ou autre).
- "echeance" : date d'échéance ou de renouvellement si présente (format AAAA-MM-JJ si possible, sinon le texte tel quel).
Tu dois répondre uniquement en appelant l'outil enregistrer_contrat.`;

const EXTRACTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    categorie: { type: "string", enum: ["assurances", "energie", "abonnements", "aides", "autre"] },
    type: { type: "string", description: "Type de contrat, ex: Auto, Habitation, Mutuelle, Électricité…" },
    fournisseur: { type: "string", description: "Nom de l'assureur, du fournisseur ou de l'organisme" },
    montant_annuel: { type: "string", description: "Cotisation annuelle en euros, nombre seul" },
    franchise: { type: "string", description: "Franchise éventuelle en euros" },
    echeance: { type: "string", description: "Date d'échéance / renouvellement" },
    numero_contrat: { type: "string" },
    garanties: { type: "array", items: { type: "string" }, description: "Garanties principales mentionnées" },
    resume: { type: "string", description: "Résumé en une phrase de ce contrat" },
  },
  required: [
    "categorie", "type", "fournisseur", "montant_annuel",
    "franchise", "echeance", "numero_contrat", "garanties", "resume",
  ],
};

export async function POST(req: Request) {
  // 1) Authentification : token de session dans l'en-tête Authorization
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch {
    return NextResponse.json({ error: "Service indisponible" }, { status: 500 });
  }

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  // 2) Contrôle Premium (maîtrise du coût IA — réservé aux abonnés)
  const { data: profile } = await admin
    .from("profiles")
    .select("is_premium, is_founder")
    .eq("id", userData.user.id)
    .single();
  if (!(profile?.is_premium || profile?.is_founder)) {
    return NextResponse.json({ error: "Réservé aux abonnés" }, { status: 403 });
  }

  // 3) Clé API configurée ?
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Lecture de documents non configurée (clé API manquante)." },
      { status: 503 }
    );
  }

  // 4) Lecture du corps
  let body: { fileBase64?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const { fileBase64, mediaType } = body;
  if (!fileBase64 || !mediaType || !ALLOWED_MEDIA.includes(mediaType)) {
    return NextResponse.json({ error: "Fichier ou format non supporté (PDF, JPG, PNG)." }, { status: 400 });
  }
  if (fileBase64.length > MAX_BASE64_LEN) {
    return NextResponse.json({ error: "Fichier trop volumineux (4 Mo max)." }, { status: 413 });
  }

  // 5) Bloc document (PDF) ou image selon le type
  const docBlock =
    mediaType === "application/pdf"
      ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: fileBase64 } }
      : { type: "image", source: { type: "base64", media_type: mediaType, data: fileBase64 } };

  // 6) Appel Claude — sortie structurée garantie via outil forcé
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
        tools: [
          {
            name: "enregistrer_contrat",
            description: "Enregistre les informations extraites du contrat.",
            input_schema: EXTRACTION_SCHEMA,
          },
        ],
        tool_choice: { type: "tool", name: "enregistrer_contrat" },
        messages: [
          {
            role: "user",
            content: [
              docBlock,
              { type: "text", text: "Extrais les informations de ce contrat avec l'outil." },
            ],
          },
        ],
      }),
    });

    if (!resp.ok) {
      // eslint-disable-next-line no-console
      console.error("[Econia][read-document] Claude API", resp.status, await resp.text());
      return NextResponse.json({ error: "La lecture du document a échoué. Réessaie." }, { status: 502 });
    }

    const json = await resp.json();
    const toolUse = Array.isArray(json.content)
      ? json.content.find((b: { type: string }) => b.type === "tool_use")
      : null;
    if (!toolUse?.input) {
      return NextResponse.json({ error: "Aucune information lisible dans ce document." }, { status: 422 });
    }

    // Le fichier n'est jamais stocké : il disparaît avec la fin de la requête.
    return NextResponse.json({ data: toolUse.input });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[Econia][read-document]", e);
    return NextResponse.json({ error: "Erreur lors de la lecture du document." }, { status: 500 });
  }
}

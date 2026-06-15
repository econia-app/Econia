"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { T, fonts } from "@/lib/theme";
import {
  DOSSIER_SECTIONS,
  entryTitle,
  type Dossier,
  type DossierEntry,
  type DossierField,
  type DossierSectionConfig,
} from "@/lib/dossier";

/** Données structurées renvoyées par /api/read-document. */
type Extracted = {
  categorie?: string;
  type?: string;
  fournisseur?: string;
  montant_annuel?: string;
  franchise?: string;
  echeance?: string;
  numero_contrat?: string;
  garanties?: string[];
  resume?: string;
};

/** Convertit un fichier en base64 (sans le préfixe data:). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("read error"));
    reader.readAsDataURL(file);
  });
}

/** Mappe les données extraites vers les champs de la section concernée. */
function mapExtraction(sectionKey: string, d: Extracted): Record<string, string> {
  const garanties = Array.isArray(d.garanties) ? d.garanties.join(", ") : "";
  const notes = [
    d.resume,
    garanties ? `Garanties : ${garanties}` : "",
    d.franchise ? `Franchise : ${d.franchise}€` : "",
  ].filter(Boolean).join(" — ");
  let raw: Record<string, string | undefined>;
  if (sectionKey === "assurances") {
    raw = { type: d.type, assureur: d.fournisseur, montant: d.montant_annuel, echeance: d.echeance, numero: d.numero_contrat, notes };
  } else if (sectionKey === "energie") {
    raw = { type: d.type, fournisseur: d.fournisseur, offre: d.resume, montant: d.montant_annuel, notes };
  } else if (sectionKey === "abonnements") {
    raw = { nom: d.fournisseur || d.type, montant: d.montant_annuel, notes };
  } else if (sectionKey === "aides") {
    raw = { nom: d.type, organisme: d.fournisseur, montant: d.montant_annuel, notes };
  } else {
    raw = {};
  }
  // On ne garde que les valeurs réellement remplies (ne pas écraser avec du vide)
  return Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v != null && v !== "")
  ) as Record<string, string>;
}

type Props = {
  initial: Dossier;
  /** Persiste le dossier complet (déclenché à chaque ajout/modif/suppression). */
  onSave: (dossier: Dossier) => void;
};

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `e${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
}

/** Champ de formulaire générique selon son type. */
function Field({
  field,
  value,
  onChange,
}: {
  field: DossierField;
  value: string;
  onChange: (v: string) => void;
}) {
  const base = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: `1px solid ${T.border}`,
    fontSize: "14px",
    fontFamily: fonts.body,
    background: "#fff",
    boxSizing: "border-box" as const,
  };
  return (
    <label style={{ display: "block", marginBottom: "12px" }}>
      <span style={{ display: "block", fontSize: "12px", fontWeight: 600, color: T.textSoft, marginBottom: "5px" }}>
        {field.label}
        {field.suffix ? <span style={{ color: T.textMuted, fontWeight: 400 }}> ({field.suffix})</span> : null}
      </span>
      {field.type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={base}>
          <option value="">— choisir —</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} rows={2} style={{ ...base, resize: "vertical" }} />
      ) : (
        <input
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          inputMode={field.type === "number" ? "decimal" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          style={base}
        />
      )}
    </label>
  );
}

export default function DossierManager({ initial, onSave }: Props) {
  const [data, setData] = useState<Dossier>(initial);
  // Édition en cours : { section, entry }. entry.id absent dans data => ajout.
  const [editing, setEditing] = useState<{ section: string; entry: DossierEntry } | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Lecture d'un contrat (PDF/photo) par l'IA → pré-remplit les champs.
  const handleImport = async (sectionKey: string, file: File) => {
    setImportError(null);
    setImporting(true);
    try {
      const fileBase64 = await fileToBase64(file);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setImportError("Reconnecte-toi pour importer un document.");
        return;
      }
      const resp = await fetch("/api/read-document", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileBase64, mediaType: file.type }),
      });
      const json = await resp.json();
      if (!resp.ok) {
        setImportError(json.error || "La lecture a échoué.");
        return;
      }
      const mapped = mapExtraction(sectionKey, (json.data || {}) as Extracted);
      setEditing((cur) => (cur ? { ...cur, entry: { ...cur.entry, ...mapped } } : cur));
    } catch {
      setImportError("Problème réseau. Réessaie.");
    } finally {
      setImporting(false);
    }
  };

  const persist = (next: Dossier) => {
    setData(next);
    onSave(next);
  };

  const startAdd = (sectionKey: string) => {
    setEditing({ section: sectionKey, entry: { id: newId() } });
  };

  const startEdit = (sectionKey: string, entry: DossierEntry) => {
    setEditing({ section: sectionKey, entry: { ...entry } });
  };

  const removeEntry = (sectionKey: string, id: string) => {
    if (!window.confirm("Supprimer cette fiche ?")) return;
    const list = (data[sectionKey] || []).filter((e) => e.id !== id);
    persist({ ...data, [sectionKey]: list });
  };

  const saveEntry = () => {
    if (!editing) return;
    const { section, entry } = editing;
    const list = data[section] || [];
    const exists = list.some((e) => e.id === entry.id);
    const nextList = exists ? list.map((e) => (e.id === entry.id ? entry : e)) : [...list, entry];
    persist({ ...data, [section]: nextList });
    setEditing(null);
  };

  return (
    <div>
      {DOSSIER_SECTIONS.map((section: DossierSectionConfig) => {
        const list = data[section.key] || [];
        const isEditingHere = editing?.section === section.key;
        return (
          <div key={section.key} style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{section.icon}</span>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, fontFamily: fonts.title }}>
                  {section.label}
                </h3>
                <span style={{ fontSize: "12px", color: T.textMuted }}>· {list.length}</span>
              </div>
              {!isEditingHere && (
                <button
                  onClick={() => startAdd(section.key)}
                  style={{ padding: "8px 14px", background: section.color + "15", color: section.color, border: `1px solid ${section.color}33`, borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  + Ajouter
                </button>
              )}
            </div>

            {/* Formulaire d'ajout / modification */}
            {isEditingHere && editing && (
              <div style={{ background: T.bgCard, border: `1.5px solid ${section.color}55`, borderRadius: "14px", padding: "18px", marginBottom: "12px" }}>
                {/* Lecture automatique d'un contrat (PDF/photo) → pré-remplissage */}
                <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: `1px solid ${T.borderLight}` }}>
                  <label
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: section.color + "12", color: section.color, border: `1px dashed ${section.color}55`, borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: importing ? "default" : "pointer", opacity: importing ? 0.7 : 1 }}
                  >
                    {importing ? "⏳ Lecture en cours…" : "📄 Importer un contrat (PDF / photo)"}
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      disabled={importing}
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImport(section.key, f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <p style={{ fontSize: "11px", color: T.textMuted, lineHeight: 1.5, margin: "8px 0 0" }}>
                    Econia lit ton document et remplit les champs pour toi. Vérifie toujours les infos. Le fichier n&apos;est pas conservé.
                  </p>
                  {importError && (
                    <p role="alert" style={{ fontSize: "12px", color: T.red, margin: "8px 0 0" }}>{importError}</p>
                  )}
                </div>
                {section.fields.map((f) => (
                  <Field
                    key={f.key}
                    field={f}
                    value={editing.entry[f.key] != null ? String(editing.entry[f.key]) : ""}
                    onChange={(v) =>
                      setEditing({ ...editing, entry: { ...editing.entry, [f.key]: v } })
                    }
                  />
                ))}
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                    onClick={saveEntry}
                    style={{ flex: 1, padding: "11px", background: section.color, color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer", minHeight: 44 }}
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    style={{ padding: "11px 16px", background: T.bg, color: T.textSoft, border: `1px solid ${T.border}`, borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", minHeight: 44 }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Liste des fiches */}
            {list.length === 0 && !isEditingHere && (
              <div style={{ background: T.bgCard, border: `1px dashed ${T.border}`, borderRadius: "14px", padding: "18px", textAlign: "center", color: T.textMuted, fontSize: "13px" }}>
                Aucun {section.itemLabel} pour l&apos;instant. Clique sur « + Ajouter » pour commencer.
              </div>
            )}
            {list.map((entry) => {
              const amount = entry["montant"];
              return (
                <div key={entry.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "14px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: T.navy }}>
                      {entryTitle(section, entry)}
                    </div>
                    <div style={{ fontSize: "12px", color: T.textSoft, marginTop: "2px" }}>
                      {[entry["assureur"], entry["fournisseur"], entry["organisme"]].filter(Boolean).join(" ")}
                      {amount ? `${entry["assureur"] || entry["fournisseur"] || entry["organisme"] ? " · " : ""}${Number(amount).toLocaleString("fr-FR")}€${section.key === "abonnements" ? "" : "/an"}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button onClick={() => startEdit(section.key, entry)} aria-label="Modifier" style={{ padding: "8px 10px", background: T.bg, color: T.textSoft, border: `1px solid ${T.border}`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                      Modifier
                    </button>
                    <button onClick={() => removeEntry(section.key, entry.id)} aria-label="Supprimer" style={{ padding: "8px 10px", background: "#fff", color: T.red, border: `1px solid ${T.red}33`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                      Suppr.
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

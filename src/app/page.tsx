"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { guides, gainToGuide } from "@/lib/guides";

const supabase = createClient(
  "https://pxbntlbtngcecbhcghzu.supabase.co",
  "sb_publishable_RK6hui-9UQCUy5H36tj9_A_gcGNtfIQ"
);

// ─── DESIGN TOKENS V4 ───
const T = {
  blue: "#2563EB", blueDark: "#1D4ED8", blueLight: "#EFF4FF",
  bg: "#FAFBFF", bgWarm: "#F5F3FF", bgCard: "#FFFFFF",
  navy: "#0F172A", navy2: "#1E293B",
  text: "#0F172A", textSoft: "#536179", textMuted: "#7A8599", textLight: "#A0AAB8",
  border: "#E2E8F0", borderLight: "#F1F5F9",
  green: "#059669", greenLight: "#ECFDF5",
  amber: "#D97706", amberLight: "#FEF3C7",
  red: "#DC2626", purple: "#7C3AED",
};

const fontTitle = "'Fraunces', serif";
const fontSub = "'Inter', sans-serif";
const fontBody = "'Inter', sans-serif";

// ─── GUIDES DATA ───


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
   if (["proprio_credit","proprio_sans"].includes(a.logement) && a.logementAge === "oui") gains.push({ cat: "aide", icon: "🏗️", title: "MaPrimeRénov' + CEE", desc: "Aides rénovation cumulables.", montant: "1 000 à 10 000€", annuel: [0, 0] });
  if (a.vehicule === "thermique" && isModeste) gains.push({ cat: "aide", icon: "🚗", title: "Leasing social", desc: "Voiture électrique à ~100€/mois.", montant: "~2 800€/an vs diesel", annuel: [1500, 2800] });
  if (hasKids && youngKids) infos.push({ icon: "👶", title: "Vérifiez votre CMG", desc: "Depuis 2025, jusqu'à 997€/mois. Plus de reste à charge 15%. Simulation sur urssaf.fr." });

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
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    if (!email.includes("@") || password.length < 6) { setError(password.length < 8 ? "Mot de passe : 8 caractères minimum." : "Email invalide."); setLoading(false); return; }
    if (mode === "signup" && !acceptedLegal) { setError("Vous devez accepter les CGU et la politique de confidentialité."); setLoading(false); return; }
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div style={{ background: T.bgCard, borderRadius: "20px", maxWidth: "420px", width: "100%", padding: "32px", boxShadow: "0 20px 60px rgba(15,23,42,0.2)", border: `1px solid ${T.border}` }}>
        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📧</div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "10px", fontFamily: fontTitle, letterSpacing: "-1px" }}>Vérifiez vos emails</h2>
            <p style={{ color: T.textSoft, fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>Un lien de confirmation a été envoyé à <strong style={{ color: T.text }}>{email}</strong>. Cliquez dessus pour activer votre compte.</p>
            <button onClick={onClose} style={{ padding: "12px 28px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}>Compris</button>
          </div>
        ) : (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, fontFamily: fontTitle, letterSpacing: "-1px" }}>{mode === "signup" ? "Créer un compte" : "Connexion"}</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", color: T.textMuted, cursor: "pointer", padding: "4px 8px" }}>✕</button>
          </div>
          {mode === "signup" && (
            <div style={{ background: T.amberLight, border: `1px solid ${T.amber}33`, borderRadius: "12px", padding: "10px 14px", marginBottom: "20px", fontSize: "12px", color: T.amber, fontWeight: 500 }}>
              🎁 Les 50 premiers : 1er mois gratuit + 3,49€/mois pendant 6 mois
            </div>
          )}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "12px", color: T.textSoft, display: "block", marginBottom: "6px", fontWeight: 500, fontFamily: fontSub }}>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="vous@email.com" style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${T.border}`, borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" as const, fontFamily: fontBody, transition: "border 0.2s" }} onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.blue} onBlur={e => (e.target as HTMLInputElement).style.borderColor = T.border} />
          </div>
          <div style={{ marginBottom: "18px" }}>
            <label style={{ fontSize: "12px", color: T.textSoft, display: "block", marginBottom: "6px", fontWeight: 500, fontFamily: fontSub }}>MOT DE PASSE</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="8 caractères minimum" style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${T.border}`, borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" as const, fontFamily: fontBody, transition: "border 0.2s" }} onKeyDown={e => e.key === "Enter" && handleSubmit()} onFocus={e => (e.target as HTMLInputElement).style.borderColor = T.blue} onBlur={e => (e.target as HTMLInputElement).style.borderColor = T.border} />
          </div>
          {mode === "signup" && (
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "14px", cursor: "pointer" }}>
              <input type="checkbox" checked={acceptedLegal} onChange={e => setAcceptedLegal(e.target.checked)} style={{ marginTop: "3px", cursor: "pointer", width: "16px", height: "16px", accentColor: T.blue, flexShrink: 0 }} />
              <span style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5 }}>
                J&apos;ai lu et j&apos;accepte les{" "}
                <a href="/cgu" target="_blank" rel="noopener noreferrer" style={{ color: T.blue, textDecoration: "none", fontWeight: 600 }}>Conditions d&apos;utilisation</a>
                {" "}et la{" "}
                <a href="/confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: T.blue, textDecoration: "none", fontWeight: 600 }}>Politique de confidentialité</a>
                {" "}d&apos;Econia.
              </span>
            </label>
          )}
          {error && <p style={{ color: T.red, fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading || (mode === "signup" && !acceptedLegal)} style={{ width: "100%", padding: "14px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: (loading || (mode === "signup" && !acceptedLegal)) ? "not-allowed" : "pointer", opacity: (loading || (mode === "signup" && !acceptedLegal)) ? 0.5 : 1, boxShadow: "0 8px 24px rgba(37,99,235,0.25)", transition: "transform 0.2s" }}>
            {loading ? "..." : mode === "signup" ? "Créer mon compte gratuit" : "Me connecter"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}><div style={{ flex: 1, height: "1px", background: T.border }} /><span style={{ fontSize: "11px", color: T.textMuted, fontFamily: fontSub, letterSpacing: "0.5px" }}>OU</span><div style={{ flex: 1, height: "1px", background: T.border }} /></div>
          <button onClick={async () => { await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } }); }} style={{ width: "100%", padding: "12px", background: T.bgCard, color: T.text, border: `1.5px solid ${T.border}`, borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "border 0.2s" }} onMouseOver={e => (e.currentTarget as HTMLButtonElement).style.borderColor = T.blue} onMouseOut={e => (e.currentTarget as HTMLButtonElement).style.borderColor = T.border}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuer avec Google
          </button>
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: T.textMuted }}>
            {mode === "signup" ? "Déjà inscrit ?" : "Pas encore de compte ?"}{" "}
            <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} style={{ background: "none", border: "none", color: T.blue, cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
              {mode === "signup" ? "Se connecter" : "Créer un compte"}
            </button>
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px", overflowY: "auto" }}>
      <div style={{ background: T.bgCard, borderRadius: "20px", maxWidth: "600px", width: "100%", marginTop: "60px", marginBottom: "40px", border: `1px solid ${T.border}`, boxShadow: "0 20px 60px rgba(15,23,42,0.2)" }}>
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "6px", fontFamily: fontTitle, letterSpacing: "-1px" }}>{guide.title}</h2>
            <div style={{ fontSize: "12px", color: T.textMuted, display: "flex", gap: "12px", fontFamily: fontSub }}>
              <span>⏱ {guide.time}</span>
              <span>📊 {guide.difficulty}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", color: T.textMuted, cursor: "pointer", padding: "4px 8px" }}>✕</button>
        </div>
        <div style={{ padding: "24px" }}>
          {guide.steps.map((s, i) => (
            <div key={i} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "start", marginBottom: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: T.blueLight, color: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, flexShrink: 0, fontFamily: fontTitle }}>{i+1}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: fontSub }}>{s.title}</h3>
              </div>
              <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7, marginLeft: "40px" }}>{s.content}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
          <button onClick={onClose} style={{ padding: "12px 32px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}>Fermer</button>
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
  const [openFaq, setOpenFaq] = useState<number|null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const reset = () => { 
  setStep("hero"); setQIdx(0); setAnswers({}); setData(null); setVisNum(0); setOpenGuide(null);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
  const catLabels: Record<string,string> = { aide: "Aides & prestations", assurance: "Assurances", abonnement: "Abonnements & contrats", energie: "Énergie" };
  const catColors: Record<string,string> = { aide: T.blue, assurance: T.purple, abonnement: T.amber, impot: T.green, energie: T.red };
  const spotsLeft = Math.max(0, MAX_WAITLIST - waitlistCount);

  const faqs = [
    { q: "Comment Econia détecte mon argent perdu ?", a: "Econia croise vos réponses avec les barèmes officiels 2026 : aides CAF, fiscalité, tarifs énergie, moyennes assurances. L'analyse est instantanée et basée sur des données vérifiées." },
    { q: "Mes données sont-elles en sécurité ?", a: "Oui. Hébergement européen, chiffrement des données, aucun partage avec des tiers. Suppression possible à tout moment." },
    { q: "Econia est-il un courtier en assurance ?", a: "Non. Econia vous aide à comprendre vos contrats et vous oriente vers les comparateurs officiels. Aucune vente, aucune commission." },
    { q: "Les 500€/an sont-ils garantis ?", a: "Non. C'est une estimation moyenne. Le montant réel dépend de votre situation. Certains récupèrent plus de 5 000€, d'autres moins de 200€." },
    { q: "Je peux annuler quand je veux ?", a: "Oui. Sans engagement. Résiliation en un clic. Accès maintenu jusqu'à la fin de la période payée." },
  ];

  return (
    <>
      {/* GOOGLE FONTS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: ${fontBody}; color: ${T.text}; background: ${T.bg}; -webkit-font-smoothing: antialiased; margin: 0; }
        body::after { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.018; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        h1, h2, h3 { font-family: ${fontTitle}; }
        h4, .label { font-family: ${fontSub}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drift { 0%,100% { transform: translate(0,0) scale(1); } 25% { transform: translate(40px,-30px) scale(1.04); } 50% { transform: translate(-20px,40px) scale(0.96); } 75% { transform: translate(30px,20px) scale(1.02); } }
        @keyframes blink { 0%,100% { opacity: 1; box-shadow: 0 0 0 3px rgba(5,150,105,0.2); } 50% { opacity: 0.5; box-shadow: 0 0 0 6px rgba(5,150,105,0.05); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .anim { opacity: 0; animation: fadeUp 0.7s ease forwards; }
        .d1 { animation-delay: 0.1s; } .d2 { animation-delay: 0.2s; } .d3 { animation-delay: 0.3s; } .d4 { animation-delay: 0.4s; } .d5 { animation-delay: 0.5s; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-card-wrap { max-width: 340px !important; margin: 0 auto; }
          .hero-stats { justify-content: center !important; }
          .hero-btns { justify-content: center !important; }
          .hero-p { margin: 0 auto 28px !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .lev-grid { grid-template-columns: 1fr !important; }
          .lev-last { grid-column: span 1 !important; }
          .pr-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .nav-a { display: none !important; }
          .hamburger { display: flex !important; }
          .hero h1 { font-size: 32px !important; letter-spacing: -1.5px !important; }
          .hero-card { padding: 22px !important; }
          .hero-stats { flex-wrap: wrap; gap: 16px !important; }
          .section { padding: 72px 16px !important; }
          .levers-bg { margin: 0 !important; border-radius: 0 !important; padding: 56px 16px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 24px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px 10px 20px", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", border: `1px solid rgba(226,232,240,0.6)`, borderRadius: "18px", boxShadow: "0 4px 20px rgba(15,23,42,0.04)" }}>
          <div style={{ fontFamily: fontTitle, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.8px", color: T.navy, cursor: "pointer" }} onClick={reset}>
            ec<span style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "normal" }}>o</span>nia
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {step === "hero" && (<>
              <a href="#how" className="nav-a" style={{ padding: "8px 14px", fontSize: "13px", color: T.textSoft, textDecoration: "none", borderRadius: "10px", fontWeight: 500 }}>Fonctionnement</a>
              <a href="#detect" className="nav-a" style={{ padding: "8px 14px", fontSize: "13px", color: T.textSoft, textDecoration: "none", borderRadius: "10px", fontWeight: 500 }}>Économies</a>
              <a href="#prix" className="nav-a" style={{ padding: "8px 14px", fontSize: "13px", color: T.textSoft, textDecoration: "none", borderRadius: "10px", fontWeight: 500 }}>Tarifs</a>
            </>)}
            <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: "none", width: "36px", height: "36px", border: `1px solid ${T.border}`, borderRadius: "10px", background: T.bgCard, cursor: "pointer", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <span style={{ display: "block", width: "16px", height: "2px", background: T.navy, borderRadius: "1px" }} />
              <span style={{ display: "block", width: "16px", height: "2px", background: T.navy, borderRadius: "1px" }} />
              <span style={{ display: "block", width: "16px", height: "2px", background: T.navy, borderRadius: "1px" }} />
            </button>
            {user ? (<>
              <span style={{ fontSize: "12px", color: T.textMuted, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{user.email}</span>
              {profile?.is_founder && <span style={{ fontSize: "10px", background: T.amberLight, color: T.amber, padding: "3px 8px", borderRadius: "6px", fontWeight: 700, fontFamily: fontSub, letterSpacing: "0.5px" }}>FONDATEUR</span>}
              <button onClick={handleLogout} style={{ padding: "8px 14px", background: "transparent", color: T.textSoft, border: `1px solid ${T.border}`, borderRadius: "10px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>Déconnexion</button>
            </>) : (
              <button onClick={() => setShowAuth(true)} style={{ padding: "10px 22px", background: T.navy, color: "#fff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Connexion</button>
            )}
          </div>
        </div>
        {mobileMenuOpen && step === "hero" && (
          <div style={{ position: "fixed", top: "72px", left: "16px", right: "16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "16px", boxShadow: "0 20px 60px rgba(15,23,42,0.1)", display: "flex", flexDirection: "column", gap: "4px" }}>
            <a href="#how" onClick={() => setMobileMenuOpen(false)} style={{ padding: "12px 16px", fontSize: "15px", color: T.textSoft, textDecoration: "none", borderRadius: "10px", fontWeight: 500 }}>Fonctionnement</a>
            <a href="#detect" onClick={() => setMobileMenuOpen(false)} style={{ padding: "12px 16px", fontSize: "15px", color: T.textSoft, textDecoration: "none", borderRadius: "10px", fontWeight: 500 }}>Économies</a>
            <a href="#prix" onClick={() => setMobileMenuOpen(false)} style={{ padding: "12px 16px", fontSize: "15px", color: T.textSoft, textDecoration: "none", borderRadius: "10px", fontWeight: 500 }}>Tarifs</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ padding: "12px 16px", fontSize: "15px", color: T.textSoft, textDecoration: "none", borderRadius: "10px", fontWeight: 500 }}>FAQ</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      {step === "hero" && (<>
        <div className="hero hero-grid" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: "48px", maxWidth: "1140px", margin: "0 auto", padding: "130px 32px 80px", position: "relative", overflow: "hidden" }}>
          {/* MESH BG */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, background: "rgba(37,99,235,0.1)", top: "-150px", left: "-50px", animation: "drift 25s ease-in-out infinite" }} />
            <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, background: "rgba(124,58,237,0.07)", bottom: "-100px", right: "-50px", animation: "drift 25s ease-in-out 12s infinite" }} />
            <div style={{ position: "absolute", width: "250px", height: "250px", borderRadius: "50%", filter: "blur(100px)", opacity: 0.5, background: "rgba(5,150,105,0.05)", top: "40%", right: "30%", animation: "drift 25s ease-in-out 6s infinite" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(37,99,235,0.06) 1px,transparent 1px)", backgroundSize: "32px 32px", maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%,black,transparent)", WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 40%,black,transparent)" }} />
          </div>

          {/* LEFT */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="anim d1 hero-chip" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 16px 7px 10px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "100px", fontSize: "13px", fontWeight: 500, color: T.textSoft, marginBottom: "24px", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.green, boxShadow: "0 0 0 3px rgba(5,150,105,0.2)", animation: "blink 2s infinite" }} />
              Plus que <strong style={{ color: T.navy, fontWeight: 600 }}>{spotsLeft} places</strong> gratuites sur 50
            </div>
            <h1 className="anim d2" style={{ fontSize: "clamp(34px,5.5vw,56px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2.5px", marginBottom: "18px" }}>
              Récupérez l&apos;argent que vous perdez{" "}
              <span style={{ position: "relative", display: "inline-block", zIndex: 1 }}>
                chaque mois
                <span style={{ content: "''", position: "absolute", bottom: "4px", left: "-4px", right: "-4px", height: "12px", background: "linear-gradient(90deg,rgba(37,99,235,0.18),rgba(124,58,237,0.12))", borderRadius: "4px", zIndex: -1 }} />
              </span>
            </h1>
            <p className="anim d3 hero-p" style={{ fontSize: "16px", lineHeight: 1.75, color: T.textSoft, maxWidth: "440px", marginBottom: "32px" }}>
              Econia scanne votre situation en 3 minutes et identifie chaque euro que vous pourriez récupérer.
            </p>
            <div className="anim d4 hero-btns" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px" }}>
              <button onClick={() => { setStep("scan"); setVisNum(1); }} style={{ padding: "16px 34px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", fontFamily: fontBody }}>
                Scanner ma situation →
              </button>
              <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "16px 34px", background: T.bgCard, color: T.navy, border: `1.5px solid ${T.border}`, borderRadius: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: fontBody }}>
                Comment ça marche
              </button>
            </div>
            <div className="anim d5 hero-stats" style={{ display: "flex", gap: "28px" }}>
              <div><div style={{ fontFamily: fontTitle, fontSize: "20px", fontWeight: 800, background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>10 Mds€</div><div style={{ fontSize: "11px", color: T.textMuted, marginTop: "1px" }}>Aides non réclamées/an</div></div>
              <div><div style={{ fontFamily: fontTitle, fontSize: "20px", fontWeight: 800, background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>~500€</div><div style={{ fontSize: "11px", color: T.textMuted, marginTop: "1px" }}>Économie moy./an</div></div>
              <div><div style={{ fontFamily: fontTitle, fontSize: "20px", fontWeight: 800, background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3 min</div><div style={{ fontSize: "11px", color: T.textMuted, marginTop: "1px" }}>Durée du scan</div></div>
            </div>
          </div>

          {/* RIGHT - PRODUCT CARD */}
          <div className="anim d5 hero-card-wrap" style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", maxWidth: "400px", width: "100%" }}>
              <div style={{ position: "absolute", width: "350px", height: "350px", background: "radial-gradient(circle,rgba(37,99,235,0.08),transparent 70%)", borderRadius: "50%", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0 }} />
              <div style={{ position: "absolute", top: "-16px", right: "-24px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "12px 16px", boxShadow: "0 8px 32px rgba(15,23,42,0.06)", zIndex: 3, display: "flex", alignItems: "center", gap: "10px", animation: "float 5s ease-in-out infinite" }}>
                <span style={{ fontSize: "18px" }}>🛡️</span>
                <div style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>Assurance auto<br /><small style={{ fontWeight: 400, color: T.textMuted, fontSize: "11px" }}>−240€/an détecté</small></div>
              </div>
              <div className="hero-card" style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "22px", padding: "28px", boxShadow: "0 20px 60px rgba(15,23,42,0.1)", position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{ fontFamily: fontSub, fontSize: "14px", fontWeight: 700 }}>Votre analyse Econia</div>
                  <div style={{ fontFamily: fontSub, fontSize: "11px", fontWeight: 600, color: T.green, background: T.greenLight, padding: "4px 10px", borderRadius: "6px" }}>✓ 8 pistes</div>
                </div>
                <div style={{ fontFamily: fontTitle, fontSize: "38px", fontWeight: 800, letterSpacing: "-2px", marginBottom: "2px" }}>
                  2 340€<span style={{ fontSize: "15px", fontWeight: 400, color: T.textMuted, letterSpacing: 0 }}> /an</span>
                </div>
                <div style={{ fontSize: "12px", color: T.textMuted, marginBottom: "20px" }}>Gain potentiel estimé</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { ico: "🏛️", name: "Prime d'activité", desc: "Non réclamée", val: "+200€/mois" },
                    { ico: "📱", name: "3 abonnements", desc: "Probablement inutilisés", val: "+32€/mois" },
                    { ico: "⚡", name: "Énergie", desc: "Fournisseur non comparé", val: "+14€/mois" },
                    { ico: "📋", name: "Crédit impôt CESU", desc: "Case 7DB", val: "+125€/mois" },
                  ].map((it, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: T.bg, border: `1px solid ${T.borderLight}`, borderRadius: "12px" }}>
                      <span style={{ fontSize: "18px", flexShrink: 0 }}>{it.ico}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: fontSub, fontSize: "13px", fontWeight: 600 }}>{it.name}</div>
                        <div style={{ fontSize: "11px", color: T.textMuted }}>{it.desc}</div>
                      </div>
                      <div style={{ fontFamily: fontSub, fontSize: "12px", fontWeight: 700, color: T.green }}>{it.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "-12px", left: "-20px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "12px 16px", boxShadow: "0 8px 32px rgba(15,23,42,0.06)", zIndex: 3, display: "flex", alignItems: "center", gap: "10px", animation: "float 5s ease-in-out 2.5s infinite" }}>
                <span style={{ fontSize: "18px" }}>⏰</span>
                <div style={{ fontSize: "12px", fontWeight: 600, color: T.navy }}>Alerte fin d&apos;offre<br /><small style={{ fontWeight: 400, color: T.textMuted, fontSize: "11px" }}>Free → 19,99€ dans 28j</small></div>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST RIBBON */}
        <div style={{ padding: "24px", background: T.bgCard, borderTop: `1px solid ${T.borderLight}`, borderBottom: `1px solid ${T.borderLight}` }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "36px", flexWrap: "wrap" }}>
            {[
              { ico: "🔒", txt: "Données chiffrées", bg: T.bgWarm },
              { ico: "🇪🇺", txt: "Hébergement européen", bg: T.blueLight },
              { ico: "⚡", txt: "Résultat en 3 min", bg: T.greenLight },
              { ico: "✕", txt: "Sans engagement", bg: T.amberLight },
            ].map((it, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: T.textSoft, fontWeight: 500 }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", background: it.bg }}>{it.ico}</div>
                {it.txt}
              </div>
            ))}
          </div>
        </div>

        {/* HOW */}
        <section id="how" className="section" style={{ padding: "110px 24px" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <div style={{ fontFamily: fontSub, fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "2px", color: T.blue, marginBottom: "14px" }}>Fonctionnement</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: "-1.8px", lineHeight: 1.08, marginBottom: "14px" }}>Trois étapes.<br />Zéro prise de tête.</h2>
            <p style={{ fontSize: "15px", color: T.textSoft, lineHeight: 1.7, maxWidth: "440px", marginBottom: "56px" }}>Econia fait le travail. Vous récoltez.</p>
            <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px" }}>
              {[
                { n: "01", h: "Répondez au scan", p: "19 questions simples. Revenus, logement, famille, assurances. 3 minutes, aucun document." },
                { n: "02", h: "Découvrez vos pistes", p: "Econia croise votre profil avec les barèmes officiels 2026. Résultat instantané, chaque euro identifié." },
                { n: "03", h: "Passez à l'action", p: "Guides pas à pas, scripts de négociation, alertes. On vous accompagne jusqu'au bout." },
              ].map((c, i) => (
                <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "22px", padding: "36px 28px", position: "relative" }}>
                  <div style={{ fontFamily: fontTitle, fontSize: "48px", fontWeight: 800, lineHeight: 1, marginBottom: "16px", WebkitTextStroke: `1.5px ${T.border}`, color: "transparent" }}>{c.n}</div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "8px", letterSpacing: "-0.3px" }}>{c.h}</h3>
                  <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.7 }}>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEVERS (navy section) */}
        <div id="detect" className="levers-bg" style={{ background: T.navy, borderRadius: "28px", margin: "0 24px", padding: "80px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle,rgba(37,99,235,0.12),transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "350px", height: "350px", background: "radial-gradient(circle,rgba(124,58,237,0.08),transparent 70%)", borderRadius: "50%" }} />
          <div style={{ maxWidth: "1080px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: fontSub, fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>Sources d&apos;économie</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: "-1.8px", lineHeight: 1.08, marginBottom: "14px", color: "#fff" }}>7 leviers. Des milliers<br />d&apos;euros récupérables.</h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "440px", marginBottom: "56px" }}>Chaque levier a son guide d&apos;action complet, vérifié et à jour.</p>
            <div className="lev-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { ico: "🏛️", g: "linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.1))", h: "Aides sociales non réclamées", p: "RSA, prime d'activité, APL, CSS, AAH", t: "600 — 7 000€" },
                { ico: "🛡️", g: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(236,72,153,0.1))", h: "Assurances non optimisées", p: "Comparaison, négociation, doublons CB", t: "150 — 1 200€" },
                { ico: "📱", g: "linear-gradient(135deg,rgba(251,191,36,0.2),rgba(249,115,22,0.1))", h: "Abonnements fantômes", p: "Détection, résiliation, alertes fin d'offre", t: "200 — 500€" },
                { ico: "📋", g: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.1))", h: "Impôts mal déclarés", p: "Cases oubliées, frais réels, crédits d'impôt", t: "200 — 2 000€" },
                { ico: "⚡", g: "linear-gradient(135deg,rgba(6,182,212,0.2),rgba(37,99,235,0.1))", h: "Énergie non optimisée", p: "Fournisseur, option tarifaire, puissance", t: "100 — 300€" },
                { ico: "⏰", g: "linear-gradient(135deg,rgba(239,68,68,0.15),rgba(249,115,22,0.1))", h: "Fins d'offre oubliées", p: "Alertes + scripts de négociation", t: "100 — 400€" },
                { ico: "🚗", g: "linear-gradient(135deg,rgba(34,197,94,0.2),rgba(6,182,212,0.1))", h: "Aides mobilité & véhicule", p: "Leasing social, bonus écologique, rétrofit", t: "1 500 — 9 500€", last: true },
              ].map((l, i) => (
                <div key={i} className={l.last ? "lev-last" : ""} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", gridColumn: l.last ? "span 2" : "auto" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0, background: l.g }}>{l.ico}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "1px" }}>{l.h}</h4>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>{l.p}</p>
                  </div>
                  <div style={{ fontFamily: fontSub, fontSize: "12px", fontWeight: 700, color: T.green, background: "rgba(5,150,105,0.12)", border: "1px solid rgba(5,150,105,0.15)", padding: "5px 12px", borderRadius: "10px", whiteSpace: "nowrap" as const, flexShrink: 0 }}>{l.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRICING */}
        <section id="prix" className="section" style={{ background: `linear-gradient(180deg,${T.bg} 0%,${T.bgWarm} 100%)`, padding: "110px 24px" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <div style={{ fontFamily: fontSub, fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "2px", color: T.blue, marginBottom: "14px" }}>Tarifs</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: "-1.8px", lineHeight: 1.08, marginBottom: "14px" }}>Transparent. Sans piège.</h2>
            <p style={{ fontSize: "15px", color: T.textSoft, lineHeight: 1.7, maxWidth: "440px", marginBottom: "56px" }}>Le scan est gratuit. L&apos;accompagnement complet est réservé aux membres Premium.</p>
            <div className="pr-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "800px" }}>
              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "24px", padding: "40px 36px", position: "relative" }}>
                <div style={{ fontFamily: fontSub, fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: "20px", color: T.textMuted }}>Gratuit</div>
                <div style={{ fontFamily: fontTitle, fontSize: "48px", fontWeight: 800, letterSpacing: "-2px", marginBottom: "4px" }}>0€</div>
                <div style={{ fontSize: "13px", color: T.textMuted, marginBottom: "32px", lineHeight: 1.5 }}>Pour tout le monde, sans inscription</div>
                <ul style={{ listStyle: "none", marginBottom: "36px", padding: 0 }}>
                  {[
                    { t: "Scan complet en 3 minutes", on: true },
                    { t: "Résultats personnalisés", on: true },
                    { t: "Liste des pistes détectées", on: true },
                    { t: "Guides pas à pas", on: false },
                    { t: "Scripts de négociation", on: false },
                    { t: "Alertes proactives", on: false },
                  ].map((li, i) => (
                    <li key={i} style={{ padding: "7px 0", fontSize: "14px", color: T.textSoft, display: "flex", alignItems: "center", gap: "10px", opacity: li.on ? 1 : 0.35 }}>
                      <span style={{ color: li.on ? T.green : T.textLight, fontWeight: 800 }}>{li.on ? "✓" : "✗"}</span> {li.t}
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setStep("scan"); setVisNum(1); }} style={{ width: "100%", padding: "16px", background: T.bg, color: T.navy, border: `1.5px solid ${T.border}`, borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: fontBody }}>
                  Lancer le scan
                </button>
              </div>
              <div style={{ background: T.bgCard, border: `2px solid ${T.blue}`, borderRadius: "24px", padding: "40px 36px", position: "relative", boxShadow: "0 20px 60px rgba(15,23,42,0.1), 0 0 0 4px rgba(37,99,235,0.06)" }}>
                <div style={{ position: "absolute", top: "18px", right: "18px", fontFamily: fontSub, fontSize: "10px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1px", padding: "6px 14px", borderRadius: "8px", background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", boxShadow: "0 4px 12px rgba(217,119,6,0.3)" }}>50 premiers</div>
                <div style={{ fontFamily: fontSub, fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: "20px", color: T.blue }}>Premium</div>
                <div style={{ fontFamily: fontTitle, fontSize: "48px", fontWeight: 800, letterSpacing: "-2px", marginBottom: "4px" }}>3,49€ <small style={{ fontSize: "16px", fontWeight: 400, color: T.textMuted, letterSpacing: 0 }}>/mois</small></div>
                <div style={{ fontSize: "13px", color: T.textMuted, marginBottom: "32px", lineHeight: 1.5 }}>1er mois gratuit · 6 premiers mois à −50%<br />puis 6,99€/mois · sans engagement</div>
                <ul style={{ listStyle: "none", marginBottom: "36px", padding: 0 }}>
                  {[
                    "Tout le gratuit inclus",
                    "Guides d'action pas à pas",
                    "Scripts de négociation personnalisés",
                    "Cases d'impôts personnalisées",
                    "Alertes fin d'offre proactives",
                    "Coffre-fort documents",
                    "Compteur de gains temps réel",
                    "Analyse de contrats par photo",
                  ].map((t, i) => (
                    <li key={i} style={{ padding: "7px 0", fontSize: "14px", color: T.textSoft, display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: T.green, fontWeight: 800 }}>✓</span> {t}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setShowAuth(true)} style={{ width: "100%", padding: "16px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", fontFamily: fontBody }}>
                  Rejoindre les 50 premiers →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section" style={{ background: T.bgCard, padding: "110px 24px" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <div style={{ fontFamily: fontSub, fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "2px", color: T.blue, marginBottom: "14px" }}>FAQ</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, letterSpacing: "-1.8px", lineHeight: 1.08, marginBottom: "14px" }}>Vous hésitez encore ?</h2>
            <p style={{ fontSize: "15px", color: T.textSoft, lineHeight: 1.7, maxWidth: "440px", marginBottom: "56px" }}>Les réponses à vos questions.</p>
            <div style={{ maxWidth: "640px" }}>
              {faqs.map((f, i) => (
                <div key={i} style={{ borderBottom: `1px solid ${T.borderLight}`, padding: "22px 0" }}>
                  <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ fontFamily: fontSub, fontSize: "16px", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", color: T.navy }}>
                    {f.q}
                    <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: openFaq === i ? T.blueLight : T.bg, border: `1px solid ${openFaq === i ? "rgba(37,99,235,0.2)" : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: openFaq === i ? T.blue : T.textMuted, flexShrink: 0, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</div>
                  </div>
                  <div style={{ maxHeight: openFaq === i ? "200px" : "0", overflow: "hidden", transition: "max-height 0.4s ease", fontSize: "14px", color: T.textSoft, lineHeight: 1.75, paddingTop: openFaq === i ? "14px" : "0" }}>
                    {f.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <div style={{ textAlign: "center", padding: "120px 24px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: "500px", height: "300px", background: "radial-gradient(ellipse,rgba(37,99,235,0.07),transparent 70%)", bottom: "-50px", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />
          <h2 style={{ fontSize: "clamp(30px,5.5vw,48px)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "8px", lineHeight: 1.08, position: "relative", zIndex: 1 }}>
            Combien perdez-vous<br />
            <span style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>sans le savoir</span> ?
          </h2>
          <p style={{ fontSize: "15px", color: T.textSoft, marginBottom: "12px", position: "relative", zIndex: 1 }}>3 minutes. Gratuit. Sans engagement.</p>
          <p style={{ fontSize: "13px", color: T.textMuted, marginBottom: "32px", position: "relative", zIndex: 1 }}>
            <strong style={{ color: T.amber, fontWeight: 600 }}>🎁 Offre 50 premiers :</strong> 1er mois gratuit + 6 mois à −50%
          </p>
          <button onClick={() => { setStep("scan"); setVisNum(1); }} style={{ padding: "16px 34px", background: T.blue, color: "#fff", border: "none", borderRadius: "14px", fontSize: "15px", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.15)", position: "relative", zIndex: 1, fontFamily: fontBody }}>
            Scanner ma situation →
          </button>
        </div>

        {/* FOOTER */}
        <footer style={{ background: T.navy, color: "rgba(255,255,255,0.4)", padding: "56px 32px 28px" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto", display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
            <div>
              <div style={{ fontFamily: fontTitle, fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
                ec<span style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>o</span>nia
              </div>
              <p style={{ fontSize: "13px", lineHeight: 1.7, maxWidth: "260px" }}>L&apos;agent IA qui détecte l&apos;argent que vous perdez sans le savoir et vous accompagne pour le récupérer.</p>
            </div>
            <div>
              <h4 style={{ fontFamily: fontSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>Produit</h4>
              <a href="#how" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Fonctionnement</a>
              <a href="#detect" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Économies</a>
              <a href="#prix" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Tarifs</a>
              <a href="#faq" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>FAQ</a>
            </div>
            <div>
              <h4 style={{ fontFamily: fontSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>Légal</h4>
              <a href="/mentions-legales" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Mentions légales</a>
              <a href="/confidentialite" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Confidentialité</a>
              <a href="/cgu" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>CGU</a>
            </div>
            <div>
              <h4 style={{ fontFamily: fontSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>Suivez-nous</h4>
              <a href="#" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Instagram</a>
              <a href="#" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>TikTok</a>
              <a href="#" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Facebook</a>
              <a href="mailto:econia.app@gmail.com" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", padding: "4px 0" }}>Contact</a>
            </div>
          </div>
          <div style={{ maxWidth: "1080px", margin: "0 auto", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(255,255,255,0.25)", flexWrap: "wrap", gap: "8px" }}>
            <span>© 2026 Econia — Estimations indicatives basées sur les barèmes officiels</span>
            <span>Fait en France 🇫🇷</span>
          </div>
        </footer>
      </>)}

      {/* SCAN */}
      {step === "scan" && qIdx < questions.length && (() => {
        const q = questions[qIdx];
        return (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "100px 20px 40px", background: T.bg }}>
            <div style={{ width: "100%", maxWidth: "480px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <span style={{ fontFamily: fontSub, fontSize: "13px", color: T.textMuted, fontWeight: 600 }}>{visNum}/19</span>
                <div style={{ width: "140px", height: "5px", background: T.borderLight, borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${(visNum/19)*100}%`, height: "100%", background: `linear-gradient(90deg, ${T.blue}, ${T.purple})`, borderRadius: "3px", transition: "width 0.3s" }} />
                </div>
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "6px", lineHeight: 1.2, letterSpacing: "-1px" }}>{q.q}</h2>
              {"sub" in q && q.sub && <p style={{ fontSize: "13px", color: T.textMuted, marginBottom: "20px" }}>{q.sub as string}</p>}
              {!("sub" in q && q.sub) && <div style={{ height: "20px" }} />}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {q.options.map((o, i) => (
                  <button key={i} onClick={() => handleAnswer(q.id, o.value)} style={{ padding: "16px 20px", background: T.bgCard, border: `1.5px solid ${T.border}`, borderRadius: "14px", fontSize: "15px", color: T.text, cursor: "pointer", textAlign: "left" as const, fontWeight: 500, fontFamily: fontBody, transition: "all 0.15s" }}
                    onMouseOver={e => { (e.target as HTMLElement).style.borderColor = T.blue; (e.target as HTMLElement).style.background = T.blueLight; }}
                    onMouseOut={e => { (e.target as HTMLElement).style.borderColor = T.border; (e.target as HTMLElement).style.background = T.bgCard; }}
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
          <div style={{ minHeight: "100vh", padding: "100px 20px 40px", background: T.bg }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎯</div>
                <h2 style={{ fontSize: "30px", fontWeight: 800, marginBottom: "6px", letterSpacing: "-1.5px" }}>Votre analyse Econia</h2>
                <p style={{ color: T.textSoft, fontSize: "14px" }}>{data.gains.length} pistes d&apos;économies identifiées</p>
              </div>
              <div style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, borderRadius: "20px", padding: "28px", color: "#fff", textAlign: "center", marginBottom: "20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-50%", right: "-50%", width: "200%", height: "200%", background: "radial-gradient(circle at 70% 30%,rgba(255,255,255,0.07),transparent 60%)" }} />
                <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px", position: "relative" }}>Gain potentiel estimé</div>
                <div style={{ fontFamily: fontTitle, fontSize: "36px", fontWeight: 800, letterSpacing: "-1.5px", position: "relative" }}>{data.gainMin.toLocaleString()}€ — {data.gainMax.toLocaleString()}€<span style={{ fontSize: "16px", fontWeight: 400 }}>/an</span></div>
                <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "4px", position: "relative" }}>Hors crédits d&apos;impôt et aides déjà perçues</div>
              </div>
              {pleasures.length > 0 && (
                <div style={{ background: T.amberLight, border: `1px solid ${T.amber}33`, borderRadius: "14px", padding: "18px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: T.amber, marginBottom: "8px", fontFamily: fontSub }}>💛 Ce que ça représente chaque mois</div>
                  <div style={{ fontSize: "13px", lineHeight: 1.6, color: T.text }}>{pleasures.map((p, i) => <div key={i}>• {p}</div>)}</div>
                  <div style={{ fontSize: "12px", color: T.textSoft, marginTop: "8px", fontStyle: "italic" }}>Des plaisirs cachés dans vos factures.</div>
                </div>
              )}
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: catColors[cat] || T.blue }} />
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, letterSpacing: "0.8px", fontFamily: fontSub }}>{catLabels[cat] || cat}</h3>
                  </div>
                  {items.map((g, i) => {
                    const gk = gainToGuide[g.title]; const gd = gk ? guides[gk] : null;
                    return (
                      <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "16px", marginBottom: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}><span style={{ fontSize: "18px" }}>{g.icon}</span><span style={{ fontSize: "14px", fontWeight: 700, fontFamily: fontSub }}>{g.title}</span></div>
                            <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5, margin: 0 }}>{g.desc}</p>
                          </div>
                          <div style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, color: catColors[g.cat] || T.blue, background: (catColors[g.cat] || T.blue) + "15", whiteSpace: "nowrap" as const, fontFamily: fontSub }}>{g.montant}</div>
                        </div>
                        {gd && (
                          <div style={{ marginTop: "12px", borderTop: `1px solid ${T.borderLight}`, paddingTop: "12px" }}>
                            {isPremium ? (
                              <button onClick={() => setOpenGuide(gk)} style={{ width: "100%", padding: "10px", background: T.blueLight, color: T.blue, border: `1px solid ${T.blue}33`, borderRadius: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: fontSub }}>📖 Voir le guide pas à pas ({gd.steps.length} étapes)</button>
                            ) : (
                              <button onClick={() => user ? undefined : setShowAuth(true)} style={{ width: "100%", padding: "10px", background: T.bg, color: T.textMuted, border: `1px dashed ${T.border}`, borderRadius: "10px", fontSize: "12px", cursor: "pointer", fontFamily: fontSub }}>🔒 Guide pas à pas ({gd.steps.length} étapes) — {user ? "Econia Premium" : "Créez un compte"}</button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              
                  <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ fontSize: "18px" }}>📋</span><span style={{ fontSize: "14px", fontWeight: 700, fontFamily: fontSub }}>Vos cases d&apos;impôts à remplir</span></div>
                    <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5, margin: "0 0 12px" }}>Guide personnalisé : cases exactes, montants, erreurs à éviter.</p>
                    {isPremium ? (
                      <button onClick={() => setOpenGuide("impots_cases")} style={{ width: "100%", padding: "10px", background: T.greenLight, color: T.green, border: `1px solid ${T.green}33`, borderRadius: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: fontSub }}>📖 Voir mes cases ({guides.impots_cases.steps.length} sections)</button>
                    ) : (
                      <button onClick={() => user ? undefined : setShowAuth(true)} style={{ width: "100%", padding: "10px", background: T.bg, color: T.textMuted, border: `1px dashed ${T.border}`, borderRadius: "10px", fontSize: "12px", cursor: "pointer", fontFamily: fontSub }}>🔒 Mes cases personnalisées — {user ? "Premium" : "Créez un compte"}</button>
                    )}
                  </div>
                </div>
              )}
              {data.infos.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, marginBottom: "12px", fontFamily: fontSub, letterSpacing: "0.8px" }}>💡 Bon à savoir</h3>
                  {data.infos.map((info, i) => (
                    <div key={i} style={{ background: T.blueLight, border: `1px solid ${T.blue}22`, borderRadius: "14px", padding: "16px", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}><span style={{ fontSize: "18px" }}>{info.icon}</span><span style={{ fontSize: "14px", fontWeight: 700, color: T.blue, fontFamily: fontSub }}>{info.title}</span></div>
                      <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              {!user && (
                <div style={{ background: T.greenLight, border: `1px solid ${T.green}33`, borderRadius: "14px", padding: "22px", textAlign: "center", marginTop: "28px" }}>
                  <p style={{ fontSize: "15px", color: T.green, fontWeight: 700, marginBottom: "8px", fontFamily: fontSub }}>Créez votre compte pour sauvegarder vos résultats</p>
                  <p style={{ fontSize: "13px", color: T.textSoft, marginBottom: "16px", lineHeight: 1.5 }}>
                    {spotsLeft > 0 ? `50 premiers : 1er mois gratuit + 3,49€/mois pendant 6 mois. Plus que ${spotsLeft} places.` : "Inscrivez-vous pour être prévenu(e) des prochaines offres."}
                  </p>
                  <button onClick={() => setShowAuth(true)} style={{ padding: "12px 30px", background: T.green, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(5,150,105,0.25)" }}>Créer mon compte gratuit</button>
                </div>
              )}
              <div style={{ textAlign: "center", marginTop: "24px" }}><button onClick={reset} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>Refaire un scan</button></div>
              <p style={{ textAlign: "center", fontSize: "10px", color: T.textMuted, marginTop: "20px", lineHeight: 1.5 }}>Estimations indicatives basées sur les barèmes avril 2026. Seuls les organismes compétents peuvent confirmer vos droits.</p>
              <div style={{ textAlign: "center", marginTop: "24px", display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <a href="/mentions-legales" style={{ fontSize: "11px", color: T.textMuted, textDecoration: "none" }}>Mentions légales</a>
                <a href="/confidentialite" style={{ fontSize: "11px", color: T.textMuted, textDecoration: "none" }}>Confidentialité</a>
                <a href="/cgu" style={{ fontSize: "11px", color: T.textMuted, textDecoration: "none" }}>CGU</a>
              </div>
            </div>
          </div>
        );
      })()}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
      {openGuide && <GuideModal guideKey={openGuide} onClose={() => setOpenGuide(null)} />}
    </>
  );
}

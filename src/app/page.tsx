"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { guides, gainToGuide } from "@/lib/guides";

const supabase = createClient(
  "https://pxbntlbtngcecbhcghzu.supabase.co",
  "sb_publishable_RK6hui-9UQCUy5H36tj9_A_gcGNtfIQ"
);

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
  if (isModeste && !["retraite","etudiant","chomage"].includes(a.statut)) gains.push({ cat: "aide", icon: "💰", title: "Prime d'activité", desc: "Complément pour travailleurs modestes.", montant: "100 à 350€/mois", annuel: [1200, 4200] });
  if (a.logement === "locataire" && isModeste) gains.push({ cat: "aide", icon: "🏠", title: "APL", desc: "Aide pour réduire votre loyer.", montant: "50 à 400€/mois", annuel: [600, 4800] });
  if (hasKids && ["6-10","11-17"].includes(a.ageEnfant) && isModeste) gains.push({ cat: "aide", icon: "🎒", title: "Allocation rentrée scolaire", desc: "Versée en août.", montant: "429 à 468€/enfant", annuel: [429, 936] });
  if (a.statut === "retraite" && isModeste) gains.push({ cat: "aide", icon: "🧓", title: "ASPA (minimum vieillesse)", desc: "Complément pour petites retraites.", montant: "jusqu'à 1 044€/mois", annuel: [2000, 12516] });
  if (isModeste) gains.push({ cat: "aide", icon: "🏥", title: "Complémentaire Santé Solidaire", desc: "Mutuelle gratuite ou à moins de 1€/jour.", montant: "30 à 100€/mois", annuel: [360, 1200] });
  if (isModeste) gains.push({ cat: "aide", icon: "🔥", title: "Chèque énergie", desc: "Aide au paiement des factures.", montant: "48 à 277€/an", annuel: [48, 277] });
  if (a.handicap === "oui") gains.push({ cat: "aide", icon: "♿", title: "AAH / PCH", desc: "Allocations liées au handicap.", montant: "jusqu'à 1 042€/mois", annuel: [3000, 12504] });
  if (a.age === "18-25" || a.statut === "etudiant") gains.push({ cat: "aide", icon: "🎓", title: "Aides jeunes / étudiants", desc: "Bourse, Visale, aide au permis.", montant: "variable", annuel: [500, 5000] });
  if (a.assurances !== "oui_tout") { gains.push({ cat: "assurance", icon: "🛡️", title: "Assurances non comparées", desc: "Hausse 5-8%/an.", montant: "150 à 400€/an", annuel: [150, 400] }); gains.push({ cat: "assurance", icon: "💳", title: "Doublons carte bancaire", desc: "Votre CB inclut des assurances.", montant: "80 à 200€/an", annuel: [80, 200] }); }
  if (["oui_5","oui_15","oui_15plus"].includes(a.credit)) gains.push({ cat: "assurance", icon: "🏦", title: "Assurance emprunteur (loi Lemoine)", desc: "Changez à tout moment.", montant: "400 à 1 200€/an", annuel: [400, 1200] });
  if (a.abonnements !== "oui_precis") gains.push({ cat: "abonnement", icon: "📱", title: "Abonnements fantômes", desc: "1 Français sur 3 paie un abonnement oublié.", montant: "200 à 500€/an", annuel: [200, 500] });
  gains.push({ cat: "abonnement", icon: "⏰", title: "Alertes fin d'offre", desc: "Econia vous prévient avant que vos promos expirent.", montant: "100 à 400€/an", annuel: [100, 400] });
  if (a.logement !== "heberge") gains.push({ cat: "energie", icon: "⚡", title: "Optimisation énergie", desc: "Comparaison fournisseurs et option tarifaire.", montant: "100 à 300€/an", annuel: [100, 300] });
  if (["proprio_credit","proprio_sans"].includes(a.logement) && a.logementAge === "oui") gains.push({ cat: "aide", icon: "🏗️", title: "MaPrimeRénov' + CEE", desc: "Aides rénovation cumulables.", montant: "1 000 à 10 000€", annuel: [0, 0] });
  if (a.vehicule === "thermique" && isModeste) gains.push({ cat: "aide", icon: "🚗", title: "Leasing social", desc: "Voiture électrique à ~100€/mois.", montant: "~2 800€/an vs diesel", annuel: [1500, 2800] });
  if (hasKids && youngKids) infos.push({ icon: "👶", title: "Vérifiez votre CMG", desc: "Jusqu'à 997€/mois. Simulation sur urssaf.fr." });
  if (a.sap === "oui_sans_cesu") infos.push({ icon: "📋", title: "CESU", desc: "Services sans CESU = pas de crédit d'impôt. cesu.urssaf.fr." });
  let gainMin = 0, gainMax = 0;
  gains.forEach(g => { gainMin += g.annuel[0]; gainMax += g.annuel[1]; });
  return { gains, infos, gainMin: Math.min(gainMin, 12000), gainMax: Math.min(gainMax, 20000) };
}

const MAX_WAITLIST = 50;

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
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "10px", fontFamily: fontTitle }}>Vérifiez vos emails</h2>
            <p style={{ color: T.textSoft, fontSize: "14px", marginBottom: "24px" }}>Un lien de confirmation a été envoyé à <strong>{email}</strong>.</p>
            <button onClick={onClose} style={{ padding: "12px 28px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Compris</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, fontFamily: fontTitle }}>{mode === "signup" ? "Créer un compte" : "Connexion"}</h2>
              <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", color: T.textMuted, cursor: "pointer" }}>✕</button>
            </div>
            {mode === "signup" && (
              <div style={{ background: T.amberLight, border: `1px solid ${T.amber}33`, borderRadius: "12px", padding: "10px 14px", marginBottom: "20px", fontSize: "12px", color: T.amber, fontWeight: 500 }}>
                🎁 Les 50 premiers : 1er mois gratuit + 3,49€/mois pendant 6 mois
              </div>
            )}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: T.textSoft, display: "block", marginBottom: "6px", fontWeight: 500 }}>EMAIL</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="vous@email.com" style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${T.border}`, borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }} />
            </div>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "12px", color: T.textSoft, display: "block", marginBottom: "6px", fontWeight: 500 }}>MOT DE PASSE</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="8 caractères minimum" style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${T.border}`, borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" as const }} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
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
            <button onClick={handleSubmit} disabled={loading || (mode === "signup" && !acceptedLegal)} style={{ width: "100%", padding: "14px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: (loading || (mode === "signup" && !acceptedLegal)) ? "not-allowed" : "pointer", opacity: (loading || (mode === "signup" && !acceptedLegal)) ? 0.5 : 1 }}>
              {loading ? "..." : mode === "signup" ? "Créer mon compte gratuit" : "Me connecter"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", background: T.border }} />
              <span style={{ fontSize: "11px", color: T.textMuted }}>OU</span>
              <div style={{ flex: 1, height: "1px", background: T.border }} />
            </div>
            <button onClick={async () => { await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } }); }} style={{ width: "100%", padding: "12px", background: T.bgCard, color: T.text, border: `1.5px solid ${T.border}`, borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continuer avec Google
            </button>
            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: T.textMuted }}>
              {mode === "signup" ? "Déjà inscrit ?" : "Pas encore de compte ?"}{" "}
              <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }} style={{ background: "none", border: "none", color: T.blue, cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                {mode === "signup" ? "Se connecter" : "Créer un compte"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function GuideModal({ guideKey, onClose }: { guideKey: string; onClose: () => void }) {
  const guide = guides[guideKey]; if (!guide) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px", overflowY: "auto" }}>
      <div style={{ background: T.bgCard, borderRadius: "20px", maxWidth: "640px", width: "100%", marginTop: "60px", marginBottom: "40px", border: `1px solid ${T.border}` }}>
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px", fontFamily: fontTitle }}>{guide.title}</h2>
            <div style={{ fontSize: "12px", color: T.textMuted, display: "flex", gap: "12px" }}>
              <span>⏱ {guide.time}</span>
              <span>📊 {guide.difficulty}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", color: T.textMuted, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: "24px" }}>
          {guide.steps.map((s, i) => (
            <div key={i} style={{ marginBottom: "22px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "start", marginBottom: "8px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: T.blueLight, color: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>{s.title}</h3>
              </div>
              <p style={{ fontSize: "14px", color: T.textSoft, lineHeight: 1.75, marginLeft: "40px" }}>{s.content}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 24px 24px", textAlign: "center" }}>
          <button onClick={onClose} style={{ padding: "12px 32px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

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
  const reset = () => {
    setStep("hero"); setQIdx(0); setAnswers({}); setData(null); setVisNum(0); setOpenGuide(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const catLabels: Record<string,string> = { aide: "Aides & prestations", assurance: "Assurances", abonnement: "Abonnements & contrats", energie: "Énergie" };
  const catColors: Record<string,string> = { aide: T.blue, assurance: T.purple, abonnement: T.amber, energie: T.red };
  const spotsLeft = Math.max(0, MAX_WAITLIST - waitlistCount);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: ${fontBody}; color: ${T.text}; background: ${T.bg}; -webkit-font-smoothing: antialiased; margin: 0; }
        h1, h2, h3 { font-family: ${fontTitle}; }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100, background: "rgba(250,251,255,0.85)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${T.borderLight}` }}>
        <div style={{ fontFamily: fontTitle, fontSize: "22px", fontWeight: 700, cursor: "pointer", color: T.navy }} onClick={reset}>
          ec<span style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>o</span>nia
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {user ? (
            <>
              <span style={{ fontSize: "12px", color: T.textMuted, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{user.email}</span>
              {profile?.is_founder && <span style={{ fontSize: "10px", background: T.amberLight, color: T.amber, padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>FONDATEUR</span>}
              <button onClick={handleLogout} style={{ padding: "6px 12px", background: "transparent", color: T.textMuted, border: `1px solid ${T.border}`, borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>Déconnexion</button>
            </>
          ) : (
            <button onClick={() => setShowAuth(true)} style={{ padding: "8px 18px", background: T.navy, color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Connexion</button>
          )}
        </div>
      </nav>

      {step === "hero" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px 20px", background: `linear-gradient(180deg, ${T.blueLight} 0%, ${T.bg} 50%)` }}>
          <div style={{ fontSize: "42px", marginBottom: "16px" }}>🔍</div>
          <h1 style={{ fontSize: "clamp(30px, 7vw, 52px)", fontWeight: 600, lineHeight: 1.1, marginBottom: "16px", maxWidth: "640px", letterSpacing: "-1.5px" }}>Récupérez l&apos;argent que vous perdez <span style={{ color: T.blue }}>chaque mois</span></h1>
          <p style={{ fontSize: "16px", color: T.textSoft, maxWidth: "440px", lineHeight: 1.6, marginBottom: "24px" }}>Econia scanne votre situation en 3 minutes et identifie chaque euro que vous pourriez récupérer.</p>
          <div style={{ padding: "8px 16px", borderRadius: "8px", background: spotsLeft > 0 ? T.amberLight : "#FEE2E2", border: `1px solid ${spotsLeft > 0 ? T.amber : T.red}33`, marginBottom: "24px", fontSize: "13px", color: spotsLeft > 0 ? T.amber : T.red, fontWeight: 600 }}>
            {spotsLeft > 0 ? `🎁 Accès gratuit — Plus que ${spotsLeft} places sur ${MAX_WAITLIST}` : "Les 50 places gratuites sont prises !"}
          </div>
          <button onClick={() => { setStep("scan"); setVisNum(1); }} style={{ padding: "16px 40px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.25)" }}>Lancer mon scan gratuit</button>
          <div style={{ display: "flex", gap: "32px", marginTop: "48px", flexWrap: "wrap", justifyContent: "center" }}>
            {[{ n: "10 Mds€", t: "d'aides non réclamées/an" }, { n: "500€", t: "d'abonnements oubliés/foyer" }, { n: "+5 à 8%", t: "hausse assurances/an" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: fontTitle, fontSize: "22px", fontWeight: 700, background: "linear-gradient(135deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.n}</div>
                <div style={{ fontSize: "12px", color: T.textMuted, marginTop: "2px" }}>{s.t}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "scan" && qIdx < questions.length && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "100px 20px 40px" }}>
          <div style={{ width: "100%", maxWidth: "480px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <span style={{ fontSize: "13px", color: T.textMuted, fontWeight: 600 }}>{visNum}/19</span>
              <div style={{ width: "140px", height: "5px", background: T.borderLight, borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${(visNum/19)*100}%`, height: "100%", background: `linear-gradient(90deg, ${T.blue}, ${T.purple})`, borderRadius: "3px", transition: "width 0.3s" }} />
              </div>
            </div>
            <h2 style={{ fontSize: "26px", fontWeight: 600, marginBottom: "6px", lineHeight: 1.2, letterSpacing: "-1px" }}>{questions[qIdx].q}</h2>
            {"sub" in questions[qIdx] && questions[qIdx].sub && <p style={{ fontSize: "13px", color: T.textMuted, marginBottom: "20px" }}>{questions[qIdx].sub as string}</p>}
            {!("sub" in questions[qIdx] && questions[qIdx].sub) && <div style={{ height: "20px" }} />}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {questions[qIdx].options.map((o, i) => (
                <button key={i} onClick={() => handleAnswer(questions[qIdx].id, o.value)} style={{ padding: "16px 20px", background: T.bgCard, border: `1.5px solid ${T.border}`, borderRadius: "14px", fontSize: "15px", color: T.text, cursor: "pointer", textAlign: "left" as const, fontWeight: 500 }}>{o.label}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "results" && data && (
        <div style={{ minHeight: "100vh", padding: "100px 20px 40px" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎯</div>
              <h2 style={{ fontSize: "30px", fontWeight: 600, marginBottom: "6px", letterSpacing: "-1.5px" }}>Votre analyse Econia</h2>
              <p style={{ color: T.textSoft, fontSize: "14px" }}>{data.gains.length} pistes d&apos;économies identifiées</p>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${T.blue}, ${T.purple})`, borderRadius: "20px", padding: "28px", color: "#fff", textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>Gain potentiel estimé</div>
              <div style={{ fontFamily: fontTitle, fontSize: "36px", fontWeight: 700, letterSpacing: "-1.5px" }}>{data.gainMin.toLocaleString()}€ — {data.gainMax.toLocaleString()}€<span style={{ fontSize: "16px", fontWeight: 400 }}>/an</span></div>
              <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "4px" }}>Hors aides déjà perçues</div>
            </div>
            {(() => {
              const grouped: Record<string, Gain[]> = {};
              data.gains.forEach(g => { if (!grouped[g.cat]) grouped[g.cat] = []; grouped[g.cat].push(g); });
              return Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: catColors[cat] || T.blue }} />
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, letterSpacing: "0.8px" }}>{catLabels[cat] || cat}</h3>
                  </div>
                  {items.map((g, i) => {
                    const gk = gainToGuide[g.title]; const gd = gk ? guides[gk] : null;
                    return (
                      <div key={i} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "16px", marginBottom: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <span style={{ fontSize: "18px" }}>{g.icon}</span>
                              <span style={{ fontSize: "14px", fontWeight: 700 }}>{g.title}</span>
                            </div>
                            <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5, margin: 0 }}>{g.desc}</p>
                          </div>
                          <div style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, color: catColors[g.cat] || T.blue, background: (catColors[g.cat] || T.blue) + "15", whiteSpace: "nowrap" as const }}>{g.montant}</div>
                        </div>
                        {gd && (
                          <div style={{ marginTop: "12px", borderTop: `1px solid ${T.borderLight}`, paddingTop: "12px" }}>
                            {isPremium ? (
                              <button onClick={() => setOpenGuide(gk)} style={{ width: "100%", padding: "10px", background: T.blueLight, color: T.blue, border: `1px solid ${T.blue}33`, borderRadius: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>📖 Voir le guide pas à pas ({gd.steps.length} étapes)</button>
                            ) : (
                              <button onClick={() => user ? undefined : setShowAuth(true)} style={{ width: "100%", padding: "10px", background: T.bg, color: T.textMuted, border: `1px dashed ${T.border}`, borderRadius: "10px", fontSize: "12px", cursor: "pointer" }}>🔒 Guide pas à pas ({gd.steps.length} étapes) — {user ? "Econia Premium" : "Créez un compte"}</button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
            {data.infos.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, marginBottom: "12px" }}>💡 Bon à savoir</h3>
                {data.infos.map((info, i) => (
                  <div key={i} style={{ background: T.blueLight, border: `1px solid ${T.blue}22`, borderRadius: "14px", padding: "16px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "18px" }}>{info.icon}</span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: T.blue }}>{info.title}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
                  </div>
                ))}
              </div>
            )}
            {!user && (
              <div style={{ background: T.greenLight, border: `1px solid ${T.green}33`, borderRadius: "14px", padding: "22px", textAlign: "center", marginTop: "28px" }}>
                <p style={{ fontSize: "15px", color: T.green, fontWeight: 700, marginBottom: "8px" }}>Créez votre compte pour sauvegarder vos résultats</p>
                <p style={{ fontSize: "13px", color: T.textSoft, marginBottom: "16px" }}>{spotsLeft > 0 ? `50 premiers : 1er mois gratuit + 3,49€/mois pendant 6 mois. Plus que ${spotsLeft} places.` : "Inscrivez-vous pour être prévenu(e) des prochaines offres."}</p>
                <button onClick={() => setShowAuth(true)} style={{ padding: "12px 30px", background: T.green, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>Créer mon compte gratuit</button>
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button onClick={reset} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>Refaire un scan</button>
            </div>
            <p style={{ textAlign: "center", fontSize: "10px", color: T.textMuted, marginTop: "20px", lineHeight: 1.5 }}>Estimations indicatives basées sur les barèmes 2026. Seuls les organismes compétents peuvent confirmer vos droits.</p>
          </div>
        </div>
      )}

      {step === "hero" && (
        <footer style={{ textAlign: "center", padding: "32px 20px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: fontTitle, fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>ec<span style={{ color: T.blue }}>o</span>nia</div>
          <p style={{ fontSize: "12px", color: T.textMuted }}>Découvrez combien vous pourriez récupérer</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
            <a href="/mentions-legales" style={{ fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>Mentions légales</a>
            <a href="/confidentialite" style={{ fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>Confidentialité</a>
            <a href="/cgu" style={{ fontSize: "12px", color: T.textMuted, textDecoration: "none" }}>CGU</a>
          </div>
          <p style={{ fontSize: "11px", color: T.textMuted, marginTop: "12px" }}>© 2026 Econia — Estimations indicatives</p>
        </footer>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
      {openGuide && <GuideModal guideKey={openGuide} onClose={() => setOpenGuide(null)} />}
    </>
  );
}

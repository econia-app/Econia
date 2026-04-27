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
    { value: "cumul", label: "Salarié + micro-entreprise" }, { value: "chomage", label: "Demandeur d'emploi" },
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

  if (a.revenus === "moins1500" && a.statut !== "retraite")
    gains.push({ cat: "aide", icon: "🏛️", title: "RSA", desc: "Revenu minimum garanti pour les personnes sans ressources.", montant: "jusqu'à 635€/mois", annuel: [3000, 7620] });
  if (isModeste && !["retraite","etudiant","chomage"].includes(a.statut))
    gains.push({ cat: "aide", icon: "💰", title: "Prime d'activité", desc: "Complément de revenus pour les travailleurs modestes.", montant: "50 à 300€/mois", annuel: [600, 3600] });
  if (a.logement === "locataire" && isModeste)
    gains.push({ cat: "aide", icon: "🏠", title: "APL", desc: "Aide pour réduire votre loyer.", montant: "50 à 400€/mois", annuel: [600, 4800] });
  if (hasKids && ["6-10","11-17"].includes(a.ageEnfant) && isModeste)
    gains.push({ cat: "aide", icon: "🎒", title: "Allocation rentrée scolaire", desc: "Versée en août pour les fournitures.", montant: "427 à 466€/enfant", annuel: [427, 932] });
  if (a.statut === "retraite" && isModeste)
    gains.push({ cat: "aide", icon: "🧓", title: "ASPA (minimum vieillesse)", desc: "Complément pour les petites retraites.", montant: "jusqu'à 1 043€/mois", annuel: [2000, 12516] });
  if (isModeste)
    gains.push({ cat: "aide", icon: "🏥", title: "Complémentaire Santé Solidaire", desc: "Mutuelle gratuite ou à moins de 1€/jour.", montant: "30 à 100€/mois d'économie", annuel: [360, 1200] });
  if (isModeste)
    gains.push({ cat: "aide", icon: "🔥", title: "Chèque énergie", desc: "Aide au paiement des factures.", montant: "48 à 277€/an", annuel: [48, 277] });
  if (a.handicap === "oui")
    gains.push({ cat: "aide", icon: "♿", title: "AAH / PCH", desc: "Allocations et prestations liées au handicap.", montant: "jusqu'à 1 041€/mois", annuel: [3000, 12492] });
  if (a.age === "18-25" || a.statut === "etudiant")
    gains.push({ cat: "aide", icon: "🎓", title: "Aides jeunes / étudiants", desc: "Bourse, Visale, aide au permis.", montant: "variable", annuel: [500, 5000] });
  if (a.assurances !== "oui_tout") {
    gains.push({ cat: "assurance", icon: "🛡️", title: "Assurances non comparées", desc: "Hausse de 5-8%/an. Vous surpayez probablement.", montant: "150 à 400€/an", annuel: [150, 400] });
    gains.push({ cat: "assurance", icon: "💳", title: "Doublons carte bancaire", desc: "Votre CB inclut des assurances. Vérifiez les doublons.", montant: "80 à 200€/an", annuel: [80, 200] });
  }
  if (["oui_5","oui_15","oui_15plus"].includes(a.credit))
    gains.push({ cat: "assurance", icon: "🏦", title: "Assurance emprunteur (loi Lemoine)", desc: "Changez à tout moment, économie de 5 000-15 000€ sur le prêt.", montant: "400 à 1 200€/an", annuel: [400, 1200] });
  if (a.abonnements !== "oui_precis")
    gains.push({ cat: "abonnement", icon: "📱", title: "Abonnements fantômes", desc: "1 Français sur 3 paie un abonnement oublié.", montant: "200 à 500€/an", annuel: [200, 500] });
  gains.push({ cat: "abonnement", icon: "⏰", title: "Alertes fin d'offre", desc: "Econia vous prévient avant que vos promos expirent.", montant: "100 à 400€/an", annuel: [100, 400] });
  if (a.logement !== "heberge")
    gains.push({ cat: "energie", icon: "⚡", title: "Optimisation énergie", desc: "Comparaison fournisseurs et option tarifaire.", montant: "100 à 300€/an", annuel: [100, 300] });
  if (["salarie","cumul"].includes(a.statut) && ["15-30","30-50","50plus"].includes(a.distance))
    gains.push({ cat: "impot", icon: "🚗", title: "Frais réels vs abattement 10%", desc: "Avec votre distance, les frais réels sont potentiellement plus avantageux.", montant: "200 à 1 500€/an", annuel: [200, 1500] });
  if (["proprio_credit","proprio_sans"].includes(a.logement) && a.logementAge === "oui")
    gains.push({ cat: "aide", icon: "🏗️", title: "MaPrimeRénov' + CEE", desc: "Aides rénovation énergétique cumulables.", montant: "1 000 à 10 000€ (ponctuel)", annuel: [0, 0] });
  if (a.vehicule === "thermique" && isModeste)
    gains.push({ cat: "aide", icon: "🚗", title: "Leasing social", desc: "Voiture électrique à ~100€/mois. Ouverture juillet 2026.", montant: "~2 800€/an vs diesel", annuel: [1500, 2800] });

  if (hasKids && youngKids)
    infos.push({ icon: "👶", title: "Vérifiez votre CMG", desc: "Depuis la réforme 2025, le CMG peut atteindre 992€/mois. Plus de reste à charge obligatoire de 15%. Faites une simulation sur le site de l'Urssaf." });
  infos.push({ icon: "💡", title: "Crédit d'impôt Services à la Personne", desc: "L'État rembourse 50% : ménage, jardinage, garde, soutien scolaire, assistance informatique... Plafond 12 000€/an = 6 000€ de crédit. MÊME SI VOUS NE PAYEZ PAS D'IMPÔTS. Pour la garde hors domicile : jusqu'à 1 750€/enfant. Cases 7DB et 7GA." });
  if (a.sap === "oui_sans_cesu")
    infos.push({ icon: "📋", title: "CESU — Vous passez à côté du remboursement", desc: "Vous utilisez des services à domicile SANS CESU. Vous perdez le crédit d'impôt de 50%. Avec l'Avance Immédiate, vous ne payez que la moitié chaque mois. Inscription gratuite sur cesu.urssaf.fr." });

  let gainMin = 0, gainMax = 0;
  gains.forEach(g => { gainMin += g.annuel[0]; gainMax += g.annuel[1]; });
  return { gains, infos, gainMin: Math.min(gainMin, 12000), gainMax: Math.min(gainMax, 20000) };
}

const MAX_WAITLIST = 50;

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

  useEffect(() => {
    async function fetchCount() {
      try {
        const { count } = await supabase.from("waitlist").select("*", { count: "exact", head: true });
        setWaitlistCount(count || 0);
      } catch { /* ignore */ }
    }
    fetchCount();
  }, []);

  const handleSubscribe = async () => {
    setEmailError("");
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Entrez un email valide.");
      return;
    }
    try {
      const { error } = await supabase.from("waitlist").insert([
        { email, scan_data: data ? { gains: data.gains.length, gainMin: data.gainMin, gainMax: data.gainMax, answers } : null }
      ]);
      if (error) {
        if (error.code === "23505") setEmailError("Cet email est déjà inscrit !");
        else setEmailError("Erreur, réessayez.");
        return;
      }
      setSubscribed(true);
      setWaitlistCount(c => c + 1);
    } catch {
      setEmailError("Erreur de connexion, réessayez.");
    }
  };

  const handleAnswer = (id: string, value: string) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    let ni = qIdx + 1;
    while (ni < questions.length) {
      const nq = questions[ni];
      if (nq.showIf && !nq.showIf(next)) { next[nq.id] = "na"; ni++; }
      else break;
    }
    if (ni >= questions.length) { setData(analyzeProfile(next)); setStep("results"); }
    else { setQIdx(ni); setVisNum(p => p + 1); }
  };

  const reset = () => { setStep("hero"); setQIdx(0); setAnswers({}); setData(null); setVisNum(0); setEmail(""); setSubscribed(false); setEmailError(""); };
  const catLabels: Record<string,string> = { aide: "Aides & prestations", assurance: "Assurances", abonnement: "Abonnements & contrats", impot: "Impôts", energie: "Énergie" };
  const catColors: Record<string,string> = { aide: T.accent, assurance: T.purple, abonnement: T.orange, impot: T.green, energie: T.red };
  const spotsLeft = Math.max(0, MAX_WAITLIST - waitlistCount);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", color: T.text }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100, background: `${T.bg}EE`, backdropFilter: "blur(16px)", borderBottom: "1px solid #E5E7EB44" }}>
        <div style={{ fontSize: "22px", fontWeight: 700 }}>Ec<span style={{ color: T.accent }}>o</span>nia</div>
        {step === "hero" && <button onClick={() => { setStep("scan"); setVisNum(1); }} style={{ padding: "8px 18px", background: T.accent, color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Scan gratuit</button>}
      </nav>

      {step === "hero" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px 20px", background: `linear-gradient(180deg, ${T.accentLight} 0%, ${T.bg} 50%)` }}>
          <div style={{ fontSize: "42px", marginBottom: "16px" }}>🔍</div>
          <h1 style={{ fontSize: "clamp(30px, 7vw, 52px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "16px", maxWidth: "600px", letterSpacing: "-1px" }}>
            Découvrez combien vous pourriez <span style={{ color: T.accent }}>récupérer</span>
          </h1>
          <p style={{ fontSize: "16px", color: T.textSoft, maxWidth: "440px", lineHeight: 1.6, marginBottom: "24px" }}>
            Econia analyse votre situation en 3 minutes et identifie les aides, économies et optimisations que vous ne percevez probablement pas.
          </p>
          <div style={{ padding: "8px 16px", borderRadius: "8px", background: spotsLeft > 0 ? T.orangeLight : "#FEE2E2", border: `1px solid ${spotsLeft > 0 ? T.orange : T.red}33`, marginBottom: "24px", fontSize: "13px", color: spotsLeft > 0 ? T.orange : T.red, fontWeight: 600 }}>
            {spotsLeft > 0 ? `🎁 Gratuit — Plus que ${spotsLeft} places sur ${MAX_WAITLIST}` : "⚠️ Les 50 places gratuites sont prises !"}
          </div>
          <button onClick={() => { setStep("scan"); setVisNum(1); }} style={{ padding: "16px 40px", background: T.accent, color: "#fff", border: "none", borderRadius: "12px", fontSize: "17px", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(27,110,243,0.3)" }}>
            Lancer mon scan gratuit
          </button>
          <div style={{ display: "flex", gap: "32px", marginTop: "48px", flexWrap: "wrap", justifyContent: "center" }}>
            {[{ n: "10 Mds€", t: "d'aides non réclamées/an" }, { n: "500€", t: "d'abonnements oubliés/foyer" }, { n: "+5 à 8%", t: "hausse assurances/an" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 700 }}>{s.n}</div>
                <div style={{ fontSize: "12px", color: T.textMuted, marginTop: "2px" }}>{s.t}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "scan" && qIdx < questions.length && (() => {
        const q = questions[qIdx];
        return (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
            <div style={{ width: "100%", maxWidth: "480px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <span style={{ fontSize: "13px", color: T.textMuted }}>{visNum}/19</span>
                <div style={{ width: "120px", height: "4px", background: "#F3F4F6", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${(visNum / 19) * 100}%`, height: "100%", background: T.accent, borderRadius: "2px", transition: "width 0.3s" }} />
                </div>
              </div>
              <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "6px", lineHeight: 1.3 }}>{q.q}</h2>
              {"sub" in q && q.sub && <p style={{ fontSize: "13px", color: T.textMuted, marginBottom: "16px" }}>{q.sub as string}</p>}
              {!("sub" in q && q.sub) && <div style={{ height: "16px" }} />}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {q.options.map((o, i) => (
                  <button key={i} onClick={() => handleAnswer(q.id, o.value)} style={{
                    padding: "14px 18px", background: T.card, border: `1.5px solid ${T.border}`,
                    borderRadius: "10px", fontSize: "15px", color: T.text, cursor: "pointer",
                    textAlign: "left" as const, fontWeight: 500, transition: "all 0.15s",
                  }}
                    onMouseOver={e => { (e.target as HTMLElement).style.borderColor = T.accent; (e.target as HTMLElement).style.background = T.accentLight; }}
                    onMouseOut={e => { (e.target as HTMLElement).style.borderColor = T.border; (e.target as HTMLElement).style.background = T.card; }}
                  >{o.label}</button>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

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

              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "4px", height: "18px", borderRadius: "2px", background: catColors[cat] || T.accent }} />
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{catLabels[cat] || cat}</h3>
                  </div>
                  {items.map((g, i) => (
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
                    </div>
                  ))}
                </div>
              ))}

              {data.infos.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: T.textSoft, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "10px" }}>💡 Bon à savoir</h3>
                  {data.infos.map((info, i) => (
                    <div key={i} style={{ background: T.accentLight, border: `1px solid ${T.accent}22`, borderRadius: "10px", padding: "14px", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span>{info.icon}</span>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: T.accent }}>{info.title}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.6, margin: 0 }}>{info.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ background: T.greenLight, border: `1px solid ${T.green}33`, borderRadius: "12px", padding: "20px", textAlign: "center", marginTop: "24px" }}>
                {!subscribed ? (<>
                  <p style={{ fontSize: "15px", color: T.green, fontWeight: 600, marginBottom: "6px" }}>Econia vous accompagnera pas à pas pour récupérer cet argent.</p>
                  <p style={{ fontSize: "13px", color: T.textSoft, marginBottom: "14px" }}>
                    {spotsLeft > 0
                      ? `Les ${MAX_WAITLIST} premiers inscrits bénéficient d'un accès gratuit. Plus que ${spotsLeft} places.`
                      : "Les places gratuites sont prises, mais inscrivez-vous pour être prévenu(e) des prochaines offres."}
                  </p>
                  <input value={email} onChange={e => { setEmail(e.target.value); setEmailError(""); }} placeholder="Votre email" style={{ width: "100%", maxWidth: "300px", padding: "11px 14px", border: `1.5px solid ${emailError ? T.red : T.border}`, borderRadius: "8px", fontSize: "14px", outline: "none", textAlign: "center" as const, boxSizing: "border-box" as const, marginBottom: "4px" }} />
                  {emailError && <p style={{ fontSize: "12px", color: T.red, margin: "4px 0" }}>{emailError}</p>}
                  <div style={{ marginTop: "8px" }}><button onClick={handleSubscribe} style={{ padding: "11px 28px", background: T.green, color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Rejoindre la liste d&apos;attente</button></div>
                </>) : (
                  <div><span style={{ fontSize: "24px" }}>✅</span><p style={{ fontSize: "15px", color: T.green, fontWeight: 600, marginTop: "8px" }}>Vous êtes inscrit(e) ! On vous prévient dès le lancement.</p></div>
                )}
              </div>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={reset} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}>Refaire un scan</button>
              </div>
              <p style={{ textAlign: "center", fontSize: "10px", color: T.textMuted, marginTop: "20px", lineHeight: 1.5 }}>
                Estimations indicatives basées sur les barèmes 2026. Seuls les organismes compétents peuvent confirmer vos droits.
              </p>
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
    </div>
  );
}
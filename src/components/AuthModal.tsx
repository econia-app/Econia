"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { T, fonts } from "@/lib/theme";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    if (!email.includes("@") || password.length < 6) {
      setError(password.length < 8 ? "Mot de passe : 8 caractères minimum." : "Email invalide.");
      setLoading(false);
      return;
    }
    if (mode === "signup" && !acceptedLegal) {
      setError("Vous devez accepter les CGU et la politique de confidentialité.");
      setLoading(false);
      return;
    }
    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message === "User already registered" ? "Cet email est déjà inscrit. Connectez-vous." : err.message);
        setLoading(false);
        return;
      }
      setSuccess(true);
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }
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
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "10px", fontFamily: fonts.title }}>Vérifiez vos emails</h2>
            <p style={{ color: T.textSoft, fontSize: "14px", marginBottom: "24px" }}>
              Un lien de confirmation a été envoyé à <strong>{email}</strong>.
            </p>
            <button onClick={onClose} style={{ padding: "12px 28px", background: T.blue, color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Compris
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, fontFamily: fonts.title }}>
                {mode === "signup" ? "Créer un compte" : "Connexion"}
              </h2>
              <button onClick={onClose} aria-label="Fermer" style={{ background: "none", border: "none", fontSize: "20px", color: T.textMuted, cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✕
              </button>
            </div>
            {mode === "signup" && (
              <div style={{ background: T.amberLight, border: `1px solid ${T.amber}33`, borderRadius: "12px", padding: "10px 14px", marginBottom: "20px", fontSize: "12px", color: T.amber, fontWeight: 500 }}>
                🎁 Les 50 premiers : 1er mois gratuit + 3,49€/mois pendant 6 mois
              </div>
            )}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: T.textSoft, display: "block", marginBottom: "6px", fontWeight: 500 }}>EMAIL</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="vous@email.com"
                style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${T.border}`, borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "12px", color: T.textSoft, display: "block", marginBottom: "6px", fontWeight: 500 }}>MOT DE PASSE</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="8 caractères minimum"
                style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${T.border}`, borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            {mode === "signup" && (
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "14px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={acceptedLegal}
                  onChange={(e) => setAcceptedLegal(e.target.checked)}
                  style={{ marginTop: "3px", cursor: "pointer", width: "16px", height: "16px", accentColor: T.blue, flexShrink: 0 }}
                />
                <span style={{ fontSize: "12px", color: T.textSoft, lineHeight: 1.5 }}>
                  J&apos;ai lu et j&apos;accepte les{" "}
                  <a href="/cgu" target="_blank" rel="noopener noreferrer" style={{ color: T.blue, textDecoration: "none", fontWeight: 600 }}>
                    Conditions d&apos;utilisation
                  </a>{" "}
                  et la{" "}
                  <a href="/confidentialite" target="_blank" rel="noopener noreferrer" style={{ color: T.blue, textDecoration: "none", fontWeight: 600 }}>
                    Politique de confidentialité
                  </a>{" "}
                  d&apos;Econia.
                </span>
              </label>
            )}
            {error && <p style={{ color: T.red, fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading || (mode === "signup" && !acceptedLegal)}
              style={{
                width: "100%",
                padding: "14px",
                background: T.blue,
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading || (mode === "signup" && !acceptedLegal) ? "not-allowed" : "pointer",
                opacity: loading || (mode === "signup" && !acceptedLegal) ? 0.5 : 1,
              }}
            >
              {loading ? "..." : mode === "signup" ? "Créer mon compte gratuit" : "Me connecter"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", background: T.border }} />
              <span style={{ fontSize: "11px", color: T.textMuted }}>OU</span>
              <div style={{ flex: 1, height: "1px", background: T.border }} />
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
              }}
              style={{ width: "100%", padding: "12px", background: T.bgCard, color: T.text, border: `1.5px solid ${T.border}`, borderRadius: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuer avec Google
            </button>
            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: T.textMuted }}>
              {mode === "signup" ? "Déjà inscrit ?" : "Pas encore de compte ?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "signup" ? "login" : "signup");
                  setError("");
                }}
                style={{ background: "none", border: "none", color: T.blue, cursor: "pointer", fontWeight: 600, fontSize: "13px" }}
              >
                {mode === "signup" ? "Se connecter" : "Créer un compte"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

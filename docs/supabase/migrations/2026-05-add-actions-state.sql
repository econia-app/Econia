-- ============================================================
-- Migration : ajout du suivi d'actions dans le dashboard utilisateur
-- À exécuter dans Supabase → SQL Editor → New query → Run
-- Date : 2026-05-16
-- ============================================================

-- 1. Ajoute la colonne actions_state (JSONB) à la table profiles
--    Structure : { "RSA": { "status": "done", "montant": 4200, "date": "2026-05-16T10:00:00Z" }, ... }
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS actions_state JSONB DEFAULT '{}'::jsonb;

-- 2. (gains_total existe déjà, on ne crée que si manquant — protection)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS gains_total NUMERIC DEFAULT 0;

-- 3. Index pour requêtes futures sur les actions (optionnel mais utile)
CREATE INDEX IF NOT EXISTS profiles_actions_state_gin
  ON profiles USING GIN (actions_state);

-- ============================================================
-- VÉRIFICATION : après exécution, lance cette requête pour confirmer
-- ============================================================
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'profiles' AND column_name IN ('actions_state', 'gains_total');

-- ============================================================
-- Migration : dashboard utilisateur + fix scan qui ne s'enregistre pas
-- À exécuter dans Supabase → SQL Editor → New query → Run
-- Date : 2026-05-17
-- ============================================================

-- 1. Colonnes du dashboard
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS actions_state JSONB DEFAULT '{}'::jsonb;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS gains_total NUMERIC DEFAULT 0;

CREATE INDEX IF NOT EXISTS profiles_actions_state_gin
  ON profiles USING GIN (actions_state);

-- 2. RLS Policies — autorise chaque utilisateur à lire / créer / modifier SON profil
--    (sécurise : un utilisateur ne peut pas voir/modifier les profils des autres)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Trigger : crée auto la ligne profiles à chaque nouvelle inscription
--    (évite que le scan ne puisse pas s'enregistrer car la ligne n'existe pas)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_premium, is_founder, gains_total)
  VALUES (NEW.id, NEW.email, false, false, 0)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Crée les lignes profiles manquantes pour les utilisateurs déjà inscrits
--    (rétroactif : si certains comptes ont été créés avant ce trigger)
INSERT INTO public.profiles (id, email, is_premium, is_founder, gains_total)
SELECT u.id, u.email, false, false, 0
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VÉRIFICATION : lance ces 3 requêtes après pour valider
-- ============================================================
-- a) Colonnes présentes ?
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'profiles';
--
-- b) Policies en place ?
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';
--
-- c) Tous les utilisateurs ont une ligne profile ?
-- SELECT COUNT(*) FROM auth.users u LEFT JOIN profiles p ON p.id = u.id WHERE p.id IS NULL;
-- → doit retourner 0

-- Migration Stripe pour table profiles
-- À jouer dans Supabase Studio → SQL Editor → New query → coller → Run
-- Date : 2026-05-26

-- 1. Ajouter les colonnes d'abonnement Stripe
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id      text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id  text,
  ADD COLUMN IF NOT EXISTS subscription_status     text,
  ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz;

-- 2. Index pour lookup rapide depuis le webhook
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON public.profiles (stripe_customer_id);

CREATE INDEX IF NOT EXISTS profiles_stripe_subscription_id_idx
  ON public.profiles (stripe_subscription_id);

-- 3. Commentaires pour documentation
COMMENT ON COLUMN public.profiles.stripe_customer_id IS
  'ID Customer Stripe (cus_...) lié à ce profil';
COMMENT ON COLUMN public.profiles.stripe_subscription_id IS
  'ID Subscription Stripe (sub_...) actif pour ce profil';
COMMENT ON COLUMN public.profiles.subscription_status IS
  'Status Stripe : trialing, active, past_due, canceled, incomplete, etc.';
COMMENT ON COLUMN public.profiles.subscription_period_end IS
  'Fin de la période payée actuelle (ISO timestamp). Maj via webhook customer.subscription.updated';

-- 4. RLS : les utilisateurs voient leur propre stripe_customer_id mais ne peuvent
-- pas modifier les colonnes d'abonnement (réservé au service role via webhooks)
-- Note : si tu n'as pas encore de policies sur profiles, ajoute :
--   - SELECT policy : auth.uid() = id
--   - UPDATE policy : auth.uid() = id AND
--       (ne pas autoriser modif de stripe_*, subscription_*, is_premium, is_founder)

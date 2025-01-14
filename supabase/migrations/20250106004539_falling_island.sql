/*
  # Fix user creation and table structure
  
  1. Changes
    - Ensure users table has correct structure
    - Make email required but other fields optional
    - Add proper constraints and defaults
    - Update trigger function to handle nulls properly
*/

-- First ensure the users table has the correct structure
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  name text DEFAULT '',
  phone text DEFAULT '',
  company_name text DEFAULT '',
  address text DEFAULT '',
  logo text,
  created_at timestamptz DEFAULT now()
);

-- Update the trigger function to handle nulls properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    phone,
    company_name,
    address
  )
  VALUES (
    new.id,
    new.email,
    NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'name', '')), ''),
    NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'phone', '')), ''),
    NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'company_name', '')), ''),
    NULLIF(TRIM(COALESCE(new.raw_user_meta_data->>'address', '')), '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    company_name = COALESCE(EXCLUDED.company_name, public.users.company_name),
    address = COALESCE(EXCLUDED.address, public.users.address);

  RETURN new;
END;
$$;

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid());
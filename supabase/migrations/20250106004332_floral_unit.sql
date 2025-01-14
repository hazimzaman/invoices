/*
  # Add search_path security to functions

  1. Changes
    - Set explicit search_path for all functions
    - Improve security by preventing search_path injection

  2. Security
    - Explicitly set search_path to public
    - Prevent potential schema injection attacks
*/

-- Update handle_new_user function with explicit search_path
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
    COALESCE(new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'company_name', ''),
    COALESCE(new.raw_user_meta_data->>'address', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    company_name = EXCLUDED.company_name,
    address = EXCLUDED.address;

  RETURN new;
END;
$$;
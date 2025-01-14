/*
  # Fix function security options
  
  1. Changes
    - Remove conflicting SECURITY INVOKER option
    - Keep SECURITY DEFINER for elevated privileges
    - Maintain explicit search_path for security
*/

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
    address = EXCLUDED.address
  WHERE public.users.id = EXCLUDED.id;

  RETURN new;
END;
$$;
/*
  # Fix user trigger and validation
  
  1. Changes
    - Add better error handling
    - Add input validation
    - Improve data sanitization
*/

-- Create validation function
CREATE OR REPLACE FUNCTION public.validate_user_input(
  p_email text,
  p_name text,
  p_phone text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate email
  IF p_email IS NULL OR p_email = '' OR 
     p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
  THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Validate name if provided
  IF p_name IS NOT NULL AND length(trim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters long';
  END IF;

  -- Validate phone if provided
  IF p_phone IS NOT NULL AND p_phone !~ '^\+?[0-9\s-()]+$' THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;

  RETURN true;
END;
$$;

-- Update trigger function with validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  v_name text;
  v_phone text;
  v_company_name text;
  v_address text;
BEGIN
  -- Get and sanitize metadata
  v_name := trim(COALESCE(new.raw_user_meta_data->>'name', ''));
  v_phone := trim(COALESCE(new.raw_user_meta_data->>'phone', ''));
  v_company_name := trim(COALESCE(new.raw_user_meta_data->>'company_name', ''));
  v_address := trim(COALESCE(new.raw_user_meta_data->>'address', ''));

  -- Validate input
  PERFORM validate_user_input(new.email, v_name, v_phone);

  -- Insert user data
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
    NULLIF(v_name, ''),
    NULLIF(v_phone, ''),
    NULLIF(v_company_name, ''),
    NULLIF(v_address, '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    company_name = COALESCE(EXCLUDED.company_name, users.company_name),
    address = COALESCE(EXCLUDED.address, users.address);

  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Failed to create user: %', SQLERRM;
END;
$$;
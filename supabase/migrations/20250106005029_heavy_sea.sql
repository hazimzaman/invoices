/*
  # Fix user validation and constraints
  
  1. Changes
    - Add better error handling
    - Add input validation with detailed error messages
    - Improve data sanitization
    - Update constraints safely
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create validation function with better error messages
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
    RAISE EXCEPTION 'Invalid email format: %', p_email
      USING HINT = 'Email must be a valid format (e.g., user@example.com)';
  END IF;

  -- Validate name if provided
  IF p_name IS NOT NULL AND length(trim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid name: must be at least 2 characters'
      USING HINT = 'Please provide a valid full name';
  END IF;

  -- Validate phone if provided
  IF p_phone IS NOT NULL AND p_phone !~ '^\+?[0-9\s-()]+$' THEN
    RAISE EXCEPTION 'Invalid phone number format: %', p_phone
      USING HINT = 'Phone number should contain only numbers, spaces, and basic punctuation';
  END IF;

  RETURN true;
END;
$$;

-- Update users table with better constraints
DO $$ 
BEGIN
  -- Drop existing constraints if they exist
  ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS users_email_check,
    DROP CONSTRAINT IF EXISTS users_name_check,
    DROP CONSTRAINT IF EXISTS users_phone_check;

  -- Set column defaults
  ALTER TABLE public.users
    ALTER COLUMN name SET DEFAULT '',
    ALTER COLUMN phone SET DEFAULT '',
    ALTER COLUMN company_name SET DEFAULT '',
    ALTER COLUMN address SET DEFAULT '';

  -- Add new constraints
  ALTER TABLE public.users
    ADD CONSTRAINT users_email_check 
      CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    ADD CONSTRAINT users_name_check 
      CHECK (name IS NULL OR length(trim(name)) >= 2),
    ADD CONSTRAINT users_phone_check 
      CHECK (phone IS NULL OR phone ~ '^\+?[0-9\s-()]+$');
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Ignore if constraints already exist
END $$;

-- Update trigger function with better error handling
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
    address = COALESCE(EXCLUDED.address, users.address)
  WHERE users.id = EXCLUDED.id;

  RETURN new;
EXCEPTION
  WHEN check_violation THEN
    RAISE EXCEPTION 'Invalid user data: %', SQLERRM
      USING HINT = 'Please check the provided information and try again';
  WHEN others THEN
    RAISE EXCEPTION 'Failed to create user: %', SQLERRM;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
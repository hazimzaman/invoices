/*
  # Improve user data validation and constraints

  1. Changes
    - Add validation for user data
    - Add proper constraints with NULL handling
    - Add performance indexes
    - Update trigger function

  2. Security
    - Maintain existing RLS policies
    - Add data validation
*/

-- First, ensure the columns exist
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS company_name text;

-- Create function to validate user data
CREATE OR REPLACE FUNCTION public.validate_user_data(
  p_name text,
  p_email text,
  p_phone text
) RETURNS boolean AS $$
BEGIN
  -- Validate name
  IF p_name IS NULL OR length(trim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters long';
  END IF;

  -- Validate email
  IF p_email IS NULL OR p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Validate phone if provided
  IF p_phone IS NOT NULL AND p_phone !~ '^\+?[0-9\s-()]{6,}$' THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Update trigger function with validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_name text;
  v_phone text;
  v_company_name text;
BEGIN
  -- Get metadata values
  v_name := new.raw_user_meta_data->>'name';
  v_phone := new.raw_user_meta_data->>'phone';
  v_company_name := new.raw_user_meta_data->>'company_name';

  -- Validate user data
  PERFORM validate_user_data(v_name, new.email, v_phone);

  -- Insert or update user
  INSERT INTO public.users (
    id,
    email,
    name,
    phone,
    company_name
  )
  VALUES (
    new.id,
    new.email,
    v_name,
    v_phone,
    v_company_name
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    company_name = EXCLUDED.company_name;

  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Failed to create user: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add validation constraints with NULL handling
DO $$ 
BEGIN
  -- Drop existing constraints if they exist
  ALTER TABLE public.users 
    DROP CONSTRAINT IF EXISTS users_name_check,
    DROP CONSTRAINT IF EXISTS users_phone_check,
    DROP CONSTRAINT IF EXISTS users_email_check;

  -- Add new constraints
  ALTER TABLE public.users
    ADD CONSTRAINT users_name_check 
      CHECK (name IS NULL OR char_length(trim(name)) >= 2),
    ADD CONSTRAINT users_phone_check 
      CHECK (phone IS NULL OR phone ~ '^\+?[0-9\s-()]{6,}$'),
    ADD CONSTRAINT users_email_check 
      CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS users_name_idx ON public.users (name);
CREATE INDEX IF NOT EXISTS users_phone_idx ON public.users (phone);
CREATE INDEX IF NOT EXISTS users_company_name_idx ON public.users (company_name);
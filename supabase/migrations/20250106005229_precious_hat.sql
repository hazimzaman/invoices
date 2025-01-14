/*
  # Fix email validation and error handling
  
  1. Changes
    - Update email validation pattern to be more permissive while still secure
    - Improve error messages for validation failures
    - Add better null handling
*/

-- Update the validation function with a more robust email pattern
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
  -- Validate email with a more permissive pattern
  IF p_email IS NULL OR p_email = '' OR 
     p_email !~ '[^@\s]+@[^@\s]+\.[^@\s]+'
  THEN
    RAISE EXCEPTION 'Invalid email format: %', COALESCE(p_email, 'empty')
      USING HINT = 'Please provide a valid email address';
  END IF;

  -- Validate name if provided
  IF p_name IS NOT NULL AND length(trim(p_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid name: must be at least 2 characters'
      USING HINT = 'Please provide a valid full name';
  END IF;

  -- Validate phone if provided with a more permissive pattern
  IF p_phone IS NOT NULL AND p_phone !~ '^\+?[0-9\s\-()\.]+$' THEN
    RAISE EXCEPTION 'Invalid phone number format: %', p_phone
      USING HINT = 'Phone number should contain only numbers, spaces, and basic punctuation';
  END IF;

  RETURN true;
END;
$$;

-- Update the users table constraints to match the new validation
DO $$ 
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS users_email_check;

  -- Add new email constraint with more permissive pattern
  ALTER TABLE public.users
    ADD CONSTRAINT users_email_check 
      CHECK (email ~ '[^@\s]+@[^@\s]+\.[^@\s]+');
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- Ignore if constraint already exists
END $$;
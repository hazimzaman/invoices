/*
  # Update test user email

  1. Changes
    - Update test user email in both auth.users and public.users tables
    - Ensure data consistency across tables
    - Add proper error handling
*/

DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;
  new_email text := 'demo@example.com';
BEGIN
  -- Update auth.users table
  UPDATE auth.users 
  SET 
    email = new_email,
    updated_at = now()
  WHERE id = test_user_id;

  -- Update public.users table
  UPDATE public.users
  SET email = new_email
  WHERE id = test_user_id;

  -- Verify the updates
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = test_user_id AND email = new_email
  ) THEN
    RAISE EXCEPTION 'Failed to update auth.users email';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = test_user_id AND email = new_email
  ) THEN
    RAISE EXCEPTION 'Failed to update public.users email';
  END IF;

EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Failed to update test user: %', SQLERRM;
END;
$$;
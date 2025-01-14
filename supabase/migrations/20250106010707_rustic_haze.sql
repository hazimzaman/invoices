/*
  # Fix test user creation

  1. Changes
    - Add proper error handling for test user creation
    - Ensure all required fields are present
    - Handle existing user cleanup properly
    - Add proper constraints and defaults
*/

-- Create test user with proper credentials
DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;
BEGIN
  -- First ensure the user doesn't exist in both tables
  DELETE FROM auth.users WHERE id = test_user_id OR email = 'test@example.com';
  DELETE FROM public.users WHERE id = test_user_id OR email = 'test@example.com';
  
  -- Create test user in auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud,
    confirmation_token
  )
  VALUES (
    test_user_id,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'test@example.com',
    crypt('test123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Test User","phone":"+1234567890","company_name":"Test Company","address":"123 Test St"}'::jsonb,
    false,
    'authenticated',
    'authenticated',
    encode(gen_random_bytes(32), 'hex')
  );

  -- Create test user in public.users
  INSERT INTO public.users (
    id,
    email,
    name,
    phone,
    company_name,
    address,
    created_at
  )
  VALUES (
    test_user_id,
    'test@example.com',
    'Test User',
    '+1234567890',
    'Test Company',
    '123 Test St',
    now()
  );

EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'User already exists, skipping creation';
  WHEN others THEN
    RAISE EXCEPTION 'Failed to create test user: %', SQLERRM;
END;
$$;
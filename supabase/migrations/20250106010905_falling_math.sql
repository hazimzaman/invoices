/*
  # Create second demo user

  1. Changes
    - Creates a new demo2 user in both auth.users and public.users tables
    - Sets up proper credentials and metadata
    - Ensures data consistency across tables
*/

DO $$
DECLARE
  demo2_user_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
BEGIN
  -- First ensure the user doesn't exist in both tables
  DELETE FROM auth.users WHERE id = demo2_user_id OR email = 'demo2@example.com';
  DELETE FROM public.users WHERE id = demo2_user_id OR email = 'demo2@example.com';
  
  -- Create demo2 user in auth.users
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
    demo2_user_id,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'demo2@example.com',
    crypt('test123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Demo User 2","phone":"+1987654321","company_name":"Demo Company 2","address":"456 Demo Ave"}'::jsonb,
    false,
    'authenticated',
    'authenticated',
    encode(gen_random_bytes(32), 'hex')
  );

  -- Create demo2 user in public.users
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
    demo2_user_id,
    'demo2@example.com',
    'Demo User 2',
    '+1987654321',
    'Demo Company 2',
    '456 Demo Ave',
    now()
  );

EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'User already exists, skipping creation';
  WHEN others THEN
    RAISE EXCEPTION 'Failed to create demo2 user: %', SQLERRM;
END;
$$;
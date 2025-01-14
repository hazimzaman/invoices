-- Create test user with proper credentials
DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;
BEGIN
  -- First ensure the user doesn't exist
  DELETE FROM auth.users WHERE email = 'test@example.com';
  
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
    aud
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
    'authenticated'
  );

  -- Ensure test user exists in public.users
  INSERT INTO public.users (
    id,
    email,
    name,
    phone,
    company_name,
    address
  )
  VALUES (
    test_user_id,
    'test@example.com',
    'Test User',
    '+1234567890',
    'Test Company',
    '123 Test St'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    company_name = EXCLUDED.company_name,
    address = EXCLUDED.address;
END;
$$;
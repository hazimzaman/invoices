-- Create test user in auth.users
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Create test user in auth.users if it doesn't exist
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
    role
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'test@example.com',
    crypt('test123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Test User","phone":"+1234567890","company_name":"Test Company","address":"123 Test St"}'::jsonb,
    false,
    'authenticated'
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING id INTO test_user_id;

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
  ON CONFLICT (id) DO NOTHING;
END;
$$;
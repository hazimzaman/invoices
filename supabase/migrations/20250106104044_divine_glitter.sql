/*
  # Create test user

  1. Creates a test user in auth.users and public.users tables
  2. Sets up proper credentials and metadata
  3. Ensures the user can be used for testing
*/

DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000006'::uuid;
BEGIN
  -- First ensure the user doesn't exist in both tables
  DELETE FROM auth.users WHERE id = test_user_id OR email = 'user6@example.com';
  DELETE FROM public.users WHERE id = test_user_id OR email = 'user6@example.com';
  
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
    'user6@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email']
    ),
    jsonb_build_object(
      'name', 'Test User',
      'phone', '+1234567890',
      'company_name', 'Test Company',
      'address', '123 Test St'
    ),
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
    'user6@example.com',
    'Test User',
    '+1234567890',
    'Test Company',
    '123 Test St',
    now()
  );

  -- Add some sample data
  INSERT INTO public.clients (
    id,
    user_id,
    name,
    company_name,
    vat,
    phone,
    email,
    address
  )
  VALUES (
    gen_random_uuid(),
    test_user_id,
    'Sample Client',
    'Sample Company',
    'VAT123',
    '+1234567890',
    'client@example.com',
    '123 Client Street'
  );

EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'User already exists, skipping creation';
  WHEN others THEN
    RAISE EXCEPTION 'Failed to create test user: %', SQLERRM;
END;
$$;
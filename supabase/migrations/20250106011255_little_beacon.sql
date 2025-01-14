-- Create fixed user with proper credentials
DO $$
DECLARE
  fixed_user_id uuid := '00000000-0000-0000-0000-000000000006'::uuid;
BEGIN
  -- First ensure the user doesn't exist in both tables
  DELETE FROM auth.users WHERE id = fixed_user_id OR email = 'user6@example.com';
  DELETE FROM public.users WHERE id = fixed_user_id OR email = 'user6@example.com';
  
  -- Create user with ID 6 in auth.users with proper password hash
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
    fixed_user_id,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'user6@example.com',
    crypt('password123', gen_salt('bf')), -- This creates a proper password hash
    now(),
    now(),
    now(),
    jsonb_build_object(
      'provider', 'email',
      'providers', array['email']
    ),
    jsonb_build_object(
      'name', 'User 6',
      'phone', '+1666666666',
      'company_name', 'Company 6',
      'address', '6 Business Ave'
    ),
    false,
    'authenticated',
    'authenticated',
    encode(gen_random_bytes(32), 'hex')
  );

  -- Create user with ID 6 in public.users
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
    fixed_user_id,
    'user6@example.com',
    'User 6',
    '+1666666666',
    'Company 6',
    '6 Business Ave',
    now()
  );

  -- Add some sample data for the user
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
    fixed_user_id,
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
    RAISE EXCEPTION 'Failed to create user: %', SQLERRM;
END;
$$;
-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user_settings();

-- Create or replace function to handle new user settings
CREATE OR REPLACE FUNCTION handle_new_user_settings()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.settings (
    user_id,
    email,
    next_invoice_number,
    company_name,
    name,
    phone,
    wise_email,
    logo_url
  )
  VALUES (
    NEW.id,
    NEW.email,
    1,
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email,
    ''
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    email = EXCLUDED.email,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_settings();
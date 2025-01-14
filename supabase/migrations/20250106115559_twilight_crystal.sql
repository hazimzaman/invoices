-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS increment_invoice_number_trigger ON invoices;
DROP FUNCTION IF EXISTS increment_invoice_number();

-- Recreate settings table with better defaults
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  next_invoice_number integer DEFAULT 1,
  company_name text DEFAULT '',
  name text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  wise_email text DEFAULT '',
  logo_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own settings" ON settings;
DROP POLICY IF EXISTS "Users can create own settings" ON settings;
DROP POLICY IF EXISTS "Users can update own settings" ON settings;

-- Create more permissive policies
CREATE POLICY "Users can manage own settings"
  ON settings FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create function to handle new user settings
CREATE OR REPLACE FUNCTION handle_new_user_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.settings (user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user settings
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_settings();

-- Create function to auto-increment invoice number
CREATE OR REPLACE FUNCTION increment_invoice_number()
RETURNS trigger AS $$
BEGIN
  UPDATE settings
  SET 
    next_invoice_number = next_invoice_number + 1,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-increment invoice number
CREATE TRIGGER increment_invoice_number_trigger
  AFTER INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION increment_invoice_number();
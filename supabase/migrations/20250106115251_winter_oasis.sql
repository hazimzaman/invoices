/*
  # Add Global Settings Table

  1. New Tables
    - `settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `next_invoice_number` (integer)
      - `company_name` (text)
      - `name` (text)
      - `phone` (text)
      - `email` (text)
      - `wise_email` (text)
      - `logo_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `settings` table
    - Add policies for authenticated users
*/

-- Create settings table
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  next_invoice_number integer DEFAULT 1,
  company_name text,
  name text,
  phone text,
  email text,
  wise_email text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own settings"
  ON settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to auto-increment invoice number
CREATE OR REPLACE FUNCTION increment_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE settings
  SET next_invoice_number = next_invoice_number + 1
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-increment invoice number
CREATE TRIGGER increment_invoice_number_trigger
  AFTER INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION increment_invoice_number();
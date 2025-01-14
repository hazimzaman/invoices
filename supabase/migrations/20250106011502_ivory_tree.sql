/*
  # Remove user dependencies

  1. Changes
    - Drop existing policies first
    - Drop users table and related dependencies
    - Remove user_id columns from clients and invoices
    - Create new open policies for all tables
*/

-- First drop all policies
DO $$ 
BEGIN
  -- Drop policies on clients table
  DROP POLICY IF EXISTS "Users can view own clients" ON clients;
  DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
  DROP POLICY IF EXISTS "Users can update own clients" ON clients;
  DROP POLICY IF EXISTS "Users can delete own clients" ON clients;
  DROP POLICY IF EXISTS "Single user clients access" ON clients;

  -- Drop policies on invoices table
  DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
  DROP POLICY IF EXISTS "Users can create invoices" ON invoices;
  DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
  DROP POLICY IF EXISTS "Users can delete own invoices" ON invoices;
  DROP POLICY IF EXISTS "Single user invoices access" ON invoices;

  -- Drop policies on invoice_items table
  DROP POLICY IF EXISTS "Users can view own invoice items" ON invoice_items;
  DROP POLICY IF EXISTS "Users can create invoice items" ON invoice_items;
  DROP POLICY IF EXISTS "Users can update own invoice items" ON invoice_items;
  DROP POLICY IF EXISTS "Users can delete own invoice items" ON invoice_items;
  DROP POLICY IF EXISTS "Single user invoice items access" ON invoice_items;
END $$;

-- Drop triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS validate_user_input();

-- Drop foreign key constraints and columns
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_user_id_fkey CASCADE;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_user_id_fkey CASCADE;

ALTER TABLE clients DROP COLUMN IF EXISTS user_id;
ALTER TABLE invoices DROP COLUMN IF EXISTS user_id;

-- Drop users table
DROP TABLE IF EXISTS users;

-- Create new open policies
CREATE POLICY "Allow all operations on clients"
  ON clients FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on invoices"
  ON invoices FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on invoice_items"
  ON invoice_items FOR ALL
  USING (true)
  WITH CHECK (true);
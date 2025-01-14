/*
  # Convert to Single User Mode
  
  1. Changes
    - Remove existing RLS policies
    - Create new open policies for single user access
    - Add default admin user
  
  2. Security
    - Removes user-specific policies
    - Creates open policies for single-user mode
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can create clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can create invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can view own invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can create invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can update own invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Users can delete own invoice items" ON public.invoice_items;

-- Remove existing constraints that might conflict
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_email_check,
  DROP CONSTRAINT IF EXISTS users_name_check,
  DROP CONSTRAINT IF EXISTS users_phone_check;

-- Create default admin user
DO $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    company_name,
    phone,
    address
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'admin@example.com',
    'Admin User',
    'My Company',
    '+1234567890',
    '123 Business St'
  )
  ON CONFLICT (id) DO NOTHING;
END
$$;

-- Create new open policies for single user mode
CREATE POLICY "Single user access" ON public.users
  FOR ALL USING (true);

CREATE POLICY "Single user clients access" ON public.clients
  FOR ALL USING (true);

CREATE POLICY "Single user invoices access" ON public.invoices
  FOR ALL USING (true);

CREATE POLICY "Single user invoice items access" ON public.invoice_items
  FOR ALL USING (true);
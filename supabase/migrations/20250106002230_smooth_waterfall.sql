/*
  # Fix RLS Policies for Invoices

  1. Changes
    - Update RLS policies for invoices table to properly handle user authentication
    - Add missing user_id check in invoice items policy
    - Ensure proper cascading of permissions

  2. Security
    - Maintain strict RLS enforcement
    - Only allow authenticated users to access their own data
*/

-- Update invoice policies to properly check user_id
DROP POLICY IF EXISTS "Users can create invoices" ON invoices;
CREATE POLICY "Users can create invoices"
ON invoices
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

-- Update invoice items policies
DROP POLICY IF EXISTS "Users can create invoice items" ON invoice_items;
CREATE POLICY "Users can create invoice items"
ON invoice_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  )
);
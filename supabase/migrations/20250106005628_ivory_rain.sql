-- Add currency column to invoice_items table
ALTER TABLE public.invoice_items
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'USD';

-- Update existing rows to have default currency
UPDATE public.invoice_items
SET currency = 'USD'
WHERE currency IS NULL;
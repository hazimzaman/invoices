// Update Invoice type to match database schema
export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  date: string;
  total_amount: number;
  client: Client;
  items: InvoiceItem[];
  created_at: string;
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  name: string;
  price: number;
  currency: string;
  created_at?: string;
}

export interface InvoiceFormData {
  client_id: string;
  items: InvoiceItem[];
}
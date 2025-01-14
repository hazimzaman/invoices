export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  name: string;
  price: number;
  currency: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  date: string;
  total_amount: number;
  items: InvoiceItem[];
  created_at?: string;
}

export interface CreateInvoiceData {
  client_id: string;
  invoice_number: string;
  date: string;
  items: InvoiceItem[];
}
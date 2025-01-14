export interface Settings {
  id: string;
  user_id: string;
  next_invoice_number: number;
  company_name: string;
  name: string;
  phone: string;
  email: string;
  wise_email: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsFormData {
  next_invoice_number: string;
  company_name: string;
  name: string;
  phone: string;
  email: string;
  wise_email: string;
  logo_url: string;
}

export interface UpdateSettingsData {
  next_invoice_number?: number;
  company_name?: string;
  name?: string;
  phone?: string;
  email?: string;
  wise_email?: string;
  logo_url?: string;
}
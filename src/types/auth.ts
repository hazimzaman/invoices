export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone: string;
  company_name?: string;
  address: string;
}

export interface AuthError {
  message: string;
  status?: number;
}
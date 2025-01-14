export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          company_name: string | null;
          email: string;
          phone: string | null;
          address: string | null;
          logo: string | null;
          created_at: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company_name: string | null;
          vat: string | null;
          phone: string;
          email: string;
          address: string;
          created_at: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          client_id: string;
          invoice_number: string;
          date: string;
          total_amount: number;
          created_at: string;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          name: string;
          price: number;
          currency: string;
          created_at: string;
        };
      };
    };
  };
}
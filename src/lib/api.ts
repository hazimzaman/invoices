import { supabase } from './supabase';
import type { ClientFormData, InvoiceFormData } from '../types';

export const api = {
  // Clients
  getClients: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    return data || [];
  },
    
  createClient: async (clientData: ClientFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      console.log('Creating client with data:', {
        ...clientData,
        user_id: user.id
      });

      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          company_name: clientData.company_name || '',
          vat: clientData.vat || '',
          phone: clientData.phone,
          email: clientData.email,
          address: clientData.address,
          "currency-selector": clientData.currency_selector,
          user_id: user.id
        })
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Created client:', data);
      return data;

    } catch (err) {
      console.error('Client creation error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create client');
    }
  },

  updateClient: async (id: string, clientData: ClientFormData) => {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: clientData.name,
        company_name: clientData.company_name,
        vat: clientData.vat,
        phone: clientData.phone,
        email: clientData.email,
        address: clientData.address,
        "currency-selector": clientData.currency_selector
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  createInvoice: async (invoiceData: InvoiceFormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        client_id: invoiceData.client_id,
        invoice_number: invoiceData.invoice_number,
        date: invoiceData.date,
        currency_selector: invoiceData.currency_selector,
        user_id: user.id,
        total_amount: invoiceData.items.reduce((sum, item) => sum + item.price, 0)
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Create invoice items
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(
        invoiceData.items.map(item => ({
          invoice_id: data.id,
          name: item.name,
          price: item.price,
          currency: invoiceData.currency_selector
        }))
      );

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    return data;
  },

  deleteClient: async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error('Delete client error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to delete client');
    }
  }
};
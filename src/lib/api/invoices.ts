import { supabase } from '../supabase';
import type { CreateInvoiceData, Invoice } from '../../types/invoice';

export const invoicesApi = {
  getInvoices: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        items:invoice_items(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch invoices:', error);
      throw new Error('Failed to fetch invoices');
    }

    return data || [];
  },

  createInvoice: async (invoiceData: CreateInvoiceData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const totalAmount = invoiceData.items.reduce((sum, item) => sum + item.price, 0);

    // Create invoice first
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        client_id: invoiceData.client_id,
        invoice_number: invoiceData.invoice_number,
        date: invoiceData.date,
        total_amount: totalAmount
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Failed to create invoice:', invoiceError);
      throw new Error('Failed to create invoice');
    }

    // Then create invoice items
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(
        invoiceData.items.map(item => ({
          invoice_id: invoice.id,
          name: item.name,
          price: item.price,
          currency: item.currency
        }))
      );

    if (itemsError) {
      console.error('Failed to create invoice items:', itemsError);
      // Clean up the invoice if items creation fails
      await supabase.from('invoices').delete().eq('id', invoice.id);
      throw new Error('Failed to create invoice items');
    }

    return invoice;
  }
};
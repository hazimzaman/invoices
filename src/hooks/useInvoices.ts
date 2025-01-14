import { useState, useEffect } from 'react';
import { invoicesApi } from '../lib/api/invoices';
import type { Invoice } from '../types/invoice';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoicesApi.getInvoices();
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const createInvoice = async (data: Omit<Invoice, 'id' | 'user_id' | 'created_at'>) => {
    try {
      await invoicesApi.createInvoice(data);
      await loadInvoices(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
      return false;
    }
  };

  return {
    invoices,
    loading,
    error,
    createInvoice,
    refreshInvoices: loadInvoices
  };
};
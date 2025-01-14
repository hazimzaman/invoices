import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { InvoiceForm } from '../components/invoices/InvoiceForm';
import { InvoiceList } from '../components/invoices/InvoiceList';
import { useInvoices } from '../hooks/useInvoices';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function Invoices() {
  const { invoices, loading, error, createInvoice } = useInvoices();
  const [showForm, setShowForm] = useState(false);

  const handleCreateInvoice = async (data: any) => {
    const success = await createInvoice(data);
    if (success) {
      setShowForm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Invoice
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Invoice</h2>
            <InvoiceForm
              onSubmit={handleCreateInvoice}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <InvoiceList invoices={invoices} />
    </div>
  );
}
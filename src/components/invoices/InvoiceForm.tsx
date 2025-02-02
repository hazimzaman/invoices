import React, { useState } from 'react';
import { useClients } from '../../hooks/useClients';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import type { CreateInvoiceData, InvoiceItem } from '../../types/invoice';

interface Props {
  onSubmit: (data: CreateInvoiceData) => Promise<void>;
  onCancel: () => void;
}

// Simplified currency options
const CURRENCY_OPTIONS = ['€', '$', 'Rs', '£'];

export const InvoiceForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const { clients, loading: clientsLoading, error: clientsError } = useClients();
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('€');
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: '', price: 0, currency: '€' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    setSubmitting(true);
    try {
      await onSubmit({
        client_id: selectedClient,
        invoice_number: `INV-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        items,
        currency_selector: selectedCurrency
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = () => {
    setItems([...items, { name: '', price: 0, currency: selectedCurrency }]);
  };

  if (clientsLoading) return <LoadingSpinner />;
  if (clientsError) return <ErrorMessage message={clientsError} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Client</label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.company_name ? `${client.company_name} (${client.name})` : client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Currency Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Currency</label>
        <select
          value={selectedCurrency}
          onChange={(e) => {
            const newCurrency = e.target.value;
            setSelectedCurrency(newCurrency);
            // Update all items to use the new currency
            setItems(items.map(item => ({ ...item, currency: newCurrency })));
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          {CURRENCY_OPTIONS.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      {/* Invoice Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
        {items.map((item, index) => (
          <div key={index} className="flex space-x-4 mb-2">
            <Input
              label=""
              value={item.name}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index] = { ...item, name: e.target.value };
                setItems(newItems);
              }}
              placeholder="Item description"
              required
            />
            <div className="w-48">
              <Input
                label=""
                type="number"
                value={item.price}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index] = { ...item, price: Number(e.target.value) };
                  setItems(newItems);
                }}
                placeholder="Price"
                required
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Add Item
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Create Invoice
        </Button>
      </div>
    </form>
  );
};
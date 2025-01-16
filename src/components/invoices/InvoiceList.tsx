import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { InvoiceCard } from '../invoice/InvoiceCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Invoice } from '../../types/invoice';

interface Props {
  invoices: Invoice[];
  viewType: 'grid' | 'list';
}

export const InvoiceList: React.FC<Props> = ({ invoices, viewType }) => {
  const { settings, loading } = useSettings();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!settings) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please configure your settings first to generate invoices.
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No invoices found. Create your first invoice to get started.
      </div>
    );
  }

  return (
    <div className={`
      ${viewType === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
      }
    `}>
      {invoices.map((invoice) => (
        <InvoiceCard 
          key={invoice.id} 
          invoice={invoice}
          settings={settings}
          viewType={viewType}
        />
      ))}
    </div>
  );
};
import React from 'react';
import { format } from 'date-fns';
import { Download, FileText } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { Invoice } from '../../types/invoice';
import type { Settings } from '../../types/settings';
import { InvoicePDF } from './InvoicePDF';

interface Props {
  invoice: Invoice;
  settings: Settings;
}

export const InvoiceCard: React.FC<Props> = ({ invoice, settings }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Invoice #{invoice.invoice_number}
            </h3>
            <p className="text-sm text-gray-500">
              {format(new Date(invoice.date), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* PDF Download Button */}
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} settings={settings} />}
          fileName={`invoice-${invoice.invoice_number}.pdf`}
        >
          {({ loading }) => (
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Generating PDF...' : 'Download PDF'}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Clients</p>
            <p className="font-medium">
              {invoice.client.company_name || invoice.client.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-medium text-lg text-blue-600">
              {invoice.items[0]?.currency} {invoice.total_amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

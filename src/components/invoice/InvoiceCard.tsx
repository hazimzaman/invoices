import React, { useState } from 'react';
import { format } from 'date-fns';
import { Download, FileText, Eye, ArrowLeft } from 'lucide-react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import type { Invoice } from '../../types/invoice';
import type { Settings } from '../../types/settings';
import { PDFDocument } from './PDFDocument';

interface Props {
  invoice: Invoice;
  settings: Settings;
  viewType: 'grid' | 'list';
}

export const InvoiceCard: React.FC<Props> = ({ invoice, settings, viewType }) => {
  const [showPDF, setShowPDF] = useState(false);

  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm ${
        viewType === 'grid' ? 'p-4' : 'p-6'
      }`}>
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

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-medium truncate">
                {invoice.client.company_name || invoice.client.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium text-lg text-blue-600">
                {invoice.currency_selector} {invoice.total_amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
          <button
            onClick={() => setShowPDF(true)}
            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm min-w-[100px] justify-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>

          <PDFDownloadLink
            document={<PDFDocument invoice={invoice} settings={settings} />}
            fileName={`invoice-${invoice.invoice_number}.pdf`}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm min-w-[100px] justify-center"
          >
            {({ loading }) => (
              <>
                <Download className="w-4 h-4 mr-1" />
                {loading ? 'Loading...' : 'Download'}
              </>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {showPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg shadow-xl flex flex-col">
            <div className="p-4 border-b flex items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowPDF(false)}
                  className="inline-flex items-center text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5 mr-1" />
                  Back to Invoices
                </button>
                <h2 className="text-lg font-semibold">Invoice #{invoice.invoice_number}</h2>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <PDFViewer 
                width="100%" 
                height="100%" 
                className="border-0"
                showToolbar={false}
              >
                <PDFDocument invoice={invoice} settings={settings} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

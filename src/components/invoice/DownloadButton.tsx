import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';

interface Props {
  invoiceId: string;
  invoiceNumber: string;
}

export const DownloadButton: React.FC<Props> = ({ invoiceId, invoiceNumber }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      await generatePDF(
        `#invoice-${invoiceId}`, 
        `invoice-${invoiceNumber}.pdf`
      );
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      <Download className="w-4 h-4 mr-2" />
      {loading ? 'Generating...' : 'Download PDF'}
    </button>
  );
};
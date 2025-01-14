import React from 'react';
import { generatePDF } from '../utils/pdfGenerator';

interface PDFGeneratorProps {
  onGenerateClick: () => void;
}

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ onGenerateClick }) => {
  return (
    <button
      onClick={onGenerateClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
    >
      Download PDF
    </button>
  );
};
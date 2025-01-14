import { format } from 'date-fns';

declare const kendo: any;
declare const $: any;

const PDF_CONFIG = {
  paperSize: 'A4',
  margin: {
    top: '1cm',
    left: '1cm',
    right: '1cm',
    bottom: '1cm'
  },
  scale: 0.8,
  forcePageBreak: '.page-break',
  template: null
};

// Define system fonts
kendo.pdf.defineFont({
  "DejaVu Sans": "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf",
  "DejaVu Sans|Bold": "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
  "DejaVu Sans|Bold|Italic": "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf",
  "DejaVu Sans|Italic": "https://kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf"
});

export const generatePDF = async (selector: string, filename: string): Promise<void> => {
  try {
    const element = document.querySelector(selector);
    if (!element) throw new Error('PDF template element not found');

    const group = await kendo.drawing.drawDOM($(element), PDF_CONFIG);
    await kendo.drawing.pdf.saveAs(group, filename);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};
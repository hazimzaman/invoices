declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: { type: string; quality: number };
      html2canvas?: any;
      jsPDF?: { unit: string; format: string | number[]; orientation: string };
    }
  
    interface Html2Pdf {
      from(element: HTMLElement): this;
      set(options: Html2PdfOptions): this;
      save(): void;
      toPdf(): Promise<this>;
      getPdf(): Promise<{ pdf: any; blob: Blob }>;
    }
  
    const html2pdf: () => Html2Pdf;
    export default html2pdf;
  }
  
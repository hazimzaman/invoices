import React from 'react';
import { format } from 'date-fns';

interface InvoicePDFProps {
  invoice: {
    invoice_number: string;
    date: string;
    total_amount: number;
    items: Array<{
      name: string;
      price: number;
      currency: string;
    }>;
    currency_selector: string;
  };
  client: {
    name: string;
    company_name?: string;
    vat?: string;
    address: string;
  };
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
  };
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, client, company }) => {
  return (
    <div className="pdf-page size-a4">
      <div className="invoice-container">
        <div className="blob-wrapper">
          <img src="https://hazimzaman.com/wp-content/uploads/2025/01/Frame-7.png" alt="" />
        </div>
        
        <div className="header">
          <div className="invoice-title">HAZIM</div>
          <div className="company-info">
            {company.logo && (
              <div className="company-logo">
                <img src={company.logo} alt={company.name} />
              </div>
            )}
            <div className="name">{company.name}</div>
            <div>{company.phone}</div>
            <div>{company.address}</div>
          </div>
        </div>

        <div className="invoice-details">
          <div className="left-details">
            <div className="detail-row">
              <div className="detail-label">InvoiceSDSDADAS No:</div>
              <div>{invoice.invoice_number}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Bill to:</div>
              <div>{client.company_name || client.name}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Address:</div>
              <div>{client.address}</div>
            </div>
            {client.vat && (
              <div className="detail-row">
                <div className="detail-label">VAT:</div>
                <div>{client.vat}</div>
              </div>
            )}
          </div>
          <div className="date-section">
            <div className="detail-row">
              <div className="detail-label">Date:</div>
              <div>{format(new Date(invoice.date), 'do MMM, yyyy')}</div>
            </div>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}.</td>
                <td>{item.name}</td>
                <td>{item.currency} {item.price.toFixed(2)}</td>
                <td>{item.currency} {item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-section">
          Total: {invoice.currency_selector} {invoice.total_amount.toFixed(2)}
        </div>

        <div className="footer">
          If you have any questions please contact: {company.email}
        </div>
      </div>
    </div>
  );
};
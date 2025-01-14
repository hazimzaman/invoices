import React from 'react';
import { format } from 'date-fns';
import type { Invoice } from '../types';

interface Props {
  invoice: Invoice;
}

export const PDFPreview: React.FC<Props> = ({ invoice }) => {
  return (
    <div className="pdf-preview">
      <div id={`invoice-${invoice.id}`} className="pdf-page">
        <div className="invoice-container">
          <div className="blob-wrapper">
            <img src="https://hazimzaman.com/wp-content/uploads/2025/01/Frame-7.png" alt="" />
          </div>
          
          <div className="header">
            <div className="invoice-title">INVOICE</div>
            <div className="company-info">
              <div className="company-logo">
                <img src="https://hazimzaman.com/wp-content/uploads/2025/01/primo-logo.png" alt="" />
              </div>
              <div className="name">{invoice.client.company_name || invoice.client.name}</div>
              <div>{invoice.client.phone}</div>
              <div>{invoice.client.address}</div>
            </div>
          </div>

          <div className="invoice-details">
            <div className="left-details">
              <div className="detail-row">
                <div className="detail-label">Invoice No:</div>
                <div>{invoice.invoice_number}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Bill to:</div>
                <div>{invoice.client.name}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Address:</div>
                <div>{invoice.client.address}</div>
              </div>
              {invoice.client.vat && (
                <div className="detail-row">
                  <div className="detail-label">VAT:</div>
                  <div>{invoice.client.vat}</div>
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
            Total<span>{invoice.items[0]?.currency} {invoice.total_amount.toFixed(2)}</span>
          </div>

          <div className="footer">
            If you have any questions please contact: {invoice.client.email}
          </div>
        </div>
      </div>
    </div>
  );
};
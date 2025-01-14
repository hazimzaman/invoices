import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

import type { Invoice } from '../../types/invoice';
import type { Settings } from '../../types/settings';
import logo from './primo-logo.png';

interface Props {
  invoice: Invoice;
  settings: Settings;
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20,
    borderBottom: '2px solid #000',
    paddingBottom: 10,
  },
  companyInfo: { textAlign: 'right', fontSize: 10 },
  companyLogo: { height: 50, width: 50, marginBottom: 5 },
  invoiceTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  invoiceDetails: { 
    marginBottom: 20, 
    padding: 10, 
    backgroundColor: '#f9f9f9', 
    border: '1px solid #ddd',
    borderRadius: 5,
  },
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5, 
    fontSize: 11,
  },
  table: { 
    display: 'table', 
    width: '100%', 
    marginVertical: 20, 
    borderWidth: 1, 
    borderColor: '#ddd',
    borderRadius: 5,
  },
  tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #ddd' },
  tableCellHeader: { flex: 1, padding: 8, fontWeight: 'bold', fontSize: 10 },
  tableCell: { flex: 1, padding: 8, fontSize: 10 },
  totalSection: { 
    marginTop: 20, 
    padding: 10, 
    backgroundColor: '#f9f9f9', 
    border: '1px solid #ddd', 
    borderRadius: 5, 
    textAlign: 'right',
  },
  totalText: { fontWeight: 'bold', fontSize: 14 },
  footer: { 
    marginTop: 40, 
    textAlign: 'center', 
    fontSize: 10, 
    color: '#555',
    borderTop: '1px solid #ddd',
    paddingTop: 10,
  },
});

export const InvoicePDF: React.FC<Props> = ({ invoice, settings }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.invoiceTitle}>INVOICE</Text>
        <View style={styles.companyInfo}>
          <Image style={styles.companyLogo} src={logo} />

          <Text>{settings.company_name}</Text>
          <Text>{settings.name}</Text>
          <Text>{settings.phone}</Text>
          <Text>{settings.email}</Text>
          {settings.wise_email && <Text>WISE: {settings.wise_email}</Text>}
        </View>
      </View>

      {/* Invoice Details */}
      <View style={styles.invoiceDetails}>
        <View style={styles.detailRow}>
          <Text>Invoice No:</Text>
          <Text>{invoice.invoice_number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text>Bill to:</Text>
          <Text>{invoice.client.company_name || invoice.client.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text>Address:</Text>
          <Text>{invoice.client.address}</Text>
        </View>
        {invoice.client.vat && (
          <View style={styles.detailRow}>
            <Text>VAT:</Text>
            <Text>{invoice.client.vat}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text>Date:</Text>
          <Text>{new Date(invoice.date).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Table Section */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCellHeader, { flex: 1 }]}>#</Text>
          <Text style={[styles.tableCellHeader, { flex: 3 }]}>Description</Text>
          <Text style={[styles.tableCellHeader, { flex: 2 }]}>Price</Text>
          <Text style={[styles.tableCellHeader, { flex: 2 }]}>Amount</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{item.name}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.currency} {item.price.toFixed(2)}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.currency} {(item.quantity || 1) * item.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      {/* Total Section */}
      <View style={styles.totalSection}>
        <Text style={styles.totalText}>Total: {invoice.items[0]?.currency} {invoice.total_amount.toFixed(2)}</Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text>If you have any questions, please contact: {settings.email}</Text>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
);

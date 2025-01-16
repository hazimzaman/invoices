import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import type { Invoice } from '../../types/invoice';
import type { Settings } from '../../types/settings';

interface PDFDocumentProps {
  invoice: Invoice;
  settings: Settings;
}

const styles = StyleSheet.create({
  page: {
    padding: '20px',
    fontSize: 10,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  invoiceTitle: {
    fontSize: 36,
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    width: 80,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  footer: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 9,
  }
});

export const PDFDocument: React.FC<PDFDocumentProps> = ({ invoice, settings }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.invoiceTitle}>INVOICE</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Invoice No:</Text>
          <Text>{invoice.invoice_number}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bill to:</Text>
          <Text>{invoice.client.company_name || invoice.client.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text>{invoice.client.address}</Text>
        </View>
        {invoice.client.vat && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>VAT:</Text>
            <Text>{invoice.client.vat}</Text>
          </View>
        )}
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeaderCell, styles.numberColumn]}>#</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell, styles.descriptionColumn]}>Description</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell, styles.amountColumn]}>Price</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell, styles.amountColumn]}>Amount</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.numberColumn]}>{index + 1}.</Text>
            <Text style={[styles.tableCell, styles.descriptionColumn]}>{item.name}</Text>
            <Text style={[styles.tableCell, styles.amountColumn]}>
              {invoice.currency_selector} {item.price.toFixed(2)}
            </Text>
            <Text style={[styles.tableCell, styles.amountColumn]}>
              {invoice.currency_selector} {item.price.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text>{invoice.currency_selector} {invoice.total_amount.toFixed(2)}</Text>
      </View>

      <Text style={styles.footer}>
        If you have any question please contact : hazimzaman@primocreators.com
      </Text>
    </Page>
  </Document>
); 
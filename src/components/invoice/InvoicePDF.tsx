import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import type { Invoice } from '../../types/invoice';
import type { Settings } from '../../types/settings';
import logo from './primo-logo.png';
import bgImage from './Frame-7.png';

import montserratRegular from './Montserrat-Regular.ttf';
import montserratBold from './Montserrat-Bold.ttf';
import openSansRegular from './OpenSans-Regular.ttf';
import openSansBold from './OpenSans-Bold.ttf';


interface Props {
  invoice: Invoice;
  settings: Settings;
}




Font.register({
  family: 'Montserrat',
  fonts: [
    {
      src: montserratRegular,
      fontWeight: 'normal',
    },
    {
      src: montserratBold,
      fontWeight: 'bold',
    }
  ]
});

Font.register({
  family: 'OpenSans',
  fonts: [
    {
      src: openSansRegular,
      fontWeight: 'normal',
    },
    {
      src: openSansBold,
      fontWeight: 'bold',
    }
  ]
});











const styles = StyleSheet.create({
  page: {
    fontFamily: 'OpenSans',
    padding: 40,
    fontSize: 10.5,
    position: 'relative',
  },
  invoiceContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    rowGap:25
  },
  blobWrapper: {
    position: 'absolute',
    width: 200,
    height: 503,
    left: -112,
    zIndex: -1,
    opacity: 0.12,
    top: 150,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  invoiceTitle: {
    fontSize: 48.6,
    fontFamily: 'Montserrat',
    fontWeight: 400,
    letterSpacing: 2,
    alignSelf: 'flex-end',
  },
  companyInfo: {
    textAlign: 'right',
    alignItems: 'flex-end',
    marginBottom:45
  },
  companyLogo: {
    width: 64,
    height: 64,
    marginBottom: 8,
    marginLeft: 'auto',
  },
  companyName: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    marginBottom: 4,
  },
  companyDetail: {
    marginBottom: 2,
  },
  wise: {
    marginTop: 4,
  },
  wiseLabel: {
    fontWeight: 'bold',
  },
  invoiceDetails: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 10,
    width:  'auto'
  },
  leftDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    columnGap: 4,
    rowGap: 4

  },
  dateSection: {
    textAlign: 'right',
    flexDirection: 'row',
    marginRight: 4
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    columnGap: 10
  },
  detailLabel: {
    fontWeight: 'bold',
    minWidth: 80,
    fontSize: 16,
  },
  table: {
    width: '100%',
    marginBottom: 32,
    borderColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: '#0000',
    borderStyle: 'solid',
     borderBottom: 1,
     borderRight: 1,
     borderLeft: 1 ,
     borderTop: 1
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
 
  },
  tableCell: {
    flex: 1,
   
  },
  tableCell2: {
    flex: 2,
    
  },
  tableCellAmount: {
    flex: 1,
    textAlign: 'right',
  },
  totalSection: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 60,
  },
  footer: {
    textAlign: 'center',
    marginTop: 'auto',
    fontSize: 12,
  }
});

export const InvoicePDF: React.FC<Props> = ({ invoice, settings }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.invoiceContainer}>
        <View style={styles.blobWrapper}>
          <Image src={bgImage} />
        </View>
        
        <View style={styles.header}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <View style={styles.companyInfo}>
            <Image style={styles.companyLogo} src={logo} />
            <Text style={styles.companyName}>{settings.company_name}</Text>
            <Text style={styles.companyDetail}>{settings.name}</Text>
            <Text style={styles.companyDetail}>{settings.phone}</Text>
            <Text style={styles.companyDetail}>{settings.address}</Text>
            {settings.wise_email && (
              <Text style={styles.wise}>
                <Text style={styles.wiseLabel}>WISE: </Text>
                {settings.wise_email}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.invoiceDetails}>
          <View style={styles.leftDetails}>
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
          <View style={styles.dateSection}>
          <Text style={styles.detailLabel}>Date:</Text>
              <Text>{new Date(invoice.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>#</Text>
            <Text style={styles.tableCell2}>Description</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCellAmount}>Amount</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{index + 1}.</Text>
              <Text style={styles.tableCell2}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.currency} {item.price.toFixed(2)}</Text>
              <Text style={styles.tableCellAmount}>
                {item.currency} {((item.quantity || 1) * item.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <Text>
            Total    {invoice.items[0]?.currency} {invoice.total_amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>If you have any questions, please contact: {settings.email}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
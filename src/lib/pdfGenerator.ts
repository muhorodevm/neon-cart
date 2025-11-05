import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';

interface ReceiptData {
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentCode?: string;
}

export const generateReceiptPDF = (data: ReceiptData): jsPDF => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  let yPos = 20;

  // Header - Logo and Company Name
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('NDULA', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Premium Sneakers & Streetwear', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Receipt Title
  pdf.setFillColor(0, 0, 0);
  pdf.rect(20, yPos, pageWidth - 40, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT RECEIPT', pageWidth / 2, yPos + 7, { align: 'center' });
  pdf.setTextColor(0, 0, 0);
  yPos += 20;

  // Order Info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Order #: ${data.orderNumber}`, 20, yPos);
  pdf.text(`Date: ${new Date(data.date).toLocaleDateString()}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 15;

  // Customer Information
  pdf.setFont('helvetica', 'bold');
  pdf.text('CUSTOMER INFORMATION', 20, yPos);
  yPos += 7;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Name: ${data.customer.name}`, 20, yPos);
  yPos += 5;
  pdf.text(`Email: ${data.customer.email}`, 20, yPos);
  yPos += 5;
  pdf.text(`Phone: ${data.customer.phone}`, 20, yPos);
  yPos += 5;
  pdf.text(`Address: ${data.customer.address}`, 20, yPos);
  yPos += 15;

  // Payment Information
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT DETAILS', 20, yPos);
  yPos += 7;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Method: ${data.paymentMethod}`, 20, yPos);
  if (data.paymentCode) {
    pdf.text(`Transaction Code: ${data.paymentCode}`, 20, yPos + 5);
    yPos += 5;
  }
  yPos += 15;

  // Items Header
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('ITEM', 25, yPos);
  pdf.text('SIZE', 100, yPos);
  pdf.text('QTY', 130, yPos);
  pdf.text('PRICE', 150, yPos);
  pdf.text('TOTAL', pageWidth - 25, yPos, { align: 'right' });
  yPos += 10;

  // Items
  pdf.setFont('helvetica', 'normal');
  data.items.forEach((item) => {
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.text(item.name, 25, yPos);
    pdf.text(item.size || 'N/A', 100, yPos);
    pdf.text(item.quantity.toString(), 130, yPos);
    pdf.text(`KES ${item.price.toLocaleString()}`, 150, yPos);
    pdf.text(`KES ${(item.price * item.quantity).toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
    yPos += 7;
  });

  yPos += 10;
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  // Totals
  pdf.setFont('helvetica', 'normal');
  pdf.text('Subtotal:', pageWidth - 70, yPos);
  pdf.text(`KES ${data.subtotal.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 7;

  pdf.text('Shipping:', pageWidth - 70, yPos);
  pdf.text(`KES ${data.shipping.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 7;

  pdf.text('Tax:', pageWidth - 70, yPos);
  pdf.text(`KES ${data.tax.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 10;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('TOTAL:', pageWidth - 70, yPos);
  pdf.text(`KES ${data.total.toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' });
  yPos += 15;

  // Barcode
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, data.orderNumber, {
    format: 'CODE128',
    width: 2,
    height: 50,
    displayValue: true,
  });
  
  const barcodeImage = canvas.toDataURL('image/png');
  pdf.addImage(barcodeImage, 'PNG', pageWidth / 2 - 40, yPos, 80, 20);
  yPos += 25;

  // Footer
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  pdf.text('Thank you for shopping with NDULA!', pageWidth / 2, yPos, { align: 'center' });
  pdf.text('For support, contact us at support@ndula.com', pageWidth / 2, yPos + 5, { align: 'center' });

  return pdf;
};

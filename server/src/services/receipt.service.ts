import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Returns absolute file path to the generated PDF on disk
export async function generateReceipt(orderId: string): Promise<string> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        payments: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Generate receipt data for PDF
    const receiptData = {
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString(),
      customer: {
        name: `${order.user.profile?.firstName} ${order.user.profile?.lastName}`,
        email: order.user.email,
        phone: order.user.profile?.phone || '',
        address: order.address ? 
          `${order.address.street}, ${order.address.city}, ${order.address.postalCode}, ${order.address.country}` : 
          'No address provided',
      },
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size || 'N/A',
        total: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.payments[0]?.method || 'M-Pesa',
      paymentCode: order.payments[0]?.transactionId || '',
    };

    // Ensure receipts directory exists
    const receiptsDir = path.join(__dirname, '..', '..', 'receipts');
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }

    const filename = `${order.orderNumber}.pdf`;
    const filePath = path.join(receiptsDir, filename);

    // Generate PDF using pdfkit
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc
      .fontSize(20)
      .text('NDULA - Order Receipt', { align: 'center' })
      .moveDown(0.5);
    doc.fontSize(12).text(`Order Number: ${receiptData.orderNumber}`);
    doc.text(`Date: ${new Date(receiptData.date).toLocaleString()}`);
    doc.text(`Payment Method: ${receiptData.paymentMethod}`);
    if (receiptData.paymentCode) doc.text(`Payment Code: ${receiptData.paymentCode}`);
    doc.moveDown();

    // Customer
    doc.fontSize(14).text('Customer Information', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${receiptData.customer.name}`);
    doc.text(`Email: ${receiptData.customer.email}`);
    if (receiptData.customer.phone) doc.text(`Phone: ${receiptData.customer.phone}`);
    doc.text(`Address: ${receiptData.customer.address}`);
    doc.moveDown();

    // Items table
    doc.fontSize(14).text('Items', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    receiptData.items.forEach((it: any) => {
      doc.text(`${it.name}  x${it.quantity}  -  KSh ${(it.total).toLocaleString()}`);
    });
    doc.moveDown();

    // Totals
    doc.text(`Subtotal: KSh ${receiptData.subtotal.toLocaleString()}`);
    doc.text(`Tax: KSh ${receiptData.tax.toLocaleString()}`);
    doc.text(`Shipping: KSh ${receiptData.shipping.toLocaleString()}`);
    doc.moveDown(0.5);
    doc.fontSize(14).text(`TOTAL: KSh ${receiptData.total.toLocaleString()}`);

    doc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on('finish', () => resolve());
      stream.on('error', (err) => reject(err));
    });

    return filePath;
  } catch (error) {
    console.error('Generate receipt error:', error);
    throw error;
  }
}

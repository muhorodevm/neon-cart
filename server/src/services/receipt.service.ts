import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // In production, generate actual PDF using a library like puppeteer or pdfkit
    // and upload to cloud storage (ImageKit, S3, etc.)
    // For now, return a simulated receipt URL
    const receiptUrl = `https://receipts.ndula.com/${order.orderNumber}.pdf`;

    console.log('Receipt generated:', receiptData);

    return receiptUrl;
  } catch (error) {
    console.error('Generate receipt error:', error);
    throw error;
  }
}

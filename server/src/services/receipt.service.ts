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

    // In production, generate actual PDF and upload to storage
    // For now, return a placeholder receipt URL
    const receiptData = {
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString(),
      customer: {
        name: `${order.user.profile?.firstName} ${order.user.profile?.lastName}`,
        email: order.user.email,
      },
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      payment: order.payments[0],
    };

    // Simulate receipt URL (in production, this would be uploaded to storage)
    const receiptUrl = `https://receipts.ndula.com/${order.orderNumber}.pdf`;

    console.log('Receipt generated:', receiptData);

    return receiptUrl;
  } catch (error) {
    console.error('Generate receipt error:', error);
    throw error;
  }
}

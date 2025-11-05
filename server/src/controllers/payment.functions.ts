import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generatePaymentCode } from '../utils/otp.util';
import { generateReceipt } from '../services/receipt.service';
import { sendOrderConfirmationEmail } from '../services/email.service';

const prisma = new PrismaClient();

export async function initiateMpesaPayment(req: AuthRequest, res: Response) {
  try {
    const { orderId, phoneNumber, amount } = req.body;

    // Simulate M-Pesa payment
    const transactionId = generatePaymentCode();
    const mpesaReceiptNumber = `MP${Date.now()}`;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        transactionId,
        paymentMethod: 'MPESA',
        amount,
        status: 'COMPLETED', // Simulated success
        mpesaReceiptNumber,
        mpesaPhoneNumber: phoneNumber,
        metadata: {
          simulatedPayment: true,
          timestamp: new Date().toISOString(),
        },
      },
      include: {
        order: {
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
          },
        },
      },
    });

    // Update order payment status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'PROCESSING',
      },
    });

    // Generate receipt
    const receiptUrl = await generateReceipt(orderId);
    await prisma.order.update({
      where: { id: orderId },
      data: { receiptUrl },
    });

    // Send confirmation email with receipt
    await sendOrderConfirmationEmail(
      payment.order.user.email,
      payment.order.user.profile?.firstName || 'Customer',
      payment.order.orderNumber,
      amount
    );

    res.json({
      message: 'Payment successful (simulated)',
      payment: {
        transactionId,
        mpesaReceiptNumber,
        amount,
        status: 'COMPLETED',
        receiptUrl,
      },
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
}

export async function getPaymentStatus(req: AuthRequest, res: Response) {
  try {
    const { transactionId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: { order: true },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
}

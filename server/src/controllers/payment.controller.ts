import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generatePaymentCode } from '../utils/otp.util';

const prisma = new PrismaClient();

export class PaymentController {
  async initiateMpesaPayment(req: AuthRequest, res: Response) {
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
      });

      // Update order payment status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          status: 'PROCESSING',
        },
      });

      res.json({
        message: 'Payment successful (simulated)',
        payment: {
          transactionId,
          mpesaReceiptNumber,
          amount,
          status: 'COMPLETED',
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({ error: 'Payment failed' });
    }
  }

  async getPaymentStatus(req: AuthRequest, res: Response) {
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
}

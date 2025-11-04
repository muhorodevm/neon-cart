import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { EmailService } from '../services/email.service';

const prisma = new PrismaClient();
const emailService = new EmailService();

export class OrderController {
  async createOrder(req: AuthRequest, res: Response) {
    try {
      const { addressId, items, paymentMethod } = req.body;
      const userId = req.user!.id;

      // Calculate totals
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      const tax = subtotal * 0.16; // 16% VAT
      const shippingCost = 500;
      const total = subtotal + tax + shippingCost;

      const orderNumber = `ORD-${Date.now()}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          paymentMethod,
          subtotal,
          tax,
          shippingCost,
          total,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              name: item.name,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          user: { include: { profile: true } },
        },
      });

      // Send order confirmation email
      if (order.user.profile) {
        await emailService.sendOrderPlacedEmail(
          order.user.email,
          order.user.profile.firstName,
          orderNumber,
          total.toFixed(2)
        );
      }

      res.json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  async getOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: { include: { product: true } },
          address: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ orders });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          user: { include: { profile: true } },
        },
      });

      // Send email if delivered
      if (status === 'DELIVERED' && order.user.profile) {
        await emailService.sendOrderDeliveredEmail(
          order.user.email,
          order.user.profile.firstName,
          order.orderNumber
        );
      }

      res.json({ message: 'Order updated successfully', order });
    } catch (error) {
      console.error('Update order error:', error);
      res.status(500).json({ error: 'Failed to update order' });
    }
  }
}

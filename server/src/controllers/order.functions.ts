import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendOrderConfirmationEmail, sendOrderDeliveredEmail } from '../services/email.service';
import { generateReceipt } from '../services/receipt.service';

const prisma = new PrismaClient();

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const { addressId, paymentMethod, items, mpesaPhoneNumber, notes } = req.body;

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.16; // 16% VAT
    const shipping = 500; // Fixed shipping
    const total = subtotal + tax + shipping;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user!.id,
        addressId,
        paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Send confirmation email
    await sendOrderConfirmationEmail(
      order.user.email,
      order.user.profile?.firstName || 'Customer',
      orderNumber,
      total
    );

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

export async function getOrders(req: AuthRequest, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
}

export async function getOrderById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      include: {
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
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Send delivery email if status is delivered
    if (status === 'DELIVERED') {
      await sendOrderDeliveredEmail(
        order.user.email,
        order.user.profile?.firstName || 'Customer',
        order.orderNumber
      );

      // Generate and attach receipt
      const receiptUrl = await generateReceipt(order.id);
      await prisma.order.update({
        where: { id },
        data: { receiptUrl },
      });
    }

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
}

export async function getAllOrders(req: AuthRequest, res: Response) {
  try {
    const { status, search } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string, mode: 'insensitive' } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
}

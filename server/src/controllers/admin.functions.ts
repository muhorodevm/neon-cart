import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export async function getDashboardStats(req: AuthRequest, res: Response) {
  try {
    // Total revenue
    const totalRevenue = await prisma.order.aggregate({
      where: { paymentStatus: 'COMPLETED' },
      _sum: { total: true },
    });

    // Total orders
    const totalOrders = await prisma.order.count();

    // Total customers
    const totalCustomers = await prisma.user.count({
      where: {
        userRoles: {
          some: { role: 'CUSTOMER' },
        },
      },
    });

    // Total products
    const totalProducts = await prisma.product.count();

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
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
      },
    });

    // Top products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          product,
          totalSold: item._sum.quantity,
        };
      })
    );

    // Revenue by category
    const ordersByCategory = await prisma.orderItem.findMany({
      where: {
        order: {
          paymentStatus: 'COMPLETED',
        },
      },
      include: {
        product: true,
      },
    });

    const revenueByCategory = ordersByCategory.reduce((acc: any, item) => {
      const category = item.product.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.price * item.quantity;
      return acc;
    }, {});

    // Orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    res.json({
      stats: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
        recentOrders,
        topProducts: topProductsWithDetails,
        revenueByCategory,
        ordersByStatus,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
}

export async function getAllCustomers(req: AuthRequest, res: Response) {
  try {
    const customers = await prisma.user.findMany({
      where: {
        userRoles: {
          some: { role: 'CUSTOMER' },
        },
      },
      include: {
        profile: true,
        _count: {
          select: {
            orders: true,
          },
        },
        orders: {
          where: {
            paymentStatus: 'COMPLETED',
          },
          select: {
            total: true,
          },
        },
      },
    });

    const customersWithStats = customers.map((customer) => ({
      id: customer.id,
      email: customer.email,
      profile: customer.profile,
      totalOrders: customer._count.orders,
      totalSpent: customer.orders.reduce((sum, order) => sum + order.total, 0),
      createdAt: customer.createdAt,
    }));

    res.json({ customers: customersWithStats });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
}

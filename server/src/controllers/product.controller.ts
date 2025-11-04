import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  sizes: z.array(z.string()).min(1),
  colors: z.array(z.string()).min(1),
  images: z.array(z.string()).min(1),
  stock: z.number().int().min(0),
  brand: z.string().optional(),
});

export class ProductController {
  async createProduct(req: AuthRequest, res: Response) {
    try {
      const data = productSchema.parse(req.body);

      const product = await prisma.product.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      res.status(201).json({
        message: 'Product created successfully',
        product,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid product data', details: error.errors });
      }
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  async updateProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = productSchema.partial().parse(req.body);

      const product = await prisma.product.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      res.json({
        message: 'Product updated successfully',
        product,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid product data', details: error.errors });
      }
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  async deleteProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.product.delete({
        where: { id },
      });

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ product });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ error: 'Failed to get product' });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const { category, search, minPrice, maxPrice } = req.query;

      const where: any = {};

      if (category) {
        where.category = category;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice as string);
        if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
      }

      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      res.json({ products });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ error: 'Failed to get products' });
    }
  }
}

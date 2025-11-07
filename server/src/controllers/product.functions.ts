import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export async function createProduct(req: AuthRequest, res: Response) {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      sizes,
      colors,
      images,
      stock,
      brand,
      featured,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        subcategory,
        sizes,
        colors,
        images,
        stock,
        brand,
        featured: featured || false,
      },
    });

    return res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: 'Failed to create product' });
  }
}

export async function updateProduct(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function deleteProduct(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ error: 'Failed to get product' });
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const { category, search, minPrice, maxPrice, featured } = req.query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
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

    return res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ error: 'Failed to get products' });
  }
}

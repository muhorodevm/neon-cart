import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().min(10).max(20).optional(),
  avatarUrl: z.string().url().optional(),
});

const updateAddressSchema = z.object({
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
});

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatarUrl: true,
          createdAt: true,
          addresses: true,
          userRoles: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const data = updateProfileSchema.parse(req.body);

      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatarUrl: true,
        },
      });

      res.json({
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid profile data', details: error.errors });
      }
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  async addAddress(req: AuthRequest, res: Response) {
    try {
      const data = updateAddressSchema.parse(req.body);

      const address = await prisma.address.create({
        data: {
          ...data,
          userId: req.user!.id,
        },
      });

      res.status(201).json({
        message: 'Address added successfully',
        address,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid address data', details: error.errors });
      }
      console.error('Add address error:', error);
      res.status(500).json({ error: 'Failed to add address' });
    }
  }

  async updateAddress(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data = updateAddressSchema.parse(req.body);

      // Verify address belongs to user
      const existingAddress = await prisma.address.findFirst({
        where: {
          id,
          userId: req.user!.id,
        },
      });

      if (!existingAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }

      const address = await prisma.address.update({
        where: { id },
        data,
      });

      res.json({
        message: 'Address updated successfully',
        address,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid address data', details: error.errors });
      }
      console.error('Update address error:', error);
      res.status(500).json({ error: 'Failed to update address' });
    }
  }

  async deleteAddress(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Verify address belongs to user
      const existingAddress = await prisma.address.findFirst({
        where: {
          id,
          userId: req.user!.id,
        },
      });

      if (!existingAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }

      await prisma.address.delete({
        where: { id },
      });

      res.json({ message: 'Address deleted successfully' });
    } catch (error) {
      console.error('Delete address error:', error);
      res.status(500).json({ error: 'Failed to delete address' });
    }
  }
}

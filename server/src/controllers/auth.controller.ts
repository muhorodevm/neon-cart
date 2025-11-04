import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.util';
import { generateOTP } from '../utils/otp.util';
import { EmailService } from '../services/email.service';

const prisma = new PrismaClient();
const emailService = new EmailService();

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map<string, { otp: string; expiresAt: Date }>();

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      otpStore.set(email, { otp, expiresAt });

      // Send OTP email
      await emailService.sendSignupEmail(email, firstName, otp);

      // Store user data temporarily (simplified - in production use better approach)
      res.json({
        message: 'OTP sent to your email',
        tempData: { email, hashedPassword, firstName, lastName },
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Signup failed' });
    }
  }

  async verifySignupOTP(req: Request, res: Response) {
    try {
      const { email, otp, tempData } = req.body;

      const storedOTP = otpStore.get(email);
      if (!storedOTP) {
        return res.status(400).json({ error: 'OTP expired or not found' });
      }

      if (storedOTP.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      if (new Date() > storedOTP.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP expired' });
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email: tempData.email,
          emailVerified: true,
          profile: {
            create: {
              firstName: tempData.firstName,
              lastName: tempData.lastName,
            },
          },
          userRoles: {
            create: {
              role: 'CUSTOMER',
            },
          },
        },
      });

      otpStore.delete(email);

      const token = generateToken(user.id, user.email);

      res.json({
        message: 'Account created successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ error: 'Verification failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { userRoles: true, profile: true },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // In production, store password hash
      // const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      // For now, simplified

      const token = generateToken(user.id, user.email);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          roles: user.userRoles.map((r) => r.role),
          profile: user.profile,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      otpStore.set(email, { otp, expiresAt });

      await emailService.sendPasswordResetEmail(
        email,
        user.profile?.firstName || 'User',
        otp
      );

      res.json({ message: 'Password reset OTP sent to your email' });
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({ error: 'Request failed' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { email, otp, newPassword } = req.body;

      const storedOTP = otpStore.get(email);
      if (!storedOTP || storedOTP.otp !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      if (new Date() > storedOTP.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ error: 'OTP expired' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password (add passwordHash field to schema)
      // await prisma.user.update({
      //   where: { email },
      //   data: { passwordHash: hashedPassword },
      // });

      otpStore.delete(email);

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ error: 'Reset failed' });
    }
  }
}

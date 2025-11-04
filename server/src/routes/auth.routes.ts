import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { z } from 'zod';

const router = Router();
const authController = new AuthController();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  tempData: z.object({
    email: z.string(),
    hashedPassword: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
});

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/verify-otp', validate(verifyOTPSchema), authController.verifySignupOTP);
router.post('/login', validate(loginSchema), authController.login);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router;

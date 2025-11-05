import { Router } from 'express';
import { signup, verifySignupOTP, resendOTP, login, requestPasswordReset, resetPassword } from '../controllers/auth.functions';
import { validate } from '../middlewares/validation.middleware';
import { z } from 'zod';

const router = Router();

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

router.post('/signup', validate(signupSchema), signup);
router.post('/verify-otp', validate(verifyOTPSchema), verifySignupOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', validate(loginSchema), login);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;

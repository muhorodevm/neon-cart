import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { z } from 'zod';

const router = Router();
const paymentController = new PaymentController();

const mpesaPaymentSchema = z.object({
  orderId: z.string().uuid(),
  phoneNumber: z.string().regex(/^254\d{9}$/),
  amount: z.number().positive(),
});

router.use(authenticate);

router.post('/mpesa/initiate', validate(mpesaPaymentSchema), paymentController.initiateMpesaPayment);
router.get('/status/:transactionId', paymentController.getPaymentStatus);

export default router;

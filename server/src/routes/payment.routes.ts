import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { initiateMpesaPayment, getPaymentStatus } from '../controllers/payment.functions';

const router = Router();

router.use(authenticate);

router.post('/mpesa', initiateMpesaPayment);
router.get('/:transactionId', getPaymentStatus);

export default router;

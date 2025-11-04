import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { z } from 'zod';

const router = Router();
const orderController = new OrderController();

const createOrderSchema = z.object({
  addressId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      name: z.string(),
      size: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  paymentMethod: z.enum(['MPESA', 'CARD', 'BANK_TRANSFER', 'CASH_ON_DELIVERY']),
});

router.use(authenticate);

router.post('/create', validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', orderController.getOrders);
router.patch(
  '/:orderId/status',
  authorize('ADMIN', 'SUPER_ADMIN'),
  orderController.updateOrderStatus
);

export default router;

import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createOrder, getOrders, getOrderById, updateOrderStatus, getAllOrders } from '../controllers/order.functions';

const router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/admin/all', authorize('ADMIN', 'SUPER_ADMIN'), getAllOrders);
router.put('/:id/status', authorize('ADMIN', 'SUPER_ADMIN'), updateOrderStatus);

export default router;

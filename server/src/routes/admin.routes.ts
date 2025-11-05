import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getDashboardStats, getAllCustomers } from '../controllers/admin.functions';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/analytics/stats', getDashboardStats);
router.get('/customers', getAllCustomers);

export default router;

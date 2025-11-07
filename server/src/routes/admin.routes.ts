import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { getDashboardStats, getAllCustomers } from '../controllers/admin.functions';
import { adminLogin } from '../controllers/auth.functions';

// hello
const router = Router();

// Public admin auth
router.post('/login', adminLogin);

router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/analytics/stats', getDashboardStats);
router.get('/customers', getAllCustomers);

export default router;

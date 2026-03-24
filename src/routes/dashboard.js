import { Router } from 'express';
import { spendingByDepartment, totalSpent, ticketStats } from '../controllers/dashboardController.js';
import { protect, superAdminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/spending', protect, superAdminOnly, spendingByDepartment);
router.get('/total-spent', protect, superAdminOnly, totalSpent);
router.get('/ticket-stats', protect, ticketStats);

export default router;

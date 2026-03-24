import { Router } from 'express';
import { list, listAdmins, deactivate } from '../controllers/userController.js';
import { protect, adminOrSuper, superAdminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, adminOrSuper, list);
router.get('/admins', protect, superAdminOnly, listAdmins);
router.patch('/:id/deactivate', protect, adminOrSuper, deactivate);

export default router;

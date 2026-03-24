import { Router } from 'express';
import { list, getOne, create } from '../controllers/auditController.js';
import { protect, adminOrSuper } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, list);
router.get('/:id', protect, getOne);
router.post('/', protect, adminOrSuper, create);

export default router;

import { Router } from 'express';
import {
  list,
  getOne,
  create,
  update,
  remove,
  belowThreshold,
} from '../controllers/inventoryController.js';
import { protect, adminOrSuper } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, list);
router.get('/below-threshold', protect, belowThreshold);
router.get('/:id', protect, getOne);
router.post('/', protect, adminOrSuper, create);
router.patch('/:id', protect, adminOrSuper, update);
router.delete('/:id', protect, adminOrSuper, remove);

export default router;

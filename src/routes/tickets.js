import { Router } from 'express';
import { body } from 'express-validator';
import {
  list,
  getOne,
  create,
  approveByDirector,
  rejectByDirector,
  resolve,
} from '../controllers/ticketController.js';
import { protect, adminOrSuper, superAdminOnly } from '../middleware/auth.js';
import { uploadTicketFiles } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Standard Routes
router.get('/', protect, list);
router.get('/:id', protect, getOne);

// Create Ticket with Multer Fields
router.post(
  '/',
  protect,
  uploadTicketFiles.fields([
    { name: 'excelFile', maxCount: 1 },
    { name: 'attachments', maxCount: 5 }
  ]),
  [
    body('type').isIn(['Service', 'Requisition']),
    body('title').trim().notEmpty(),
    body('departmentId').isMongoId(),
  ],
  validate,
  create
);

// Approval Routes
router.patch('/:id/approve', protect, superAdminOnly, approveByDirector);
router.patch('/:id/reject', protect, superAdminOnly, rejectByDirector);

// Resolution Route
router.patch(
  '/:id/resolve',
  protect,
  adminOrSuper,
  [body('cost').optional({ checkFalsy: true }).isFloat({ min: 0 })],
  validate,
  resolve
);

export default router;















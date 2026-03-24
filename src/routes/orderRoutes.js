import express from 'express';
// Using the * as orderCtrl syntax you provided
import * as orderCtrl from '../controllers/orderController.js';

const router = express.Router();

/**
 * Kitchen Routes
 */
router.post('/kitchen/request', orderCtrl.createOrder);

/**
 * Admin Routes
 */
// This now correctly points to the exported function 'getPendingOrders'
router.get('/admin/pending', orderCtrl.getPendingOrders);

// Handles the approval and inventory subtraction
router.patch('/admin/approve/:id', orderCtrl.approveOrder);

export default router;










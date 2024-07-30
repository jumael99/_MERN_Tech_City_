import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaidPost,
  updateOrderToDelivered,
  getOrders,
  paymentSuccess,
  paymentFailure,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').post(protect, updateOrderToPaidPost);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/payment-online/success/:tranId').post(paymentSuccess);
router.route('/payment-online/failure/:tranId').get(paymentFailure);

export default router;
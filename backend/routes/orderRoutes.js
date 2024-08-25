import express from "express";
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
  getTotalRevenue,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/revenue").get(protect, admin, getTotalRevenue);
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").post(protect, updateOrderToPaidPost);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/payment-online/success/:tranId").post(paymentSuccess);
router.route("/payment-online/failure/:tranId").post(paymentFailure);
router.route("/revenue").get(protect, admin, getTotalRevenue);

export default router;

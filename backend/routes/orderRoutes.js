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
  getSellerOrders,
  getSellerRevenue,
} from "../controllers/orderController.js";
import { protect, admin, seller } from "../middleware/authMiddleware.js";

// Route for getting total revenue
router.route("/revenue").get(protect, admin, getTotalRevenue);

// Seller-specific routes should be defined before the generic ones to avoid being caught by the "/:id" route
router.route("/seller").get(protect, seller, getSellerOrders);
router.route("/seller/revenue").get(protect, seller, getSellerRevenue);

// Route for handling online payment success and failure
router.route("/payment-online/success/:tranId").post(paymentSuccess);
router.route("/payment-online/failure/:tranId").post(paymentFailure);

// General routes for orders
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/mine").get(protect, getMyOrders);

// Specific routes for an order
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").post(protect, updateOrderToPaidPost);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;

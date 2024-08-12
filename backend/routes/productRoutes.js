import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getSellerProducts,
} from "../controllers/productController.js";

import { protect, admin, seller } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, seller, createProduct);

router.get("/top", getTopProducts);
router.get("/seller", protect, seller, getSellerProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, seller, updateProduct)
  .delete(protect, seller, deleteProduct);

router.route("/:id/reviews").post(protect, createProductReview);

export default router;

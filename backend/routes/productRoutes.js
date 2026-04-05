import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getTopProducts,
  getSellerProducts,
} from "../controllers/productController.js";

import { protect, admin, seller } from "../middleware/authMiddleware.js";

// Public route to get products
router.route("/").get(getProducts);

// Route to create a product, accessible by both admin and seller
router.route("/").post(
  protect,
  (req, res, next) => {
    if (req.user.isAdmin || req.user.role === "seller") {
      return next();
    }
    res.status(401).json({ message: "Not authorized to create product" });
  },
  createProduct,
);

// Route to get top-rated products
router.get("/top", getTopProducts);

// Route to get products for a specific seller
router.get("/seller", protect, seller, getSellerProducts);

// Routes for product details, updates, and deletions
router
  .route("/:id")
  .get(getProductById)
  .put(
    protect,
    (req, res, next) => {
      if (req.user.isAdmin || req.user.role === "seller") {
        return next();
      }
      res.status(401).json({ message: "Not authorized to update product" });
    },
    updateProduct,
  )
  .delete(
    protect,
    (req, res, next) => {
      if (req.user.isAdmin || req.user.role === "seller") {
        return next();
      }
      res.status(401).json({ message: "Not authorized to delete product" });
    },
    deleteProduct,
  );

// Route to create a product review
router.route("/:id/reviews").post(protect, createProductReview);

router
  .route("/:id/reviews/:reviewId")
  .put(protect, updateProductReview)
  .delete(protect, deleteProductReview);

export default router;

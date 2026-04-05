import express from "express";
const router = express.Router();
import {
  getProducts,
  getSellerProducts,
  createProduct,
  deleteProduct,
  // other controllers...
} from "../controllers/productController.js";
import { protect, admin, seller } from "../middleware/authMiddleware.js";

router.route("/:id").delete(protect, seller, deleteProduct);
// other routes...

export default router;

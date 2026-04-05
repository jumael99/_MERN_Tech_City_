// backend/controllers/sellerController.js
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Get seller's products
// @route   GET /api/seller/myproducts
// @access  Private/Seller
const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id });
  res.json(products);
});

// @desc    Add a new product
// @route   POST /api/seller/product
// @access  Private/Seller
const addProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const product = new Product({
    user: req.user._id,
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

export { getMyProducts, addProduct };

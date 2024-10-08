import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";
import SSLCommerzPayment from "sslcommerz-lts";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const updateOrderToPaidPost = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("User not authorized to update this order");
    }

    const tran_id = new ObjectId().toString();
    order.tranId = tran_id;

    const updatedOrder = await order.save();

    const data = {
      total_amount: order.totalPrice,
      currency: "BDT",
      tran_id: tran_id,
      success_url: `http://localhost:5000/api/orders/payment-online/success/${tran_id}`,
      fail_url: `http://localhost:5000/api/orders/payment-online/failure/${tran_id}`,
      cancel_url: `${process.env.BASE_URL}/order/${order._id}`,
      ipn_url: `${process.env.BASE_URL}/api/orders/${order._id}/ipn`,
      shipping_method: "Courier",
      product_name: "Order Items",
      product_category: "Physical Goods",
      product_profile: "general",
      cus_name: req.user.name,
      cus_email: req.user.email,
      cus_add1: order.shippingAddress.address,
      cus_add2: "N/A",
      cus_city: order.shippingAddress.city,
      cus_state: order.shippingAddress.city,
      cus_postcode: order.shippingAddress.postalCode,
      cus_country: order.shippingAddress.country,
      cus_phone: req.user.phoneNumber || "N/A",
      cus_fax: "N/A",
      ship_name: req.user.name,
      ship_add1: order.shippingAddress.address,
      ship_add2: "N/A",
      ship_city: order.shippingAddress.city,
      ship_state: order.shippingAddress.city,
      ship_postcode: order.shippingAddress.postalCode,
      ship_country: order.shippingAddress.country,
    };

    const sslcz = new SSLCommerzPayment(
      process.env.STORE_ID,
      process.env.STORE_PASS,
      false
    );
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.json({ url: apiResponse.GatewayPageURL, order: updatedOrder });
    } else {
      throw new Error("Failed to get payment URL from SSLCommerz");
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
    res.status(500).json({
      message: "Payment initialization failed",
      error: error.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
    });
  }
});

const paymentSuccess = asyncHandler(async (req, res) => {
  try {
    //added objectid solve this
    const updateOrder = await Order.findOne({ tranId: req.params.tranId });

    if (!updateOrder) {
      return res.status(404).json({ message: "Order is not found" });
    }

    updateOrder.isPaid = true;
    updateOrder.paidAt = Date.now();
    await updateOrder.save();
    res.redirect(`http://localhost:3000/order/${updateOrder._id}`); //added updateOrder._id solve another one.
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const paymentFailure = asyncHandler(async (req, res) => {
  console.log("Payment failure endpoint hit. tranId:", req.params.tranId);
  try {
    const updateOrder = await Order.findOne({ tranId: req.params.tranId });

    if (!updateOrder) {
      return res.status(404).json({ message: "Order is not found" });
    }

    const redirectUrl = `http://localhost:3000/order/${updateOrder._id}`;
    res.redirect(redirectUrl);
  } catch (error) {
    res.redirect(
      `http://localhost:3000/payment-error?message=${encodeURIComponent(
        error.message
      )}`
    );
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // Fetch the products from the database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // Check if all products are in stock
    for (const item of orderItems) {
      const product = itemsFromDB.find((p) => p._id.toString() === item._id);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item._id}`);
      }
      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(`Product ${product.name} is out of stock`);
      }
    }

    // Create order items and update stock
    const dbOrderItems = [];
    for (const item of orderItems) {
      const product = itemsFromDB.find((p) => p._id.toString() === item._id);
      const orderItem = {
        name: product.name,
        qty: item.qty,
        image: product.image,
        price: product.price,
        product: product._id,
      };
      dbOrderItems.push(orderItem);

      // Update stock
      product.countInStock -= item.qty;
      await product.save();
    }

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const sellerId = itemsFromDB[0].user._id;

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      seller: sellerId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    console.log("Created order:", createdOrder);

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

// @desc    Get total revenue
// @route   GET /api/orders/revenue
// @access  Private/Admin
const getTotalRevenue = asyncHandler(async (req, res) => {
  const orders = await Order.find({ isPaid: true });
  const totalRevenue = orders.reduce((acc, order) => acc + order.itemsPrice, 0);
  res.json({ totalRevenue });
});

// @desc    Get logged in seller's orders
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = asyncHandler(async (req, res) => {
  console.log("Request path:", req.path);
  console.log("Request params:", req.params);
  console.log("Request query:", req.query);

  try {
    const sellerId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      throw new Error("Invalid seller ID");
    }

    const orders = await Order.find({ seller: sellerId }).populate(
      "user",
      "id name"
    );

    console.log("Query:", { seller: sellerId });
    console.log("Found orders:", orders);

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error in getSellerOrders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get seller's revenue
// @route   GET /api/orders/seller/revenue
// @access  Private/Seller
const getSellerRevenue = asyncHandler(async (req, res) => {
  try {
    // Correct usage of ObjectId with 'new' keyword
    const sellerId = new mongoose.Types.ObjectId(req.user._id);

    // Find all paid orders for the logged-in seller
    const orders = await Order.find({ seller: sellerId, isPaid: true });

    // Calculate total revenue for the seller
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.itemsPrice,
      0
    );

    // Return the total revenue in JSON format
    res.json({ totalRevenue });
  } catch (error) {
    console.error("Error fetching seller's revenue:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message }); // Return error message
  }
});

export {
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
};

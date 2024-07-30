import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import dotenv from 'dotenv';
dotenv.config();

const updateOrderToPaidPost = asyncHandler(async (req, res) => {
  console.log('Received payment request for order:', req.params.id);
  console.log('User:', req.user);

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to update this order');
    }

    const tran_id = new ObjectId().toString();
    order.tranId = tran_id;

    const updatedOrder = await order.save();

    const data = {
      total_amount: order.totalPrice,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `http://localhost:5000/api/orders/payment-online/success/${tran_id}`,
    fail_url: `${process.env.BASE_URL}/api/orders/payment-online/failure/${tran_id}`,
      cancel_url: `${process.env.BASE_URL}/order/${order._id}`,
      ipn_url: `${process.env.BASE_URL}/api/orders/${order._id}/ipn`,
      shipping_method: 'Courier',
      product_name: 'Order Items',
      product_category: 'Physical Goods',
      product_profile: 'general',
      cus_name: req.user.name,
      cus_email: req.user.email,
      cus_add1: order.shippingAddress.address,
      cus_add2: 'N/A',
      cus_city: order.shippingAddress.city,
      cus_state: order.shippingAddress.city,
      cus_postcode: order.shippingAddress.postalCode,
      cus_country: order.shippingAddress.country,
      cus_phone: req.user.phoneNumber || 'N/A',
      cus_fax: 'N/A',
      ship_name: req.user.name,
      ship_add1: order.shippingAddress.address,
      ship_add2: 'N/A',
      ship_city: order.shippingAddress.city,
      ship_state: order.shippingAddress.city,
      ship_postcode: order.shippingAddress.postalCode,
      ship_country: order.shippingAddress.country,
    };

    const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASS, false);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      res.json({ url: apiResponse.GatewayPageURL, order: updatedOrder });
    } else {
      throw new Error('Failed to get payment URL from SSLCommerz');
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      message: 'Payment initialization failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
  }
});

const paymentSuccess = asyncHandler(async (req, res) => {
  const { tranId } = req.params;
  console.log('Received success callback for transaction:', tranId);

  try {
    const order = await Order.findOne({ tranId });

    if (!order) {
      console.log('Order not found for transaction:', tranId);
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: tranId,
        status: 'completed',
        update_time: Date.now(),
        email_address: req.body.value_d || '',  // Adjust based on SSLCommerz response
      };

      const updatedOrder = await order.save();
      console.log('Order updated successfully:', updatedOrder._id);
    }

    // Redirect to the frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/payment-success/${tranId}`);
  } catch (error) {
    console.error('Error in payment success handler:', error);
    res.status(500).json({ message: 'Error processing payment success', error: error.message });
  }
});

const paymentFailure = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findOne({ tranId: req.params.tranId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment-failure/${req.params.tranId}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

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
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
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
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
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
};
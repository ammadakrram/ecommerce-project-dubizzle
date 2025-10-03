const asyncHandler = require('express-async-handler');
const { Order, OrderItem, Cart, CartItem, Product, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Create new order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'stripe' } = req.body;

  // Validate shipping address
  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address ||
      !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode ||
      !shippingAddress.phone) {
    res.status(400);
    throw new Error('Please provide complete shipping address');
  }

  // Get user's cart with items
  const cart = await Cart.findOne({
    where: { userId: req.user.id },
    include: [{
      model: CartItem,
      as: 'items',
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'discountPrice', 'stock', 'images']
      }]
    }]
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  // Verify stock availability and calculate totals
  let subtotal = 0;
  const orderItemsData = [];

  for (const item of cart.items) {
    const product = item.Product;

    // Check if product still exists
    if (!product) {
      res.status(400);
      throw new Error(`Product ${item.name} is no longer available`);
    }

    // Check stock
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} available`);
    }

    const itemPrice = Number(item.price);
    const itemTotal = itemPrice * item.quantity;
    subtotal += itemTotal;

    orderItemsData.push({
      productId: product.id,
      name: item.name,
      price: itemPrice,
      image: item.image,
      quantity: item.quantity,
      size: item.size,
      color: item.color
    });
  }

  // Calculate discount if cart has discount percentage
  const discountPercentage = cart.discountPercentage || 0;
  const discount = (subtotal * discountPercentage) / 100;

  // Delivery fee
  const deliveryFee = 15;

  // Calculate total
  const total = subtotal - discount + deliveryFee;

  // Create order
  const order = await Order.create({
    userId: req.user.id,
    shippingAddress,
    paymentMethod,
    subtotal,
    discount,
    deliveryFee,
    total,
    orderStatus: 'pending',
    isPaid: false
  });

  // Create order items
  for (const itemData of orderItemsData) {
    await OrderItem.create({
      ...itemData,
      orderId: order.id
    });
  }

  // Update product stock
  for (const item of cart.items) {
    const product = item.Product;
    await product.update({
      stock: product.stock - item.quantity
    });
  }

  // Clear the cart
  await CartItem.destroy({ where: { cartId: cart.id } });
  await cart.update({ subtotal: 0, discountPercentage: 0 });

  // Reload order with items
  await order.reload({
    include: [{
      model: OrderItem,
      as: 'items'
    }, {
      model: User,
      attributes: ['name', 'email']
    }]
  });

  res.status(201).json({
    success: true,
    data: order,
    message: 'Order created successfully'
  });
});

// @desc    Get all orders for logged-in user
// @route   GET /api/orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;

  // Build where clause
  const where = { userId: req.user.id };
  if (status) {
    where.orderStatus = status;
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [{
      model: OrderItem,
      as: 'items'
    }],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  res.json({
    success: true,
    count: rows.length,
    total: count,
    page: Number(page),
    pages: Math.ceil(count / limit),
    data: rows
  });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{
      model: OrderItem,
      as: 'items'
    }, {
      model: User,
      attributes: ['name', 'email']
    }]
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify ownership (users can only see their own orders, unless admin)
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({
    success: true,
    data: order
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify ownership
  if (order.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  // Payment result from payment gateway (Stripe)
  const { id, status, update_time, email_address } = req.body;

  await order.update({
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id,
      status,
      update_time,
      email_address
    },
    orderStatus: 'processing'
  });

  await order.reload({
    include: [{
      model: OrderItem,
      as: 'items'
    }]
  });

  res.json({
    success: true,
    data: order,
    message: 'Payment successful'
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{
      model: OrderItem,
      as: 'items'
    }]
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Verify ownership
  if (order.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Check if order can be cancelled
  if (order.orderStatus === 'delivered') {
    res.status(400);
    throw new Error('Cannot cancel delivered order');
  }

  if (order.orderStatus === 'cancelled') {
    res.status(400);
    throw new Error('Order is already cancelled');
  }

  // Restore product stock
  for (const item of order.items) {
    const product = await Product.findByPk(item.productId);
    if (product) {
      await product.update({
        stock: product.stock + item.quantity
      });
    }
  }

  await order.update({
    orderStatus: 'cancelled'
  });

  res.json({
    success: true,
    data: order,
    message: 'Order cancelled successfully'
  });
});

// ============================================
// ADMIN ROUTES
// ============================================

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, userId } = req.query;
  const offset = (page - 1) * limit;

  // Build where clause
  const where = {};
  if (status) {
    where.orderStatus = status;
  }
  if (userId) {
    where.userId = userId;
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [{
      model: OrderItem,
      as: 'items'
    }, {
      model: User,
      attributes: ['id', 'name', 'email']
    }],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  res.json({
    success: true,
    count: rows.length,
    total: count,
    page: Number(page),
    pages: Math.ceil(count / limit),
    data: rows
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!orderStatus || !validStatuses.includes(orderStatus)) {
    res.status(400);
    throw new Error(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findByPk(req.params.id, {
    include: [{
      model: OrderItem,
      as: 'items'
    }]
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Update delivered date if status is delivered
  const updateData = { orderStatus };
  if (orderStatus === 'delivered' && !order.deliveredAt) {
    updateData.deliveredAt = new Date();
  }

  await order.update(updateData);

  await order.reload({
    include: [{
      model: OrderItem,
      as: 'items'
    }, {
      model: User,
      attributes: ['name', 'email']
    }]
  });

  res.json({
    success: true,
    data: order,
    message: `Order status updated to ${orderStatus}`
  });
});

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  // Total orders
  const totalOrders = await Order.count();

  // Orders by status
  const pendingOrders = await Order.count({ where: { orderStatus: 'pending' } });
  const processingOrders = await Order.count({ where: { orderStatus: 'processing' } });
  const shippedOrders = await Order.count({ where: { orderStatus: 'shipped' } });
  const deliveredOrders = await Order.count({ where: { orderStatus: 'delivered' } });
  const cancelledOrders = await Order.count({ where: { orderStatus: 'cancelled' } });

  // Total revenue (only paid orders)
  const paidOrders = await Order.findAll({
    where: { isPaid: true },
    attributes: ['total']
  });
  const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total), 0);

  // Recent orders
  const recentOrders = await Order.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    include: [{
      model: User,
      attributes: ['name', 'email']
    }]
  });

  res.json({
    success: true,
    data: {
      totalOrders,
      ordersByStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      totalRevenue: totalRevenue.toFixed(2),
      recentOrders
    }
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  cancelOrder,
  // Admin routes
  getAllOrders,
  updateOrderStatus,
  getOrderStats
};

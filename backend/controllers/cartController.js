const asyncHandler = require('express-async-handler');
const { Cart, CartItem, Product } = require('../models');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({
    where: { userId: req.user.id },
    include: [{
      model: CartItem,
      as: 'items',
      include: [{
        model: Product,
        attributes: ['name', 'price', 'images', 'stock']
      }]
    }]
  });

  if (!cart) {
    // Create empty cart if doesn't exist
    cart = await Cart.create({
      userId: req.user.id
    });
  }

  res.json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  // Validation
  if (!productId || !quantity || !size || !color) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Get product
  const product = await Product.findByPk(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check stock
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  // Get or create cart
  let cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!cart) {
    cart = await Cart.create({ userId: req.user.id });
  }

  // Check if item already exists
  const existingItem = await CartItem.findOne({
    where: {
      cartId: cart.id,
      productId,
      size,
      color
    }
  });

  if (existingItem) {
    // Update quantity
    await existingItem.update({
      quantity: existingItem.quantity + quantity
    });
  } else {
    // Add new item
    await CartItem.create({
      cartId: cart.id,
      productId,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0],
      quantity,
      size,
      color
    });
  }

  // Recalculate cart totals
  const items = await CartItem.findAll({ where: { cartId: cart.id } });
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  
  await cart.update({ subtotal });

  // Reload cart with items
  await cart.reload({
    include: [{
      model: CartItem,
      as: 'items',
      include: [{ model: Product, attributes: ['name', 'price', 'images', 'stock'] }]
    }]
  });

  res.json({
    success: true,
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const item = await CartItem.findByPk(req.params.itemId, {
    include: [{ model: Product }]
  });

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Verify ownership
  const cart = await Cart.findByPk(item.cartId);
  if (cart.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Check stock
  if (item.Product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  await item.update({ quantity });

  // Recalculate cart totals
  const items = await CartItem.findAll({ where: { cartId: cart.id } });
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  await cart.update({ subtotal });

  // Reload cart
  await cart.reload({
    include: [{
      model: CartItem,
      as: 'items',
      include: [{ model: Product, attributes: ['name', 'price', 'images', 'stock'] }]
    }]
  });

  res.json({
    success: true,
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const item = await CartItem.findByPk(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Verify ownership
  const cart = await Cart.findByPk(item.cartId);
  if (cart.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await item.destroy();

  // Recalculate cart totals
  const items = await CartItem.findAll({ where: { cartId: cart.id } });
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  await cart.update({ subtotal });

  // Reload cart
  await cart.reload({
    include: [{
      model: CartItem,
      as: 'items',
      include: [{ model: Product, attributes: ['name', 'price', 'images', 'stock'] }]
    }]
  });

  res.json({
    success: true,
    data: cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Delete all items
  await CartItem.destroy({ where: { cartId: cart.id } });
  await cart.update({ subtotal: 0 });

  res.json({
    success: true,
    data: cart
  });
});

// @desc    Apply promo code
// @route   POST /api/cart/promo
// @access  Private
const applyPromoCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const cart = await Cart.findOne({ where: { userId: req.user.id } });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Simple promo code logic
  const promoCodes = {
    'SAVE20': 20,
    'FIRST10': 10,
    'WELCOME15': 15
  };

  if (!promoCodes[code]) {
    res.status(400);
    throw new Error('Invalid promo code');
  }

  await cart.update({ discountPercentage: promoCodes[code] });

  res.json({
    success: true,
    data: cart,
    message: `Promo code applied! ${promoCodes[code]}% off`
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyPromoCode
};
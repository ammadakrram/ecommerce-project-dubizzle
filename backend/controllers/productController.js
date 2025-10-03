const asyncHandler = require('express-async-handler');
const { Product, Review, User } = require('../models');
const { Op } = require('sequelize');
const {
  indexProduct,
  updateProduct: updateProductES,
  deleteProduct: deleteProductES
} = require('../services/elasticsearchService');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    colors,
    sizes,
    dressStyle,
    search,
    sort = 'createdAt',
    page = 1,
    limit = 9
  } = req.query;

  // Build where clause
  const where = {};

  if (category) where.category = category;
  if (dressStyle) where.dressStyle = dressStyle;
  
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
  }

  if (colors) {
    const colorArray = colors.split(',');
    where.colors = { [Op.overlap]: colorArray };
  }

  if (sizes) {
    const sizeArray = sizes.split(',');
    where.sizes = { [Op.overlap]: sizeArray };
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Pagination
  const offset = (page - 1) * limit;

  // Execute query
  const { count, rows } = await Product.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [[sort, 'DESC']]
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [{
      model: Review,
      as: 'reviews',
      include: [{
        model: User,
        attributes: ['name']
      }]
    }]
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  // Index product in Elasticsearch
  try {
    await indexProduct(product.toJSON());
  } catch (error) {
    console.error('Error indexing product in Elasticsearch:', error.message);
    // Don't fail the request if ES indexing fails
  }

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.update(req.body);

  // Update product in Elasticsearch
  try {
    await updateProductES(product.id, product.toJSON());
  } catch (error) {
    console.error('Error updating product in Elasticsearch:', error.message);
    // Don't fail the request if ES update fails
  }

  res.json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const productId = product.id;
  await product.destroy();

  // Delete product from Elasticsearch
  try {
    await deleteProductES(productId);
  } catch (error) {
    console.error('Error deleting product from Elasticsearch:', error.message);
    // Don't fail the request if ES deletion fails
  }

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findByPk(req.params.id, {
    include: [{ model: Review, as: 'reviews' }]
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    review => review.userId === req.user.id
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  // Create review
  const review = await Review.create({
    userId: req.user.id,
    productId: product.id,
    rating: Number(rating),
    comment
  });

  // Update product rating
  const reviews = await Review.findAll({ where: { productId: product.id } });
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  
  await product.update({
    rating: avgRating,
    numReviews: reviews.length
  });

  res.status(201).json({
    success: true,
    message: 'Review added'
  });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
};
const asyncHandler = require('express-async-handler');
const {
  searchProducts,
  getAutocompleteSuggestions,
  getAggregations
} = require('../services/elasticsearchService');

// @desc    Search products using Elasticsearch
// @route   GET /api/search
// @access  Public
const searchProductsES = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    colors,
    sizes,
    dressStyle,
    sort = 'relevance',
    page = 1,
    limit = 9
  } = req.query;

  const result = await searchProducts({
    query: q,
    category,
    minPrice,
    maxPrice,
    colors,
    sizes,
    dressStyle,
    sort,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    count: result.products.length,
    total: result.total,
    page: result.page,
    pages: result.pages,
    data: result.products
  });
});

// @desc    Get autocomplete suggestions
// @route   GET /api/search/autocomplete
// @access  Public
const autocomplete = asyncHandler(async (req, res) => {
  const { q, limit = 5 } = req.query;

  if (!q || q.trim() === '') {
    return res.json({
      success: true,
      data: []
    });
  }

  const suggestions = await getAutocompleteSuggestions(q, parseInt(limit));

  res.json({
    success: true,
    data: suggestions
  });
});

// @desc    Get filter aggregations
// @route   GET /api/search/filters
// @access  Public
const getFilters = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const aggregations = await getAggregations(q);

  res.json({
    success: true,
    data: aggregations
  });
});

module.exports = {
  searchProductsES,
  autocomplete,
  getFilters
};

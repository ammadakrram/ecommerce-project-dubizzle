const express = require('express');
const router = express.Router();
const {
  searchProductsES,
  autocomplete,
  getFilters
} = require('../controllers/searchController');

// Search products
router.get('/', searchProductsES);

// Autocomplete suggestions
router.get('/autocomplete', autocomplete);

// Get filter aggregations
router.get('/filters', getFilters);

module.exports = router;

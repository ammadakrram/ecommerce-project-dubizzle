import api from "./axios";

/**
 * Search products using Elasticsearch
 * @param {Object} params - Search parameters
 * @param {string} params.q - Search query
 * @param {string} params.category - Category filter
 * @param {number} params.minPrice - Minimum price
 * @param {number} params.maxPrice - Maximum price
 * @param {string} params.colors - Colors filter (comma-separated)
 * @param {string} params.sizes - Sizes filter (comma-separated)
 * @param {string} params.dressStyle - Dress style filter
 * @param {string} params.sort - Sort option (relevance, price_asc, price_desc, rating, newest)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Search results
 */
export const searchProducts = async (params) => {
  try {
    const response = await api.get("/search", { params });
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

/**
 * Get autocomplete suggestions
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of suggestions
 * @returns {Promise} Autocomplete suggestions
 */
export const getAutocompleteSuggestions = async (query, limit = 5) => {
  try {
    const response = await api.get("/search/autocomplete", {
      params: { q: query, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting autocomplete suggestions:", error);
    throw error;
  }
};

/**
 * Get filter aggregations
 * @param {string} query - Search query (optional)
 * @returns {Promise} Filter aggregations
 */
export const getFilterAggregations = async (query = "") => {
  try {
    const response = await api.get("/search/filters", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting filter aggregations:", error);
    throw error;
  }
};

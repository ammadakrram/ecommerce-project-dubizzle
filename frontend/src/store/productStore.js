import { create } from 'zustand';
import api from '../api/axios';

const useProductStore = create((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    colors: [],
    sizes: [],
    dressStyle: '',
    search: ''
  },
  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    pages: 0
  },

  // Fetch all products with filters
  fetchProducts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key].length > 0) {
          if (Array.isArray(filters[key])) {
            params.append(key, filters[key].join(','));
          } else {
            params.append(key, filters[key]);
          }
        }
      });

      const response = await api.get(`/search?${params.toString()}`);
      set({ 
        products: response.data.data,
        pagination: {
          page: response.data.page,
          limit: response.data.limit || 9,
          total: response.data.total,
          pages: response.data.pages
        },
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch products',
        loading: false 
      });
    }
  },

  // Fetch single product
  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/products/${id}`);
      set({ product: response.data.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch product',
        loading: false 
      });
    }
  },

  // Update filters
  setFilters: (filters) => {
    set({ filters });
  },

  // Clear filters
  clearFilters: () => {
    set({ 
      filters: {
        category: '',
        minPrice: '',
        maxPrice: '',
        colors: [],
        sizes: [],
        dressStyle: '',
        search: ''
      }
    });
  }
}));

export default useProductStore;
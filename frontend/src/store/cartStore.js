import { create } from 'zustand';
import api from '../api/axios';

const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  // Fetch cart
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/cart');
      set({ cart: response.data.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch cart', 
        loading: false 
      });
    }
  },

  // Add to cart
  addToCart: async (item) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/cart', item);
      set({ cart: response.data.data, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Update cart item (with optimistic update)
  updateCartItem: async (itemId, quantity) => {
    const currentCart = get().cart;

    // Optimistic update - update UI immediately
    if (currentCart && currentCart.items) {
      const updatedItems = currentCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      set({
        cart: { ...currentCart, items: updatedItems },
        error: null
      });
    }

    // Send request to backend
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      // Update with actual backend response
      set({ cart: response.data.data });
    } catch (error) {
      // Revert to original state on error
      set({
        cart: currentCart,
        error: error.response?.data?.message || 'Failed to update cart'
      });
    }
  },

  // Remove from cart (with optimistic update)
  removeFromCart: async (itemId) => {
    const currentCart = get().cart;

    // Optimistic update - remove from UI immediately
    if (currentCart && currentCart.items) {
      const updatedItems = currentCart.items.filter(item => item.id !== itemId);
      set({
        cart: { ...currentCart, items: updatedItems },
        error: null
      });
    }

    // Send request to backend
    try {
      const response = await api.delete(`/cart/${itemId}`);
      // Update with actual backend response
      set({ cart: response.data.data });
    } catch (error) {
      // Revert to original state on error
      set({
        cart: currentCart,
        error: error.response?.data?.message || 'Failed to remove item'
      });
    }
  },

  // Apply promo code
  applyPromo: async (code) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/cart/promo', { code });
      set({ cart: response.data.data, loading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid promo code';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ cart: null });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }
}));

export default useCartStore;
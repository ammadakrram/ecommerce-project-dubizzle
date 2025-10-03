import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import CartItems from "../components/cart/CartItems";
import OrderSummary from "../components/cart/OrderSummary";
import NewsletterSection from "../components/common/NewsletterSection";

export default function Cart() {
  const { cart, loading, updateCartItem, removeFromCart, fetchCart, applyPromo } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    fetchCart();
  }, [isAuthenticated, fetchCart, navigate]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleApplyPromo = async (code) => {
    const result = await applyPromo(code);
    return result;
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-white">
        <div className="cart-page-container">
          <nav className="cart-breadcrumb">
            <Link to="/" className="cart-breadcrumb-item">
              Home
            </Link>
            <span className="cart-breadcrumb-separator">›</span>
            <span className="cart-breadcrumb-current">Cart</span>
          </nav>
          <div className="cart-empty">
            <ShoppingCart className="cart-empty-icon" />
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <p className="cart-empty-text">Add some products to get started!</p>
            <Link to="/products" className="cart-empty-button">
              Continue Shopping
            </Link>
          </div>
        </div>
        <NewsletterSection />
      </div>
    );
  }

  const cartItems = cart.items || [];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="cart-page-container">
          <nav className="cart-breadcrumb">
            <Link to="/" className="cart-breadcrumb-item">
              Home
            </Link>
            <span className="cart-breadcrumb-separator">›</span>
            <span className="cart-breadcrumb-current">Cart</span>
          </nav>
          <div className="cart-empty">
            <ShoppingCart className="cart-empty-icon" />
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <p className="cart-empty-text">Add some products to get started!</p>
            <Link to="/products" className="cart-empty-button">
              Continue Shopping
            </Link>
          </div>
        </div>
        <NewsletterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="cart-page-container">
        {/* Breadcrumb */}
        <nav className="cart-breadcrumb">
          <Link to="/" className="cart-breadcrumb-item">
            Home
          </Link>
          <span className="cart-breadcrumb-separator">›</span>
          <span className="cart-breadcrumb-current">Cart</span>
        </nav>

        {/* Page Title */}
        <h1 className="cart-page-title">YOUR CART</h1>

        {/* Cart Layout: Items + Summary */}
        <div className="cart-content-layout">
          {/* Cart Items */}
          <CartItems
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />

          {/* Order Summary */}
          <OrderSummary
            cart={cart}
            onApplyPromo={handleApplyPromo}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}

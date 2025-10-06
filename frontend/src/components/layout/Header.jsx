import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import { Popover } from "antd";
import SearchBar from "../search/SearchBar";
import MobileSearchModal from "../search/MobileSearchModal";

/**
 * ==========================================
 * HEADER COMPONENT
 * ==========================================
 * Main navigation header with:
 * - Top promotional banner
 * - Logo and navigation links
 * - Search bar
 * - Cart and user account icons
 * - Mobile responsive menu
 */
export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Fetch cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm header">
      {/* TOP PROMOTIONAL BANNER */}
      {/* ==================== */}
      {/* {showBanner && (
        <div className="bg-black text-white text-center py-2 px-4 text-xs sm:text-sm relative">
          <p>
            Sign up and get 20% off on your first order.{" "}
            <Link
              to="/auth/signup"
              className="underline font-medium hover:text-gray-300"
            >
              Sign Up Now
            </Link>
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-gray-300"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )} */}

      {/* ==================== */}
      {/* MAIN HEADER */}
      {/* ==================== */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* take up max width*/}
        <div className="flex items-center h-16 justify-around">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-80 transition-opacity"
          >
            SHOP.CO
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:w-1/5 items-center justify-around">
            <Link
              to="/products"
              className="text-gray-700 hover:text-black font-medium transition-colors text-base"
            >
              Shop
            </Link>
            <Link
              to="/products?sort=newest"
              className="text-gray-700 hover:text-black font-medium transition-colors text-base"
            >
              New Arrivals
            </Link>
            <Link
              to="/brands"
              className="text-gray-700 hover:text-black font-medium transition-colors text-base"
            >
              Brands
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <SearchBar className="hidden lg:flex flex-1 max-w-md xl:max-w-lg mx-8 xl:mx-12" />

          {/* Right Side Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <Popover
                content={
                  <div className="py-1 min-w-[160px]">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                }
                trigger="click"
                placement="bottomRight"
              >
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden xl:block text-sm font-medium max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </button>
              </Popover>
            ) : (
              <Link
                to="/auth/login"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ==================== */}
      {/* MOBILE MENU */}
      {/* ==================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="px-4 py-4 space-y-3">
            <Link
              to="/products"
              className="block py-2 text-gray-700 hover:text-black font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/products?sort=newest"
              className="block py-2 text-gray-700 hover:text-black font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              to="/brands"
              className="block py-2 text-gray-700 hover:text-black font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Brands
            </Link>
          </nav>
        </div>
      )}

      {/* Mobile Search Modal */}
      <MobileSearchModal
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </header>
  );
}

import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import useProductStore from "../store/productStore";
import ProductCard from "../components/product/ProductCard";
import NewsletterSection from "../components/common/NewsletterSection";
import FiltersComponent from "../components/filters/FiltersComponent";

export default function ProductListing() {
  const { products, loading, fetchProducts } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("Most Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: 0,
    maxPrice: 300,
    colors: [],
    sizes: [],
    dressStyle: searchParams.get("dressStyle") || "",
  });

  const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];
  const colors = [
    { name: "Green", value: "#22c55e" },
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#eab308" },
    { name: "Orange", value: "#f97316" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
  ];
  const sizes = [
    "XX-Small",
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "XX-Large",
    "3X-Large",
    "4X-Large",
  ];
  const dressStyles = ["Casual", "Formal", "Party", "Gym"];
  const sortOptions = [
    "Most Popular",
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
  ];

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price filter - use discounted price if available, otherwise original price
    const effectivePrice = product.discountPrice || product.price;
    if (
      effectivePrice < filters.minPrice ||
      effectivePrice > filters.maxPrice
    ) {
      return false;
    }

    // Colors filter
    if (filters.colors.length > 0) {
      // Check if product has any of the selected colors
      const hasMatchingColor = filters.colors.some(
        (color) => product.colors?.includes(color) || product.color === color
      );
      if (!hasMatchingColor) {
        return false;
      }
    }

    // Sizes filter
    if (filters.sizes.length > 0) {
      // Check if product has any of the selected sizes
      const hasMatchingSize = filters.sizes.some(
        (size) => product.sizes?.includes(size) || product.size === size
      );
      if (!hasMatchingSize) {
        return false;
      }
    }

    // Dress Style filter
    if (filters.dressStyle && product.dressStyle !== filters.dressStyle) {
      return false;
    }

    return true;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // place window scroll to top useEffect here below
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleColorToggle = (color) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSizeToggle = (size) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // const applyFilters = useCallback(() => {
  //   setShowMobileFilters(false);
  //   setCurrentPage(1); // Reset pagination when applying filters
  //   // Filters are already applied in real-time through filteredProducts
  // }, []);

  const clearAllFilters = () => {
    setFilters({
      category: "",
      minPrice: 50,
      maxPrice: 200,
      colors: [],
      sizes: [],
      dressStyle: "",
    });
  };

  const getCategoryFromUrl = () => {
    return searchParams.get("category") || "Casual";
  };

  return (
    <div className="product-listing-container">
      {/* Main Content */}
      <div className="product-listing-content">
        {/* Sidebar */}
        <div className="product-listing-sidebar">
          <FiltersComponent
            filters={filters}
            onFiltersChange={handleFilterChange}
            // onApplyFilters={applyFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="product-listing-main">
          {/* Results Header */}
          <div className="products-results-header">
            <p>
              Showing {currentProducts.length} of {filteredProducts.length}{" "}
              products
            </p>
            {filteredProducts.length === 0 && (
              <p className="no-results">
                No products match your current filters. Try adjusting your
                selection.
              </p>
            )}
          </div>

          <div className="products-grid">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}

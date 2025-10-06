import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSearchResults } from "../hooks/useSearch";
import { Loader2, Search as SearchIcon } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import NewsletterSection from "../components/common/NewsletterSection";
import FiltersComponent from "../components/filters/FiltersComponent";

/**
 * ==========================================
 * SEARCH RESULTS PAGE
 * ==========================================
 * Displays search results from Elasticsearch with same layout as ProductListing
 * Features:
 * - URL-based search query
 * - Filters sidebar (reusing FiltersComponent)
 * - Product grid with ProductCard components
 * - Loading states, error handling, empty state
 * - Pagination support
 */
export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { results, isLoading, error, pagination, performSearch } =
    useSearchResults();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 300,
    colors: [],
    sizes: [],
    dressStyle: "",
  });

  

  // Perform search when query or filters change
  useEffect(() => {
    if (query) {
      performSearch({
        q: query,
        page: currentPage,
        limit: 9,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        colors: filters.colors.join(","),
        sizes: filters.sizes.join(","),
        dressStyle: filters.dressStyle,
      });
    }
  }, [query, currentPage, filters, performSearch]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // const applyFilters = useCallback(() => {
  //   setCurrentPage(1);
  // }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query, currentPage, filters]);

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
          {/* Search Results Header */}
          <div className="products-results-header">
            {query && (
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                Search Results for "{query}"
              </p>
            )}
            {!isLoading && results.length > 0 && (
              <p>
                Showing {results.length} of {pagination.total} products
              </p>
            )}
            {!isLoading && results.length === 0 && !error && query && (
              <p className="no-results">
                No products found matching "{query}". Try adjusting your search
                or filters.
              </p>
            )}
            {error && (
              <p className="no-results">
                Error loading search results. Please try again.
              </p>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 20px",
                textAlign: "center",
              }}
            >
              <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
              <p style={{ color: "#6b7280", fontSize: "16px" }}>
                Searching products...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && results.length === 0 && query && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                padding: "60px 40px",
                textAlign: "center",
                border: "1px solid #f0f0f0",
                marginTop: "20px",
              }}
            >
              <SearchIcon
                style={{
                  width: "64px",
                  height: "64px",
                  color: "#d1d5db",
                  margin: "0 auto 24px",
                }}
              />
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#1f2937",
                  marginBottom: "12px",
                }}
              >
                No results found
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "24px",
                  fontSize: "16px",
                }}
              >
                We couldn't find any products matching "{query}"
              </p>
              <div
                style={{
                  fontSize: "14px",
                  color: "#9ca3af",
                  marginBottom: "32px",
                }}
              >
                <p style={{ marginBottom: "12px" }}>Suggestions:</p>
                <ul
                  style={{
                    listStyle: "disc",
                    listStylePosition: "inside",
                    lineHeight: "1.8",
                  }}
                >
                  <li>Check your spelling</li>
                  <li>Try more general keywords</li>
                  <li>Try different keywords</li>
                  <li>Adjust your filters</li>
                </ul>
              </div>
              <Link
                to="/products"
                style={{
                  display: "inline-block",
                  backgroundColor: "#1f2937",
                  color: "#ffffff",
                  padding: "14px 32px",
                  borderRadius: "62px",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#374151")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#1f2937")}
              >
                Browse All Products
              </Link>
            </div>
          )}

          {/* Results Grid - Using same grid class as ProductListing */}
          {!isLoading && !error && results.length > 0 && (
            <div className="products-grid">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading &&
            !error &&
            results.length > 0 &&
            pagination.pages > 1 && (
              <div
                style={{
                  marginTop: "48px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontWeight: 500,
                      border:
                        pagination.page === i + 1
                          ? "none"
                          : "1px solid #e5e7eb",
                      backgroundColor:
                        pagination.page === i + 1 ? "#1f2937" : "#ffffff",
                      color: pagination.page === i + 1 ? "#ffffff" : "#6b7280",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      minWidth: "40px",
                    }}
                    onMouseOver={(e) => {
                      if (pagination.page !== i + 1) {
                        e.target.style.backgroundColor = "#f9fafb";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (pagination.page !== i + 1) {
                        e.target.style.backgroundColor = "#ffffff";
                      }
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}

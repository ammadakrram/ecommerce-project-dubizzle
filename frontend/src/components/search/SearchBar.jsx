import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import { useEffect, useRef } from "react";

/**
 * ==========================================
 * SEARCHBAR COMPONENT
 * ==========================================
 * Reusable search bar with autocomplete functionality
 * Features:
 * - Real-time autocomplete suggestions
 * - Debounced API calls
 * - Loading states
 * - Error handling
 * - Click outside to close
 * - Keyboard navigation support
 */
export default function SearchBar({ className = "", placeholder = "Search for products..." }) {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const {
    query,
    setQuery,
    suggestions,
    // isLoadingSuggestions,
    suggestionsError,
    showSuggestions,
    setShowSuggestions,
    clearSearch,
    hideSuggestions,
  } = useSearch(300);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        hideSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideSuggestions]);

  /**
   * Handle search submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      hideSuggestions();
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      inputRef.current?.blur();
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion) => {
    hideSuggestions();
    navigate(`/product/${suggestion.id}`);
    setQuery("");
  };

  /**
   * Handle clear button click
   */
  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  /**
   * Handle input focus
   */
  const handleFocus = () => {
    if (query.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  /**
   * Format price for display
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div ref={searchRef} className={className}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all text-base search-input"
        />

        {/* Clear button or loading spinner */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Clear search"
          >
          <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {showSuggestions && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {isLoadingSuggestions && suggestions.length === 0 ? (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Loading suggestions...
            </div>
          ) : suggestionsError ? (
            <div className="px-4 py-3 text-center text-red-500 text-sm">
              {suggestionsError}
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                >
                  {/* Product Image */}
                  {suggestion.images && suggestion.images.length > 0 ? (
                    <img
                      src={suggestion.images[0]}
                      alt={suggestion.name}
                      className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/48?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.name}
                    </p>
                    {suggestion.price && (
                      <p className="text-sm text-gray-600">
                        {formatPrice(suggestion.price)}
                      </p>
                    )}
                  </div>
                </button>
              ))}

              {/* View all results link */}
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              >
                View all results for "{query}"
              </button>
            </>
          ) : (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

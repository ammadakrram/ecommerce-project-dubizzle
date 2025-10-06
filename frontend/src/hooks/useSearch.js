import { useState, useEffect, useCallback, useRef } from "react";
import { getAutocompleteSuggestions, searchProducts } from "../api/searchApi";

/**
 * Custom hook for search functionality with autocomplete
 * @param {number} debounceDelay - Delay in ms for debouncing autocomplete calls
 * @returns {Object} Search state and functions
 */
export const useSearch = (debounceDelay = 300) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Ref to store the timeout ID for debouncing
  const debounceTimerRef = useRef(null);
  // Ref to track if component is mounted
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Fetch autocomplete suggestions
   */
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    setSuggestionsError(null);

    try {
      const response = await getAutocompleteSuggestions(searchQuery, 5);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setSuggestions(response.data || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Error fetching suggestions:", error);
        setSuggestionsError(error.message || "Failed to fetch suggestions");
        setSuggestions([]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoadingSuggestions(false);
      }
    }
  }, []);

  /**
   * Handle query change with debouncing
   */
  const handleQueryChange = useCallback(
    (newQuery) => {
      setQuery(newQuery);

      // Clear previous timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timeout for debounced autocomplete call
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(newQuery);
      }, debounceDelay);
    },
    [debounceDelay, fetchSuggestions]
  );

  /**
   * Clear search and suggestions
   */
  const clearSearch = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSuggestionsError(null);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  /**
   * Hide suggestions dropdown
   */
  const hideSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, []);

  return {
    query,
    setQuery: handleQueryChange,
    suggestions,
    isLoadingSuggestions,
    suggestionsError,
    showSuggestions,
    setShowSuggestions,
    clearSearch,
    hideSuggestions,
  };
};

/**
 * Custom hook for search results page
 * @returns {Object} Search results state and functions
 */
export const useSearchResults = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 9,
  });

  /**
   * Perform search
   */
  const performSearch = useCallback(async (searchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchProducts(searchParams);

      setResults(response.data || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        limit: searchParams.limit || 9,
      });
    } catch (error) {
      console.error("Error performing search:", error);
      setError(error.message || "Failed to perform search");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear search results
   */
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setPagination({
      page: 1,
      pages: 1,
      total: 0,
      limit: 9,
    });
  }, []);

  return {
    results,
    isLoading,
    error,
    pagination,
    performSearch,
    clearResults,
  };
};

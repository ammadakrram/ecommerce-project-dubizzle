import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Range } from "react-range";
import {
  SlidersHorizontal,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const FiltersComponent = React.memo(({
  filters,
  onFiltersChange,
  className = "",
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    colors: true,
    size: true,
    dressStyle: true,
  });

  // Ref to maintain scroll position
  const filtersRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];

  const colors = [
    { name: "Green", value: "#22c55e", hex: "#22c55e" },
    { name: "Red", value: "#ef4444", hex: "#ef4444" },
    { name: "Yellow", value: "#eab308", hex: "#eab308" },
    { name: "Orange", value: "#f97316", hex: "#f97316" },
    { name: "Cyan", value: "#06b6d4", hex: "#06b6d4" },
    { name: "Blue", value: "#3b82f6", hex: "#3b82f6" },
    { name: "Purple", value: "#a855f7", hex: "#a855f7" },
    { name: "Pink", value: "#ec4899", hex: "#ec4899" },
    { name: "White", value: "#ffffff", hex: "#ffffff" },
    { name: "Black", value: "#000000", hex: "#000000" },
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

  // Preserve scroll position during re-renders
  useLayoutEffect(() => {
    const container = filtersRef.current;
    if (container && scrollPositionRef.current > 0) {
      container.scrollTop = scrollPositionRef.current;
    }
  });

  // Save scroll position before re-renders
  const handleScroll = () => {
    if (filtersRef.current) {
      scrollPositionRef.current = filtersRef.current.scrollTop;
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategorySelect = (category) => {
    onFiltersChange({ ...filters, category });
  };

  const handlePriceChange = (type, value) => {
    onFiltersChange({
      ...filters,
      [type]: parseInt(value),
    });
  };

  const handlePriceRangeChange = (values) => {
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const handleColorToggle = (colorName) => {
    const newColors = filters.colors?.includes(colorName)
      ? filters.colors.filter((c) => c !== colorName)
      : [...(filters.colors || []), colorName];

    onFiltersChange({ ...filters, colors: newColors });
  };

  const handleSizeToggle = (size) => {
    const newSizes = filters.sizes?.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...(filters.sizes || []), size];

    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const handleDressStyleSelect = (style) => {
    onFiltersChange({ ...filters, dressStyle: style });
  };

  return (
    <div
      ref={filtersRef}
      onScroll={handleScroll}
      className={`filters-component ${className}`}
    >
      {/* Header */}
      <div className="filters-header">
        <h3 className="filters-title">Filters</h3>
        <SlidersHorizontal className="filters-icon" />
      </div>

      {/* Categories */}
      <div className="filters-section">
        <div className="filters-category-list">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`filters-category-item ${
                filters.category === category ? "filters-category-active" : ""
              }`}
            >
              <span className="filters-category-name">{category}</span>
              <ChevronRight className="filters-category-arrow" />
            </button>
          ))}
        </div>
      </div>

      <div className="filters-divider"></div>

      {/* Price */}
      <div className="filters-section">
        <button
          onClick={() => toggleSection("price")}
          className="filters-section-header"
        >
          <span className="filters-section-title">Price</span>
          {expandedSections.price ? (
            <ChevronUp className="filters-section-toggle" />
          ) : (
            <ChevronDown className="filters-section-toggle" />
          )}
        </button>

        {expandedSections.price && (
          <div className="filters-price-content">
            <div className="filters-price-range-container">
              <Range
                values={[filters.minPrice || 0, filters.maxPrice || 300]}
                step={5}
                min={0}
                max={500}
                onChange={handlePriceRangeChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      height: "6px",
                      background:
                        "linear-gradient(to right, #e5e7eb 0%, #e5e7eb " +
                        ((filters.minPrice || 0) / 500) * 100 +
                        "%, #1f2937 " +
                        ((filters.minPrice || 0) / 500) * 100 +
                        "%, #1f2937 " +
                        ((filters.maxPrice || 300) / 500) * 100 +
                        "%, #e5e7eb " +
                        ((filters.maxPrice || 300) / 500) * 100 +
                        "%, #e5e7eb 100%)",
                      borderRadius: "3px",
                      width: "100%",
                      alignSelf: "center",
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#1f2937",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0px 2px 6px #AAA",
                      cursor: "pointer",
                      transform: isDragged ? "scale(1.1)" : "scale(1)",
                      transition: "transform 0.2s ease",
                      outline: "none",
                    }}
                  />
                )}
              />
            </div>
            <div className="filters-price-labels">
              <span className="filters-price-label">
                ${filters.minPrice || 0}
              </span>
              <span className="filters-price-label">
                ${filters.maxPrice || 300}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="filters-divider"></div>

      {/* Colors */}
      <div className="filters-section">
        <button
          onClick={() => toggleSection("colors")}
          className="filters-section-header"
        >
          <span className="filters-section-title">Colors</span>
          {expandedSections.colors ? (
            <ChevronUp className="filters-section-toggle" />
          ) : (
            <ChevronDown className="filters-section-toggle" />
          )}
        </button>

        {expandedSections.colors && (
          <div className="filters-colors-grid">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorToggle(color.name)}
                className={`filters-color-swatch ${
                  filters.colors?.includes(color.name)
                    ? "filters-color-selected"
                    : ""
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {color.name === "White" && (
                  <div className="filters-color-white-border"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="filters-divider"></div>

      {/* Size */}
      <div className="filters-section">
        <button
          onClick={() => toggleSection("size")}
          className="filters-section-header"
        >
          <span className="filters-section-title">Size</span>
          {expandedSections.size ? (
            <ChevronUp className="filters-section-toggle" />
          ) : (
            <ChevronDown className="filters-section-toggle" />
          )}
        </button>

        {expandedSections.size && (
          <div className="filters-sizes-grid">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`filters-size-button ${
                  filters.sizes?.includes(size) ? "filters-size-selected" : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="filters-divider"></div>

      {/* Dress Style */}
      <div className="filters-section">
        <button
          onClick={() => toggleSection("dressStyle")}
          className="filters-section-header"
        >
          <span className="filters-section-title">Dress Style</span>
          {expandedSections.dressStyle ? (
            <ChevronUp className="filters-section-toggle" />
          ) : (
            <ChevronDown className="filters-section-toggle" />
          )}
        </button>

        {expandedSections.dressStyle && (
          <div className="filters-dress-style-list">
            {dressStyles.map((style) => (
              <button
                key={style}
                onClick={() => handleDressStyleSelect(style)}
                className={`filters-dress-style-item ${
                  filters.dressStyle === style
                    ? "filters-dress-style-active"
                    : ""
                }`}
              >
                <span className="filters-dress-style-name">{style}</span>
                <ChevronRight className="filters-dress-style-arrow" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button */}
      {/* <div className="filters-footer">
        <button onClick={onApplyFilters} className="filters-apply-button">
          Apply Filter
        </button>
      </div> */}
    </div>
  );
});

FiltersComponent.displayName = 'FiltersComponent';

export default FiltersComponent;

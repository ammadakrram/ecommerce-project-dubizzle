import { Star, Minus, Plus } from "lucide-react";

export default function ProductInfo({
  product,
  selectedColor,
  selectedSize,
  quantity,
  onColorSelect,
  onSizeSelect,
  onQuantityChange,
  onAddToCart,
  cartLoading,
}) {
  const rating = product.averageRating || product.rating || 4.5;
  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const colors = product.colors || [];
  const sizes = product.sizes || ["Small", "Medium", "Large", "X-Large"];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          className="product-rating-star product-rating-star-filled"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="product-rating-star-half">
          <Star className="product-rating-star product-rating-star-empty" />
          <div className="product-rating-star-half-inner">
            <Star className="product-rating-star product-rating-star-filled" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="product-rating-star product-rating-star-empty"
        />
      );
    }

    return stars;
  };

  return (
    <div className="product-info-container">
      {/* Product Title */}
      <h1 className="product-title">
        {product.name || product.title || "Product Name"}
      </h1>

      {/* Rating */}
      <div className="product-rating-container">
        <div className="product-rating-stars">{renderStars(rating)}</div>
        <span className="product-rating-text">
          {rating}/5 ({product.reviewCount || 450})
        </span>
      </div>

      {/* Price */}
      <div className="product-price-container">
        <span className="product-price-current">Pkr. {displayPrice}</span>
        {originalPrice && (
          <>
            <span className="product-price-original">Pkr. {originalPrice}</span>
            <span className="product-discount-badge">-{discountPercent}%</span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="product-description">
        {product.description ||
          "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style."}
      </p>

      {/* Colors */}
      <div className="product-colors-container">
        <p className="product-colors-label">Colors Available:</p>
        <div className="product-colors-grid">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => onColorSelect(color)}
              className={`product-color-swatch ${
                selectedColor === color ? "product-color-swatch-active" : ""
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="product-sizes-container">
        <p className="product-sizes-label">Choose Size:</p>
        <div className="product-sizes-grid">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={`product-size-button ${
                selectedSize === size ? "product-size-button-active" : ""
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="product-controls-container">
        {/* Quantity Selector */}
        <div className="product-quantity-container">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="product-quantity-button product-quantity-button-left"
            disabled={quantity <= 1}
          >
            <Minus className="product-rating-star" />
          </button>
          <span className="product-quantity-display">{quantity}</span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="product-quantity-button product-quantity-button-right"
          >
            <Plus className="product-rating-star" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={onAddToCart}
          disabled={cartLoading}
          className="product-add-to-cart-button"
        >
          {cartLoading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

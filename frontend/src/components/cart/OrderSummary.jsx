import { useState } from "react";
import { Tag, ArrowRight } from "lucide-react";

export default function OrderSummary({ cart, onApplyPromo, onCheckout }) {
  const [promoCode, setPromoCode] = useState("");

  const items = cart?.items || [];

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  // Get discount percentage
  const discountPercent = parseFloat(cart?.discountPercentage) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;

  // Get delivery fee
  const deliveryFee = parseFloat(cart?.deliveryFee) || (subtotal > 0 ? 15 : 0);

  // Calculate total
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    await onApplyPromo(promoCode);
  };

  return (
    <div className="order-summary-card">
      <h2 className="order-summary-title">Order Summary</h2>

      <div className="order-summary-content">
        {/* Subtotal */}
        <div className="order-summary-row">
          <span className="order-summary-label">Subtotal</span>
          <span className="order-summary-value">Pkr. {subtotal.toFixed(0)}</span>
        </div>

        {/* Discount */}
        <div className="order-summary-row">
          <span className="order-summary-label">
            Discount (-{discountPercent}%)
          </span>
          <span className="order-summary-value order-summary-discount">
            -Pkr. {discountAmount.toFixed(0)}
          </span>
        </div>

        {/* Delivery Fee */}
        <div className="order-summary-row">
          <span className="order-summary-label">Delivery Fee</span>
          <span className="order-summary-value">Pkr. {deliveryFee.toFixed(0)}</span>
        </div>

        {/* Divider */}
        <div className="order-summary-divider"></div>

        {/* Total */}
        <div className="order-summary-row order-summary-total-row">
          <span className="order-summary-total-label">Total</span>
          <span className="order-summary-total-value">Pkr. {total.toFixed(0)}</span>
        </div>

        {/* Promo Code Input */}
        <div className="order-promo-section">
          <div className="order-promo-input-wrapper">
            <Tag className="order-promo-icon" size={20} />
            <input
              type="text"
              placeholder="Add promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="order-promo-input"
            />
          </div>
          <button
            onClick={handleApplyPromo}
            className="order-promo-btn"
            disabled={!promoCode.trim()}
          >
            Apply
          </button>
        </div>

        {/* Checkout Button */}
        <button onClick={onCheckout} className="order-checkout-btn">
          Go to Checkout
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

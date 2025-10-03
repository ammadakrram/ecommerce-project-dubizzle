import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItems({ items, onUpdateQuantity, onRemoveItem }) {
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      onRemoveItem(itemId);
    } else {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="cart-items-container">
      {items.map((item) => (
        <div key={item.id} className="cart-item-card">
          {/* Product Image */}
          <div className="cart-item-img">
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.name}
            />
          </div>

          {/* Product Details */}
          <div className="cart-item-info">
            <div className="cart-item-top">
              <h3 className="cart-item-title">{item.name}</h3>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="cart-item-delete"
                aria-label="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <p className="cart-item-attribute">
              Size: <span>{item.size}</span>
            </p>
            <p className="cart-item-attribute">
              Color: <span>{item.color}</span>
            </p>

            <div className="cart-item-bottom">
              <p className="cart-item-price">${parseFloat(item.price).toFixed(0)}</p>

              <div className="cart-item-qty-controls">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  className="cart-qty-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="cart-qty-display">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  className="cart-qty-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  // Calculate discount percentage
  const discountPercent = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : 0;

  // Get display price
  const displayPrice = product.discountPrice || product.price;

  // Get average rating
  const rating = product.averageRating || product.rating || 0;

  // Ensure we have a fallback image
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder-product.jpg";

  return (
    <Link to={`/products/${product.id || product._id}`} className="group block">
      <div className="bg-gray-50 rounded-lg overflow-hidden mb-3 aspect-square">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/placeholder-product.jpg";
          }}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-sm sm:text-base leading-tight group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {Number(rating).toFixed(1)}/5
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-lg sm:text-xl">${displayPrice}</span>
          {product.discountPrice && (
            <>
              <span className="text-gray-400 line-through text-sm sm:text-base">
                ${product.price}
              </span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

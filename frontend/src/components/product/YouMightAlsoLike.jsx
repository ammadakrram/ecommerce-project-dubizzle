import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const YouMightAlsoLike = ({ currentProduct }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!currentProduct?.category) return;

        const response = await fetch(
          `http://localhost:8000/api/products?category=${currentProduct.category}&limit=8`
        );

        if (response.ok) {
          const data = await response.json();
          // Filter out current product and take first 4 different products
          const filtered = data.products
            .filter((product) => product.id !== currentProduct.id)
            .slice(0, 4);

          setRecommendations(filtered);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProduct]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="recommendation-star recommendation-star-filled"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="recommendation-star recommendation-star-half"
        />
      );
    }

    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="recommendation-star recommendation-star-empty"
        />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <section className="recommendations-section">
        <div className="recommendations-container">
          <h2 className="recommendations-heading">YOU MIGHT ALSO LIKE</h2>
          <div className="recommendations-grid">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="recommendation-card-skeleton">
                <div className="recommendation-image-skeleton"></div>
                <div className="recommendation-content-skeleton">
                  <div className="recommendation-title-skeleton"></div>
                  <div className="recommendation-rating-skeleton"></div>
                  <div className="recommendation-price-skeleton"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="recommendations-section">
      <div className="recommendations-container">
        <h2 className="recommendations-heading">YOU MIGHT ALSO LIKE</h2>
        <div className="recommendations-grid">
          {recommendations.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="recommendation-card"
            >
              <div className="recommendation-image-container">
                <img
                  src={product.images?.[0] || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="recommendation-image"
                />
              </div>

              <div className="recommendation-content">
                <h3 className="recommendation-title">{product.name}</h3>

                <div className="recommendation-rating">
                  <div className="recommendation-stars">
                    {renderStars(product.rating || 0)}
                  </div>
                  <span className="recommendation-rating-count">
                    {product.rating || 0}
                  </span>
                </div>

                <div className="recommendation-pricing">
                  <span className="recommendation-current-price">
                    ${product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <>
                      <span className="recommendation-original-price">
                        ${product.price}
                      </span>
                      <span className="recommendation-discount">
                        -{product.discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouMightAlsoLike;

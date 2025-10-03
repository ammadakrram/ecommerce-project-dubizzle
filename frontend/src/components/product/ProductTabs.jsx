import { useState } from "react";
import { Star, ChevronDown, MoreHorizontal } from "lucide-react";

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("reviews");

  const reviews = [
    {
      id: 1,
      name: "Samantha D.",
      verified: true,
      rating: 5,
      date: "August 14, 2023",
      comment:
        "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
    },
    {
      id: 2,
      name: "Alex M.",
      verified: true,
      rating: 4,
      date: "August 15, 2023",
      comment:
        "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
    },
    {
      id: 3,
      name: "Ethan R.",
      verified: true,
      rating: 4,
      date: "August 16, 2023",
      comment:
        "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
    },
    {
      id: 4,
      name: "Olivia P.",
      verified: true,
      rating: 4,
      date: "August 17, 2023",
      comment:
        "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.",
    },
    {
      id: 5,
      name: "Liam K.",
      verified: true,
      rating: 5,
      date: "August 18, 2023",
      comment:
        "This t-shirt is a fusion of comfort and creativity. The fabric is soft and the design speaks volumes about the designer's skill. I'm like wearing a piece of art that reflects my passion for both design and fashion.",
    },
    {
      id: 6,
      name: "Ava H.",
      verified: true,
      rating: 4.5,
      date: "August 19, 2023",
      comment:
        "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "What is the fit like?",
      answer:
        "Our t-shirts have a relaxed, comfortable fit. They're true to size, but if you prefer a looser fit, we recommend sizing up.",
    },
    {
      id: 2,
      question: "What material is this made from?",
      answer:
        "This t-shirt is made from 100% premium cotton that's soft, breathable, and durable. It's pre-shrunk to minimize shrinking after washing.",
    },
    {
      id: 3,
      question: "How should I care for this item?",
      answer:
        "Machine wash cold with like colors. Do not bleach. Tumble dry low. Iron on low heat if needed. This will help maintain the quality and design.",
    },
    {
      id: 4,
      question: "Is this design screen printed or embroidered?",
      answer:
        "The design is screen printed using high-quality, fade-resistant inks that maintain their vibrancy wash after wash.",
    },
    {
      id: 5,
      question: "What if I'm not satisfied with my purchase?",
      answer:
        "We offer a 30-day return policy. If you're not completely satisfied, you can return the item in its original condition for a full refund.",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="product-tabs-star product-tabs-star-filled" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="product-tabs-star-half">
          <Star className="product-tabs-star product-tabs-star-empty" />
          <div className="product-tabs-star-half-inner">
            <Star className="product-tabs-star product-tabs-star-filled" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="product-tabs-star product-tabs-star-empty"
        />
      );
    }

    return stars;
  };

  return (
    <div className="product-tabs-container">
      {/* Tab Navigation */}
      <div className="product-tabs-nav">
        <button
          onClick={() => setActiveTab("details")}
          className={`product-tab-button ${
            activeTab === "details" ? "product-tab-button-active" : ""
          }`}
        >
          Product Details
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`product-tab-button ${
            activeTab === "reviews" ? "product-tab-button-active" : ""
          }`}
        >
          Rating & Reviews
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`product-tab-button ${
            activeTab === "faqs" ? "product-tab-button-active" : ""
          }`}
        >
          FAQs
        </button>
      </div>

      {/* Tab Content */}
      <div className="product-tabs-content">
        {activeTab === "details" && (
          <div className="product-tab-panel">
            <div className="product-details-content">
              <h3 className="product-details-heading">Product Information</h3>
              <div className="product-details-grid">
                <div className="product-detail-item">
                  <span className="product-detail-label">Material:</span>
                  <span className="product-detail-value">
                    100% Premium Cotton
                  </span>
                </div>
                <div className="product-detail-item">
                  <span className="product-detail-label">Fit:</span>
                  <span className="product-detail-value">Relaxed Fit</span>
                </div>
                <div className="product-detail-item">
                  <span className="product-detail-label">Care:</span>
                  <span className="product-detail-value">
                    Machine wash cold, tumble dry low
                  </span>
                </div>
                <div className="product-detail-item">
                  <span className="product-detail-label">Origin:</span>
                  <span className="product-detail-value">Made in USA</span>
                </div>
              </div>
              <div className="product-details-description">
                <h4 className="product-details-subheading">Description</h4>
                <p className="product-details-text">
                  {product.description ||
                    "This graphic t-shirt is perfect for any occasion. Crafted from soft and breathable fabric, it offers superior comfort and style. The unique design makes it a standout piece that's both trendy and timeless. Whether you're heading to a casual meetup or just lounging at home, this t-shirt ensures you look great while feeling comfortable."}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="product-tab-panel">
            <div className="product-reviews-header">
              <h3 className="product-reviews-title">All Reviews (451)</h3>
              <div className="product-reviews-controls">
                <div className="product-reviews-filter">
                  <span className="product-reviews-filter-icon">⚙️</span>
                </div>
                <div className="product-reviews-sort">
                  <span className="product-reviews-sort-text">Latest</span>
                  <ChevronDown className="product-reviews-sort-icon" />
                </div>
                <button className="product-reviews-write-btn">
                  Write a Review
                </button>
              </div>
            </div>

            <div className="product-reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="product-review-card">
                  <div className="product-review-header">
                    <div className="product-review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <button className="product-review-menu">
                      <MoreHorizontal className="product-review-menu-icon" />
                    </button>
                  </div>
                  <div className="product-review-author">
                    <span className="product-review-name">{review.name}</span>
                    {review.verified && (
                      <span className="product-review-verified">✓</span>
                    )}
                  </div>
                  <p className="product-review-text">{review.comment}</p>
                  <div className="product-review-date">
                    Posted on {review.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="product-tab-panel">
            <h3 className="product-faqs-heading">Frequently Asked Questions</h3>
            <div className="product-faqs-list">
              {faqs.map((faq) => (
                <div key={faq.id} className="product-faq-item">
                  <h4 className="product-faq-question">{faq.question}</h4>
                  <p className="product-faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

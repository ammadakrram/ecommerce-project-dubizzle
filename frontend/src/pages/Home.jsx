import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useProductStore from "../store/productStore";
import ProductCard from "../components/product/ProductCard";
import NewsletterSection from "../components/common/NewsletterSection";

export default function Home() {
  const { products, loading, fetchProducts } = useProductStore();
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products.length > 0) {
      // Get 4 most recent products for new arrivals
      const recent = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
      setNewArrivals(recent);

      // Get 4 highest rated products for top selling
      const topRated = [...products]
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 4);
      setTopSelling(topRated);
    }
  }, [products]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      verified: true,
      rating: 5,
      comment:
        "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
      id: 2,
      name: "Alex K.",
      verified: true,
      rating: 5,
      comment:
        "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    },
    {
      id: 3,
      name: "James L.",
      verified: true,
      rating: 5,
      comment:
        "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ==================== */}
      {/* HERO SECTION */}
      {/* ==================== */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
        {/* Full-width background image */}
        <div className="absolute inset-0">
          <img
            src="/hero-img-ecommerce.png"
            alt="Fashion models showcasing clothing"
            className="w-full h-full object-cover object-center"
          />
          {/* Optional overlay for better text readability */}
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Decorative stars */}
        <div className="absolute top-10 right-20 z-10">
          <img
            src="/star.png"
            alt="Decorative star"
            className="w-8 h-8 lg:w-20 lg:h-20"
          />
        </div>
        <div className="absolute top-1/3 left-1/2 z-10 opacity-60">
          <img
            src="/star.png"
            alt="Decorative star"
            className="w-7 h-7 lg:w-10 lg:h-10"
          />
        </div>

        {/* Overlay content */}
        <div className="relative z-20 flex items-center min-h-[600px] lg:min-h-[700px]">
          <div className="container mx-auto px-40 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl ml-0 sm:ml-4 lg:ml-12 hero-text">
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-gray-900">
                    FIND CLOTHES
                    <br />
                    THAT MATCHES
                    <br />
                    YOUR STYLE
                  </h1>
                  <p className="text-gray-700 text-base sm:text-lg lg:text-xl max-w-3xl">
                    Browse through our diverse range of meticulously crafted
                    garments, designed to bring out your individuality and cater
                    to your sense of style.
                  </p>
                </div>

                <Link
                  to="/products"
                  className="inline-block bg-black text-white px-16 py-4 rounded-[50px] font-medium hover:bg-gray-900 transition-all duration-300 text-base sm:text-lg shop-now-btn"
                >
                  Shop Now
                </Link>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-6 lg:pt-8">
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      200+
                    </div>
                    <div className="text-gray-700 text-sm">Verified Brands</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      2,000+
                    </div>
                    <div className="text-gray-700 text-sm">
                      High-Quality Products
                    </div>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      30,000+
                    </div>
                    <div className="text-gray-700 text-sm">Happy Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* BRAND LOGOS */}
      {/* ==================== */}
      <section className="py-8 sm:py-12 bg-black">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex logo-bar w-full">
            <div className="flex items-center justify-center">
              <img
                src="/versache-logo.png"
                alt="Versace"
                className="h-8 sm:h-10 lg:h-12 w-auto object-contain filter brightness-0 invert"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/zara-logo.png"
                alt="Zara"
                className="h-8 sm:h-10 lg:h-12 w-auto object-contain filter brightness-0 invert"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/gucci-logo.png"
                alt="Gucci"
                className="h-8 sm:h-10 lg:h-12 w-auto object-contain filter brightness-0 invert"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/prada-logo.png"
                alt="Prada"
                className="h-8 sm:h-10 lg:h-12 w-auto object-contain filter brightness-0 invert"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/ck-logo.png"
                alt="Calvin Klein"
                className="h-8 sm:h-10 lg:h-12 w-auto object-contain filter brightness-0 invert"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* NEW ARRIVALS */}
      {/* ==================== */}
      <section className="new-arrivals-section">
        <div className="new-arrivals-container">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center new-arrivals-heading">
            NEW ARRIVALS
          </h2>

          {loading ? (
            <div className="new-arrivals-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="new-arrivals-grid">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 lg:mt-12">
            <Link
              to="/products"
              className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* TOP SELLING */}
      {/* ==================== */}
      <section className="top-selling-section bg-gray-50">
        <div className="top-selling-container">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center top-selling-heading">
            TOP SELLING
          </h2>

          {loading ? (
            <div className="top-selling-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="top-selling-grid">
              {topSelling.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 lg:mt-12">
            <Link
              to="/products"
              className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* BROWSE BY DRESS STYLE */}
      {/* ==================== */}
      <section className="browse-style-section">
        <div className="browse-style-container">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center browse-style-heading">
            BROWSE BY DRESS STYLE
          </h2>

          <div className="browse-style-grid">
            <Link
              to="/products?dressStyle=Casual"
              className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square sm:aspect-[4/3] hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  {/* <div className="text-6xl mb-4">👔</div> */}
                  <img src='/casual.webp'></img>
                  {/* <h3 className="text-2xl sm:text-3xl font-bold">Casual</h3> */}
                </div>
              </div>
            </Link>

            <Link
              to="/products?dressStyle=Formal"
              className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square sm:aspect-[4/3] hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  {/* <div className="text-6xl mb-4">🤵</div> */}
                  <img src="/formal.webp" alt="" />
                  {/* <h3 className="text-2xl sm:text-3xl font-bold">Formal</h3> */}
                </div>
              </div>
            </Link>

            <Link
              to="/products?dressStyle=Party"
              className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square sm:aspect-[4/3] hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-200"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  {/* <div className="text-6xl mb-4">💃</div> */}
                  <img src="/party.jpg" alt="" />
                  {/* <h3 className="text-2xl sm:text-3xl font-bold">Party</h3> */}
                </div>
              </div>
            </Link>

            <Link
              to="/products?dressStyle=Gym"
              className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square sm:aspect-[4/3] hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  {/* <div className="text-6xl mb-4">💪</div> */}
                  <img src="/gym.webp" alt="" />
                  {/* <h3 className="text-2xl sm:text-3xl font-bold">Gym</h3> */}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* CUSTOMER TESTIMONIALS */}
      {/* ==================== */}
      <section className="customer-testimonials-section bg-gray-50">
        <div className="customer-testimonials-container">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center customer-testimonials-heading">
            OUR HAPPY CUSTOMERS
          </h2>

          <div className="customer-testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-box">
                <div className="flex items-center mb-4">
                  <div className="testimonial-stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold">{testimonial.name}</span>
                  {testimonial.verified && (
                    <span className="text-green-600 text-sm">✓</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* NEWSLETTER SECTION */}
      {/* ==================== */}
      <NewsletterSection />
    </div>
  );
}

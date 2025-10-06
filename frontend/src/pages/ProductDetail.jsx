import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Star } from "lucide-react";
import useProductStore from "../store/productStore";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import ProductCard from "../components/product/ProductCard";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductTabs from "../components/product/ProductTabs";
import YouMightAlsoLike from "../components/product/YouMightAlsoLike";
import NewsletterSection from "../components/common/NewsletterSection";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    products,
    product: storeProduct,
    loading,
    fetchProducts,
    fetchProduct,
  } = useProductStore();
  const { addToCart, loading: cartLoading } = useCartStore();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Try to fetch specific product by ID first
        await fetchProduct(id);
      } catch (error) {
        console.error("Failed to load product:", error);
        // Fallback to finding in products array
        await fetchProducts();
      }
    };

    loadProduct();
  }, [id, fetchProduct, fetchProducts]);

  useEffect(() => {
    // Update local product when store product changes
    if (storeProduct) {
      setProduct(storeProduct);
    } else if (products.length > 0) {
      // Fallback to finding in products array
      const found = products.find((p) => p.id === id || p._id === id);
      setProduct(found);
    }
  }, [storeProduct, products, id]);

  useEffect(() => {
    if (product && products.length > 0) {
      // Get related products from same category or similar
      const related = products
        .filter(
          (p) =>
            p.id !== product.id &&
            p._id !== product._id &&
            (p.category === product.category || p.brand === product.brand)
        )
        .slice(0, 4);
      setRelatedProducts(related);

      // Set default color and size
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, products]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (!selectedColor || !selectedSize) {
      alert("Please select color and size");
      return;
    }

    try {
      await addToCart({
        productId: product.id || product._id,
        quantity,
        color: selectedColor,
        size: selectedSize,
        price: product.discountPrice || product.price,
      });
      // Optional: Show success message
      alert("Product added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // const reviews = [
  //   {
  //     id: 1,
  //     name: "Samantha D.",
  //     verified: true,
  //     rating: 5,
  //     date: "August 14, 2023",
  //     comment:
  //       "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
  //   },
  //   {
  //     id: 2,
  //     name: "Alex M.",
  //     verified: true,
  //     rating: 4,
  //     date: "August 15, 2023",
  //     comment:
  //       "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
  //   },
  //   {
  //     id: 3,
  //     name: "Ethan R.",
  //     verified: true,
  //     rating: 4,
  //     date: "August 16, 2023",
  //     comment:
  //       "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
  //   },
  //   {
  //     id: 4,
  //     name: "Olivia P.",
  //     verified: true,
  //     rating: 5,
  //     date: "August 17, 2023",
  //     comment:
  //       "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.",
  //   },
  // ];

  const images = product.images || ["/placeholder-product.jpg"];
  const rating = product.averageRating || product.rating || 4.5;
  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <nav className="product-breadcrumb">
        <div className="product-breadcrumb-nav">
          <Link to="/" className="product-breadcrumb-link">
            Home
          </Link>
          <span className="product-breadcrumb-separator">{">"}</span>
          <Link to="/products" className="product-breadcrumb-link">
            Shop
          </Link>
          <span className="product-breadcrumb-separator">{">"}</span>
          <Link
            to={`/products?category=${product.category || "men"}`}
            className="product-breadcrumb-link"
          >
            {product.category || "Men"}
          </Link>
          <span className="product-breadcrumb-separator">{">"}</span>
          <span className="product-breadcrumb-current">
            {product.subcategory || "item"}
          </span>
        </div>
      </nav>

      {/* Main Product Section */}
      <div className="product-detail-container">
        <div className="product-detail-content">
          {/* Product Images */}
          <ProductImageGallery
            images={images}
            selectedImageIndex={selectedImageIndex}
            onImageSelect={setSelectedImageIndex}
          />

          {/* Product Information */}
          <ProductInfo
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            quantity={quantity}
            onColorSelect={setSelectedColor}
            onSizeSelect={setSelectedSize}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            cartLoading={cartLoading}
          />
        </div>
      </div>

      {/* Product Tabs Section */}
      <ProductTabs product={product} />

      {/* You Might Also Like Section */}
      <YouMightAlsoLike currentProduct={product} />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}

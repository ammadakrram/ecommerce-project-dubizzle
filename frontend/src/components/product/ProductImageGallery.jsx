export default function ProductImageGallery({
  images,
  selectedImageIndex,
  onImageSelect,
}) {
  return (
    <div className="product-image-gallery">
      {/* Thumbnail Images */}
      <div className="product-thumbnail-container">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`product-thumbnail ${
              selectedImageIndex === index ? "product-thumbnail-active" : ""
            }`}
          >
            <img
              src={image}
              alt={`Product view ${index + 1}`}
              className="product-thumbnail-image"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="product-main-image-container">
        <img
          src={images[selectedImageIndex]}
          alt="Selected product view"
          className="product-main-image"
        />
      </div>
    </div>
  );
}

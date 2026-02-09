import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/layout/Navbar";
import { getImageUrl } from "@/utils/helpers";
import {
  fetchProductById,
  clearSelectedProduct,
} from "@/features/products/productSlice";
import { addProductToCart } from "@/features/cart/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [notification, setNotification] = useState(null);

  const { selectedProduct: product, loading, error } = useSelector(
    (state) => state.products
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading: cartLoading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(addProductToCart({ productId: id, quantity })).unwrap();
      setNotification({
        type: "success",
        message: `${quantity} item(s) added to cart!`,
      });
      setQuantity(1);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: err || "Failed to add to cart",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(addProductToCart({ productId: id, quantity })).unwrap();
      navigate("/cart");
    } catch (err) {
      setNotification({
        type: "error",
        message: err || "Failed to add to cart",
      });
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(
      1,
      Math.min(value, product?.stock || 1)
    );
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-400 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-6 text-red-400 text-center">
            <p className="text-lg mb-4">{error || "Product not found"}</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#D4AF37] text-black px-6 py-2 rounded font-semibold hover:bg-[#e5c158] transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 px-6 py-3 rounded-lg z-50 animate-pulse ${
            notification.type === "success"
              ? "bg-green-500"
              : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate("/products")}
          className="text-[#D4AF37] hover:text-white mb-6 transition-colors"
        >
          ← Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] h-96 flex items-center justify-center overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={getImageUrl(product.images[currentImageIndex])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-gray-500">No Image Available</p>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                      currentImageIndex === index
                        ? "border-[#D4AF37]"
                        : "border-[#374151] hover:border-[#D4AF37]"
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category Badge */}
            <p className="text-[#D4AF37] text-sm font-semibold mb-2">
              {product.category?.name || "Uncategorized"}
            </p>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>

            {/* Rating Placeholder */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-gray-400 text-sm">(42 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-5xl font-bold text-[#D4AF37] mb-2">
                ₹{product.price?.toLocaleString() || 0}
              </p>
              <p className="text-gray-400">
                {product.stock > 0 ? (
                  <span className="text-green-500 font-semibold">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Out of Stock
                  </span>
                )}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded p-4 border border-[#374151]">
                <p className="text-gray-400 text-sm">Stock</p>
                <p className="text-2xl font-bold text-[#D4AF37]">
                  {product.stock}
                </p>
              </div>
              <div className="bg-[#1a1a1a] rounded p-4 border border-[#374151]">
                <p className="text-gray-400 text-sm">SKU</p>
                <p className="text-sm font-mono text-white">
                  {product._id?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="bg-[#1a1a1a] border border-[#374151] rounded px-3 py-2 text-[#D4AF37] font-bold hover:bg-[#2a2a2a] transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    min="1"
                    max={product.stock}
                    className="w-16 px-3 py-2 bg-[#1a1a1a] border border-[#374151] rounded text-center text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="bg-[#1a1a1a] border border-[#374151] rounded px-3 py-2 text-[#D4AF37] font-bold hover:bg-[#2a2a2a] transition-colors"
                  >
                    +
                  </button>
                  <p className="text-gray-400 text-sm ml-auto">
                    {quantity} of {product.stock}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {product.stock > 0 ? (
              <div className="flex gap-4">
                <button
                  onClick={handleBuyNow}
                  disabled={cartLoading}
                  className="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-[#e5c158] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cartLoading ? "Processing..." : "Buy Now"}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="flex-1 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-bold py-3 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cartLoading ? "Processing..." : "Add to Cart"}
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-gray-600 text-gray-300 font-bold py-3 rounded-lg cursor-not-allowed opacity-50"
              >
                Out of Stock
              </button>
            )}

            {!isAuthenticated && (
              <p className="text-gray-400 text-sm text-center mt-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#D4AF37] hover:underline"
                >
                  Log in
                </button>
                {" "}to purchase
              </p>
            )}
          </div>
        </div>

        {/* Additional Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#374151] pt-12">
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#374151]">
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
              ✓ Shipping Information
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Free shipping on orders over ₹500. Standard delivery within 3-5 business days.
              Express delivery available at checkout.
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#374151]">
            <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
              ✓ Return Policy
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              30-day easy returns. No questions asked return policy for unused items.
              We'll refund your money within 5-7 business days.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-center py-6 mt-16 border-t border-[#374151]">
        © {new Date().getFullYear()} Fashion Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default ProductDetails;
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../features/products/productSlice";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allProducts, loading } = useSelector((state) => state.products);
  const container = useRef();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Animate Hero Section
      tl.from(".hero-content > *", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
      })
        // Animate Product Cards with a slight scale up
        .from(
          ".product-card",
          {
            scale: 0.9,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
          },
          "-=0.5"
        );
    },
    { scope: container }
  );

  const featuredProducts = allProducts.slice(0, 6);

  return (
    <div ref={container} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-content text-center py-16 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#0F0F0F]">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37]">
          Premium Fashion. Timeless Style.
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-300">
          Discover luxury fashion crafted for elegance and confidence.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/products")}
            className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#e5c158] transition-colors"
          >
            Shop Now
          </button>
        </div>
        {!isAuthenticated && (
          <div className="mt-6">
            <p className="text-gray-400">
              Login to explore personalized collections
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-3 border-2 border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-10">
          Featured Products
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-400 text-lg">Loading products...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredProducts.map((product, idx) => (
              <div
                key={product._id || `product-${idx}`}
                onClick={() => navigate(`/product/${product._id}`)}
                className="product-card bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#374151] hover:border-[#D4AF37] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#D4AF37]/20"
              >
                <div className="relative bg-[#2a2a2a] h-48 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <p className="text-sm">No Image</p>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-xs font-bold">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#D4AF37] mb-2">
                    {product.category?.name || "Uncategorized"}
                  </p>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-[#D4AF37]">
                      ₹{product.price?.toLocaleString() || 0}
                    </p>
                    {isAuthenticated && product.stock > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product._id}`);
                        }}
                        className="bg-[#D4AF37] text-black px-3 py-2 rounded font-semibold text-sm hover:bg-[#e5c158] transition-colors"
                      >
                        Quick Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No products available</p>
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/products")}
            className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-lg font-bold hover:bg-[#D4AF37] hover:text-black transition-colors"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-[#1a1a1a] py-16 px-4 border-t border-b border-[#374151]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#D4AF37] mb-10 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Men's Fashion", icon: "👔" },
              { name: "Women's Fashion", icon: "👗" },
              { name: "Accessories", icon: "👜" },
            ].map((cat, idx) => (
              <div
                key={`cat-${idx}`}
                onClick={() => navigate("/products")}
                className="bg-[#0F0F0F] p-8 rounded-lg border border-[#374151] hover:border-[#D4AF37] transition-colors cursor-pointer text-center hover:shadow-lg hover:shadow-[#D4AF37]/20"
              >
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹500" },
            {
              icon: "🔒",
              title: "Secure Payment",
              desc: "100% secure transactions",
            },
            {
              icon: "↩️",
              title: "Easy Returns",
              desc: "30 day return policy",
            },
          ].map((feature, idx) => (
            <div
              key={`feature-${idx}`}
              className="bg-[#1a1a1a] p-6 rounded-lg border border-[#374151] text-center hover:border-[#D4AF37] transition-colors"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-center py-6 mt-16 border-t border-[#374151]">
        © {new Date().getFullYear()} Fashion Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  fetchAllProducts,
  setSearchFilter,
  setCategoryFilter,
  setPriceFilter,
  resetFilters,
  selectFilteredProducts,
} from "../features/products/productSlice";

const ProductBrowse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { allProducts, filters, loading, error } = useSelector(
    (state) => state.products
  );
  const filteredProducts = useSelector(selectFilteredProducts);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const categories = Array.from(
    new Set(
      allProducts
        .filter((p) => p.category)
        .map((p) => JSON.stringify({ _id: p.category._id, name: p.category.name }))
    )
  ).map((c) => JSON.parse(c));

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    dispatch(setSearchFilter(value));
  };

  const handleCategoryChange = (categoryId) => {
    dispatch(setCategoryFilter(categoryId));
  };

  const handlePriceChange = (min, max) => {
    dispatch(setPriceFilter({ minPrice: min, maxPrice: max }));
  };

  const handleResetFilters = () => {
    setLocalSearch("");
    dispatch(resetFilters());
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-8">Our Collection</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#374151] sticky top-20">
              <h2 className="text-xl font-bold text-[#D4AF37] mb-4">Filters</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={localSearch}
                  onChange={handleSearch}
                  className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#374151] rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F0F0F] border border-[#374151] rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories && categories.length > 0 && categories.map((cat, idx) => (
                    <option key={cat._id || `cat-${idx}`} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-400">Min: ₹{filters.minPrice}</label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handlePriceChange(
                          parseInt(e.target.value),
                          filters.maxPrice
                        )
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Max: ₹{filters.maxPrice}</label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handlePriceChange(
                          filters.minPrice,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetFilters}
                className="w-full py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#e5c158] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-300">
                Showing {sortedProducts.length} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-[#1a1a1a] border border-[#374151] rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {loading && (
              <div className="flex justify-center items-center h-96">
                <div className="text-gray-400 text-lg">Loading products...</div>
              </div>
            )}

            {error && (
              <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 text-red-400 mb-6">
                {error}
              </div>
            )}

            {!loading && sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts && sortedProducts.length > 0 && sortedProducts.map((product, idx) => (
                  <div
                    key={product._id || `product-${idx}`}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#374151] hover:border-[#D4AF37] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#D4AF37]/20"
                  >
                    <div className="relative bg-[#2a2a2a] h-48 flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-gray-500 text-sm">No Image</div>
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
                          <button className="bg-[#D4AF37] text-black px-3 py-2 rounded font-semibold text-sm hover:bg-[#e5c158] transition-colors active:scale-95">
                            Quick Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <p className="text-gray-400 text-lg mb-4">No products found</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#D4AF37] text-black px-6 py-2 rounded font-semibold hover:bg-[#e5c158] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <footer className="bg-black text-gray-400 text-center py-6 mt-16 border-t border-[#374151]">
        © {new Date().getFullYear()} Fashion Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default ProductBrowse;
import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import ProductTable from "./ProductTable";
import AddProductModal from "./AddProductModal";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/v1/product/");
      if (res.data.success) setProducts(res.data.products);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      const res = await axios.delete(`/api/v1/product/${id}`);
      if (res.data.success) setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert("Error deleting product");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-[#D4AF37]">Manage Products</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D4AF37] text-black px-4 py-2 rounded font-bold hover:scale-105 active:scale-95 transition-transform"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading products...</p>
      ) : (
        <ProductTable products={products} onDelete={handleDeleteProduct} />
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshProducts={fetchProducts}
      />
    </div>
  );
};

export default ProductManagement;
import React, { useState, useEffect, useRef } from "react";
import axios from "@/config/axiosConfig";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AddProductModal = ({ isOpen, onClose, refreshProducts }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Ref for the modal container to scope animations
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // GSAP Entrance Animation
  useGSAP(() => {
    if (isOpen) {
      // Fade in overlay
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3 }
      );
      // Pop in modal content
      gsap.fromTo(modalRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, { dependencies: [isOpen] });

  if (!isOpen) return null;

  // Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach((file) => data.append("images", file));

    try {
      const res = await axios.post("/api/v1/product/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        alert("Product added successfully!");
        refreshProducts();
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md"
    >
      <div 
        ref={modalRef}
        className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#374151] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <h2 className="text-2xl text-[#D4AF37] font-bold mb-6 text-center">Add New Product</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Form Fields */}
          <div className="space-y-4">
            <input 
              name="name" 
              placeholder="Product Name" 
              className="modal-input" 
              onChange={handleChange} 
              required 
            />
            
            <textarea 
              name="description" 
              placeholder="Description" 
              className="modal-input min-h-[100px]" 
              onChange={handleChange} 
              required 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                name="price" 
                type="number" 
                placeholder="Price" 
                className="modal-input" 
                onChange={handleChange} 
                required 
              />
              <input 
                name="stock" 
                type="number" 
                placeholder="Stock" 
                className="modal-input" 
                onChange={handleChange} 
                required 
              />
            </div>

            <input 
              name="category" 
              type="text"
              placeholder="Category (e.g., Jacket)" 
              className="modal-input" 
              value={formData.category}
              onChange={handleChange} 
              required 
            />
            
            <div className="bg-[#0F0F0F] p-4 rounded-lg border border-[#374151]">
              <label className="block text-gray-400 mb-2 text-sm font-semibold">Upload Images (Max 5)</label>
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                className="text-xs text-gray-400 file:bg-[#D4AF37] file:text-black file:border-none file:px-3 file:py-1 file:rounded file:mr-3 file:cursor-pointer hover:file:opacity-80 transition-all" 
                required 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-xl active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-xl hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
import React from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getImageUrl } from "@/utils/helpers";
const ProductTable = ({ products, onDelete }) => {
  if (!products || products.length === 0) {
    return <p className="text-gray-400 p-4">No products found in the database.</p>;
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#374151] text-[#D4AF37]">
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="product-row border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-3">
                {/* Safety check for image array from productController.js */}
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={getImageUrl(product.images[0])} 
                    className="w-12 h-12 object-cover rounded border border-[#374151]" 
                    alt={product.name} 
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-[10px] text-gray-500">No Image</div>
                )}
              </td>
              <td className="p-3 font-medium">{product.name}</td>
              <td className="p-3">₹{product.price}</td>
              <td className="p-3">{product.stock}</td>
              <td className="p-3 text-right">
                <button 
                  onClick={() => onDelete(product._id)}
                  className="text-red-500 cursor-pointer active:scale-95 hover:text-red-400 font-medium transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
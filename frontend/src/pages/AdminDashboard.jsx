import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("products");
  const container = useRef(null);

  // Animation for dashboard entrance
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.from(".sidebar", { x: -50, opacity: 0, duration: 0.8 })
      .from(".content-area", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");
  }, { scope: container });

  // Security check: Only allow admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div ref={container} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-8 gap-6">
        {/* Sidebar */}
        <aside className="sidebar w-full md:w-64 bg-[#1a1a1a] p-6 rounded-lg border border-[#374151] h-fit">
          <h2 className="text-[#D4AF37] font-bold text-xl mb-6">Admin Panel</h2>
          <nav className="flex flex-col gap-4">
            <button 
              onClick={() => setActiveTab("products")}
              className={`text-left px-4 py-2 rounded transition-all ${activeTab === 'products' ? 'bg-[#D4AF37] text-black' : 'hover:bg-white/5'}`}
            >
              Manage Products
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`text-left px-4 py-2 rounded transition-all ${activeTab === 'users' ? 'bg-[#D4AF37] text-black' : 'hover:bg-white/5'}`}
            >
              Manage Users
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="content-area flex-1 bg-[#1a1a1a] p-8 rounded-lg border border-[#374151]">
          {activeTab === "products" ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-[#D4AF37]">Products</h3>
                <button className="bg-[#D4AF37] text-black px-4 py-2 rounded font-bold active:scale-95 transition-transform">
                  + Add Product
                </button>
              </div>
              <p className="text-gray-400">Product management table will load here...</p>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-semibold text-[#D4AF37] mb-6">Users</h3>
              <p className="text-gray-400">User management list will load here...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
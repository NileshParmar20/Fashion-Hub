import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import ProductManagement from "../components/ProductManagement";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UserManagement from "../components/UserManagement";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("products");
  const container = useRef(null);

  // GSAP Animations remain safely scoped here
 useGSAP(() => {
  if (container.current) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Animate the sidebar on initial mount
    tl.from(".sidebar-panel", { x: -30, opacity: 0, duration: 0.8 });

    // Animate the current tab content whenever it renders
    tl.from(".content-panel", { 
      opacity: 0, 
      y: 20, 
      duration: 0.6 
    }, "-=0.4");
  }
}, { 
  scope: container, 
  dependencies: [activeTab] // This is the crucial fix!
});

  // Security check: Match backend isAdmin middleware logic
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div ref={container} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-8 gap-6">
        
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="content-panel flex-1 bg-[#1a1a1a] p-8 rounded-lg border border-[#374151]">
          {activeTab === "products" ? (
            <ProductManagement />
          ) : (
            <UserManagement />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
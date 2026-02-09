import React from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = ["products", "users"];

  return (
    <aside className="sidebar-panel w-full md:w-64 bg-[#1a1a1a] p-6 rounded-lg border border-[#374151] h-fit">
      <h2 className="text-[#D4AF37] font-bold text-xl mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`text-left px-4 py-2 rounded capitalize transition-all ${
              activeTab === item ? "bg-[#D4AF37] text-black font-bold" : "hover:bg-white/5"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
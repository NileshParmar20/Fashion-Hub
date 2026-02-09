import React from "react";
import { Link } from "react-router-dom";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
const AdminView = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-[#D4AF37] text-xl font-bold uppercase tracking-wider">Admin Controls</h2>
      <div className="h-px bg-[#374151] flex-1 ml-4"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-5 bg-black/40 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
        <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Access Level</p>
        <p className="text-white font-medium">Full System Management</p>
      </div>
      <div className="p-5 bg-black/40 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
        <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Status</p>
        <p className="text-green-500 font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Authorized
        </p>
      </div>
    </div>

    {/* FIXED BUTTON: Uses Link to navigate */}
    <Link 
      to="/admin" 
      className="block w-full bg-[#D4AF37] text-black font-black text-center py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#D4AF37]/20"
    >
      GO TO ADMIN DASHBOARD
    </Link>
  </div>
);

export default AdminView;
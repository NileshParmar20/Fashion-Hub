import React from "react";

const UserView = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-[#D4AF37] text-xl font-bold uppercase tracking-wider">Your Activity</h2>
      <div className="h-px bg-[#374151] flex-1 ml-4"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label: "Orders", value: "0" },
        { label: "Wishlist", value: "0" },
        { label: "Reviews", value: "0" }
      ].map((stat, i) => (
        <div key={i} className="p-6 bg-black/40 rounded-xl border border-white/5 text-center group hover:border-[#D4AF37]/40 transition-all">
          <p className="text-[#D4AF37] text-3xl font-black group-hover:scale-110 transition-transform">{stat.value}</p>
          <p className="text-gray-500 text-[10px] font-bold uppercase mt-1 tracking-widest">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
);

export default UserView;
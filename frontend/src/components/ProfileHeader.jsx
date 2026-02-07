import React from "react";

const ProfileHeader = ({ user }) => (
  <div className="flex flex-col md:flex-row items-center gap-8 border-b border-[#374151] pb-8">
    <div className="w-32 h-32 bg-[#D4AF37] rounded-full flex items-center justify-center text-black text-4xl font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]">
      {user?.name?.charAt(0).toUpperCase()}
    </div>
    <div className="text-center md:text-left">
      <h1 className="text-3xl font-bold text-white tracking-tight">{user?.name}</h1>
      <p className="text-gray-400 font-medium">{user?.email}</p>
      <div className="mt-3">
        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          user?.role === 'admin' ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-[#D4AF37]'
        }`}>
          {user?.role} Account
        </span>
      </div>
    </div>
  </div>
);

export default ProfileHeader;
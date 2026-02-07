import React from "react";

const UserTable = ({ users }) => {
  if (!users || users.length === 0) {
    return <p className="text-gray-400 p-4">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#374151] text-[#D4AF37]">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium">{user.name}</td>
              <td className="p-3 text-gray-300">{user.email}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-[#D4AF37] text-black' : 'bg-gray-700 text-white'}`}>
                  {user.role.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
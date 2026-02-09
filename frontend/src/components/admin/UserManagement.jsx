import { useRef, useState, useEffect } from "react";
import axios from "@/config/axiosConfig";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/v1/user/all-users");
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-gray-400">Loading users...</p>;

  return (
    <div className="overflow-x-auto">
      <h3 className="text-2xl font-semibold text-[#D4AF37] mb-6">Registered Users</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#374151] text-[#D4AF37]">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3 text-right">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-3">{u.name}</td>
              <td className="p-3 text-gray-400">{u.email}</td>
              <td className="p-3 text-right">
                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-[#D4AF37] text-black' : 'bg-gray-700 text-white'}`}>
                  {u.role.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
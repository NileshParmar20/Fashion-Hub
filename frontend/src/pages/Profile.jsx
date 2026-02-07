import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/api/v1/order/my-orders");
      
      console.log('Orders response:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-400 mb-4">Please log in to view profile</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#D4AF37] text-black px-6 py-2 rounded font-semibold"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-8">My Profile</h1>

        {/* User Info */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Name</p>
              <p className="text-white text-lg font-semibold">{user?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white text-lg font-semibold">{user?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Member Since</p>
              <p className="text-white text-lg font-semibold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-green-400 text-lg font-semibold">Active</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-6">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Order History</h2>

          {loading && (
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-400">Loading orders...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 text-red-400 mb-6">
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-6">No orders yet</p>
              <button
                onClick={() => navigate("/products")}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded font-semibold hover:bg-[#e5c158] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <div
                  key={order._id || `order-${idx}`}
                  className="bg-[#0F0F0F] rounded-lg p-4 border border-[#374151] hover:border-[#D4AF37] transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Order ID</p>
                      <p className="text-white font-mono text-sm break-all">
                        {order._id?.slice(-8) || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white">
                        {order.createdAt 
                          ? new Date(order.createdAt).toLocaleDateString() 
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Amount</p>
                      <p className="text-[#D4AF37] font-bold">
                        ₹{order.totalAmount?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                          order.status === 'delivered'
                            ? 'bg-green-900 text-green-300'
                            : order.status === 'shipped'
                            ? 'bg-blue-900 text-blue-300'
                            : order.status === 'confirmed'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-gray-900 text-gray-300'
                        }`}
                      >
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="bg-[#D4AF37] text-black px-4 py-2 rounded font-semibold hover:bg-[#e5c158] transition-colors w-full md:w-auto"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Items Summary */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#374151]">
                      <p className="text-gray-400 text-sm mb-2">
                        Items ({order.items.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, itemIdx) => (
                          <span
                            key={`item-${itemIdx}`}
                            className="bg-[#1a1a1a] px-3 py-1 rounded text-sm text-gray-300"
                          >
                            Qty: {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-black text-gray-400 text-center py-6 mt-16 border-t border-[#374151]">
        © {new Date().getFullYear()} Fashion Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default Profile;
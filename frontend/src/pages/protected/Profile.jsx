import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/layout/Navbar";
import axiosInstance from "@/config/axiosConfig";
import { formatPrice, formatDate, getOrderStatusColor } from "@/utils/helpers";

const Profile = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useGSAP(() => {
    gsap.from(".animate-in", {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    });
  }, { scope: containerRef });

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
    return null;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="animate-in text-4xl font-bold text-[#D4AF37] mb-8">My Profile</h1>

        {/* User Info */}
        <div className="animate-in bg-[#1a1a1a] rounded-lg border border-[#374151] p-6 mb-8">
          
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
              <p className="text-gray-400 text-sm mb-1">Role</p>
              <p className="text-[#D4AF37] text-lg font-semibold capitalize">
                {user?.role || "user"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Member Since</p>
              <p className="text-white text-lg font-semibold">
                {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="animate-in bg-[#1a1a1a] rounded-lg border border-[#374151] p-6">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Order History</h2>

          {loading && (
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-400">Loading orders...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchOrders}
                className="bg-[#D4AF37] text-black px-6 py-2 rounded font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No orders yet</p>
              <button
                onClick={() => navigate("/products")}
                className="bg-[#D4AF37] text-black px-6 py-2 rounded font-semibold"
              >
                Start Shopping
              </button>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-[#2a2a2a] rounded-lg border border-[#374151] p-4 hover:border-[#D4AF37] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-white font-semibold">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className={`text-sm font-semibold capitalize ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {order.items?.length || 0} item(s) • {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="bg-[#D4AF37] text-black px-6 py-2 rounded font-semibold hover:bg-[#e5c158] transition-colors whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
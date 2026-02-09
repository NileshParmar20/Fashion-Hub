import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/layout/Navbar";
import axiosInstance from "@/config/axiosConfig";
import { formatPrice, formatDate, getOrderStatusColor } from "@/utils/helpers";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [order, setOrder] = useState(null);
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
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/v1/order/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(err.response?.data?.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-red-400 mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-[#D4AF37] text-black px-6 py-2 rounded font-semibold"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/profile")}
          className="animate-in text-[#D4AF37] mb-6 hover:underline"
        >
          ← Back to Orders
        </button>

        <h1 className="animate-in text-4xl font-bold text-[#D4AF37] mb-8">
          Order Details
        </h1>

        {/* Order Info */}
        <div className="animate-in bg-[#1a1a1a] rounded-lg border border-[#374151] p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Order ID</p>
              <p className="text-white font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Order Date</p>
              <p className="text-white font-semibold">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className={`font-semibold capitalize ${getOrderStatusColor(order.status)}`}>
                {order.status}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="animate-in bg-[#1a1a1a] rounded-lg border border-[#374151] p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 pb-4 border-b border-[#374151] last:border-0"
              >
                <div className="w-20 h-20 bg-[#2a2a2a] rounded flex-shrink-0">
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0].startsWith('http') 
                        ? item.product.images[0] 
                        : `http://localhost:3000${item.product.images[0]}`}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{item.product?.name || "Product"}</h3>
                  <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#D4AF37] font-bold">{formatPrice(item.price)}</p>
                  <p className="text-gray-400 text-sm">x {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#374151]">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-white">Total</span>
              <span className="text-3xl font-bold text-[#D4AF37]">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="animate-in bg-[#1a1a1a] rounded-lg border border-[#374151] p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Shipping Address</h2>
          <div className="text-gray-300">
            <p className="font-semibold text-white">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.email}</p>
            <p>{order.shippingAddress.phone}</p>
            <p className="mt-2">{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="animate-in bg-[#1a1a1a] rounded-lg border border-[#374151] p-6">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Payment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Payment Method</p>
              <p className="text-white font-semibold uppercase">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Payment Status</p>
              <p className={`font-semibold capitalize ${getOrderStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus}
              </p>
            </div>
            {order.paymentDetails?.transactionId && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Transaction ID</p>
                <p className="text-white font-semibold">{order.paymentDetails.transactionId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
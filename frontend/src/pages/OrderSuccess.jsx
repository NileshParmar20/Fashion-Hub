import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || "ORD" + Date.now();

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-block text-6xl mb-6 animate-bounce">✓</div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-4">
            Order Confirmed!
          </h1>
          <p className="text-gray-300 text-lg">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-gray-400 text-sm mb-2">Order ID</p>
              <p className="text-white text-xl font-bold font-mono">
                {orderId}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Order Date</p>
              <p className="text-white text-xl font-bold">
                {new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Estimated Delivery</p>
              <p className="text-white text-xl font-bold">3-5 Business Days</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Status</p>
              <p className="text-green-400 text-xl font-bold">Processing</p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">What's Next?</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-[#D4AF37] text-2xl font-bold">1</div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Confirmation Email
                </h3>
                <p className="text-gray-400 text-sm">
                  A confirmation email with order details has been sent to your
                  registered email address.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-[#D4AF37] text-2xl font-bold">2</div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Tracking Information
                </h3>
                <p className="text-gray-400 text-sm">
                  Once your order ships, you'll receive a tracking number via
                  email and SMS.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-[#D4AF37] text-2xl font-bold">3</div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Delivery & Returns
                </h3>
                <p className="text-gray-400 text-sm">
                  Your package will arrive within 3-5 business days. Easy
                  returns available for 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-6">
            <p className="text-[#D4AF37] font-bold text-lg mb-2">
              📧 Need Help?
            </p>
            <p className="text-gray-400 text-sm">
              Contact our customer support team at{" "}
              <span className="text-white">support@fashionhub.com</span>
            </p>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-6">
            <p className="text-[#D4AF37] font-bold text-lg mb-2">
              📱 Track Order
            </p>
            <p className="text-gray-400 text-sm">
              Visit your profile page to track your order in real-time.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/products")}
            className="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-[#e5c158] transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-bold py-3 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-transparent border-2 border-gray-400 text-gray-400 font-bold py-3 rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-[#1a1a1a] rounded-lg border border-[#374151] p-6 text-center">
          <p className="text-gray-400 text-sm mb-3">
            ✓ Free Shipping | ✓ 30-Day Returns | ✓ Secure Payment
          </p>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Fashion Hub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
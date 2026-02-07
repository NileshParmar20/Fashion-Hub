import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";
import { useRef } from "react";

const UPIPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const { orderId, paymentDetails } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [upiId, setUpiId] = useState("");
  const [copied, setCopied] = useState({});
  const [timer, setTimer] = useState(60);

  // Animations
  useGSAP(() => {
    gsap.from(".payment-card", {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "back.out"
    });

    gsap.from(".payment-step", {
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (!orderId || !paymentDetails) {
      navigate("/products");
    }
  }, [orderId, paymentDetails, navigate]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [field]: false }));
    }, 2000);
  };

  const handleConfirmPayment = async () => {
    if (!transactionId.trim()) {
      alert("Please enter the UPI transaction ID");
      return;
    }

    if (!upiId.trim()) {
      alert("Please enter the UPI ID used for payment");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/v1/order/verify-upi", {
        transactionId,
        orderId,
        status: "completed",
        referenceId: paymentDetails.referenceId
      });

      if (response.data.success) {
        setPaymentStatus("completed");

        // Animate success
        gsap.to(".payment-success-animation", {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out"
        });

        setTimeout(() => {
          navigate("/order-success", { state: { orderId } });
        }, 2000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSkipVerification = () => {
    // For demo purposes, skip verification
    navigate("/order-success", { state: { orderId } });
  };

  if (!orderId || !paymentDetails) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-400">Invalid payment details. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white" ref={containerRef}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-2 text-center">
          UPI Payment
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Complete your payment to confirm your order
        </p>

        {paymentStatus === "pending" ? (
          <div className="space-y-6">
            {/* Payment Details Card */}
            <div className="payment-card bg-[#1a1a1a] rounded-lg border border-[#374151] p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-gray-400 text-sm mb-1">UPI ID</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-[#0F0F0F] px-3 py-2 rounded font-mono text-[#D4AF37]">
                      {paymentDetails.upiId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(paymentDetails.upiId, "upi")}
                      className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                      title="Copy UPI ID"
                    >
                      {copied.upi ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Amount</p>
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    ₹{paymentDetails.amount?.toLocaleString()}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Merchant</p>
                  <p className="text-white font-medium">{paymentDetails.merchant}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Reference ID</p>
                  <code className="bg-[#0F0F0F] px-3 py-2 rounded font-mono text-xs text-[#D4AF37]">
                    {paymentDetails.referenceId}
                  </code>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#374151] my-6"></div>

              {/* Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#D4AF37] mb-4">
                  Payment Steps:
                </h3>

                <div className="payment-step flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D4AF37] text-black font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Open UPI App</p>
                    <p className="text-gray-400 text-sm">
                      Open Google Pay, PhonePe, Paytm, or any UPI app on your phone
                    </p>
                  </div>
                </div>

                <div className="payment-step flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D4AF37] text-black font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Send Money</p>
                    <p className="text-gray-400 text-sm">
                      Send ₹{paymentDetails.amount?.toLocaleString()} to{" "}
                      <span className="text-[#D4AF37]">{paymentDetails.upiId}</span>
                    </p>
                  </div>
                </div>

                <div className="payment-step flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#D4AF37] text-black font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Confirm Payment</p>
                    <p className="text-gray-400 text-sm">
                      Enter your transaction ID below and click "Confirm Payment"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Confirmation Form */}
            <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-8">
              <h3 className="text-lg font-bold text-[#D4AF37] mb-6">
                Confirm Your Payment
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Transaction ID / Reference Number *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter UPI transaction ID (e.g., 123456789012)"
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#374151] rounded text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    You'll find this in your UPI app's transaction history
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    UPI ID Used for Payment *
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter your UPI ID (e.g., yourname@bank)"
                    className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#374151] rounded text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Timer */}
                <div className="bg-[#2a2a2a] rounded p-4 border border-[#374151]">
                  <p className="text-sm text-gray-300">
                    ⏱️ Complete payment within{" "}
                    <span className="text-[#D4AF37] font-bold">{timer}s</span>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSkipVerification}
                    className="flex-1 bg-transparent border-2 border-gray-400 text-gray-400 font-semibold py-3 rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                  >
                    Skip Verification
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={loading || !transactionId.trim() || !upiId.trim()}
                    className="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-[#e5c158] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Confirm Payment"}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-[#1a1a1a] rounded-lg border border-[#D4AF37] p-6">
              <p className="text-sm text-gray-300 mb-3">
                <span className="text-[#D4AF37] font-bold">💡 Tip:</span> Your
                transaction ID is typically a 10-12 digit number starting with a
                number or 'UPI'. Check your UPI app under "Payment History".
              </p>
              <p className="text-xs text-gray-400">
                Your payment details are secure and encrypted. We never store
                your UPI credentials.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="payment-success-animation text-6xl mb-4 opacity-0 scale-0">
              ✓
            </div>
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">
              Payment Confirmed!
            </h2>
            <p className="text-gray-400">
              Redirecting to order confirmation...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPIPayment;
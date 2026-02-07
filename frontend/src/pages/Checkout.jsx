import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { fetchCart, clearCart } from "../features/cart/cartSlice";
import axiosInstance from "../utils/axiosInstance";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "upi",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (items.length === 0) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, navigate, dispatch, items.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setNotification({
        type: "error",
        message: "Please fill in all fields correctly",
      });
      return;
    }

    if (!items || items.length === 0) {
      setNotification({
        type: "error",
        message: "Your cart is empty",
      });
      return;
    }

    setLoading(true);

    try {
      // Ensure all items have required fields
      const processedItems = items.map((item) => ({
        product: item.product._id,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.product.price) || 0,
      }));

      const subtotal = calculateTotal();
      const tax = subtotal * 0.1;
      const totalAmount = subtotal + tax;

      const orderData = {
        items: processedItems,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
      };

      console.log("Order data being sent:", orderData);

      const response = await axiosInstance.post("/api/v1/order/create", orderData);

      if (response.data.success) {
        setOrderId(response.data.orderId);
        setPaymentDetails(response.data.paymentDetails);
        setOrderPlaced(true);
        dispatch(clearCart());

        setTimeout(() => {
          if (formData.paymentMethod === "upi") {
            navigate("/upi-payment", {
              state: {
                orderId: response.data.orderId,
                paymentDetails: response.data.paymentDetails,
              },
            });
          } else {
            navigate("/order-success", {
              state: { orderId: response.data.orderId },
            });
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      setNotification({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to place order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => {
      const price = parseFloat(item.product?.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return total + price * quantity;
    }, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-400 mb-4">Please log in to continue</p>
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

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-4xl font-bold text-[#D4AF37] mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-400 mb-6">
              Order ID: <span className="text-white font-bold">{orderId}</span>
            </p>
            {formData.paymentMethod === "upi" && paymentDetails && (
              <div className="bg-[#1a1a1a] border border-[#D4AF37] rounded-lg p-6 max-w-md mx-auto mb-6">
                <p className="text-[#D4AF37] font-bold mb-3">UPI Payment Details:</p>
                <p className="text-gray-300 text-sm">
                  UPI ID: <span className="font-mono">{paymentDetails.upiId}</span>
                </p>
                <p className="text-gray-300 text-sm">
                  Amount: ₹{paymentDetails.amount?.toLocaleString()}
                </p>
              </div>
            )}
            <p className="text-gray-400 mb-8">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateTotal();
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      {notification && (
        <div
          className={`fixed top-20 right-4 px-6 py-3 rounded-lg z-50 animate-pulse ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-8">Checkout</h1>

        {!items || items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400 mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#D4AF37] text-black px-8 py-3 rounded font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-6">
                  <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-[#0F0F0F] border rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors ${
                          errors.fullName ? "border-red-500" : "border-[#374151]"
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && (
                        <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-[#0F0F0F] border rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors ${
                          errors.email ? "border-red-500" : "border-[#374151]"
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 bg-[#0F0F0F] border rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors ${
                          errors.phone ? "border-red-500" : "border-[#374151]"
                        }`}
                        placeholder="9876543210"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-6">
                  <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">
                    Shipping Address
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-2 bg-[#0F0F0F] border rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors ${
                          errors.address ? "border-red-500" : "border-[#374151]"
                        }`}
                        placeholder="Enter your full address"
                      />
                      {errors.address && (
                        <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 bg-[#0F0F0F] border rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors ${
                            errors.city ? "border-red-500" : "border-[#374151]"
                          }`}
                          placeholder="Ahmedabad"
                        />
                        {errors.city && (
                          <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 bg-[#0F0F0F] border rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors ${
                            errors.state ? "border-red-500" : "border-[#374151]"
                          }`}
                          placeholder="Gujarat"
                        />
                        {errors.state && (
                          <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 bg-[#0F0F0F] border rounded text-white focus:outline-none focus:border-[#D4AF37] transition-colors ${
                            errors.pincode ? "border-red-500" : "border-[#374151]"
                          }`}
                          placeholder="380001"
                        />
                        {errors.pincode && (
                          <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-6">
                  <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-[#374151] rounded cursor-pointer hover:border-[#D4AF37] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <span className="text-white font-medium">💳 UPI Payment</span>
                        <p className="text-xs text-gray-400">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-[#374151] rounded cursor-pointer hover:border-[#D4AF37] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <span className="text-white font-medium">💳 Credit/Debit Card</span>
                        <p className="text-xs text-gray-400">Visa, Mastercard</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-[#374151] rounded cursor-pointer hover:border-[#D4AF37] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <span className="text-white font-medium">🚚 Cash on Delivery</span>
                        <p className="text-xs text-gray-400">Pay on delivery</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="flex-1 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-bold py-3 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-[#e5c158] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#D4AF37] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {items && items.length > 0 && items.map((item, idx) => (
                    <div
                      key={item.product._id || `order-item-${idx}`}
                      className="flex justify-between text-sm border-b border-[#374151] pb-3"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-[#D4AF37] font-semibold">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-[#374151] pt-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping:</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (10%):</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-[#374151] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total:</span>
                    <span className="text-2xl font-bold text-[#D4AF37]">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
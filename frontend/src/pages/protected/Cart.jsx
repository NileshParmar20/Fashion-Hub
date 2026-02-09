import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/layout/Navbar";
import { getImageUrl } from "@/utils/helpers";
import {
  fetchCart,
  removeProductFromCart,
  addProductToCart,
} from "@/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notification, setNotification] = useState(null);

  const { items, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#D4AF37] mb-4">
              Your Shopping Cart
            </h1>
            <p className="text-gray-400 mb-6">
              Please log in to view your cart
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#D4AF37] text-black px-8 py-3 rounded font-semibold hover:bg-[#e5c158] transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => {
      const price = parseFloat(item.product?.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  };

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeProductFromCart(productId)).unwrap();
      setNotification({
        type: "success",
        message: "Item removed from cart",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: err || "Failed to remove item",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    try {
      const item = items.find((i) => i.product._id === productId);
      const currentQuantity = parseInt(item?.quantity) || 1;
      const quantityDifference = newQuantity - currentQuantity;

      if (quantityDifference !== 0) {
        await dispatch(
          addProductToCart({ productId, quantity: quantityDifference })
        ).unwrap();
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err || "Failed to update quantity",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      setNotification({
        type: "error",
        message: "Your cart is empty",
      });
      return;
    }
    navigate("/checkout");
  };

  const subtotal = calculateTotal();
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      {notification && (
        <div
          className={`fixed top-20 right-4 px-6 py-3 rounded-lg z-50 animate-pulse ${
            notification.type === "success"
              ? "bg-green-500"
              : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-8">
          Shopping Cart
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-400 text-lg">Loading cart...</p>
          </div>
        )}

        {!loading && (!items || items.length === 0) ? (
          <div className="text-center py-16">
            <p className="text-3xl text-gray-400 mb-6">Your cart is empty</p>
            <button
              onClick={handleContinueShopping}
              className="bg-[#D4AF37] text-black px-8 py-3 rounded font-semibold hover:bg-[#e5c158] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items && items.length > 0 && items.map((item, index) => {
                  const itemPrice = parseFloat(item.product?.price) || 0;
                  const itemQuantity = parseInt(item.quantity) || 1;
                  const itemTotal = itemPrice * itemQuantity;

                  return (
                    <div
                      key={item.product?._id || `cart-item-${index}`}
                      className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-4 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="sm:w-32 h-32 bg-[#2a2a2a] rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={getImageUrl(item.product.images[0])}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <p className="text-gray-500 text-sm">No Image</p>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">
                            {item.product?.name || "Product"}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {item.product?.category?.name || "Uncategorized"}
                          </p>
                          <p className="text-2xl font-bold text-[#D4AF37]">
                            ₹{itemPrice.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <label className="text-gray-300 text-sm">Qty:</label>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                itemQuantity - 1
                              )
                            }
                            className="bg-[#2a2a2a] border border-[#374151] rounded px-2 py-1 text-[#D4AF37] hover:bg-[#3a3a3a] transition-colors"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={itemQuantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.product._id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            min="1"
                            className="w-12 px-2 py-1 bg-[#0F0F0F] border border-[#374151] rounded text-center text-white focus:outline-none focus:border-[#D4AF37]"
                          />
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                itemQuantity + 1
                              )
                            }
                            className="bg-[#2a2a2a] border border-[#374151] rounded px-2 py-1 text-[#D4AF37] hover:bg-[#3a3a3a] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="sm:w-32 flex flex-col items-end justify-between">
                        <div className="text-right">
                          <p className="text-gray-400 text-xs mb-1">Total</p>
                          <p className="text-2xl font-bold text-[#D4AF37]">
                            ₹{itemTotal.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-red-400 hover:text-red-300 text-sm font-semibold mt-2 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] rounded-lg border border-[#374151] p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#D4AF37] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
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

                <div className="border-t border-[#374151] pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total:</span>
                    <span className="text-3xl font-bold text-[#D4AF37]">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-[#e5c158] transition-colors mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="w-full bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-semibold py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 bg-[#2a2a2a] rounded p-4 border border-[#374151]">
                  <p className="text-xs text-gray-400">
                    ✓ Free shipping on all orders
                    <br />✓ Secure checkout
                    <br />✓ 30-day returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-black text-gray-400 text-center py-6 mt-16 border-t border-[#374151]">
        © {new Date().getFullYear()} Fashion Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default Cart;
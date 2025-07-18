import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

// Add to Cart
export const addToCart = async (req, res) => {
const userId = req.user._id; // or req.user.userId if using token directly
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity || 1;
    } else {
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// View Cart
export const viewCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body; // quantity can be +1 or -1 from frontend

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ensure we don't oversell
    if (quantity > 0 && product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      // Check if the total requested quantity is valid
      const newTotalQuantity = user.cart[cartItemIndex].quantity + (quantity || 1);
      if (newTotalQuantity < 1) return removeFromCart(req, res); // Cleanup if qty hits 0
      
      user.cart[cartItemIndex].quantity = newTotalQuantity;
    } else {
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    // UPDATE STOCK: Deduct the amount being added to the cart
    product.stock -= (quantity || 1);
    await product.save();
    
    await user.save();
    // Populate product details for the frontend
    const updatedUser = await User.findById(userId).populate("cart.product");
    res.status(200).json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (cartItem) {
      // RETURN STOCK: Add the quantity back to the product stock
      const product = await Product.findById(productId);
      if (product) {
        product.stock += cartItem.quantity;
        await product.save();
      }
    }

    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    
    const updatedUser = await User.findById(userId).populate("cart.product");
    res.status(200).json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const viewCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
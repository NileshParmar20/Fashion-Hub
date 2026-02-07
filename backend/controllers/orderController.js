import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import crypto from 'crypto';

const generateUPITransaction = async (orderData) => {
  try {
    const transactionId = `UPI${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId,
      upiPayment: {
        transactionId,
        upiId: `fashionhub@upi`,
        amount: orderData.totalAmount,
        merchant: 'Fashion Hub',
        timestamp: new Date(),
        referenceId: crypto.randomBytes(8).toString('hex')
      }
    };
  } catch (error) {
    console.error('UPI generation error:', error);
    return { success: false, error: error.message };
  }
};

const verifyUPIPayment = async (transactionId, amount) => {
  try {
    return { success: true, status: 'completed', transactionId };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { success: false, error: error.message };
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    console.log('Creating order:', { items, paymentMethod, totalAmount });

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate items - ensure product ID and price exist
    const validatedItems = items.map(item => ({
      product: item.product,
      quantity: parseInt(item.quantity) || 1,
      price: parseFloat(item.price) || 0
    }));

    // Create order object
    const orderData = {
      userId,
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      totalAmount: parseFloat(totalAmount),
      status: 'pending',
      paymentStatus: 'pending'
    };

    // Handle different payment methods
    if (paymentMethod === 'upi') {
      const upiTransaction = await generateUPITransaction({ totalAmount });

      if (!upiTransaction.success) {
        return res.status(500).json({ success: false, message: "Failed to generate UPI payment" });
      }

      orderData.paymentDetails = {
        transactionId: upiTransaction.transactionId,
        upiId: upiTransaction.upiPayment.upiId,
        timestamp: upiTransaction.upiPayment.timestamp
      };
      orderData.paymentStatus = 'pending';
      orderData.status = 'pending';

      const order = new Order(orderData);
      await order.save();
      await User.findByIdAndUpdate(userId, { cart: [] });

      return res.status(201).json({
        success: true,
        message: "Order created. Awaiting UPI payment confirmation.",
        orderId: order._id,
        paymentDetails: {
          transactionId: upiTransaction.transactionId,
          upiId: upiTransaction.upiPayment.upiId,
          amount: totalAmount,
          merchant: 'Fashion Hub',
          referenceId: upiTransaction.upiPayment.referenceId
        }
      });

    } else if (paymentMethod === 'card') {
      orderData.paymentStatus = 'pending';
      orderData.status = 'pending';

      const order = new Order(orderData);
      await order.save();
      await User.findByIdAndUpdate(userId, { cart: [] });

      return res.status(201).json({
        success: true,
        message: "Order created. Please complete card payment.",
        orderId: order._id,
        requiresPayment: true,
        paymentMethod: 'card'
      });

    } else if (paymentMethod === 'cod') {
      orderData.paymentStatus = 'pending';
      orderData.status = 'confirmed';

      const order = new Order(orderData);
      await order.save();
      await User.findByIdAndUpdate(userId, { cart: [] });

      return res.status(201).json({
        success: true,
        message: "Order placed successfully! You can pay at delivery.",
        orderId: order._id,
        paymentMethod: 'cod'
      });

    } else {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

export const verifyUPIPayment_Callback = async (req, res) => {
  try {
    const { transactionId, orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const paymentVerification = await verifyUPIPayment(transactionId, order.totalAmount);

    if (paymentVerification.success && status === 'completed') {
      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      order.paymentDetails.transactionId = transactionId;
      order.paymentDetails.timestamp = new Date();
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        orderId: order._id,
        status: 'confirmed'
      });
    } else {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        orderId: order._id
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // DO NOT USE POPULATE - just get the orders directly
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    console.log('Found orders:', orders.length);

    res.status(200).json({
      success: true,
      orders: orders || []
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Cannot cancel order in current status" });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message
    });
  }
};
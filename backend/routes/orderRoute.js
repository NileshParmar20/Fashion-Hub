import express from 'express';
import {
  createOrder,
  verifyUPIPayment_Callback,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { isAuthenticated } from '../middlewares/auth.js';  // ✅ CORRECTED: was isLoggedIn
import { isAdmin } from '../middlewares/isadmin.js';

const router = express.Router();

// User routes (protected)
router.post('/create', isAuthenticated, createOrder);  // ✅ CORRECTED
router.get('/my-orders', isAuthenticated, getUserOrders);  // ✅ CORRECTED
router.get('/:orderId', isAuthenticated, getOrderById);  // ✅ CORRECTED
router.post('/:orderId/cancel', isAuthenticated, cancelOrder);  // ✅ CORRECTED

// Payment callback route (UPI payment confirmation)
router.post('/verify-upi', verifyUPIPayment_Callback);

// Admin routes (protected)
router.put('/:orderId/status', isAuthenticated, isAdmin, updateOrderStatus);  // ✅ CORRECTED

export default router;
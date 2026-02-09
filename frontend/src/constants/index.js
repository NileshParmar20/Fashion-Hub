// API Constants
export const API_BASE_URL = 'http://localhost:3000';
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/v1/user/login',
  REGISTER: '/api/v1/user/register',
  GOOGLE_AUTH: '/api/v1/google-auth',
  
  // Products
  PRODUCTS: '/api/v1/product',
  PRODUCT_BY_ID: (id) => `/api/v1/product/${id}`,
  CREATE_PRODUCT: '/api/v1/product/create',
  DELETE_PRODUCT: (id) => `/api/v1/product/${id}`,
  
  // Cart
  CART_VIEW: '/api/v1/cart/view',
  CART_ADD: '/api/v1/cart/add',
  CART_REMOVE: '/api/v1/cart/remove',
  
  // Orders
  CREATE_ORDER: '/api/v1/order/create',
  MY_ORDERS: '/api/v1/order/my-orders',
  ALL_ORDERS: '/api/v1/order/all',
  UPDATE_ORDER: (id) => `/api/v1/order/${id}`,
  VERIFY_UPI: '/api/v1/order/verify-upi',
  
  // Admin
  ALL_USERS: '/api/v1/user/all',
  UPDATE_USER: (id) => `/api/v1/user/${id}`,
  DELETE_USER: (id) => `/api/v1/user/${id}`,
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#D4AF37',
  BACKGROUND: '#0F0F0F',
  CARD_BG: '#1a1a1a',
  BORDER: '#374151',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#9ca3af',
};

// Animation Durations
export const ANIMATION = {
  FAST: 0.3,
  NORMAL: 0.6,
  SLOW: 1,
  STAGGER: 0.1,
};

// User Roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  COD: 'cod',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

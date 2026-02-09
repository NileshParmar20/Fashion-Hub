import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import Login from "@/pages/public/Login";
import Register from "@/pages/public/Register";
import GoogleSuccess from "@/pages/public/GoogleSuccess";
import ProductBrowse from "@/pages/public/ProductBrowse";
import ProductDetails from "@/pages/public/ProductDetails";
import OrderSuccess from "@/pages/public/OrderSuccess";

// Protected Pages
import Cart from "@/pages/protected/Cart";
import Checkout from "@/pages/protected/Checkout";
import Profile from "@/pages/protected/Profile";
import UpiPayment from "@/pages/protected/UpiPayment";
import OrderDetails from "@/pages/protected/OrderDetails";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";

// Components
import ProtectedRoute from "@/components/common/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* Product Routes */}
        <Route path="/products" element={<ProductBrowse />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Cart & Checkout Routes */}
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upi-payment"
          element={
            <ProtectedRoute>
              <UpiPayment />
            </ProtectedRoute>
          }
        />

        {/* User Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
          <Route
            path="/order/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

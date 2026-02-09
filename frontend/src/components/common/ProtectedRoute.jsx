import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

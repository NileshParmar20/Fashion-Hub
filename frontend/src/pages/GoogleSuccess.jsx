import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../features/auth/authSlice";

const GoogleSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);

    dispatch(
      loginSuccess({
        
        
        user: {
          _id: decoded.userId,
          role: decoded.role,
        },
        token,
        role: decoded.role,
      })
      
    );

    navigate("/", { replace: true });
  }, [dispatch, navigate]);

  return null;
};

export default GoogleSuccess;

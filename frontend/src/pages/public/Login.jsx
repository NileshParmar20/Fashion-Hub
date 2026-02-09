import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "@/config/axiosConfig";
import { loginSuccess } from "@/features/auth/authSlice";
import Navbar from "@/components/layout/Navbar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Destructure safely from Redux state
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const container = useRef(null);

  // GSAP Animation - Wrapped in a safety check
  useGSAP(() => {
    if (container.current) {
      gsap.from(".login-box", { opacity: 0, y: 20, duration: 1, ease: "power3.out" });
    }
  }, { scope: container });

  // SAFE REDIRECT LOGIC
  // We check if user exists before accessing .role to prevent the white screen crash
  if (isAuthenticated && user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("/api/v1/user/login", { email, password });

      // Save to Redux - matching your authSlice.js expectations
      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
          role: res.data.user.role,
        })
      );

      // Manual navigation as a fallback
      if (res.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div ref={container} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      <div className="flex justify-center items-center py-16 px-4">
        <form
          onSubmit={handleLogin}
          className="login-box bg-[#1a1a1a] p-8 rounded w-full max-w-md border border-[#374151]"
        >
          <h2 className="text-2xl text-[#D4AF37] font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 mb-3 text-sm text-center">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="w-full bg-[#D4AF37] hover:opacity-90 cursor-pointer active:scale-95 text-black py-2 rounded mb-3 font-bold">
            Login
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer active:scale-95 font-semibold py-3 rounded flex items-center justify-center gap-3 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
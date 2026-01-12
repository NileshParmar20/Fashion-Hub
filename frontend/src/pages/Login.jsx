import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { loginSuccess } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/v1/user/login", {
        email,
        password,
      });

      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
          role: res.data.user.role,
        })
      );

      // 🔥 Redirect to HOME (Profile behavior)
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      <div className="flex justify-center items-center py-16 px-4">
        <form
          onSubmit={handleLogin}
          className="bg-[#1a1a1a] p-8 rounded w-full max-w-md"
        >
          <h2 className="text-2xl text-[#D4AF37] font-bold text-center mb-6">
            Login
          </h2>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-[#D4AF37]  hover:bg-#D4AF37 cursor-pointer active:scale-95 text-black py-2 rounded mb-3">
            Login
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer active:scale-95 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all"
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

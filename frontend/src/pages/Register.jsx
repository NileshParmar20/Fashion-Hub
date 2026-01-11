import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { loginSuccess } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await axios.post("/api/v1/user/register", form);

    dispatch(
      loginSuccess({
        user: res.data.user,
        token: res.data.token,
        role: res.data.user.role,
      })
    );

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      <div className="flex justify-center items-center py-16 px-4">
        <form
          onSubmit={handleRegister}
          className="bg-[#1a1a1a] p-8 rounded w-full max-w-md"
        >
          <h2 className="text-2xl text-[#D4AF37] font-bold text-center mb-6">
            Create Account
          </h2>

          <input name="name" className="input" placeholder="Name" onChange={handleChange} />
          <input name="email" className="input" placeholder="Email" onChange={handleChange} />
          <input name="password" className="input mb-6" placeholder="Password" onChange={handleChange} />

          <button className="w-full bg-[#D4AF37] text-black py-2 rounded">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

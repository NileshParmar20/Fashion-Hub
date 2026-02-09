import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { loginSuccess } from "@/features/auth/authSlice";
import Navbar from "@/components/layout/Navbar";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".success-content", {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });
  }, { scope: containerRef });

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const role = searchParams.get("role");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Ensure user has all necessary fields
        const completeUser = {
          _id: user._id || user.id,
          name: user.name || user.displayName || "User",
          email: user.email,
          role: role || user.role || "user",
          createdAt: user.createdAt || new Date().toISOString(),
        };

        dispatch(
          loginSuccess({
            user: completeUser,
            token: token,
            role: completeUser.role,
          })
        );

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (error) {
        console.error("Error processing Google login:", error);
        navigate("/login", { replace: true });
      }
    } else {
      console.error("Missing token or user data");
      navigate("/login", { replace: true });
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <div className="success-content text-center">
          <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#D4AF37] mb-4">
            Login Successful!
          </h1>
          <p className="text-gray-400">Redirecting you to home page...</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleSuccess;
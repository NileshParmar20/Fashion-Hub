import { useState, useRef } from "react"; // Added useRef
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import gsap from "gsap"; // Added
import { useGSAP } from "@gsap/react"; // Added

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navRef = useRef(null); // Added for scoping

  // Animation for Desktop Links on Load
  useGSAP(() => {
    gsap.from(".nav-link", {
      y: -10,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
    });
  }, { scope: navRef });

  // Animation for Mobile Menu Toggle
  useGSAP(() => {
    if (open) {
      gsap.fromTo(".mobile-menu",
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [open]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setOpen(false);
  };

  return (
    <nav ref={navRef} className="bg-[#0F0F0F] text-[#D4AF37] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="nav-link flex items-center gap-2">
          <img src="/logo.png" className="h-10 w-10" alt="logo" />
          <span className="text-xl font-bold tracking-wide">Fashion Hub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="nav-link hover:text-white">Home</Link>
          <Link to="/about" className="nav-link hover:text-white">About</Link>
          <Link to="/contact" className="nav-link hover:text-white">Contact</Link>
          {isAuthenticated && user?.role === "admin" && (
            <Link to="/admin" className="nav-link hover:text-white">
              Dashboard
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link border border-[#D4AF37] px-4 py-1 cursor-pointer active:scale-95 rounded hover:bg-[#D4AF37] hover:text-black">
                Login
              </Link>
              <Link to="/register" className="nav-link bg-[#D4AF37] text-black cursor-pointer active:scale-95 px-4 py-1 rounded">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="nav-link hover:text-white">Profile</Link>
              <button
                onClick={handleLogout}
                className="nav-link border border-red-500 cursor-pointer active:scale-95 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu md:hidden bg-[#1a1a1a] px-4 pb-4 space-y-3 overflow-hidden">
          <Link onClick={() => setOpen(false)} to="/" className="block">Home</Link>
          <Link onClick={() => setOpen(false)} to="/about" className="block">About</Link>
          <Link onClick={() => setOpen(false)} to="/contact" className="block">Contact</Link>


          {!isAuthenticated ? (
            <>
              <Link onClick={() => setOpen(false)} to="/login" className="block">Login</Link>
              <Link onClick={() => setOpen(false)} to="/register" className="block">Sign Up</Link>
            </>
          ) : (
            <>
              <Link onClick={() => setOpen(false)} to="/profile" className="block">Profile</Link>
              <button onClick={handleLogout} className="text-red-500">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
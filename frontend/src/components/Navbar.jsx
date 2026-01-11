import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  };

  return (
    <nav className="bg-[#0F0F0F] text-[#D4AF37] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" className="h-10 w-10" alt="logo" />
          <span className="text-xl font-bold tracking-wide">Fashion Hub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/about" className="hover:text-white">About</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="border border-[#D4AF37] px-4 py-1 rounded hover:bg-[#D4AF37] hover:text-black">
                Login
              </Link>
              <Link to="/register" className="bg-[#D4AF37] text-black px-4 py-1 rounded">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm">Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white"
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
        <div className="md:hidden bg-[#1a1a1a] px-4 pb-4 space-y-3">
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

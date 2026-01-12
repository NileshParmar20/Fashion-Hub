import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const container = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    // Animate Hero Section
    tl.from(".hero-content > *", { 
      y: 50, 
      opacity: 0, 
      stagger: 0.2, 
      duration: 1 
    })
    // Animate Product Cards with a slight scale up
    .from(".product-card", { 
      scale: 0.9, 
      opacity: 0, 
      stagger: 0.15, 
      duration: 0.8 
    }, "-=0.5");
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-content text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37]">
          Premium Fashion. Timeless Style.
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-300">
          Discover luxury fashion crafted for elegance and confidence.
        </p>
        {!isAuthenticated && (
          <div className="mt-6">
            <p className="text-gray-400">Login to explore personalized collections</p>
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-[#D4AF37] mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="product-card bg-[#1a1a1a] p-4 rounded shadow-lg border border-[#374151] hover:border-[#D4AF37] transition-colors duration-300"
            >
              <div className="h-40 bg-gray-800 rounded mb-3 flex items-center justify-center text-gray-500 italic">
                Image Placeholder
              </div>
              <h3 className="font-semibold text-white">Premium Collection {item}</h3>
              <p className="text-[#D4AF37] text-sm">₹ Luxury Price</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-black text-gray-400 text-center py-6 mt-10">
        © {new Date().getFullYear()} Fashion Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
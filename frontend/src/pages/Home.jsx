import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37]">
          Premium Fashion. Timeless Style.
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-gray-300">
          Discover luxury fashion crafted for elegance and confidence.
        </p>

        {!isAuthenticated && (
          <div className="mt-6">
            <p className="text-gray-400">
              Login to explore personalized collections
            </p>
          </div>
        )}
      </section>

      {/* Featured / Placeholder */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-[#D4AF37] mb-6">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-[#1a1a1a] p-4 rounded shadow hover:shadow-lg transition"
            >
              <div className="h-40 bg-gray-700 rounded mb-3" />
              <h3 className="font-semibold">Product Name</h3>
              <p className="text-gray-400 text-sm">₹ Price</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 text-center py-6 mt-10">
        © {new Date().getFullYear()} Fashion Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;

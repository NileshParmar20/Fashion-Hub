import Navbar from "../components/Navbar";

const About = () => (
  <div className="min-h-screen bg-[#0F0F0F] text-white">
    <Navbar />
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl text-[#D4AF37] font-bold mb-4">
        About Fashion Hub
      </h1>
      <p className="text-gray-300 leading-relaxed">
        Fashion Hub delivers premium fashion designed for elegance,
        confidence, and timeless style.
      </p>
    </div>
  </div>
);

export default About;

import Navbar from "../components/Navbar";

const Contact = () => (
  <div className="min-h-screen bg-[#0F0F0F] text-white">
    <Navbar />
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl text-[#D4AF37] font-bold mb-4">
        Contact Us
      </h1>
      <p className="text-gray-300">
        📧 support@fashionhub.com <br />
        📞 +91 90000 00000
      </p>
    </div>
  </div>
);

export default Contact;

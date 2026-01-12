import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";

const Contact = () => {
  const container = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".contact-title", { x: -20, opacity: 0, duration: 0.8 })
      .from(".contact-info", { opacity: 0, duration: 1 }, "-=0.4");
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="contact-title text-3xl text-[#D4AF37] font-bold mb-4">
          Contact Us
        </h1>
        <p className="contact-info text-gray-300">
          📧 support@fashionhub.com <br />
          📞 +91 90000 00000
        </p>
      </div>
    </div>
  );
};

export default Contact;
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar";

const About = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.from(".animate-text", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: "power3.out",
    });
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="animate-text text-3xl text-[#D4AF37] font-bold mb-4">
          About Fashion Hub
        </h1>
        <p className="animate-text text-gray-300 leading-relaxed">
          Fashion Hub delivers premium fashion designed for elegance,
          confidence, and timeless style.
        </p>
      </div>
    </div>
  );
};

export default About;
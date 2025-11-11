import React, { useState } from "react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    "Quick approval process",
    "Competitive interest rates",
    "Flexible payment terms",
  ];

  return (
    <div className="font-['DM Sans'] text-[#192132]">
      {/* Navbar */}
      <nav className="bg-[#FABF24] shadow px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="/images/sws-logo.jpg"
            alt="SWS Logo"
            className="h-10 rounded"
          />
        </div>

        <ul className="hidden md:flex space-x-6 font-medium">
          <li>
            <a href="#home" className="hover:text-amber-800">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-amber-800">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="hover:text-amber-800">
              Services
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-amber-800">
              Contact
            </a>
          </li>
        </ul>

        <button className="bg-[#65000B] text-white px-4 py-2 transition rounded-lg hidden md:block">
          Log in
        </button>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-3xl text-[#65000B]"
          aria-label="Toggle Menu"
        >
          &#9776;
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-[#FABF24] shadow px-6 py-4 flex flex-col space-y-4 md:hidden">
          <a href="#home" className="hover:text-amber-800">
            Home
          </a>
          <a href="#about" className="hover:text-amber-800">
            About
          </a>
          <a href="#services" className="hover:text-amber-800">
            Services
          </a>
          <a href="#contact" className="hover:text-amber-800">
            Contact
          </a>
          <button className="bg-[#65000B] text-white px-4 py-2 rounded-lg">
            Log in
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative bg-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Low Rates. Big Dreams. Made Possible.
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Your trusted partner for finance and lending solutions. We offer quick
          and reliable loan services to meet your needs. Contact us today!
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <div className="space-y-3 text-left">
            {features.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#FABF24]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-x-4">
          <a href="#contact">
            <button className="bg-[#FABF24] text-[#192132] px-6 py-3 font-semibold rounded-lg hover:opacity-90 transition">
              Contact Us
            </button>
          </a>

          <a href="#services">
            <button className="border-2 border-[#FABF24] text-[#FABF24] px-6 py-3 font-semibold rounded-lg hover:bg-[#FABF24] hover:text-[#192132] transition">
              Discover More
            </button>
          </a>
        </div>

        {/* Hero Image */}
        <div className="relative mt-16 max-w-5xl mx-auto">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent z-10"></div>
          <img
            src="/images/hero1.png"
            alt="Landing"
            className="w-full h-[500px] object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>
    </div>
  );
}

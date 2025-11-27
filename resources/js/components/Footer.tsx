import React, { FC, useCallback } from "react";
import { Link } from "@inertiajs/react"; // ✅ Inertia Link
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer: FC = () => {
  // Scroll helper: smooth scroll to section if present
  const scrollToId = useCallback((id: string, e?: React.MouseEvent<Element>) => {
    if (e) e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // fallback: set hash so browser tries
      window.location.hash = "#" + id;
    }
  }, []);

  return (
    <footer className="bg-gradient-navy text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12 text-center md:text-left">
          {/* Logo + socials */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 justify-center md:justify-start">
              <div className="justify-center mx-auto md:mx-0">
                        {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                  <img src="/images/jamo-logo-1.png" alt="Jamo Logo" className="h-12 w-auto max-w-[10rem]object-contain" />

                </Link>
              </div>
              {/* <span className="font-bold text-lg">JAMO Lending Corp</span> */}
            </div>
            <p className="text-sm text-white/70 mb-4">
              Your trusted partner for finance and lending solutions. Experience a seamless lending future with us.
            </p>
            <div className="flex justify-center md:justify-start gap-3">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#home" onClick={(e) => scrollToId("home", e)} className="text-white/70 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" onClick={(e) => scrollToId("services", e)} className="text-white/70 hover:text-white">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/#about" onClick={(e) => scrollToId("about", e)} className="text-white/70 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" onClick={(e) => scrollToId("contact", e)} className="text-white/70 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#services" onClick={(e) => scrollToId("services", e)} className="text-white/70 hover:text-white">Personal Loans</Link></li>
              <li><Link href="/#services" onClick={(e) => scrollToId("services", e)} className="text-white/70 hover:text-white">Home Loans</Link></li>
              <li><Link href="/#services" onClick={(e) => scrollToId("services", e)} className="text-white/70 hover:text-white">Business Loans</Link></li>
              <li><Link href="/#services" onClick={(e) => scrollToId("services", e)} className="text-white/70 hover:text-white">Emergency Loans</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>123 Finance Street, Makati</li>
              <li>North Cavaban Philippines</li>
              <li className="pt-2">Call: +63 9123987576</li>
              <li>Email: contact@lemolending.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
          © 2025 JAMO Lending Corporation. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

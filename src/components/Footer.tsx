import React, { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer: FC = () => {
  const navigate = useNavigate();

  // Robust scroll helper:
  // - tries to scroll if element exists in current DOM
  // - if not found, navigates to "/#id" and retries after a short delay
  const scrollToId = useCallback(
    (id: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
      if (e) e.preventDefault();

      // Try immediate scroll first
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      // If element not present in current DOM, navigate to home with hash
      // This works for react-router apps where the section lives on the home route.
      try {
        // Use navigate to preserve SPA behavior
        navigate("/#" + id);

        // Retry after navigation to allow route/component to mount
        setTimeout(() => {
          const elAfterNav = document.getElementById(id);
          if (elAfterNav) {
            elAfterNav.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            // Final fallback: set location hash (forces browser to try)
            window.location.hash = "#" + id;
          }
        }, 300);
      } catch {
        // If navigate isn't available for some reason, fallback to location change
        window.location.href = "/#" + id;
      }
    },
    [navigate]
  );

  return (
    <footer className="bg-gradient-navy text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12 text-center md:text-left">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-golden flex items-center justify-center mx-auto md:mx-0">
                <span className="text-sm font-bold text-white">LOGO</span>
              </div>
              <span className="font-bold text-lg">JAMO Lending Corp</span>
            </div>

            <p className="text-sm text-white/70 mb-4">
              Your trusted partner for finance and lending solutions. Experience a seamless lending future with us.
            </p>

            <div className="flex justify-center md:justify-start gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/#home"
                  onClick={(e) => {
                    // simple home fallback
                    e.preventDefault();
                    navigate("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-white/70 hover:text-white"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  onClick={(e) => scrollToId("services", e)}
                  className="text-white/70 hover:text-white"
                >
                  Our Services
                </a>
              </li>
              <li>
                <a
                  href="/#about"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId("about");
                  }}
                  className="text-white/70 hover:text-white"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId("contact");
                  }}
                  className="text-white/70 hover:text-white"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/#services"
                  onClick={(e) => scrollToId("services", e)}
                  className="text-white/70 hover:text-white"
                >
                  Personal Loans
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  onClick={(e) => scrollToId("services", e)}
                  className="text-white/70 hover:text-white"
                >
                  Home Loans
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  onClick={(e) => scrollToId("services", e)}
                  className="text-white/70 hover:text-white"
                >
                  Business Loans
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  onClick={(e) => scrollToId("services", e)}
                  className="text-white/70 hover:text-white"
                >
                  Emergency Loans
                </a>
              </li>
            </ul>
          </div>

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

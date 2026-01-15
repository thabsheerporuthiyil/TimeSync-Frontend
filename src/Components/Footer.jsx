import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Mapping display names to your actual project routes
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/watches" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16 text-center md:text-left">
          
          {/* Brand Identity */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-serif tracking-tight text-gray-900 mb-4">
              Time<span className="text-blue-600 font-light">Sync</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-light">
              Redefining luxury timepieces for the modern era. Timeless design, unmatched precision.
            </p>
          </div>

          {/* Quick Links - Using the mapped routes */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-900 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-900 mb-6">
              Follow Us
            </h3>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-all transform hover:-translate-y-1"><Facebook size={18} strokeWidth={1.5} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-all transform hover:-translate-y-1"><Twitter size={18} strokeWidth={1.5} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-all transform hover:-translate-y-1"><Instagram size={18} strokeWidth={1.5} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-all transform hover:-translate-y-1"><Mail size={18} strokeWidth={1.5} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium">
          <p>© {currentYear} TimeSync Group. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
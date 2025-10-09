import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center md:text-left">
        
        {/* Brand Column */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-3xl font-bold mb-4 text-white tracking-wide">
            Time<span className="text-blue-500">Sync</span>
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-xs">
            Redefining luxury timepieces for the modern era. Timeless design, unmatched precision.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2 w-fit">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link to="/watches" className="hover:text-blue-400 transition">Products</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Social Column */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2 w-fit">
            Follow Us
          </h3>
          <div className="flex space-x-5">
            <a href="#" className="hover:text-blue-400 transition transform hover:scale-110"><Facebook /></a>
            <a href="#" className="hover:text-blue-400 transition transform hover:scale-110"><Twitter /></a>
            <a href="#" className="hover:text-blue-400 transition transform hover:scale-110"><Instagram /></a>
            <a href="#" className="hover:text-blue-400 transition transform hover:scale-110"><Mail /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">
          Time<span className="text-blue-500">Sync</span>
        </span>. All rights reserved.
      </div>
    </footer>
  );
}

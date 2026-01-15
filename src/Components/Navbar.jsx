import { useState, useContext, useRef, useEffect } from "react";
import { ShoppingCart, Heart, Menu, X, Package, User, LogOut, ChevronDown, LayoutDashboard, Bell } from "lucide-react"; // Added LayoutDashboard icon
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ShopContext } from "../context/ShopContext";
import { useNotifications } from "../context/NotificationContext";


export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useContext(UserContext);
  const { cart, wishlist } = useContext(ShopContext);
  const { notifications, unreadCount } = useNotifications();



  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full top-0 z-[100] transition-all duration-300 ${scrolled ? "bg-white shadow-md h-16" : "bg-white border-b border-gray-100 h-20"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between h-full">

        {/* Logo */}
        <div className="text-2xl font-serif tracking-tight text-gray-900">
          <Link to="/" className="flex items-center gap-1 group">
            <span className="font-light tracking-tighter">Time</span>
            <span className="text-blue-600 font-light group-hover:text-blue-700 transition-colors">Sync</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10">
          {[
            { name: "Home", path: "/" },
            { name: "Products", path: "/watches" },
            { name: "About", path: "/about" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[12px] font-bold uppercase tracking-[0.25em] transition-all relative group ${isActive(link.path) ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-[1.5px] bg-blue-600 transition-all duration-300 group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
            </Link>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-5">
          {/* Notifications */}
          {user && (
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2 group"
            >
              <Bell className="w-5 h-5 text-gray-700 transition-transform group-hover:scale-110" />

              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
          )}
          {/* Wishlist */}
          <Link to="/wishlist" className="relative p-2 group">
            <Heart
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${user && wishlist.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
            />
            {user && wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 group">
            <ShoppingCart className="w-5 h-5 text-gray-700 transition-transform group-hover:scale-110" />
            {user && cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0)}
              </span>
            )}
          </Link>

          <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-offset-2 ring-transparent hover:ring-blue-100 transition-all">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-5 py-3 border-b border-gray-50 mb-2">
                    <p className="text-gray-900 font-bold text-sm truncate">{user.full_name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest truncate">{user.email}</p>
                  </div>

                  {/* ADMIN LINK: Only shows if user.role is 'admin' */}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-5 py-2.5 text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}

                  <Link to="/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                    <Package className="w-4 h-4" /> My Orders
                  </Link>

                  <div className="border-t border-gray-50 mt-2 pt-2">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all duration-300 rounded-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
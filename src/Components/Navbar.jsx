import { useState, useEffect, useContext } from "react";
import { ShoppingCart, Heart, Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ShopContext } from "../context/ShopContext";

export default function Navbar() {
const [isOpen, setIsOpen] = useState(false); //mobile menu
const [dropdownOpen, setDropdownOpen] = useState(false);
const { user, setUser } = useContext(UserContext);
const { cart, wishlist } = useContext(ShopContext); //cart and wishlist
const navigate = useNavigate();

useEffect(() => {
const storedUser = localStorage.getItem("user");
if (storedUser) {
  setUser(JSON.parse(storedUser));
  }
}, [setUser]);

const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null);
  navigate("/login");
};

return (
  <nav className="bg-white shadow-md fixed w-full top-0 z-50">
    <div className="container mx-auto px-4 flex items-center justify-between h-16">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">
        <Link to="/">
        Time<span className="text-blue-600">Sync</span>
        </Link>
      </div>

      {/* Desktop navigation links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/watches" className="text-gray-700 hover:text-blue-600">Watches</Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-4">

        {/* Wishlist */}
        <Link to="/wishlist" className="relative">
          <Heart className="w-6 h-6 text-gray-700 hover:text-red-500" />
          {user && wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600" />
          {user && cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0)}
            </span>
          )}
        </Link>

        {/* User Dropdown */}
        {user ? (
          <div className="relative hidden md:flex items-center gap-2">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-gray-700 font-semibold cursor-pointer"
            >
              Hi, <span className="text-blue-600">{user.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
            <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg w-40 py-2 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/orders"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}

          </div>
        ) : (
          <Link
            to="/login"
            className="group flex items-center px-4 py-2 rounded bg-gray-200 hover:bg-blue-600"
          >
            <span className="text-gray-700 group-hover:text-white">Login</span>
          </Link>
        )}

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </div>

    {/* Mobile menu */}
    {isOpen && (
      <div className="md:hidden bg-white shadow-md">
        <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Home</Link>
        <Link to="/watches" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Watches</Link>
        <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">About</Link>

        {user ? (
        <>
          <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            Profile
          </Link>
          <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
            My Orders
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </>
        ) : (
          <Link
            to="/login"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Login
          </Link>
        )}
      </div>
    )}
  </nav>
);
}

// Wishlist.js
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

export default function Wishlist() {
const { user } = useContext(UserContext);
const { wishlist, removeFromWishlist, addToCart, cart } = useContext(ShopContext);


if (!user) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-500">You are not logged in!</h1>
      <p className="text-gray-600 mt-2">Please log in to view your Wishlist.</p>
      <Link
        to="/login"
        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}

// If wishlist is empty
if (wishlist.length === 0) {
  return (
    <div className="mt-20 flex flex-col items-center">
      <h1 className="text-2xl font-bold">Your Wishlist</h1>
      <p className="text-gray-600 mt-2">Your wishlist is empty.</p>
      <Link
        to="/watches"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Browse Products
      </Link>
    </div>
  );
}

// Wishlist with items
return (
  <div className="mt-20 max-w-6xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
      Wishlist
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {wishlist.map((item) => {
        const isInCart = cart.some((cartItem) => cartItem.id === item.id); //checking duplicate
        
        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-4 flex flex-col"
          >
            {/* Image with link */}
            <Link to={`/products/${item.id}`} className="flex justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 object-contain transition-transform hover:scale-105"
              />
            </Link>

            {/* Product Info */}
            <div className="mt-4 flex-1 text-center">
              <h2 className="font-semibold text-lg text-gray-800">{item.name}</h2>
              <p className="text-gray-500 mt-1">₹{item.price}</p>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
            {/* Add to Cart */}
              <button
                onClick={() => {
                if (!item.stock || item.stock <= 0) {
                  toast.error("This product is out of stock!");
                  return;
                }
                if (isInCart) {
                  toast.warning("Already in Cart!");
                  return;
                }
                addToCart(item); //  Handles toast and stock internally
              }}
                disabled={!item.stock || item.stock <= 0}
                className={`flex-1 px-4 py-2 rounded-md ${
                  !item.stock || item.stock <= 0
                    ? "bg-gray-200 text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Add to Cart
              </button>


              {/* Remove */}
              <button
                onClick={() => {
                  removeFromWishlist(item.id);
                  toast.warning("Removed from Wishlist!");
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}

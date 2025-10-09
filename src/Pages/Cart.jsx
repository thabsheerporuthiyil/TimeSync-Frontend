import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ShopContext } from "../context/ShopContext";
import { Trash2 } from "lucide-react";

export default function Cart() {
const { user } = useContext(UserContext);
const { cart, addToCart, decreaseFromCart, removeFromCart } = useContext(ShopContext);
const navigate=useNavigate();

// price string to number
const getPriceNumber = (price) => {
  if (typeof price === "string") {
    const digits = price.replace(/[^\d]/g, "");
    return parseInt(digits || "0", 10);
  }
  return Number(price || 0);
};

// Calculate total
const totalPrice = (cart || []).reduce(
  (total, item) => total + getPriceNumber(item.price) * (Number(item.quantity) || 1),
  0
);


if (!user) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold text-red-500">You are not logged in</h1>
      <p className="text-gray-500 mt-2">Please log in to view your cart.</p>
      <Link
        to="/login"
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}

// If cart is empty
if (!cart || cart.length === 0) {
  return (
    <div className="mt-20 flex flex-col items-center">
      <h1 className="text-2xl font-semibold text-gray-800">Your Cart</h1>
      <p className="text-gray-500 mt-2">Your cart is empty.</p>
      <Link
        to="/watches"
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

return (
  <div className="mt-20 p-4 sm:p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Cart Items */}
    <div className="lg:col-span-2 space-y-4">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">Your Cart</h1>
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
        >
          {/* Product Info */}
          <Link to={`/products/${item.id}`} className="flex items-center gap-4 flex-1 w-full sm:w-auto">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 sm:w-16 sm:h-16 object-contain rounded-md"
            />
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-gray-500">₹{item.price}</p>
            </div>
          </Link>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => decreaseFromCart(item.id)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 hover:text-gray-800 transition"
            >
              −
            </button>
            <span className="px-2 sm:px-3 text-lg font-medium">{Number(item.quantity) || 1}</span>
            <button
              onClick={() => addToCart(item)}
              disabled={item.quantity >= item.stock || item.stock === 0}
              className={`w-9 h-9 flex items-center justify-center rounded-full font-bold transition
                ${item.quantity >= item.stock || item.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800"}
              `}
            >
              +
            </button>

          </div>

          {/* Actions */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => removeFromCart(item.id)}
              className="h-7 w-7 flex items-center justify-center border border-gray-300 text-gray-600 rounded hover:bg-red-500 hover:text-white transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Checkout */}
    <div className="bg-white p-6 rounded-lg shadow-sm h-fit lg:sticky top-20">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2 text-gray-700">
        <span>Items:</span>
        <span>{cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0)}</span>
      </div>
      <div className="flex justify-between mb-2 text-gray-700">
        <span>Subtotal:</span>
        <span>₹{totalPrice.toLocaleString()}</span>
      </div>
      <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
        <span>Total:</span>
        <span>₹{totalPrice.toLocaleString()}</span>
      </div>
      <button onClick={() => {
        if (cart.length === 0) {
          toast.warning("Your cart is empty!");
          return;
        }
        navigate("/payment");
      }}
      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
        Checkout
      </button>
    </div>
  </div>
);
}

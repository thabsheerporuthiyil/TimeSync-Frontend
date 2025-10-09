import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart, wishlist, addToCart, toggleWishlist } = useContext(ShopContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://timesync-e-commerce.onrender.com/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mt-20 flex flex-col items-center p-6">
        <div className="w-64 h-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-gray-200 rounded w-32 h-10 animate-pulse"></div>
          <div className="px-4 py-2 bg-gray-200 rounded w-32 h-10 animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-20 mt-4 animate-pulse"></div>
      </div>
    );
  }

  const existingCartItem = cart.find((item) => item.id === product.id);
  const remainingStock = product.stock - (existingCartItem?.quantity || 0);
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("You must be logged in!");
      navigate("/login");
      return;
    }

    if (remainingStock <= 0) {
      toast.warning("No more stock available!");
      return;
    }

    addToCart(product);
    toast.success("Added to Cart!");
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error("You must be logged in!");
      navigate("/login");
      return;
    }

    toggleWishlist(product);

    if (isInWishlist) toast.info("Removed from Wishlist!");
    else toast.success("Added to Wishlist!");
  };

  return (
    <div className="mt-20 flex flex-col items-center p-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-64 h-64 object-contain mb-4"
      />

      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-lg text-gray-600 mb-2">Brand: {product.brand}</p>
      <p className="text-xl font-bold text-blue-600 mb-2">₹{product.price}</p>

      {/* Stock Info */}
      <p
        className={`mb-4 text-sm font-semibold ${
          remainingStock > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {remainingStock > 0
          ? `${remainingStock} item${remainingStock > 1 ? "s" : ""} left in stock`
          : "Out of stock"}
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={remainingStock <= 0}
          className={`px-4 py-2 rounded transition ${
            remainingStock <= 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {remainingStock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>

        <button
          onClick={handleWishlist}
          className={`px-4 py-2 rounded transition ${
            isInWishlist
              ? "bg-gray-400 text-white"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isInWishlist ? "Remove Wishlist" : "Wishlist"}
        </button>
      </div>

      <Link to="/watches" className="text-gray-600 mt-4 underline">
        Back
      </Link>
    </div>
  );
}

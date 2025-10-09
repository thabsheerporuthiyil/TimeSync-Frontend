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
  const { cart, wishlist, addToCart, addToWishlist } = useContext(ShopContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://timesync-e-commerce.onrender.com/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    return <p className="mt-20 text-center">Loading product...</p>;
  }

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const existingCartItem = cart.find((item) => item.id === product.id);
  const remainingStock = product.stock - (existingCartItem?.quantity || 0);

  // Add to Cart with stock validation
  const handleAddToCart = () => {
    if (!user) {
      toast.error("You must be logged in!");
      navigate("/login");
      return;
    }

    if (product.stock <= 0) {
      toast.error("This product is out of stock!");
      return;
    }

    if (remainingStock <= 0) {
      toast.warning("No more stock available!");
      return;
    }

    addToCart(product);
    toast.success("Added to Cart!");
  };

  // Add to Wishlist
  const handleAddToWishlist = () => {
    if (!user) {
      toast.error("You must be logged in!");
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      toast.warning("Already in Wishlist!");
      return;
    }

    addToWishlist(product);
    toast.success("Added to Wishlist!");
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
          onClick={handleAddToWishlist}
          className={`px-4 py-2 rounded transition ${
            isInWishlist
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isInWishlist ? "Already in Wishlist" : "Wishlist"}
        </button>
      </div>

      <Link to="/watches" className="text-gray-600 mt-4 underline">
        Back
      </Link>
    </div>
  );
}

import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import { toast } from 'sonner';
import { ShoppingBag, Heart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart, wishlist, addToCart, toggleWishlist } = useContext(ShopContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get(`products/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 animate-pulse">
        <div className="bg-gray-100 rounded-3xl h-[500px]"></div>
        <div className="space-y-6 py-12">
          <div className="h-4 bg-gray-100 w-24 rounded"></div>
          <div className="h-12 bg-gray-100 w-3/4 rounded"></div>
          <div className="h-6 bg-gray-100 w-1/2 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="flex gap-4">
            <div className="h-14 bg-gray-100 flex-1 rounded-xl"></div>
            <div className="h-14 bg-gray-100 flex-1 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <p className="mt-40 text-center font-serif text-xl">Product not found</p>;

  const existingCartItem = cart.find((item) => item.id === product.id);
  const remainingStock = product.stock - (existingCartItem?.quantity || 0);
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!user) { toast.error("Please login to continue"); navigate("/login"); return; }
    if (remainingStock <= 0) { toast.warning("Out of stock"); return; }
    addToCart(product);
    toast.success("Added to your collection");
  };

  const handleWishlist = () => {
    if (!user) { toast.error("Please login to continue"); navigate("/login"); return; }
    toggleWishlist(product);
    if (isInWishlist) toast.info("Removed from Vault");
    else toast.success("Saved to Vault");
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb / Back Link */}
        <Link to="/watches" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Product Stage */}
          <div className="relative group bg-[#fafafa] rounded-3xl p-12 flex items-center justify-center overflow-hidden border border-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md object-contain drop-shadow-2xl transform transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-6 left-6">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase bg-white px-4 py-2 rounded-full shadow-sm">
                Authentic Piece
              </span>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="py-6 lg:sticky lg:top-32">
            <div className="mb-8">
              <span className="text-blue-600 text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
                {product.brand_name}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-light text-gray-900 italic">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
            </div>

            <div className="h-[1px] w-full bg-gray-100 mb-8"></div>

            {/* Stock Awareness */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-2 h-2 rounded-full animate-pulse ${remainingStock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
              <p className={`text-[11px] font-bold uppercase tracking-widest ${remainingStock > 0 ? "text-green-600" : "text-red-600"}`}>
                {remainingStock > 0 ? `Highly Desired: ${remainingStock} Available` : "Currently Out of Stock"}
              </p>
            </div>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={remainingStock <= 0}
                className={`flex-[2] py-5 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-100 ${
                  remainingStock <= 0 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-900 text-white hover:bg-blue-600 hover:-translate-y-1"
                }`}
              >
                <ShoppingBag size={16} />
                {remainingStock <= 0 ? "Out of Stock" : "Reserve Piece"}
              </button>

              <button
                onClick={handleWishlist}
                className={`flex-1 py-5 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all border flex items-center justify-center gap-3 ${
                  isInWishlist 
                  ? "bg-red-50 border-red-100 text-red-500" 
                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
                {isInWishlist ? "Saved" : "Save to Vault"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
              <div className="flex flex-col items-center text-center">
                <ShieldCheck size={20} className="text-blue-600 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Truck size={20} className="text-blue-600 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Global Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw size={20} className="text-blue-600 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Easy Returns</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
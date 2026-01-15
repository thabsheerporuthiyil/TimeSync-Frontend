import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ShopContext } from "../context/ShopContext";
import { toast } from 'sonner';
import { ShoppingBag, Trash2, Heart, ArrowRight } from "lucide-react"; // Icons for premium feel

export default function Wishlist() {
  const { user } = useContext(UserContext);
  const { wishlist, toggleWishlist, addToCart, cart } = useContext(ShopContext);

  // 1. Not Logged In State
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] pt-20 px-6">
        <div className="text-center space-y-6 max-w-md bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} />
          </div>
          <h1 className="text-3xl font-serif text-gray-900">Authentication Required</h1>
          <p className="text-gray-500 font-light leading-relaxed">
            Please log in to your account to view your curated collection of saved timepieces.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-all font-bold tracking-widest text-[11px] uppercase shadow-lg shadow-gray-200"
          >
            Go to Login <ArrowRight size={14} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  // 2. Empty Wishlist State
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] pt-20 px-6">
        <div className="text-center space-y-6 max-w-lg">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-600 block mb-4 bg-blue-50 px-4 py-2 rounded-full w-fit mx-auto">
            Your Collection
          </span>
          <h1 className="text-5xl font-serif text-gray-900">Your Wishlist <span className="text-gray-400 font-light">is empty.</span></h1>
          <p className="text-gray-500 font-light text-lg">
            Discover a masterpiece and save it for your next milestone.
          </p>
          <Link
            to="/watches"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-full hover:bg-blue-600 transition-all font-bold tracking-widest text-[11px] uppercase"
          >
            Browse Collections <ShoppingBag size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // 3. Active Wishlist Items
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-serif text-gray-900 tracking-tight mb-4">
            Personal <span className=" text-gray-400 font-light">Vault</span>
          </h1>
          <div className="h-[1px] w-20 bg-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-400 text-[10px] tracking-[0.3em] uppercase font-bold">
            {wishlist.length} Items Saved
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((item) => {
            const isInCart = cart.some((cartItem) => cartItem.id === item.id);
            const isOutOfStock = !item.stock || item.stock <= 0;

            return (
              <div
                key={item.id}
                className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative p-8 bg-gray-50/50 aspect-square flex items-center justify-center overflow-hidden">
                  <Link to={`/products/${item.id}`} className="block transform transition-transform duration-700 group-hover:scale-110">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-44 h-44 object-contain"
                    />
                  </Link>
                  {isOutOfStock && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white border border-red-100 text-red-500 text-[9px] font-bold uppercase tracking-widest rounded-full">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-6 flex-1 flex flex-col bg-white">
                  <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 line-clamp-1">{item.name}</h2>
                    <p className="text-blue-600 text-sm mt-1">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      onClick={() => {
                        if (isOutOfStock) {
                          toast.error("This product is out of stock!");
                          return;
                        }
                        if (isInCart) {
                          toast.warning("Already in Cart!");
                          return;
                        }
                        addToCart(item);
                      }}
                      disabled={isOutOfStock}
                      className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        isOutOfStock || isInCart
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-900 text-white hover:bg-blue-600"
                      }`}
                    >
                      <ShoppingBag size={14} />
                      {isInCart ? "Already in Cart" : "Move to Cart"}
                    </button>

                    <button
                      onClick={() => {
                        toggleWishlist(item);
                        toast.warning("Removed from Wishlist!");
                      }}
                      className="w-full py-3 text-gray-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={12} />
                      Remove from Vault
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
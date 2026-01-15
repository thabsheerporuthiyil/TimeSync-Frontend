import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ShopContext } from "../context/ShopContext";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { toast } from 'sonner';

export default function Cart() {
  const { user } = useContext(UserContext);
  const { cart, addToCart, decreaseFromCart, removeFromCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const getPriceNumber = (price) => {
    if (price === null || price === undefined) return 0;
    const parsed = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(parsed) ? 0 : parsed;
  };

  const totalPrice = (cart || []).reduce(
    (total, item) => total + getPriceNumber(item.price) * (Number(item.quantity) || 1),
    0
  );

  // 1. Not Logged In State
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] pt-20 px-6">
        <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={30} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-serif text-gray-900 mb-2">Your Bag Awaits</h1>
          <p className="text-gray-500 font-light mb-8">Please log in to review your selections and proceed to checkout.</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-blue-600 transition-all font-bold tracking-widest text-[11px] uppercase shadow-lg shadow-gray-200"
          >
            Sign In <ArrowRight size={14} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  // 2. Empty Cart State
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] pt-20 px-6">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-serif text-gray-900">Your Bag <span className="text-gray-400 font-light">is empty.</span></h1>
          <p className="text-gray-500 font-light text-lg max-w-sm">Fine timepieces are waiting to be discovered.</p>
          <Link
            to="/watches"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-full hover:bg-blue-600 transition-all font-bold tracking-widest text-[11px] uppercase"
          >
            Explore Collection <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left: Cart Items (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-baseline justify-between mb-10 border-b border-gray-200 pb-6">
              <h1 className="text-4xl font-serif text-gray-900 tracking-tight">Shopping <span className="text-gray-400 font-light">Bag</span></h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{cart.length} Items</p>
            </div>

            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500"
                >
                  {/* Image */}
                  <Link to={`/products/${item.id}`} className="w-32 h-32 bg-[#fafafa] rounded-xl flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply transform transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/products/${item.id}`}>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</h2>
                    </Link>
                    <p className="text-blue-600 font-serif mt-1">₹{Number(item.price).toLocaleString("en-IN")}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                      <div className="flex items-center border border-gray-100 rounded-full bg-gray-50 px-2 py-1">
                        <button
                          onClick={() => decreaseFromCart(item.id)}
                          disabled={Number(item.quantity) <= 1}
                          className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors text-gray-600
                            ${Number(item.quantity) <= 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-white text-gray-600"
                            }`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-bold">{Number(item.quantity) || 1}</span>
                        <button
                          onClick={async () => {
                            if (item.quantity >= item.stock) {
                              toast.error("Stock limit reached");
                              return;
                            }
                            try { await addToCart(item); } catch (err) { toast.error("Stock limit reached"); }
                          }}
                          disabled={item.quantity >= item.stock}
                          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${item.quantity >= item.stock ? "text-gray-300 cursor-not-allowed" : "hover:bg-white text-gray-600"
                            }`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-center sm:items-end justify-between h-full sm:min-w-[120px]">
                    <p className="text-lg font-serif text-gray-900">
                      ₹{(getPriceNumber(item.price) * (Number(item.quantity) || 1)).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-4 sm:mt-0 p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-32">
              <h2 className="text-xl font-serif text-gray-900 mb-6 pb-4 border-b border-gray-50">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-serif normal-case text-base">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600">Complimentary</span>
                </div>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-baseline">
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-900">Total</span>
                  <span className="text-2xl font-serif text-blue-600">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (cart.length === 0) { toast.warning("Your cart is empty!"); return; }
                  navigate("/payment");
                }}
                className="w-full bg-gray-900 text-white py-5 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 hover:bg-blue-600 shadow-lg shadow-gray-100"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </button>

              <p className="mt-6 text-[10px] text-center text-gray-400 leading-relaxed uppercase tracking-tighter">
                Secure checkout powered by TimeSync Encryption.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
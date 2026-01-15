import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'sonner';
import { Check, Package, Calendar, CreditCard, ArrowRight } from "lucide-react";

export default function OrderConfirmation() {
  const { user } = useContext(UserContext);
  const { clearCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    items = [],
    paymentDetails = {},
    paymentMethod = "cod",
    orderId = "",
    orderDate = "",
    orderTime = "",
    email = "",
  } = location.state || {};

  const calculatedTotal = items.reduce((acc, item) => {
    const cleanPrice = Number((item.price || "0").toString().replace(/,/g, ""));
    return acc + cleanPrice * (item.quantity || 1);
  }, 0);

  useEffect(() => {
    if (!user) {
      toast.error("Access denied.");
      navigate("/login");
      return;
    }
    if (items.length === 0) {
      navigate("/watches");
      return;
    }
    // Clear cart once order is confirmed and displayed
    if (clearCart) clearCart();
  }, [user, items, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Animation & Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200">
            <Check className="text-white w-10 h-10" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-serif text-gray-900 mb-3 tracking-tight">
            Order <span className="italic font-light text-gray-400">Confirmed</span>
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">
            Thank you for choosing TimeSync Luxe
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Order Metadata Block */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-50">
            <div className="p-6 border-r border-gray-50 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
              <p className="text-xs font-bold text-gray-900">#{orderId.toString().toUpperCase()}</p>
            </div>
            <div className="p-6 md:border-r border-gray-50 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
              <p className="text-xs font-bold text-gray-900">{orderDate}</p>
            </div>
            <div className="p-6 border-r border-gray-50 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-xs font-bold text-gray-900">₹{calculatedTotal.toLocaleString()}</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment</p>
              <p className="text-xs font-bold text-gray-900 uppercase">{paymentMethod}</p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Items List */}
            <div className="space-y-8 mb-12">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Manifest</h2>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-serif text-gray-900">{item.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Qty: {item.quantity || 1} • {item.brand || 'Luxe Collection'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{(Number((item.price || "0").toString().replace(/,/g, "")) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-12 pt-10 border-t border-gray-50">
              <div>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Delivery Address</h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-bold text-gray-900 mb-1">{paymentDetails.billingName}</p>
                  <p>{paymentDetails.billingAddress}</p>
                  <p>{paymentDetails.billingCity}, {paymentDetails.billingState} {paymentDetails.billingZip}</p>
                  <p className="mt-2 text-[11px] font-bold text-gray-400 italic">Contact: {paymentDetails.billingPhone}</p>
                </div>
              </div>
              {/* <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Notification</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  A digital receipt and tracking details have been dispatched to your registered email:
                </p>
                <p className="text-sm font-bold text-gray-900 truncate">{email}</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            Track Order <Package size={14} />
          </button>
          <button
            onClick={() => navigate("/watches")}
            className="flex-1 bg-white border border-gray-200 text-gray-900 py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            Continue Browsing <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
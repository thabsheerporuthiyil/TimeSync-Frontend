import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { ShieldCheck, CreditCard, Truck, ChevronLeft, Lock } from "lucide-react";
import api from "../api/axios";

const countries = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "China"];

export default function Payment() {
  const { user, loading: userLoading } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { cart, cartChecked, fetchCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [paymentDetails, setPaymentDetails] = useState({
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "India",
  });

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price.toString().replace(/,/g, "")) * (item.quantity || 1),
    0
  );

  const isAddressValid = () => {
    return Object.values(paymentDetails).every(val => val.trim() !== "");
  };

  useEffect(() => {
    if (userLoading || !cartChecked) return;
    if (!user) { navigate("/login"); return; }
    if (cart.length === 0 && !orderPlaced) { navigate("/watches"); }
  }, [userLoading, user, cartChecked, cart.length, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
  e.preventDefault();

  if (!isAddressValid()) {
    toast.error("Please complete your delivery details");
    return;
  }

  setLoading(true);

  try {
    // Checkout (only validation)
    await api.post("orders/checkout/", {
      billing: {
        name: paymentDetails.billingName,
        email: paymentDetails.billingEmail,
        phone: paymentDetails.billingPhone,
        address: paymentDetails.billingAddress,
        city: paymentDetails.billingCity,
        state: paymentDetails.billingState,
        zip: paymentDetails.billingZip,
        country: paymentDetails.billingCountry,
      },
    });

    // COD FLOW
    if (paymentMethod === "cod") {
      const res = await api.post("orders/cod/", {
        billing: {
          name: paymentDetails.billingName,
          email: paymentDetails.billingEmail,
          phone: paymentDetails.billingPhone,
          address: paymentDetails.billingAddress,
          city: paymentDetails.billingCity,
          state: paymentDetails.billingState,
          zip: paymentDetails.billingZip,
          country: paymentDetails.billingCountry,
        },
      });

      finishOrder("cod", res.data.order_id);
      return;
    }

    // Create Razorpay order
    const razor = await api.post("orders/razorpay/create/");

    const options = {
      key: razor.data.key,
      amount: razor.data.amount,
      currency: "INR",
      order_id: razor.data.razorpay_order_id,
      name: "TimeSync Luxe",

      handler: async (res) => {
        // Verify payment → CREATE ORDER
        const verify = await api.post("orders/razorpay/verify/", {
          razorpay_order_id: res.razorpay_order_id,
          razorpay_payment_id: res.razorpay_payment_id,
          razorpay_signature: res.razorpay_signature,
          billing: {
            name: paymentDetails.billingName,
            email: paymentDetails.billingEmail,
            phone: paymentDetails.billingPhone,
            address: paymentDetails.billingAddress,
            city: paymentDetails.billingCity,
            state: paymentDetails.billingState,
            zip: paymentDetails.billingZip,
            country: paymentDetails.billingCountry,
          },
        });

        finishOrder("razorpay", verify.data.order_id);
      },

      prefill: {
        name: user?.name,
        email: user?.email,
      },

      theme: { color: "#111827" },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    toast.error(err.response?.data?.error || "Transaction failed");
  } finally {
    setLoading(false);
  }
};


  const finishOrder = async (method, orderId) => {
    setOrderPlaced(true);
    await fetchCart();
    navigate("/order-confirmation", {
      state: { items: cart, paymentDetails, paymentMethod: method, orderId, orderDate: new Date().toLocaleDateString(), orderTime: new Date().toLocaleTimeString(), email: user?.email }
    });
    toast.success("Order secured successfully");
  };

  if (userLoading || !cartChecked) return <div className="h-screen flex items-center justify-center font-serif italic text-gray-400">Initializing Secure Checkout...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Navigation Back */}
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-10 transition-colors">
          <ChevronLeft size={14} /> Back to Bag
        </button>

        <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column: Information */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <h2 className="text-2xl font-serif mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-sans">1</span>
                Delivery Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                  <input type="text" name="billingName" value={paymentDetails.billingName} onChange={handleInputChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" placeholder="e.g. James Bond" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                  <input type="email" name="billingEmail" value={paymentDetails.billingEmail} onChange={handleInputChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" placeholder="james@mi6.com" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
                  <input type="tel" name="billingPhone" value={paymentDetails.billingPhone} onChange={handleInputChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" placeholder="+91 00000 00000" required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">Street Address</label>
                  <input type="text" name="billingAddress" value={paymentDetails.billingAddress} onChange={handleInputChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" placeholder="Suite, Street Name" required />
                </div>
                <div className="grid grid-cols-2 md:col-span-2 gap-5">
                  <input type="text" name="billingCity" value={paymentDetails.billingCity} onChange={handleInputChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" placeholder="City" required />
                  <input type="text" name="billingState" value={paymentDetails.billingState} onChange={handleInputChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" placeholder="State" required />
                </div>
                <div className="grid grid-cols-2 md:col-span-2 gap-5">
                  <input type="text" name="billingZip" value={paymentDetails.billingZip} onChange={handleInputChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm" placeholder="ZIP Code" required />
                  <select name="billingCountry" value={paymentDetails.billingCountry} onChange={handleInputChange} className="w-full bg-white border-b border-gray-200 py-3 focus:border-black outline-none transition-colors text-sm appearance-none">
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-sans">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`cursor-pointer border p-6 rounded-2xl flex items-center gap-4 transition-all ${paymentMethod === 'razorpay' ? 'border-black bg-white shadow-sm' : 'border-gray-100 bg-gray-50/50 hover:bg-white'}`}>
                  <input type="radio" className="hidden" name="method" onClick={() => setPaymentMethod('razorpay')} />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-black' : 'border-gray-300'}`}>
                    {paymentMethod === 'razorpay' && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                  <CreditCard size={20} className="text-gray-400" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Online Payment</span>
                </label>

                <label className={`cursor-pointer border p-6 rounded-2xl flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-black bg-white shadow-sm' : 'border-gray-100 bg-gray-50/50 hover:bg-white'}`}>
                  <input type="radio" className="hidden" name="method" onClick={() => setPaymentMethod('cod')} />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-black' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                  <Truck size={20} className="text-gray-400" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Cash on Delivery</span>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sticky top-32 shadow-sm">
              <h3 className="text-lg font-serif mb-6">Order Summary</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate w-32">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">₹{(Number(item.price.toString().replace(/,/g, "")) * (item.quantity || 1)).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-50 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium uppercase text-[10px] tracking-widest">Complimentary</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-gray-50 text-gray-900">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-gray-200 disabled:bg-gray-200 flex items-center justify-center gap-3"
              >
                {loading ? "Processing..." : (
                  <>
                    <Lock size={14} />
                    {paymentMethod === "cod" ? "Place Order" : "Secure Payment"}
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">SSL Encrypted Security</span>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
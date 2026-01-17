import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { Package, Truck, XCircle, CheckCircle, Clock, ChevronRight, MapPin, CreditCard } from "lucide-react";
import api from "../api/axios";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCancel = async (orderId) => {
    try {
      await api.post("orders/cancel/", { order_id: orderId });
      toast.success("Order cancelled successfully");
      setOrders(prev =>
        prev.map(order => order.orderId === orderId ? { ...order, status: "Cancelled" } : order)
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Unable to cancel order");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("orders/my-orders/");
        const formattedOrders = res.data.map(order => ({
          orderId: order.id,
          orderDate: new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          orderTime: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: order.status === "paid" ? "Confirmed" : order.status === "cancelled" ? "Cancelled" : order.status,
          paymentMethod: order.razorpay_payment_id ? "Razorpay" : "COD",
          items: order.items.map(item => ({
            id: item.id,
            name: item.product_name,
            price: item.price,
            quantity: item.quantity,
            image: item.product_image,
          })),
          paymentDetails: order.billing
        }));
        setOrders(formattedOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Confirmed": return "bg-green-50 text-green-700 border-green-100";
      case "Cancelled": return "bg-red-50 text-red-700 border-red-100";
      case "Delivered": return "bg-blue-50 text-blue-700 border-blue-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-32 px-6">
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-10 bg-gray-200 w-48 rounded"></div>
          {[1, 2].map(i => <div key={i} className="h-64 bg-gray-100 rounded-3xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate('/watches')}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 mb-4 flex items-center gap-2 transition-colors"
          >
            <ChevronRight className="rotate-180 w-3 h-3" /> Back to Shopping
          </button>
          <h1 className="text-4xl font-serif text-gray-900 tracking-tight">Your <span className="font-light text-gray-400">Orders</span></h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-300 w-10 h-10" />
            </div>
            <p className="text-gray-500 font-serif text-xl mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/watches")}
              className="px-8 py-3 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all rounded-sm"
            >
              Browse Timepieces
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const totalAmount = order.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
              const billing = order.paymentDetails || {};

              return (
                <div key={order.orderId} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">

                  {/* Order Header */}
                  <div className="px-8 py-6 border-b border-gray-50 bg-white flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Ref</p>
                        <p className="text-sm font-medium text-gray-900">#{order.orderId.toString().toUpperCase()}</p>
                      </div>
                      <div className="hidden sm:block h-8 w-[1px] bg-gray-100"></div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date Placed</p>
                        <p className="text-sm font-medium text-gray-900">{order.orderDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                      {(order.status !== "Cancelled" && order.status !== "Delivered" && order.paymentMethod === "COD") && (
                        <button
                          onClick={() => handleCancel(order.orderId)}
                          className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors ml-2"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-8 space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div>
                            <h4 className="text-sm font-serif text-gray-900 mb-1">{item.name}</h4>
                            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer / Details */}
                  <div className="px-8 py-8 bg-gray-50/50 grid md:grid-cols-2 gap-8">
                    {/* Shipping Address */}
                    {billing.billingAddress && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-gray-400 shadow-sm">
                          <MapPin size={18} />
                        </div>
                        <div className="text-[12px] leading-relaxed text-gray-500">
                          <p className="font-bold text-gray-900 uppercase tracking-widest text-[10px] mb-2">Delivery Office</p>
                          <p className="font-medium text-gray-900 mb-1">{billing.billingName}</p>
                          <p>{billing.billingAddress}, {billing.billingCity}</p>
                          <p>{billing.billingState} {billing.billingZip}</p>
                        </div>
                      </div>
                    )}

                    {/* Payment Info */}
                    <div className="flex justify-between items-end md:text-right w-full">
                      <div className="flex gap-4 md:flex-row-reverse w-full text-left md:text-right">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-gray-400 shadow-sm">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 uppercase tracking-widest text-[10px] mb-2">Total Amount</p>
                          <p className="text-2xl font-serif text-gray-900">₹{totalAmount.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mt-1">{order.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
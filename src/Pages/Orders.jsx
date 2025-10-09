import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";

export default function Orders() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to view your orders!");
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${user.id}`);
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  // ✅ Cancel order (do not remove it, just mark as cancelled)
  const handleCancel = async (orderId) => {
    try {
      const userRes = await axios.get(`http://localhost:5000/users/${user.id}`);
      const userData = userRes.data;

      const updatedOrders = await Promise.all(
        userData.orders.map(async (order) => {
          if (order.orderId === orderId) {
            // Restore product stock
            for (const item of order.items) {
              const productRes = await axios.get(
                `http://localhost:5000/products/${item.id}`
              );
              const product = productRes.data;
              const updatedStock = (product.stock || 0) + (item.quantity || 1);
              await axios.patch(`http://localhost:5000/products/${item.id}`, {
                stock: updatedStock,
              });
            }

            // Return updated order with new status
            return { ...order, status: "Cancelled" };
          }
          return order;
        })
      );

      // Update user in backend
      await axios.patch(`http://localhost:5000/users/${user.id}`, {
        orders: updatedOrders,
      });

      // Update frontend + localStorage
      setOrders(updatedOrders);
      const updatedUser = { ...user, orders: updatedOrders };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error("Failed to cancel order. Try again.");
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mt-8">
            <p className="text-gray-600 text-lg mb-4">No orders found.</p>
            <button
              onClick={() => navigate("/watches")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const totalAmount = order.items
                ? order.items.reduce(
                    (sum, item) =>
                      sum +
                      Number((item.price || "0").toString().replace(/,/g, "")) *
                        (item.quantity || 1),
                    0
                  )
                : 0;

              const billing = order.paymentDetails || {};

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Order #{order.orderId || order.orderNumber}
                      </h2>
                      <p className="text-gray-600">
                        {order.orderDate} at {order.orderTime}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status || "Processing"}
                      </span>

                      {/* ✅ Show cancel button only if not cancelled/delivered */}
                      {(!order.status ||
                        order.status === "Processing" ||
                        order.status === "Confirmed") && (
                        <button
                          onClick={() => handleCancel(order.orderId)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-4">
                    {order.items &&
                      order.items.map((item) => {
                        const cleanPrice = Number(
                          (item.price || "0").toString().replace(/,/g, "")
                        );
                        return (
                          <div
                            key={item.id}
                            className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-4">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.name}
                                </p>
                                {item.brand && (
                                  <p className="text-sm text-gray-500">
                                    Brand: {item.brand}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity || 1}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ₹
                              {(cleanPrice * (item.quantity || 1)).toLocaleString()}
                            </p>
                          </div>
                        );
                      })}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">
                        Payment: {order.paymentMethod?.toUpperCase() || "COD"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {billing.billingAddress && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Delivery Address
                      </h3>
                      <p className="text-sm text-gray-600">
                        {billing.billingName}
                        <br />
                        {billing.billingAddress}, {billing.billingCity}
                        <br />
                        {billing.billingState}, {billing.billingZip}
                        <br />
                        {billing.billingCountry}
                        <br />
                        Phone: {billing.billingPhone}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

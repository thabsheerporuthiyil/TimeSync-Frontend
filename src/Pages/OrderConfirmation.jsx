import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function OrderConfirmation() {
  const { user } = useContext(UserContext);
  const { clearCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get order data from state passed via navigate
  const {
    items = [],
    paymentDetails = {},
    paymentMethod = "cod",
    orderId = "",
    orderDate = "",
    orderTime = "",
    email = "",
  } = location.state || {};

  
  // Calculate total price safely
  const calculatedTotal = items.reduce((acc, item) => {
    const cleanPrice = Number((item.price || "0").toString().replace(/,/g, ""));
    return acc + cleanPrice * (item.quantity || 1);
  }, 0);
  

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to view orders!");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.info("No items in cart for this order.");
      navigate("/watches");
      return;
    }

    // Clear cart in case it wasn't cleared yet
    clearCart();
  }, [user, items, clearCart, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg opacity-90">Thank you for your purchase</p>
          <p className="text-sm opacity-80 mt-2">Order #{orderId}</p>
        </div>

        <div className="px-6 py-8">
          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Order Summary
            </h2>
            <p className="text-gray-600">
              Placed on {orderDate} at {orderTime}
            </p>
          </div>

          {/* Ordered Items */}
          <div className="space-y-4 mb-6">
            {items.map((item) => {
              const cleanPrice = Number(
                (item.price || "0").toString().replace(/,/g, "")
              );
              return (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      {item.brand && <p>Brand: {item.brand}</p>}
                      {item.size && <p>Size: {item.size}</p>}
                      <p>Quantity: {item.quantity || 1}</p>
                      <p>
                        Price: ₹{cleanPrice.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Total Price */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{calculatedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700">
              Payment Method:{" "}
              <span className="font-semibold">
                {paymentMethod.toUpperCase()}
              </span>
            </p>
          </div>

          {/* Billing Info */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">
                Billing Information
              </h2>
              <p className="text-gray-700">
                Name: {paymentDetails.billingName}
              </p>
              <p className="text-gray-700">
                Email: {paymentDetails.billingEmail}
              </p>
              <p className="text-gray-700">
                Phone: {paymentDetails.billingPhone}
              </p>
              <p className="text-gray-700">
                Address: {paymentDetails.billingAddress},{" "}
                {paymentDetails.billingCity}, {paymentDetails.billingState},{" "}
                {paymentDetails.billingZip}, {paymentDetails.billingCountry}
              </p>
            </div>
          )}

          {/* Confirmation Message */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-gray-700">
              We've sent your order confirmation and receipt to{" "}
              <span className="font-semibold">{email}</span>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold text-center"
            >
              View All Orders
            </button>
            <button
              onClick={() => navigate("/watches")}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition font-semibold text-center"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
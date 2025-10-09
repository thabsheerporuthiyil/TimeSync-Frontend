import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
];

export default function Payment() {
const { user } = useContext(UserContext);
const { cart, clearCart } = useContext(ShopContext);
const navigate = useNavigate();

const [paymentMethod, setPaymentMethod] = useState("card");
const [paymentDetails, setPaymentDetails] = useState({
  cardNumber: "",
  name: "",
  expiry: "",
  cvv: "",
  upiId: "",
  netbankingId: "",
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
  (total, item) =>
    total + Number(item.price.toString().replace(/,/g, "")) * (item.quantity || 1),
  0
);

if (!user) {
  toast.error("You must be logged in to pay!");
  navigate("/login");
  return null;
}

if (cart.length === 0) {
  navigate("/watches");
  return null;
}

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setPaymentDetails((prev) => ({ ...prev, [name]: value }));
};

const handlePayment = async (e) => {
  e.preventDefault();

  const orderId = "ORD" + Date.now() + Math.floor(Math.random() * 1000);
  const orderDate = new Date().toLocaleDateString();
  const orderTime = new Date().toLocaleTimeString();

  const newOrder = {
    orderId,
    items: [...cart],
    totalPrice,
    paymentMethod,
    paymentDetails,
    orderDate,
    orderTime,
    status: "Processing",
  };

  try {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) return alert("Please log in first");

    // Fetch user data
    const userRes = await axios.get(`https://timesync-e-commerce.onrender.com/users/${loggedInUser.id}`);
    const userData = userRes.data;

    // Fetch all products
    const productsRes = await axios.get("https://timesync-e-commerce.onrender.com/products");
    const allProducts = productsRes.data;

    // Update stock for each item in cart
    const updatedProducts = allProducts.map((product) => {
      const purchasedItem = cart.find((item) => item.id === product.id);
      if (purchasedItem) {
        return {
          ...product,
          stock: product.stock - (purchasedItem.quantity || 1),
        };
      }
      return product;
    });

    // Save updated products to server
    await Promise.all(
      updatedProducts.map((product) =>
        axios.patch(`https://timesync-e-commerce.onrender.com/products/${product.id}`, { stock: product.stock })
      )
    );

    // Add order to user
    const updatedOrders = [...(userData.orders || []), newOrder];
    await axios.patch(`https://timesync-e-commerce.onrender.com/users/${loggedInUser.id}`, { orders: updatedOrders });

    // Update localStorage
    const updatedUser = { ...userData, orders: updatedOrders };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Clear cart
    clearCart();

    // Navigate to confirmation
    navigate("/order-confirmation", { state: { ...newOrder, email: userData.email } });

  } catch (err) {
    console.error("Error saving order:", err);
    toast.error("Payment failed!");
  }
};


return (
  <div className="mt-20 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-8 text-center">Payment</h1>
    <form onSubmit={handlePayment}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment Methods & Details */}
        <div className="flex-1">
          {/* Order Summary */}
          <div className="mb-6 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity || 1}</span>
                <span>₹{(Number(item.price.toString().replace(/,/g, "")) * (item.quantity || 1)).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
              <span>Total:</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {["card", "upi", "netbanking", "cod"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    paymentMethod === method 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {method === "card" && "Credit Card"}
                  {method === "upi" && "UPI"}
                  {method === "netbanking" && "Net Banking"}
                  {method === "cod" && "Cash on Delivery"}
                </button>
              ))}
            </div>

            {/* Card Details */}
            {paymentMethod === "card" && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Name on Card</label>
                  <input
                    type="text"
                    name="name"
                    value={paymentDetails.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-semibold mb-2 text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={paymentDetails.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block font-semibold mb-2 text-gray-700">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* UPI */}
            {paymentMethod === "upi" && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <label className="block font-semibold mb-2 text-gray-700">UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={paymentDetails.upiId}
                  onChange={handleInputChange}
                  placeholder="example@upi"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {/* Netbanking */}
            {paymentMethod === "netbanking" && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <label className="block font-semibold mb-2 text-gray-700">Netbanking ID</label>
                <input
                  type="text"
                  name="netbankingId"
                  value={paymentDetails.netbankingId}
                  onChange={handleInputChange}
                  placeholder="Your Bank ID"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {/* COD info */}
            {paymentMethod === "cod" && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-gray-600 text-center py-4">You will pay at the time of delivery.</p>
              </div>
            )}
          </div>
        </div>

        {/* Billing Address */}
        <div className="flex-1">
          <div className="p-6 border rounded-lg bg-white">
            <h2 className="text-xl font-semibold mb-6">Billing Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="billingName"
                  value={paymentDetails.billingName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Email</label>
                  <input
                    type="email"
                    name="billingEmail"
                    value={paymentDetails.billingEmail}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="billingPhone"
                    value={paymentDetails.billingPhone}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Street Address</label>
                <input
                  type="text"
                  name="billingAddress"
                  value={paymentDetails.billingAddress}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">City</label>
                  <input
                    type="text"
                    name="billingCity"
                    value={paymentDetails.billingCity}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">State</label>
                  <input
                    type="text"
                    name="billingState"
                    value={paymentDetails.billingState}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    name="billingZip"
                    value={paymentDetails.billingZip}
                    onChange={handleInputChange}
                    placeholder="ZIP Code"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Country</label>
                  <select
                    name="billingCountry"
                    value={paymentDetails.billingCountry}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
        >
          {paymentMethod === "cod" ? `Place Order (COD)` : `Pay ₹${totalPrice.toLocaleString()}`}
        </button>
      </div>
    </form>
  </div>
);
}

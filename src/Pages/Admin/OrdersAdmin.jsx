import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import StatCard from "./StatCard";
import { toast } from "react-toastify";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); //current order modal
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5000/users");
    const allOrders = res.data
      .filter((u) => u.orders && u.orders.length > 0)
      .flatMap((u) =>
        u.orders.map((o) => ({
          ...o,
          userId: u.id,
          userName: u.name,
          userEmail: u.email,
        }))  // All orders into 1 array
      );
    setOrders(allOrders);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const userRes = await axios.get(`http://localhost:5000/users/${selectedOrder.userId}`);
      const userData = userRes.data;

      const updatedOrders = userData.orders.map((o) =>
        o.orderId === selectedOrder.orderId ? { ...o, status } : o
      );

      await axios.patch(`http://localhost:5000/users/${selectedOrder.userId}`, {
        orders: updatedOrders,
      });

      fetchOrders();
      closeModal();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (order) => {
  if (!order) return;

  try {
    const userRes = await axios.get(`http://localhost:5000/users/${order.userId}`);
    const userData = userRes.data;

    // Remove the order from user's orders
    const updatedUserOrders = userData.orders.filter(
      (o) => o.orderId !== order.orderId
    );

    // Update orders
    await axios.patch(`http://localhost:5000/users/${order.userId}`, {
      orders: updatedUserOrders,
    });

    // Remove order from orders list
    setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));

    toast.success(`Order ${order.orderId} deleted successfully!`);
  } catch (error) {
    console.error("Error deleting order:", error);
    toast.error("Failed to delete order. Try again.");
  }
};


  const totalOrders = orders.length;
  const processing = orders.filter((o) => o.status === "Processing").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;

  const statusConfig = {
    Delivered: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    Cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
    Processing: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  };

  // Filter order dropdown
  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

    
  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-600 mt-1">Showing {totalOrders} total orders</p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<Package size={24} className="text-blue-600" />}
        />
        <StatCard
          title="Processing"
          value={processing}
          icon={<Clock size={24} className="text-yellow-600" />}
        />
        <StatCard
          title="Delivered"
          value={delivered}
          icon={<CheckCircle size={24} className="text-emerald-600" />}
        />
        <StatCard
          title="Cancelled"
          value={cancelled}
          icon={<XCircle size={24} className="text-red-600" />}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-600">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold hidden sm:table-cell">Email</th>
                <th className="py-3 px-4 font-semibold">Total</th>
                <th className="py-3 px-4 font-semibold hidden sm:table-cell">Payment</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => {
                  const StatusIcon = statusConfig[o.status]?.icon || Clock;
                  return (
                    <tr key={o.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs sm:text-sm">{o.orderId}</td>
                      <td className="py-3 px-4 font-medium">{o.userName}</td>
                      <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{o.userEmail}</td>
                      <td className="py-3 px-4 font-semibold">₹{o.totalPrice.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600 capitalize hidden sm:table-cell">{o.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={14} />
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[o.status]?.color}`}
                          >
                            {o.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(o)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(o)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500">
                    No {filter !== "All" ? filter : ""} orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Modal Details */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Order #{selectedOrder.orderId}
                </h2>
                <p className="text-sm text-gray-500">Placed by {selectedOrder.userName}</p>
                <p className="text-xs text-gray-400">
                  Ordered on {selectedOrder.orderDate} at {selectedOrder.orderTime}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  statusConfig[selectedOrder.status]?.color
                }`}
              >
                {(() => {
                  const StatusIcon = statusConfig[selectedOrder.status]?.icon || Clock;
                  return <StatusIcon size={14} />;
                })()}
                {selectedOrder.status}
              </span>
            </div>


            {/* Body */}
            <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer Info</h3>
                  <p className="text-gray-900 font-medium">{selectedOrder.userName}</p>
                  <p className="text-gray-600 text-sm">{selectedOrder.userEmail}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment</h3>
                  <p className="capitalize text-gray-900 font-medium">{selectedOrder.paymentMethod}</p>
                  <p className="text-gray-600 text-sm">Total: ₹{selectedOrder.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* Products List */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Items</h3>
                <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{(selectedOrder.totalPrice - 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">₹100</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{selectedOrder.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [dbUser, setDbUser] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoadingData(true);
        try {
          const res = await axios.get(`https://timesync-e-commerce.onrender.com/users/${user.id}`);
          setDbUser(res.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        } finally {
          setLoadingData(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (loading || !user || loadingData || !dbUser) {
    return (
      <div className="min-h-screen bg-white pt-16 p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-blue-900 px-8 py-6 text-white flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-6 bg-gray-400 rounded w-48"></div>
                    <div className="h-4 bg-gray-400 rounded w-32"></div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-40"></div>
                    <div className="h-16 bg-gray-200 rounded w-full"></div>
                    <div className="h-16 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4 text-center">My Profile</h1>
          <p className="text-gray-600 text-lg">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-blue-900 px-8 py-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-semibold text-white">
                      {dbUser.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-light">{dbUser.name}</h2>
                    <p className="text-gray-300">{dbUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Personal Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Personal Information
                    </label>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900">{dbUser.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Email Address</p>
                        <p className="text-lg font-semibold text-gray-900">{dbUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Account Details
                    </label>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400">Account Type</p>
                        <p className="text-lg font-semibold text-gray-900 capitalize">{dbUser.role}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Account Status</p>
                        <p
                          className={`text-lg font-semibold ${
                            dbUser.blocked ? "text-red-500" : "text-green-600"
                          }`}
                        >
                          {dbUser.blocked ? "Blocked" : "Active"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders and Wishlist */}
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  {dbUser.orders?.length ? (
                    dbUser.orders.slice(0, 3).map((order) => (
                      <div
                        key={order.orderId}
                        className="border p-4 mb-4 rounded-lg shadow-sm bg-gray-50"
                      >
                        <p className="font-semibold text-gray-800">
                          Order ID: {order.orderId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {order.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: ₹{order.totalPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent orders found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
              <div className="space-y-2">
                <p>Orders: <span className="font-semibold">{dbUser.orders?.length || 0}</span></p>
                <p>Wishlist: <span className="font-semibold">{dbUser.wishlist?.length || 0}</span></p>
                <p>Cart: <span className="font-semibold">{dbUser.cart?.length || 0}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

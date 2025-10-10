import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Shield, ShoppingCart, Heart, Package, Lock, Unlock, Search, Filter, ChevronDown } from "lucide-react";
import StatCard from "./StatCard";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); //user detail in modal
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://timesync-e-commerce.onrender.com/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleBlockUser = async (user) => {
    try {
      const updatedUser = { ...user, blocked: !user.blocked };
      await axios.patch(`https://timesync-e-commerce.onrender.com/users/${user.id}`, {
        blocked: updatedUser.blocked,
      });
      setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
      setSelectedUser(updatedUser);
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role?.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const getFilterButtonText = () => {
    switch (roleFilter) {
      case "admin": return "Admins";
      case "user": return "Users";
      default: return "Filter";
    }
  };

  // Stat cards data
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalBlocked = users.filter(u => u.blocked).length;
  const totalActive = users.filter(u => !u.blocked).length;

  return (
    <div className="p-6 bg-white min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Manage Users
          </h1>
          <p className="text-gray-600 mt-1">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter size={20} />
              {getFilterButtonText()}
              <ChevronDown size={16} />
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => { setRoleFilter("all"); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${roleFilter === "all" ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => { setRoleFilter("admin"); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${roleFilter === "admin" ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                  >
                    Admins Only
                  </button>
                  <button
                    onClick={() => { setRoleFilter("user"); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${roleFilter === "user" ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                  >
                    Users Only
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showFilterDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={totalUsers} icon={<User size={24} className="text-blue-600" />} />
        <StatCard title="Admins" value={totalAdmins} icon={<Shield size={24} className="text-purple-600" />} />
        <StatCard title="Blocked Users" value={totalBlocked} icon={<Lock size={24} className="text-red-600" />} />
        <StatCard title="Active Users" value={totalActive} icon={<Unlock size={24} className="text-green-600" />} />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${user.blocked ? "bg-red-100" : "bg-blue-100"}`}>
                  <User className={user.blocked ? "text-red-600" : "text-blue-600"} size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.blocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                      {user.blocked ? "Blocked" : "Active"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg mx-auto mb-1">
                  <ShoppingCart size={16} className="text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{user.cart?.length || 0}</p>
                <p className="text-xs text-gray-500">Cart</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg mx-auto mb-1">
                  <Heart size={16} className="text-purple-600" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{user.wishlist?.length || 0}</p>
                <p className="text-xs text-gray-500">Wishlist</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg mx-auto mb-1">
                  <Package size={16} className="text-green-600" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{user.orders?.length || 0}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  selectedUser.blocked ? "bg-red-100" : "bg-blue-100"
                }`}>
                  <User className={selectedUser.blocked ? "text-red-600" : "text-blue-600"} size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                ✖
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold text-gray-800 capitalize">{selectedUser.role}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-semibold ${
                    selectedUser.blocked ? "text-red-600" : "text-green-600"
                  }`}>
                    {selectedUser.blocked ? "Blocked" : "Active"}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => toggleBlockUser(selectedUser)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                    selectedUser.blocked
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {selectedUser.blocked ? (
                    <>
                      <Unlock size={20} /> Unblock User
                    </>
                  ) : (
                    <>
                      <Lock size={20} /> Block User
                    </>
                  )}
                </button>
              </div>

              {/* User Data Sections */}
              <div className="space-y-6">
                {/* Cart */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingCart size={20} className="text-blue-600" />
                    </div>
                    Cart ({selectedUser.cart.length})
                  </h3>
                  {selectedUser.cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No items in cart</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedUser.cart.map((item) => (
                        <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Heart size={20} className="text-purple-600" />
                    </div>
                    Wishlist ({selectedUser.wishlist.length})
                  </h3>
                  {selectedUser.wishlist.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No items in wishlist</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedUser.wishlist.map((item) => (
                        <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-800">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Orders */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Package size={20} className="text-green-600" />
                    </div>
                    Orders ({selectedUser.orders.length})
                  </h3>
                  {selectedUser.orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No orders placed</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedUser.orders.map((order, i) => (
                        <div key={i} className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-800">Order #{i + 1}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

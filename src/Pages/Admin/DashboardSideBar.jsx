import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate, Routes, Route ,Navigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Users, Package, Menu, X } from "lucide-react";

import DashboardHome from "./DashboardHome";
import ProductsAdmin from "./ProductsAdmin";
import UsersAdmin from "./UsersAdmin";
import OrdersAdmin from "./OrdersAdmin";

export default function AdminDashboard() {
const { user, setUser } = useContext(UserContext);
const [sidebarOpen, setSidebarOpen] = useState(false);
const navigate = useNavigate();

const handleLogout = () => {
  setUser(null);
  localStorage.removeItem("token");
  navigate("/login");
};

return (
  <div className="min-h-screen flex bg-white">
  {/* Sidebar */}
  <aside
    className={`fixed top-0 left-0 min-h-screen w-72 bg-gray-900 
      text-white p-6 flex flex-col shadow-2xl transform transition-transform duration-300 z-50
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
  >
    <div className="flex justify-between items-center mb-10">
      <Link to='/admin' className="text-2xl font-bold tracking-wide text-white">
        Admin Panel 
      </Link>
      <button
        className="md:hidden text-gray-400 hover:text-white transition"
        onClick={() => setSidebarOpen(false)}
      >
        <X size={24} />
      </button>
    </div>

    <nav className="flex flex-col space-y-2 text-lg flex-1 overflow-y-auto">
      {/* Sidebar list */}
      <Link to="/admin/dashboard" className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-600 hover:text-white border-l-4 border-transparent hover:border-blue-400 transition-all group bg-gray-800">
        <LayoutDashboard size={20} className="text-blue-400 group-hover:text-white" /> Dashboard
      </Link>
      <Link to="/admin/products" className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-600 hover:text-white border-l-4 border-transparent hover:border-blue-400 transition-all group bg-gray-800">
        <ShoppingBag size={20} className="text-blue-400 group-hover:text-white" /> Manage Products
      </Link>
      <Link to="/admin/users" className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-600 hover:text-white border-l-4 border-transparent hover:border-blue-400 transition-all group bg-gray-800">
        <Users size={20} className="text-blue-400 group-hover:text-white" /> Manage Users
      </Link>
      <Link to="/admin/orders" className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-600 hover:text-white border-l-4 border-transparent hover:border-blue-400 transition-all group bg-gray-800">
        <Package size={20} className="text-blue-400 group-hover:text-white" /> Manage Orders
      </Link>
    </nav>
  </aside>

  {/* Main Content */}
  <main className="flex-1 min-h-screen p-6 md:p-10 md:ml-72 ml-0">
    <div className="md:hidden flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <button
        className="text-gray-700 hover:text-black transition"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} />
      </button>
    </div>

    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="/dashboard" element={<DashboardHome />} />
      <Route path="/products" element={<ProductsAdmin />} />
      <Route path="/users" element={<UsersAdmin />} />
      <Route path="/orders" element={<OrdersAdmin />} />
    </Routes>

  </main>
</div>

);
}

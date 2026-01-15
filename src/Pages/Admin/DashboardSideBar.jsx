import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Users, Package, Menu, X, LogOut, Globe } from "lucide-react"; // Added Globe icon
import { motion, AnimatePresence } from "framer-motion";

import DashboardHome from "./DashboardHome";
import ProductsAdmin from "./ProductsAdmin";
import UsersAdmin from "./UsersAdmin";
import OrdersAdmin from "./OrdersAdmin";

export default function AdminDashboard() {
  const { user, logout } = useContext(UserContext); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/products", label: "Products", icon: ShoppingBag },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/orders", label: "Orders", icon: Package },
  ];

  return (
    <div className="min-h-screen flex bg-[#030712] font-sans selection:bg-blue-500/30">
      
      {/* Sidebar Backdrop for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-[#030712] border-r border-gray-800/50 
          text-slate-300 p-6 flex flex-col z-[70] transform transition-transform duration-500 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo Branding */}
        <div className="flex justify-between items-center mb-10 px-2">
          <Link to='/admin' className="group flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white group-hover:text-blue-500 transition-colors">
              Time<span className="text-blue-500">Sync</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Admin Interface</span>
          </Link>
          <button className="md:hidden p-2 hover:bg-gray-800 rounded-xl transition" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>


        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-3 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`relative flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                  ? "bg-blue-600/10 text-white shadow-[inset_0_0_20px_rgba(37,99,235,0.05)] border border-blue-500/20" 
                  : "hover:bg-white/[0.03] text-slate-400 hover:text-slate-100 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-4 z-10">
                  <item.icon size={20} className={`${isActive ? "text-blue-500" : "text-slate-500 group-hover:text-blue-400"} transition-colors`} />
                  <span className="text-sm font-bold tracking-wide">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="activePill" className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                )}
              </Link>
            );
          })}
        </nav>
        {/* --- BACK TO WEBSITE BUTTON --- */}
        <div className="mb-8 px-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-gray-800 text-slate-400 hover:text-white hover:bg-white/[0.03] hover:border-blue-500/50 transition-all duration-300 group shadow-lg"
          >
            <Globe size={16} className="group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Website</span>
          </Link>
        </div>


        {/* Sidebar Footer / User Profile */}
        <div className="mt-auto pt-6 border-t border-gray-800/50 space-y-4">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-blue-500/20">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none">{user?.name || "Admin"}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">System Supervisor</span>
            </div>
          </div>
          

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all group border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen md:ml-72 flex flex-col relative">
        {/* Mobile Navbar Header */}
        <div className="md:hidden sticky top-0 bg-[#030712]/80 backdrop-blur-xl border-b border-gray-800/50 p-5 flex justify-between items-center z-40">
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter text-white">TIMESYNC</span>
          </div>
          <button
            className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-slate-300 hover:text-white transition shadow-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/products" element={<ProductsAdmin />} />
            <Route path="/users" element={<UsersAdmin />} />
            <Route path="/orders" element={<OrdersAdmin />} />
          </Routes>
        </div>

        {/* Subtle Background Glows */}
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      </main>
    </div>
  );
}
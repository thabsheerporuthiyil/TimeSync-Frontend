import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import { Eye, Trash2, Package, Clock, CheckCircle, XCircle, Search, ChevronDown, X, CreditCard, User, Mail, MapPin } from "lucide-react";
import StatCard from "./StatCard";
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [stats, setStats] = useState({
    total_orders: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // LOGIC PRESERVED
  function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
  }
  const debouncedSearch = useDebounce(search);

  const fetchStats = async () => {
    const res = await api.get("admin/orders/stats/");
    setStats(res.data);
  };

  useEffect(() => { setCurrentPage(1); }, [filter, search]);

  useEffect(() => { fetchOrders(); }, [filter, debouncedSearch, currentPage]);

  useEffect(() => { fetchStats(); }, []);

  const fetchOrders = async () => {
    try {
      setIsPageLoading(true);
      const res = await api.get("admin/orders/", {
        params: {
          page: currentPage,
          status: filter !== "All" ? filter.toLowerCase() : "all",
          search: debouncedSearch || undefined,
        },
      });
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to sync manifest");
    } finally {
      setIsPageLoading(false);
    }
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
    try {
      await api.patch(`admin/orders/${selectedOrder.id}/status/`, { status });
      setOrders((prev) => prev.map((o) => o.id === selectedOrder.id ? { ...o, status } : o));
      await fetchStats();
      closeModal();
      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  // THEME CONFIG
  const statusConfig = useMemo(() => ({
    confirmed: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Package },
    paid: { color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", icon: CheckCircle },
    delivered: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle },
    cancelled: { color: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: XCircle },
    processing: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock },
  }), []);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#030712] p-4 md:p-8 text-slate-200">
        {/* Header Skeleton */}
        <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-gray-800/50 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-11 w-64 bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-11 w-40 bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-900/40 border border-gray-800 rounded-3xl animate-pulse" />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-[2rem] overflow-hidden">
          <div className="p-8 space-y-8">
            <div className="flex justify-between border-b border-gray-800 pb-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 w-16 bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-800/50 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
                  <div className="h-3 w-40 bg-gray-800/30 rounded animate-pulse" />
                </div>
                <div className="h-4 w-24 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-6 w-24 bg-gray-800/30 rounded-lg animate-pulse" />
                <div className="h-10 w-10 bg-gray-800 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] p-4 md:p-8 text-slate-200 font-sans">
      
      {/* Header Section */}
      <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Package className="text-blue-500" size={32} />
            Order <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Manifest</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">
            Fulfillment & Transaction Control
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search by ID or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 text-slate-300 text-xs font-bold py-3 pl-11 pr-4 rounded-xl focus:outline-none focus:border-blue-500 transition-all min-w-[260px]"
            />
          </div>

          <div className="relative group">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 text-slate-300 text-xs font-bold py-3 pl-4 pr-10 rounded-xl appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer min-w-[160px]"
            >
              <option value="All">All Transactions</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Orders" value={stats.total_orders} icon={<Package size={24} />} color="blue" />
        <StatCard title="Processing" value={stats.processing} icon={<Clock size={24} />} color="orange" />
        <StatCard title="Delivered" value={stats.delivered} icon={<CheckCircle size={24} />} color="green" />
        <StatCard title="Cancelled" value={stats.cancelled} icon={<XCircle size={24} />} color="rose" />
      </div>

      {/* Table Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Order ID</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Customer Identity</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Valuation</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Vault</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {orders.map((o) => {
                const config = statusConfig[o.status] || statusConfig.processing;
                const StatusIcon = config.icon;
                return (
                  <tr key={o.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-6 font-mono text-[11px] text-blue-400">{o.id}</td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-bold text-white">{o.user_name}</p>
                      <p className="text-[10px] text-slate-500 font-medium lowercase truncate w-32">{o.user_email}</p>
                    </td>
                    <td className="py-5 px-6 text-xs text-slate-400 font-medium">{o.ordered_date}</td>
                    <td className="py-5 px-6 font-black text-white text-sm">₹{Number(o.total_amount).toLocaleString()}</td>
                    <td className="py-5 px-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tighter ${config.color}`}>
                        <StatusIcon size={12} />
                        {o.status}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button onClick={() => openModal(o)} className="p-2.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Logic */}
        {pagination && (
          <div className="p-6 border-t border-gray-800/50 flex items-center justify-between bg-gray-900/20">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Syncing Page <span className="text-white">{pagination.current_page}</span> of {pagination.total_pages}
            </p>
            <div className="flex gap-2">
              <button disabled={!pagination.has_previous} onClick={() => setCurrentPage((p) => p - 1)} className="px-4 py-2 border border-gray-800 rounded-xl text-xs font-bold hover:bg-gray-800 disabled:opacity-30 transition-all">Prev</button>
              <button disabled={!pagination.has_next} onClick={() => setCurrentPage((p) => p + 1)} className="px-4 py-2 border border-gray-800 rounded-xl text-xs font-bold hover:bg-gray-800 disabled:opacity-30 transition-all text-slate-300">Next</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal - Order Details Sidebar/Overlay */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-gray-900 border border-gray-800 rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <div>
                  <h2 className="text-2xl font-black text-white">Order Manifest <span className="text-blue-500 font-mono text-lg ml-2">#OR-{selectedOrder.id}</span></h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Registry Entry: {selectedOrder.ordered_date}</p>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-8">
                {/* Meta Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-3xl bg-gray-800/40 border border-gray-800">
                    <User size={16} className="text-blue-400 mb-3" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-sm font-bold text-white truncate">{selectedOrder.user_name}</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-gray-800/40 border border-gray-800">
                    <Mail size={16} className="text-purple-400 mb-3" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Communication</p>
                    <p className="text-sm font-bold text-white truncate">{selectedOrder.user_email}</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-gray-800/40 border border-gray-800">
                    <CreditCard size={16} className="text-orange-400 mb-3" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Payment Basis</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                {/* Items Manifest */}
                <div>
                  <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Asset List</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800/20 border border-gray-800 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <img src={item.product_image} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-700" />
                          <div>
                            <p className="text-sm font-bold text-white">{item.product_name}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Unit Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-white">₹{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update Console */}
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 block">Command: Dispatch Update</label>
                    <div className="flex gap-3">
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none"
                        >
                            <option value="confirmed">Confirmed</option>
                            <option value="paid">Paid</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button onClick={handleStatusUpdate} className="px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                            Apply Change
                        </button>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
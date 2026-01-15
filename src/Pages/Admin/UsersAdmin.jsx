import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Shield, ShoppingCart, Package,
  Lock, Unlock, Search, Filter, ChevronDown, MoreVertical, Mail, X, Activity
} from "lucide-react";
import StatCard from "./StatCard";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [stats, setStats] = useState({ total_users: 0, total_admins: 0, total_active: 0, total_blocked: 0 });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);



  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setIsPageLoading(true);
      const res = await api.get("admin/users/", {
        params: { page, search: debouncedSearch || undefined, role: roleFilter !== "all" ? roleFilter : undefined },
      });
      setUsers(res.data.results);
      setTotalCount(res.data.count);
      setTotalPages(res.data.total_pages);
      setCurrentPage(res.data.current_page);
      if (res.data.stats) setStats(res.data.stats);
    } catch (error) { console.error("Error fetching users:", error); }
    finally { setIsPageLoading(false); }
  }, [debouncedSearch, roleFilter]);

  useEffect(() => { fetchUsers(1); }, [debouncedSearch, roleFilter, fetchUsers]);

  const sendMessage = async () => {
    if (!targetUserId || !title || !message) {
      setError("All fields are required");
      return;
    }

    try {
      setSending(true);
      setError("");

      await api.post("notifications/admin/send/", {
        user_id: Number(targetUserId),
        title,
        message,
      });

      setShowMessageModal(false);
      setTargetUserId("");
      setTitle("");
      setMessage("");
    } catch (err) {
      if (err.response?.data?.user_id) {
        setError(err.response.data.user_id[0]);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to send message");
      }
    } finally {
      setSending(false);
    }
  };



  const toggleBlockUser = async (user) => {
    try {
      const res = await api.patch(`admin/users/${user.id}/toggle-block/`);
      setUsers(users.map((u) => u.id === user.id ? { ...u, is_active: res.data.is_active } : u));
      setSelectedUser((prev) => prev ? { ...prev, is_active: res.data.is_active } : prev);
    } catch (err) { console.error("Failed to toggle block", err); }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#030712] p-4 md:p-8 text-slate-200">
        {/* Header Skeleton */}
        <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-gray-800/50 rounded-lg animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-4">
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
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-20 bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
                    <div className="h-3 w-40 bg-gray-800/50 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-gray-800/50 rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-10 w-10 bg-gray-800 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] p-4 md:p-8 font-sans text-slate-200">

      {/* Header Section */}
      <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <User className="text-blue-500" size={32} />
            User <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Directory</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">
            Identity & Access Management ({totalCount} verified identities)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search identities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 text-slate-300 text-xs font-bold py-3 pl-11 pr-4 rounded-xl focus:outline-none focus:border-blue-500 transition-all min-w-[260px]"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 text-slate-300 text-xs font-bold py-3 px-5 rounded-xl hover:bg-gray-800 transition-all shadow-xl"
            >
              <Filter size={14} className="text-blue-500" />
              {roleFilter === 'all' ? 'All Roles' : roleFilter.toUpperCase()}
              <ChevronDown size={14} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </button>
            {/* Simple Dropdown Overlay */}
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl z-50"
                >
                  {['all', 'admin', 'user'].map((role) => (
                    <button
                      key={role}
                      onClick={() => { setRoleFilter(role); setShowFilterDropdown(false); }}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 transition-colors uppercase tracking-widest"
                    >
                      {role}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setShowMessageModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all"
          >
            <Mail size={14} />
            Message
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMessageModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMessageModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl 
                   z-[210] shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Mail className="text-blue-500" size={20} />
                  Send Message
                </h3>
                <button onClick={() => setShowMessageModal(false)} className="text-slate-400 hover:text-white">
                  <X />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* User ID */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}
                <input
                  type="number"
                  placeholder="User ID"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500"
                />

                {/* Title */}
                <input
                  type="text"
                  placeholder="Message title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500"
                />

                {/* Message */}
                <textarea
                  rows={5}
                  placeholder="Write message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl resize-none focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-800">
                <button
                  disabled={sending}
                  onClick={sendMessage}
                  className="w-full py-4 rounded-xl font-black text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all text-white"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={stats.total_users} icon={<User size={24} />} color="blue" />
        <StatCard title="Administrators" value={stats.total_admins} icon={<Shield size={24} />} color="purple" />
        <StatCard title="Blocked" value={stats.total_blocked} icon={<Lock size={24} />} color="orange" />
        <StatCard title="Active Now" value={stats.total_active} icon={<Activity size={24} />} color="green" />
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">UID</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity Details</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Permissions</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Activity Metrics</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="py-5 px-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg border tracking-tighter uppercase ${user.role === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                      {user.id}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg transition-transform group-hover:scale-110 ${user.is_active ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gray-800 border border-gray-700'}`}>
                        {user.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{user.full_name}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg border tracking-tighter uppercase ${user.role === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${user.is_active ? "text-emerald-400" : "text-rose-400"}`}>
                        {user.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex justify-center gap-6">
                      <div className="text-center group/icon" title="Orders">
                        <p className="text-xs font-black text-white">{user.orders_count || 0}</p>
                        <Package size={14} className="text-slate-600 group-hover/icon:text-blue-500 transition-colors mx-auto mt-1" />
                      </div>
                      <div className="text-center group/icon" title="Cart Items">
                        <p className="text-xs font-black text-white">{user.cart_count || 0}</p>
                        <ShoppingCart size={14} className="text-slate-600 group-hover/icon:text-orange-500 transition-colors mx-auto mt-1" />
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <button className="p-2.5 text-slate-500 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/20">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchUsers(currentPage - 1)}
              className="px-4 py-2 border border-gray-800 rounded-xl text-xs font-bold hover:bg-gray-800 disabled:opacity-30 transition-all text-slate-300"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchUsers(currentPage + 1)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold hover:bg-gray-700 disabled:opacity-30 transition-all text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* User Detail Slide-over */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[110] overflow-y-auto flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-gray-800">
                <div>
                  <h2 className="text-xl font-black text-white">Identity Profile</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Registry UID: {selectedUser.id}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-slate-400"><X /></button>
              </div>

              <div className="p-8">
                <div className="text-center mb-10">
                  <div className="w-28 h-28 bg-blue-500/10 border border-blue-500/30 rounded-[2.5rem] mx-auto flex items-center justify-center mb-6 shadow-2xl relative">
                    <User size={54} className="text-blue-500" />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-gray-900 ${selectedUser.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  </div>
                  <h3 className="text-2xl font-black text-white">{selectedUser.full_name}</h3>
                  <p className="text-slate-400 font-medium text-sm mt-1">{selectedUser.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-5 rounded-3xl bg-gray-800/40 border border-gray-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Access Status</p>
                    <p className={`text-sm font-black ${selectedUser.is_active ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selectedUser.is_active ? 'AUTHORIZED' : 'RESTRICTED'}
                    </p>
                  </div>
                  <div className="p-5 rounded-3xl bg-gray-800/40 border border-gray-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Authority Level</p>
                    <p className="text-sm font-black text-blue-400 uppercase tracking-tighter">{selectedUser.role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Administrative Actions</h4>
                  <button
                    onClick={() => toggleBlockUser(selectedUser)}
                    className={`w-full py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all border ${selectedUser.is_active
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
                      : "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      }`}
                  >
                    {selectedUser.is_active ? <><Lock size={18} /> TERMINATE ACCESS</> : <><Unlock size={18} /> RESTORE ACCESS</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useContext, useEffect, useState } from "react";
import api from "../../api/axios";
import { Package, Users, ShoppingCart, Boxes, LogOut, LayoutDashboard, Clock } from "lucide-react";
import StatCard from "./StatCard";
import BrandRadarChart from "./BrandRadarChart";
import StockPieChart from "./StockPieChart";
import BrandCountChart from "./BrandCountChart";
import { UserContext } from "../../context/UserContext";
import RevenueLineChart from "./RevenueLineChart";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [brandData, setBrandData] = useState({ performance: [], counts: [] });
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useContext(UserContext);
  const [revenueData, setRevenueData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, revenueRes] = await Promise.all([
          api.get("admin/dashboard/"),
          api.get("admin/revenue/")
        ]);

        setStats(dashboardRes.data.stats);
        setStockData(dashboardRes.data.stockData);
        setBrandData({
          counts: dashboardRes.data.brandCounts,
          performance: dashboardRes.data.brandCounts.map(b => ({
            brand: b.name,
            sales: b.count,
          })),
        });
        setRevenueData(revenueRes.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] p-8 space-y-8 text-slate-200">
        <div className="h-32 w-full bg-gray-900/50 rounded-3xl animate-pulse border border-gray-800" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-900/50 rounded-3xl animate-pulse border border-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] p-4 md:p-8 font-sans text-slate-200">

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-md border border-gray-800 p-8 rounded-[2.5rem] mb-10 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <LayoutDashboard size={120} className="text-blue-500" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Welcome back, <span className="text-slate-100 font-bold">{user?.name || "Administrator"}</span>.
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
            <div className="bg-gray-950/50 border border-gray-800 px-5 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-inner">
              <Clock size={16} className="text-amber-400" />
              <span className="text-xs font-bold tracking-wider text-slate-300">
                {formatDate(currentTime)}
              </span>
            </div>
            <button
              onClick={logout}
              className="group flex items-center gap-3 bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-500 px-6 py-2.5 rounded-2xl transition-all duration-300 border border-gray-700 hover:border-red-500/50 font-semibold text-sm justify-center"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${Number(stats.totalRevenue).toLocaleString()}`} icon={<ShoppingCart size={24} />} color="orange" />
        <StatCard title="Inventory" value={stats.totalProducts} icon={<Boxes size={24} />} color="blue" />
        <StatCard title="Active Users" value={stats.totalUsers} icon={<Users size={24} />} color="green" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<Package size={24} />} color="purple" />
      </div>

      {/* Graphs Grid */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Stock Breakdown */}
        <div className="group bg-gray-900/40 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-colors shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white tracking-wide">Stock Distribution</h3>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-500/20">Units</span>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <StockPieChart />
          </div>
        </div>

        {/* Brand Performance Radar */}
        <div className="group bg-gray-900/40 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-colors shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white tracking-wide">Brand Performance</h3>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-purple-500/20">Radar</span>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <BrandRadarChart />
          </div>
        </div>

        {/* Revenue Growth (Shared Row) */}
        <div className="group bg-gray-900/40 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">Revenue Growth</h3>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-500/20">Monthly</span>
          </div>
          <RevenueLineChart data={revenueData} />
        </div>

        {/* Brand Inventory Bar Chart (Shared Row) */}
        <div className="group bg-gray-900/40 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-800 hover:border-gray-700 transition-colors shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white tracking-wide">Global Inventory</h3>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-slate-700" />
            </div>
          </div>
          <div className="h-[350px]">
            <BrandCountChart />
          </div>
        </div>

      </div>

      <div className="mt-12 text-center pb-8">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">TimeSync Control Interface</p>
      </div>
    </div>
  );
}
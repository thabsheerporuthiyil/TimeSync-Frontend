import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Package, Users, ShoppingCart, Boxes } from "lucide-react";
import StatCard from "./StatCard";
import BrandRadarChart from "./BrandRadarChart";
import StockPieChart from "./StockPieChart";
import BrandCountChart from "./BrandCountChart";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardHome() {
const [stats, setStats] = useState({
  totalProducts: 0,
  totalUsers: 0,
  totalOrders: 0,
  totalCartItems: 0,
});

const [brandData, setBrandData] = useState({ performance: [], counts: [] });
const [stockData, setStockData] = useState([]);
const [loading, setLoading] = useState(false);
const {user}=useContext(UserContext);
const {logout}=useContext(AuthContext);

useEffect(() => {
  const fetchDashboardData = async () => {
  try {
    setLoading(true);

    // Fetch products
    const productsRes = await axios.get("https://timesync-e-commerce.onrender.com/products");
    const products = productsRes.data;

    // Fetch users
    const usersRes = await axios.get("https://timesync-e-commerce.onrender.com/users");
    const users = usersRes.data;

    // Fetch brands
    const brandsRes = await axios.get("https://timesync-e-commerce.onrender.com/brands");
    const brands = brandsRes.data;

    // Calculate stats
    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalOrders = users.reduce((sum, u) => sum + (u.orders?.length || 0), 0);
    const totalCartItems = users.reduce((sum, u) => sum + (u.cart?.length || 0), 0);

    setStats({ totalProducts, totalUsers, totalOrders, totalCartItems });

    // Brand performance Radar chart
    const brandPerformance = brands.map((b) => {
      const sales = users.reduce((userSum, u) => {
        return (
          userSum +
          (u.orders || []).reduce((orderSum, order) => {
            return (
              orderSum +
              (order.items || []).reduce((itemSum, item) => {
                return item.brand === b.name ? itemSum + (item.quantity || 1) : itemSum;
              }, 0)
            );
          }, 0)
        );
      }, 0);
      return { brand: b.name, sales };
    });

    // Brand product count bar chart
    const brandCounts = brands.map((b) => {
      const count = products.filter((p) => p.brand === b.name).length;
      return { brand: b.name, count };
    });

    // Update state
    setBrandData({ performance: brandPerformance, counts: brandCounts });

    // Stock distribution pie chart
    const stockDistribution = products.map((p) => ({
      name: p.name,
      value: p.stock,
    }));
    setStockData(stockDistribution);
  } catch (err) {
    console.error("Failed to fetch dashboard data:", err);
  } finally {
    setLoading(false);
  }
};

fetchDashboardData();
}, []);

if (loading) {
return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 blur-md bg-blue-500/40 rounded-full"></div>
    </div>
    <p className="text-blue-400 mt-6 text-lg font-medium tracking-wide animate-pulse">
      Fetching dashboard insights...
    </p>
  </div>
);

}

  return (
    <>
      {/* Header */}
      <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-lg flex justify-between items-center border border-gray-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, <span className="text-blue-400">{user?.name || "Admin"}</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Here you can manage products, users, and orders.
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all border border-blue-500"
        >
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Boxes size={32} className="text-blue-500" />}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={32} className="text-green-500" />}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<Package size={32} className="text-purple-500" />}
        />
        <StatCard
          title="Items in Carts"
          value={stats.totalCartItems}
          icon={<ShoppingCart size={32} className="text-orange-500" />}
        />
      </div>

      {/* Graphs Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stock Pie Chart */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200">
          <StockPieChart />
        </div>

        {/* Brand Radar Chart */}
        <div className="bg-gray-900 p-6 rounded-2xl  border-gray-200">
          <BrandRadarChart />
        </div>

        {/* Brand Count Bar Chart */}
        <div className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 lg:col-span-2">
          <BrandCountChart />
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import api from "../../api/axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Refined colors: Emerald for in-stock, Rose for out-of-stock
const COLORS = ["#10b981", "#f43f5e"]; 

export default function StockPieChart() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("admin/stock-summary/");
        setStockData([
          { name: "In Stock", value: res.data.in_stock },
          { name: "Out of Stock", value: res.data.out_of_stock },
        ]);
      } catch (err) {
        console.error("Failed to load stock data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Custom Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-md border border-gray-700 p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            {payload[0].name}
          </p>
          <p className="text-lg font-black text-white">
            {payload[0].value} <span className="text-xs font-medium text-gray-500 underline decoration-gray-700 underline-offset-4">Units</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full">
      {/* Chart Headers removed as they are now handled by the DashboardHome wrapper */}
      <div className="relative h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={stockData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={75} // Makes it a donut
              outerRadius={100}
              paddingAngle={8} // Space between segments
              stroke="none"    // Removes the white border around segments
            >
              {stockData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index]} 
                  style={{ filter: `drop-shadow(0px 0px 8px ${COLORS[index]}44)` }} // Adds a subtle glow
                  className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Availability</p>
          <p className="text-2xl font-black text-white">
            {stockData.reduce((a, b) => a + b.value, 0)}
          </p>
          <p className="text-[9px] font-medium text-slate-600 uppercase italic">Total SKU</p>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="flex justify-center gap-8 mt-4">
        {stockData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
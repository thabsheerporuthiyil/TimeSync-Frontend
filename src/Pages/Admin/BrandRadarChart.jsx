import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function BrandRadarChart() {
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandSales = async () => {
      try {
        const res = await api.get("admin/brand-sales/");
        setBrandData(res.data);
      } catch (err) {
        console.error("Failed to load brand sales:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandSales();
  }, []);

  // Custom Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-md border border-cyan-500/30 p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1">
            {payload[0].payload.brand}
          </p>
          <p className="text-lg font-black text-white">
            {payload[0].value} <span className="text-xs font-medium text-gray-500">Orders</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="h-[350px] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full h-full">
      {/* Container sizing handled by DashboardHome wrapper */}
      <div className="relative h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={brandData}>
            {/* Subtle Grid Lines */}
            <PolarGrid stroke="#1f2937" strokeDasharray="3 3" />
            
            {/* Labels for Brands */}
            <PolarAngleAxis 
              dataKey="brand" 
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}
            />

            {/* Hidden Radius Axis for Scale */}
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />

            <Tooltip content={<CustomTooltip />} />

            <Radar
              name="Sales Performance"
              dataKey="sales"
              stroke="#22d3ee"
              strokeWidth={3}
              fill="url(#radarGradient)"
              fillOpacity={1}
            />
            
            {/* Gradient for the Radar Area */}
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Simplified Legend */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em]">Market Penetration</span>
        </div>
      </div>
    </div>
  );
}
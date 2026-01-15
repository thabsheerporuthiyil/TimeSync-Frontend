import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// A more sophisticated palette: Electric Indigo to Soft Pink
const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e", "#fb923c"];

export default function BrandCountChart() {
  const [brandData, setBrandData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandCounts = async () => {
      try {
        const res = await api.get("admin/brand-count/");
        setBrandData(res.data);
      } catch (err) {
        console.error("Failed to load brand count:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandCounts();
  }, []);

  // Custom Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Brand Identity</p>
          <p className="text-sm font-bold text-white mb-2">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <p className="text-xl font-black text-white">
              {payload[0].value} <span className="text-[10px] text-slate-500 uppercase">Models</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="h-[300px] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="w-full">
      <div className="relative h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={brandData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {/* Dynamic Gradients for bars */}
              {COLORS.map((color, i) => (
                <linearGradient key={`grad-${i}`} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="8 8" />
            
            <XAxis 
              dataKey="brand" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}
              dy={15}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10 }}
            />

            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<CustomTooltip />} />
            
            <Bar 
              dataKey="count" 
              radius={[10, 10, 0, 0]} 
              barSize={45}
            >
              {brandData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#barGrad-${index % COLORS.length})`}
                  className="hover:opacity-100 opacity-80 transition-opacity duration-300 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RevenueLineChart({ data }) {
  // Custom Tooltip component to match the dark glassmorphism style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1221]/90 backdrop-blur-md border border-gray-800 p-3 rounded-lg shadow-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
          <p className="text-lg font-black text-white">
            {payload[0].value}
          </p>
          <p className="text-[10px] font-bold text-blue-500 mt-1">
            Orders: {payload[0].payload.orders || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h3 className="text-lg font-bold text-white tracking-wide">Monthly Revenue</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {/* This creates the vertical fade under the curvy line */}
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            vertical={false} 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.05)" 
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            stroke="#64748b"
            tick={{ fontSize: 11, fontWeight: 600 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            stroke="#64748b"
            tick={{ fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1 }} />

          <Area
            type="monotone" // This makes the line curvy
            dataKey="revenue"
            stroke="#facc15" // The yellow line color
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)" // Link to the gradient defined above
            activeDot={{ 
              r: 6, 
              stroke: '#030712', 
              strokeWidth: 2, 
              fill: '#facc15' 
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 
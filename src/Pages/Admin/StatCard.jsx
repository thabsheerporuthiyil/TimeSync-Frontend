export default function StatCard({ title, value, icon, color = "blue" }) {
  // Mapping for dynamic glow and icon colors based on the 'color' prop
  const colorMap = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
    green: "text-green-400 bg-green-500/10 border-green-500/20 shadow-green-500/5",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20 shadow-orange-500/5",
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className="relative overflow-hidden bg-gray-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-gray-800 shadow-xl transition-all duration-300 hover:border-gray-700 hover:-translate-y-1 group">
      
      {/* Decorative Glow Background Effect */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${selectedColor.split(' ')[0].replace('text', 'bg')}`} />

      <div className="flex flex-col gap-4">
        {/* Icon Container */}
        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-transform duration-500 group-hover:rotate-[10deg] ${selectedColor}`}>
          {icon}
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white tracking-tight">
              {value}
            </p>
            {/* Optional: Small sparkline or trend indicator could go here */}
            <div className={`w-1 h-1 rounded-full animate-pulse ${selectedColor.split(' ')[0]}`} />
          </div>
        </div>
      </div>

      {/* Subtle bottom accent line that appears on hover */}
      <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${selectedColor.split(' ')[0].replace('text', 'bg')}`} />
    </div>
  );
}
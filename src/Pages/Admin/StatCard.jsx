export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-300 hover:shadow-xl transition-all hover:border-blue-400 group flex items-center gap-4">
      <div className="bg-gray-100 p-4 rounded-xl">{icon}</div>
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gray-600">
          {title}
        </h3>
        <p className="text-3xl md:text-4xl font-bold mt-1 text-black group-hover:text-blue-600 transition-colors">
          {value}
        </p>
      </div>
    </div>
  );
}
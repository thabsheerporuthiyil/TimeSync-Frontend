import { useState, useEffect } from "react";
import axios from "axios";
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

export default function BrandCountChart() {
const [brandData, setBrandData] = useState([]);

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

useEffect(() => {
  axios
    .get("http://localhost:5000/products")
    .then((res) => {
      const products = res.data;

      // Count number of products per brand
      const counts = {};
      products.forEach((product) => {
        counts[product.brand] = (counts[product.brand] || 0) + 1;
      });

      const formatted = Object.keys(counts).map((brand) => ({
        brand,
        count: counts[brand],
      }));

      setBrandData(formatted);
    })
    .catch((err) => console.error("Error fetching products:", err));
}, []);

return (
  <div className="bg-gray-900 text-white p-6 rounded-2xl">
    <h2 className="text-lg font-bold mb-2 text-blue-400">
      Product Count by Brand
    </h2>
    <p className="text-gray-400 text-sm mb-4">
      Displays how many products each brand has.
    </p>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={brandData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="brand" stroke="#ddd" />
        <YAxis stroke="#ddd" />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.85)",
            border: "none",
            borderRadius: "8px",
          }}
          itemStyle={{ color: "#facc15" }}
          labelStyle={{ color: "#fff" }}
        />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {brandData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);
}

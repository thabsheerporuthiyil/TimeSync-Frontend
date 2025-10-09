import { useEffect, useState } from "react";
import axios from "axios";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function BrandRadarChart() {
const [brandData, setBrandData] = useState([]);

useEffect(() => {
  axios
    .get("https://timesync-e-commerce.onrender.com/users")
    .then((res) => {
      const users = res.data;
      const totals = {};

      // Loop through all users
      for (const user of users) {
        // Loop through order of the user
        if (user.orders) {
          for (const order of user.orders) {
            // Loop through item in the order
            if (order.items) {
              for (const item of order.items) {
                const brand = item.brand;
                const qty = item.quantity || 0;
                totals[brand] = (totals[brand] || 0) + qty;
              }
            }
          }
        }
      }

      // Convert object → array for Recharts
      const formatted = [];
      for (const brand in totals) {
        formatted.push({ brand, sales: totals[brand] });
      }

      setBrandData(formatted);
    })
    .catch((err) => console.error("Error fetching data:", err));
}, []);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl">
      <h2 className="text-lg font-bold mb-2 text-blue-400">
        Brand Sales Performance
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        This radar chart shows the total quantity of products sold across brands.
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={brandData}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="brand" stroke="#9CA3AF" />
          <PolarRadiusAxis stroke="#6B7280" />
          <Radar
            name="Total Quantity Sold"
            dataKey="sales"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

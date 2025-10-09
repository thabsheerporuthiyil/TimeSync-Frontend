import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#ef4444"]; // green = in stock, red = out of stock

export default function StockPieChart() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://timesync-e-commerce.onrender.com/products");
        const products = res.data || [];

        const inStock = products.filter((p) => p.stock > 0).length;
        const outOfStock = products.filter((p) => p.stock <= 0).length;

        setStockData([
          { name: "In Stock", value: inStock },
          { name: "Out of Stock", value: outOfStock },
        ]);
      } catch (err) {
        console.error("Failed to load stock data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-white">Loading stock data...</p>;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl">
      <h2 className="text-lg font-bold mb-2 text-blue-400">Product Stock</h2>
      <p className="text-gray-300 text-sm mb-4">
        This chart shows how many products are available in stock compared to those that are out of stock.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={stockData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {stockData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

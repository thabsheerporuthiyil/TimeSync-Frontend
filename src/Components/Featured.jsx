import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Featured() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("categories/categories/");
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        
        const filtered = data.filter(cat => 
          cat.filter_key === "Men" || cat.filter_key === "Ladies"
        );
        setCategories(filtered);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchCategories();
  }, []);

  
  return (
    <section className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Curated Categories</h2>
            <p className="text-gray-500 mt-2">Tailored precision for every lifestyle.</p>
        </div>
        <div className="h-[1px] flex-grow mx-8 bg-gray-200 hidden md:block"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/watches?filter=${encodeURIComponent(cat.filter_key)}`}
            className="group relative block overflow-hidden"
          >
            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>
              
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-sm tracking-widest uppercase mb-2 opacity-80">Collection</p>
                <h3 className="text-3xl font-bold mb-4">{cat.title}</h3>
                <span className="inline-block py-2 border-b border-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500">
                    View Products
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
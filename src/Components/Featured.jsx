import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Featured() {
const [categories, setCategories] = useState([]);

useEffect(() => {
  axios.get("http://localhost:5000/categories")
    .then(res => { setCategories(res.data); })
    .catch(err => { console.error("Error fetching categories:", err); });
}, []);

return (
  <section className="py-16 container mx-auto px-6">
    <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
      Shop by Category
    </h2>

    <div className="grid md:grid-cols-3 gap-8">
      {categories.map(cat => (
        <Link 
          key={cat.id}
          to={`/watches?filter=${encodeURIComponent(cat.filterKey)}`} 
          className="relative group overflow-hidden rounded-2xl shadow-lg"
        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <img
            src={cat.image}
            alt={cat.title}
            className="w-full h-80 object-cover group-hover:scale-110 transition opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold">
            {cat.title}
          </div>
        </Link>
      ))}
    </div>
  </section>
);
}

import { useEffect, useState } from "react";
import axios from "axios";

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get("https://timesync-e-commerce.onrender.com/brands")
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Failed to load brands:", err));
  }, []);

  return (
    <section className="py-12 bg-white text-center">
      <h2 className="text-3xl font-bold mb-8 text-blue-600">Explore our Brands</h2>
      <div className="flex flex-wrap justify-center items-center gap-10">
        {brands.map((brand, index) => (
          <div key={index} className="group cursor-pointer">
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-14 object-contain grayscale transition duration-300 group-hover:grayscale-0 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

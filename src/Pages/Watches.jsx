import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Heart } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Watches() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { cart, addToCart, wishlist,toggleWishlist } = useContext(ShopContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const filters = ["All", "Men", "Ladies", "Casio", "Rolex", "Titan", "Hublot", "Seiko"];
  const priceRanges = [
    { label: "All", value: "All" },
    { label: "Under ₹10,000", value: "under10k" },
    { label: "₹10,000 - ₹50,000", value: "10k-50k" },
    { label: "₹50,000 - ₹1,00,000", value: "50k-100k" },
    { label: "Above ₹1,00,000", value: "above1L" },
  ];

  const itemsPerPage = 10;

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // restore
  useEffect(() => {
    const params = new URLSearchParams(location.search); // query string to object
    setSelectedFilter(params.get("filter") || "All");
    setPriceRange(params.get("price") || "All");
    setSearch(params.get("search") || "");
    setCurrentPage(parseInt(params.get("page")) || 1);
  }, []);

  // update url
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedFilter !== "All") params.set("filter", selectedFilter);
    if (priceRange !== "All") params.set("price", priceRange);
    if (search) params.set("search", search);
    if (currentPage > 1) params.set("page", currentPage);
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedFilter, priceRange, search, currentPage, navigate]);

  // Filtering
  const filteredProducts = products.filter((p) => {
    const query = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);

    const numericPrice = Number(p.price.toString().replace(/,/g, ""));

    const matchesFilter =
      selectedFilter === "All" ||
      p.category.toLowerCase() === selectedFilter.toLowerCase() ||
      p.brand.toLowerCase() === selectedFilter.toLowerCase() ||
      (selectedFilter === "Luxury" && numericPrice > 100000);

    const matchesPrice =
      priceRange === "All" ||
      (priceRange === "under10k" && numericPrice < 10000) ||
      (priceRange === "10k-50k" && numericPrice >= 10000 && numericPrice <= 50000) ||
      (priceRange === "50k-100k" && numericPrice > 50000 && numericPrice <= 100000) ||
      (priceRange === "above1L" && numericPrice > 100000);

    return matchesSearch && matchesFilter && matchesPrice;
  });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Add to Cart with live stock update
  const handleAddToCart = async (product) => {
  if (!user) {
    toast.error("You must be logged in!");
    navigate("/login");
    return;
  }

  const existing = cart.find((item) => item.id === product.id);
  const quantityInCart = existing ? existing.quantity : 0;

  if (quantityInCart >= product.stock) {
    toast.warning("No more stock available!");
    return;
  }

  await addToCart(product);
  toast.success("Added to Cart!");
};



  return (
    <section className="mt-20 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Watches</h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search watches..."
          className="px-4 py-2 border border-gray-300 rounded-lg w-80"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 items-center">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setSelectedFilter(filter);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full border ${
              selectedFilter === filter
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
        
        <div className="flex items-center gap-2">
          <span className="text-gray-700 whitespace-nowrap">Price:</span>
          <div className="relative">
            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none px-4 py-2 pr-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-7 justify-items-center">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="relative bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-3 w-full max-w-xs h-96 flex flex-col"
          >
            <Link to={`/products/${product.id}`} className="flex-grow">
              <div className="relative h-40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-lg mb-4"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!user) {
                      toast.error("You must be logged in!");
                      navigate("/login");
                      return;
                    }
                    toggleWishlist(product);
                    if (wishlist.some((item) => item.id === product.id)) {
                      toast.info("Removed from Wishlist!");
                    } else {
                      toast.success("Added to Wishlist!");
                    }
                  }}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-100 transition"
                >
                  <Heart
                    className={`w-5 h-5 transition ${
                      wishlist.some((item) => item.id === product.id)
                        ? "fill-red-400 text-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                  />
                </button>
              </div>

              <div className="flex-grow">
                <h4 className="text-lg font-bold">{product.brand}</h4>
                <p className="text-gray-500 text-sm mb-2">{product.name}</p>
                <p className="text-gray-500 text-sm">Category: {product.category}</p>
              </div>

              <div className="mb-4">
                <p className="text-xl font-bold text-blue-600">₹{product.price}</p>
                <p
                  className={`text-sm font-semibold ${
                    (product.stock - (cart.find(i => i.id === product.id)?.quantity || 0)) > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(product.stock - (cart.find(i => i.id === product.id)?.quantity || 0)) > 0
                    ? `${product.stock - (cart.find(i => i.id === product.id)?.quantity || 0)} in stock`
                    : "Out of Stock"}
                </p>

              </div>
            </Link>

            {/* Buttons */}
            <div className="mt-auto flex justify-between gap-2">
              <button
              onClick={() => handleAddToCart(product)}
              disabled={
                (product.stock - (cart.find(i => i.id === product.id)?.quantity || 0)) <= 0
              }
              className={`flex-1 border border-gray-400 rounded-lg py-2 transition-colors ${
                (product.stock - (cart.find(i => i.id === product.id)?.quantity || 0)) <= 0
                  ? "bg-gray-200 text-gray-500"
                  : "hover:bg-gray-100"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={() => navigate(`/products/${product.id}`)}
              disabled={
                (product.stock - (cart.find(i => i.id === product.id)?.quantity || 0)) <= 0
              }
              className={`flex-1 rounded-lg py-2 transition-colors ${
                (product.stock - (cart.find(i => i.id === product.id)?.quantity || 0)) > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              Buy Now
            </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === i + 1 ? "bg-black text-white" : "bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

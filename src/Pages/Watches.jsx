import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Search, ChevronDown, ShoppingBag, ArrowRight, SlidersHorizontal } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { UserContext } from "../context/UserContext";
import { toast } from 'sonner';
import api from "../api/axios";

export default function Watches() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(urlParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedFilter, setSelectedFilter] = useState(urlParams.get("filter") || "All");
  const [priceRange, setPriceRange] = useState(urlParams.get("price") || "All");
  const [currentPage, setCurrentPage] = useState(parseInt(urlParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);

  const { cart, addToCart, toggleWishlist, isWishlisted } = useContext(ShopContext);
  const { user, loading: userLoading } = useContext(UserContext);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
  const fetchProducts = async () => {
    const params = {
      page: currentPage,
      search: debouncedSearch || undefined,
    };

    // 🔹 Category / Brand filter
    if (selectedFilter !== "All") {
      if (["Men", "Ladies"].includes(selectedFilter)) {
        params["category__filter_key"] = selectedFilter;
      } else {
        params["brand__name"] = selectedFilter;
      }
    }

    // 🔹 Price filter
    if (priceRange !== "All") {
      if (priceRange === "under10k") params.price__lt = 10000;
      if (priceRange === "10k-50k") {
        params.price__gte = 10000;
        params.price__lte = 50000;
      }
      if (priceRange === "50k-100k") {
        params.price__gte = 50000;
        params.price__lte = 100000;
      }
      if (priceRange === "above1L") params.price__gte = 100000;
    }

    try {
      const res = await api.get("products/products/", { params });
      setProducts(res.data.results);
      setTotalPages(res.data.total_pages);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setInitialLoad(false);
    }
  };

  fetchProducts();
}, [debouncedSearch, selectedFilter, priceRange, currentPage]);


  const getCartQuantity = useCallback((productId) => {
    return cart.find((c) => c.id === productId)?.quantity || 0;
  }, [cart]);

  if (userLoading || initialLoad) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-[4/5] bg-gray-100 rounded-2xl" />
              <div className="h-4 bg-gray-100 w-1/2 rounded" />
              <div className="h-6 bg-gray-100 w-3/4 rounded" />
              <div className="h-4 bg-gray-100 w-1/4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white pt-32 pb-24 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-600 block mb-4 bg-blue-50 px-4 py-2 rounded-full w-fit">
              The Collection
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 leading-tight">
              Exceptional <br /> <span className="text-gray-400">Timepieces</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by brand or model..."
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/10 focus:bg-white transition-all text-sm outline-none"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 border-y border-gray-100 py-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {["All", "Men", "Ladies", "Rolex", "Casio", "Seiko", "Hublot", "Titan"].map((filter) => (
              <button
                key={filter}
                onClick={() => { setSelectedFilter(filter); setCurrentPage(1); }}
                className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                  selectedFilter === filter
                    ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                    : "bg-white text-gray-400 hover:text-gray-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 bg-gray-50 px-6 py-2 rounded-full border border-gray-100">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={priceRange}
              onChange={(e) => { setPriceRange(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="All">All Price Tiers</option>
              <option value="under10k">Under ₹10k</option>
              <option value="10k-50k">₹10k - ₹50k</option>
              <option value="50k-100k">₹50k - ₹1L</option>
              <option value="above1L">Premium (1L+)</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-y-16 gap-x-10">
          {products.map((product) => {
            const qtyInCart = getCartQuantity(product.id);
            const availableStock = product.stock - qtyInCart;
            const isFull = availableStock <= 0;
            const isLiked = isWishlisted(product.id);

            return (
              <div key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] bg-[#fafafa] rounded-3xl overflow-hidden mb-6 border border-gray-50 p-6 flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-gray-200/50 group-hover:-translate-y-2">
                  
                  {/* Item Image */}
                  <Link to={`/products/${product.id}`} className="w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!user) { navigate("/login"); return; }
                      isLiked ? toast.info("Removed from vault") : toast.success("Saved to vault");
                      await toggleWishlist(product);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} />
                  </button>

                  {/* Stock Badge */}
                  {isFull && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-900 border-2 border-gray-900 px-4 py-2">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow space-y-1 text-center sm:text-left px-2">
                  <span className="text-blue-600 text-[9px] font-bold uppercase tracking-[0.2em]">{product.brand_name}</span>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-sm font-serif text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                    <p className="text-base font-light text-gray-900">₹{Number(product.price).toLocaleString("en-IN")}</p>
                    {availableStock < 5 && !isFull && (
                      <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">
                        Last {availableStock}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-2 px-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!user) { navigate("/login"); return; }
                      toast.success("Piece Reserved");
                      addToCart(product).catch((err) => toast.error(err.response?.data?.error || "Limit reached"));
                    }}
                    disabled={isFull}
                    className="flex-1 bg-gray-900 text-white text-[9px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={12} /> Add
                  </button>
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="flex-1 border border-gray-200 text-gray-900 text-[9px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-24 gap-4 items-center">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
            >
              <ArrowRight className="rotate-180" size={18} />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-full text-xs font-bold transition-all ${
                    currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "hover:bg-gray-100 text-gray-400"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
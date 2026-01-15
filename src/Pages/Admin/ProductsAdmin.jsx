import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, PlusCircle, ChevronDown, Save, X, Search, Package, AlertCircle } from "lucide-react";
import api from "../../api/axios";
import { toast } from 'sonner';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedStock, setSelectedStock] = useState("All Products");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "", brand: "", price: "", image: "", category: "Men", stock: 0
  });
  const [brandsList, setBrandsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      setIsPageLoading(true);
      try {
        await Promise.all([fetchProducts(1), fetchBrands(), fetchCategories()]);
      } finally {
        setIsPageLoading(false);
      }
    };
    loadInitialData();
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // FIXED: Trigger fetch when filters change (skip if initial loading)
  useEffect(() => {
    if (!isPageLoading) {
      fetchProducts(1);
    }
  }, [selectedBrand, selectedStock, debouncedSearch]);


  const fetchProducts = async (page = 1) => {
    try {
      const params = { page };
      if (selectedBrand !== "All Brands") params.brand = selectedBrand;
      if (selectedStock === "In Stock") params.stock = "in";
      else if (selectedStock === "Out of Stock") params.stock = "out";
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const res = await api.get("admin/products/", { params });
      setProducts(res.data.results);
      setTotalCount(res.data.count);
      setTotalPages(Math.ceil(res.data.count / 10));
      setCurrentPage(page);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  const fetchBrands = async () => {
    const res = await api.get("brands/");
    setBrandsList(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("categories/categories/");
    setCategoriesList(res.data);
  };

  useEffect(() => {
    fetchProducts(1);
  }, [selectedBrand, selectedStock, debouncedSearch]);


  const brands = ["All Brands", ...brandsList.map(b => b.name)];

  const handleAddProduct = () => {
    setIsAddingProduct(true);
    setNewProduct({ name: "", brand: "", category: "", price: "", image: "", stock: 0 });
  };

  const handleCancelAdd = () => setIsAddingProduct(false);

  const handleNewProductChange = (field, value) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNewProduct = async () => {
    try {
      setIsLoading(true);
      await api.post("admin/products/", newProduct);
      await fetchProducts(1);
      setIsAddingProduct(false);
      toast.success("Product added");
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      brand: brandsList.find(b => b.name === product.brand_name)?.id,
      category: categoriesList.find(c => c.title === product.category_title)?.id,
    });
  };

  const handleCancelEdit = () => setEditingProduct(null);

  const handleEditChange = (field, value) => {
    setEditingProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    const payload = {
      name: editingProduct.name,
      price: editingProduct.price,
      image: editingProduct.image,
      stock: editingProduct.stock,
      brand: editingProduct.brand,
      category: editingProduct.category,
    };
    try {
      setIsLoading(true);
      const res = await api.put(`admin/products/${editingProduct.id}/`, payload);
      setProducts(products.map(p => p.id === res.data.id ? res.data : p));
      setEditingProduct(null);
      toast.success("Product updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setIsLoading(true);
    try {
      await api.delete(`admin/products/${productId}/`);
      await fetchProducts(currentPage);
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Error deleting product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#030712] p-4 md:p-8 text-slate-200">
        {/* Header Skeleton */}
        <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-gray-800/50 rounded-lg animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="h-11 w-48 bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-11 w-40 bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-11 w-40 bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-11 w-32 bg-blue-900/30 rounded-xl animate-pulse border border-blue-500/20" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-[2rem] overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Table Header Placeholder */}
            <div className="flex justify-between border-b border-gray-800 pb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
            {/* Table Rows Placeholder */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-gray-800/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-800 rounded-2xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-800/50 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-24 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-6 w-24 bg-gray-800/50 rounded-full animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl animate-pulse" />
                  <div className="w-10 h-10 bg-gray-800 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] p-4 md:p-8 text-slate-200">

      {/* Header Section */}
      <div className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Package className="text-blue-500" size={32} />
            Inventory <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Vault</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium uppercase tracking-widest">
            Manage your global catalog ({totalCount} items)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 text-slate-300 text-xs font-bold py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:border-blue-500 transition-all min-w-[220px]"
            />
          </div>
          {/* Brand Filter */}
          <div className="relative group">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 text-slate-300 text-xs font-bold py-3 pl-4 pr-10 rounded-xl appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer min-w-[160px]"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand} className="bg-gray-900">{brand}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-500 transition-colors pointer-events-none" />
          </div>

          {/* Stock Filter */}
          <div className="relative group">
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 text-slate-300 text-xs font-bold py-3 pl-4 pr-10 rounded-xl appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer min-w-[160px]"
            >
              <option value="All Products" className="bg-gray-900">Live & Out</option>
              <option value="In Stock" className="bg-gray-900">In Stock</option>
              <option value="Out of Stock" className="bg-gray-900">Out of Stock</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-500 transition-colors pointer-events-none" />
          </div>

          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-95"
          >
            <PlusCircle size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Product Info</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden md:table-cell">Brand</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Valuation</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="py-6 px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <motion.tr
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden border border-gray-700 bg-gray-800 group-hover:border-blue-500/50 transition-colors">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{product.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 hidden md:table-cell">
                      <span className="text-xs font-bold text-slate-400 py-1 px-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        {product.brand_name}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-black text-white">₹{Number(product.price).toLocaleString()}</p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${product.stock > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of stock"}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Custom Pagination */}
        <div className="p-6 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/20">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchProducts(currentPage - 1)}
              className="px-4 py-2 border border-gray-800 rounded-xl text-xs font-bold hover:bg-gray-800 disabled:opacity-30 transition-all"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchProducts(currentPage + 1)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold hover:bg-gray-700 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Shared Modal Logic (Add/Edit) */}
      {(isAddingProduct || editingProduct) && (
        <div className="fixed inset-0 bg-[#030712]/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <div>
                <h2 className="text-2xl font-black text-white">{isAddingProduct ? "New Product" : "Edit Unit"}</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">System SKU Update</p>
              </div>
              <button onClick={isAddingProduct ? handleCancelAdd : handleCancelEdit} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Product Name" value={isAddingProduct ? newProduct.name : editingProduct.name} onChange={(val) => isAddingProduct ? handleNewProductChange('name', val) : handleEditChange('name', val)} />

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Brand</label>
                  <select
                    value={isAddingProduct ? newProduct.brand : editingProduct.brand}
                    onChange={(e) => isAddingProduct ? handleNewProductChange("brand", Number(e.target.value)) : handleEditChange("brand", Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Brand</option>
                    {brandsList.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Category</label>
                  <select
                    value={isAddingProduct ? newProduct.category : editingProduct.category}
                    onChange={(e) => isAddingProduct ? handleNewProductChange("category", Number(e.target.value)) : handleEditChange("category", Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    {categoriesList.map(c => <option key={c.id} value={c.id}>{c.title || c.filter_key}</option>)}
                  </select>
                </div>

                <InputGroup label="Price (₹)" type="text" value={isAddingProduct ? newProduct.price : editingProduct.price} onChange={(val) => isAddingProduct ? handleNewProductChange('price', val) : handleEditChange('price', val)} />
                <div className="md:col-span-2">
                  <InputGroup label="Image URL" value={isAddingProduct ? newProduct.image : editingProduct.image} onChange={(val) => isAddingProduct ? handleNewProductChange('image', val) : handleEditChange('image', val)} />
                </div>
                <InputGroup label="Stock Level" type="number" value={isAddingProduct ? newProduct.stock : editingProduct.stock} onChange={(val) => isAddingProduct ? handleNewProductChange('stock', Number(val)) : handleEditChange('stock', Number(val))} />
              </div>
            </div>

            <div className="p-8 border-t border-gray-800 bg-gray-900/50 flex gap-4">
              <button
                onClick={isAddingProduct ? handleCancelAdd : handleCancelEdit}
                className="flex-1 px-6 py-4 border border-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all text-slate-400"
              >
                Discard
              </button>
              <button
                onClick={isAddingProduct ? handleSaveNewProduct : handleSaveEdit}
                disabled={isLoading}
                className={`flex-1 px-6 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${isAddingProduct ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]'}`}
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : isAddingProduct ? "Authorize Addition" : "Commit Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Global Loading Spinner for Delete/Fetch */}
      {isLoading && !isAddingProduct && !editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Processing Sync</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Sub-component for clean UI
function InputGroup({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors placeholder:text-slate-600"
      />
    </div>
  );
}
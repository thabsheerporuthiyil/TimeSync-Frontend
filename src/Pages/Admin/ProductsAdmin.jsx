import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, PlusCircle, ChevronDown, Save, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProductsAdmin() {
const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [selectedBrand, setSelectedBrand] = useState("All Brands");
const [selectedStock, setSelectedStock] = useState("All Products");
const [editingProduct, setEditingProduct] = useState(null);
const [isAddingProduct, setIsAddingProduct] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [newProduct, setNewProduct] = useState({
  name: "", brand: "", price: "", image: "", category: "Men", stock: 0
});


useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  try {
    const res = await axios.get("https://timesync-e-commerce.onrender.com/products");
    setProducts(res.data);
    setFilteredProducts(res.data);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Dropdown filters
useEffect(() => {
  let filtered = products;
  
  if (selectedBrand !== "All Brands") {
    filtered = filtered.filter(product => product.brand === selectedBrand);
  }
  
  if (selectedStock === "In Stock") {
    filtered = filtered.filter(product => product.stock > 0);
  } else if (selectedStock === "Out of Stock") {
    filtered = filtered.filter(product => product.stock === 0);
  }
  
  setFilteredProducts(filtered);
}, [selectedBrand, selectedStock, products]);

// Get unique brands for filter dropdown
const brands = ["All Brands", ...new Set(products.map(product => product.brand))];
const availableBrands = ["Titan", "Rolex", "Hublot", "Casio", "Seiko"];
const categories = ["Men", "Ladies"];

// Add Products
const handleAddProduct = () => {
  setIsAddingProduct(true);
  setNewProduct({ name: "", brand: "", price: "", image: "", category: "Men", stock: 0 });
};

const handleCancelAdd = () => {
  setIsAddingProduct(false);
};

const handleNewProductChange = (field, value) => {
  setNewProduct(prev => ({ ...prev, [field]: value }));
};

const handleSaveNewProduct = async () => {
  if (!newProduct.name || !newProduct.brand || !newProduct.price || !newProduct.image) {
    toast.warning("Please fill in all fields");
    return;
  }

  setIsLoading(true);
  try {
    const productData = {
      ...newProduct,
      id: Date.now().toString(),
      stock: Number(newProduct.stock),
    };
    // send data to server
    const res = await axios.post("https://timesync-e-commerce.onrender.com/products", productData);
    setProducts(prev => [...prev, res.data]);
    setIsAddingProduct(false);
    toast.success("Product added successfully!");
  } catch (error) {
    console.error("Error adding product:", error);
    toast.error("Error adding product");
  } finally {
    setIsLoading(false);
  }
};

// Edit products
const handleEdit = (product) => {
  setEditingProduct({ ...product });
};

const handleCancelEdit = () => {
  setEditingProduct(null);
};

const handleEditChange = (field, value) => {
  setEditingProduct(prev => ({ ...prev, [field]: value }));
};

const handleSaveEdit = async () => {
  if (!editingProduct) return;

  setIsLoading(true);
  try {
    const updatedProduct = { ...editingProduct, stock: Number(editingProduct.stock) };
    await axios.put(`https://timesync-e-commerce.onrender.com/products/${editingProduct.id}`, updatedProduct);
    setProducts(products.map(product => 
      product.id === editingProduct.id ? updatedProduct : product
    ));
    setEditingProduct(null);
    toast.success("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Error updating product");
  } finally {
    setIsLoading(false);
  }
};

// Delete Product
const handleDelete = async (productId) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  setIsLoading(true);
  try {
    await axios.delete(`https://timesync-e-commerce.onrender.com/products/${productId}`);
    setProducts(products.filter(product => product.id !== productId));
    toast.success("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.error("Error deleting product");
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
    {/* Header with Filters and Add Button */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
        Manage Products
      </h1>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 sm:flex-none">
          {/* Brand Filter */}
          <div className="relative flex-1 sm:w-48">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Stock Filter */}
          <div className="relative flex-1 sm:w-48">
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Products">All Products</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <button 
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold shadow-md w-full sm:w-auto text-sm sm:text-base"
        >
          <PlusCircle size={18} /> Add Product
        </button>
      </div>
    </div>

    {/* Results Count */}
    <div className="mb-4 text-sm text-gray-600">
      Showing {filteredProducts.length} of {products.length} products
    </div>

    {/* Add Product Modal */}
    {isAddingProduct && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
              <button onClick={handleCancelAdd} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => handleNewProductChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                <select
                  value={newProduct.brand}
                  onChange={(e) => handleNewProductChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Brand</option>
                  {availableBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => handleNewProductChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="text"
                  value={newProduct.price}
                  onChange={(e) => handleNewProductChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => handleNewProductChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count *</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => handleNewProductChange('stock', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={handleCancelAdd}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewProduct}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Adding..." : <><PlusCircle size={18} /> Add Product</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Edit Product Modal */}
    {editingProduct && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
              <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select
                  value={editingProduct.brand}
                  onChange={(e) => handleEditChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="text"
                  value={editingProduct.price}
                  onChange={(e) => handleEditChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => handleEditChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => handleEditChange('stock', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Loading Overlay */}
    {isLoading && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Processing...</p>
        </div>
      </div>
    )}

    {/* Products Table */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto bg-white shadow-lg rounded-xl"
    >
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="py-3 px-2 sm:px-4 lg:px-6">Image</th>
            <th className="py-3 px-2 sm:px-4 lg:px-6">Product</th>
            <th className="py-3 px-2 sm:px-4 lg:px-6 hidden sm:table-cell">Brand</th>
            <th className="py-3 px-2 sm:px-4 lg:px-6">Price</th>
            <th className="py-3 px-2 sm:px-4 lg:px-6">Status</th>
            <th className="py-3 px-2 sm:px-4 lg:px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <motion.tr
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td className="py-3 px-2 sm:px-4 lg:px-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                />
              </td>
              <td className="py-3 px-2 sm:px-4 lg:px-6">{product.name}</td>
              <td className="py-3 px-2 sm:px-4 lg:px-6 hidden sm:table-cell">{product.brand}</td>
              <td className="py-3 px-2 sm:px-4 lg:px-6">₹{product.price}</td>
              <td className="py-3 px-2 sm:px-4 lg:px-6">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </td>
              <td className="py-3 px-2 sm:px-4 lg:px-6 flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(product)}
                  className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </div>
);
}

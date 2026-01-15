import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { API_BASE_URL } from "../config/apiConfig";
import api from '../api/axios'

export const ShopContext = createContext();

export function ShopProvider({ children }) {
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartChecked, setCartChecked] = useState(false);

  // Products

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}products/products/`);
      setProducts(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  //Wishlist

  const fetchWishlist = async () => {
  const token = localStorage.getItem("access");
  if (!token) return;

  try {
    const res = await api.get('wishlist/');
    setWishlist(res.data.map(item => item.product));
  } catch (err) {
    console.error("Fetch wishlist failed", err);
  }
};

  useEffect(() => {
  if (user) {
    fetchWishlist();
    fetchCart();
  }
}, [user]);


  const toggleWishlist = async (product) => {
  if (!localStorage.getItem("access")) return;

  const wasWishlisted = wishlist.some(item => item.id === product.id);
  const previousWishlist = [...wishlist];

  if (wasWishlisted) {
    setWishlist(wishlist.filter(item => item.id !== product.id));
  } else {
    setWishlist([...wishlist, product]);
  }

  try {
    await api.post(`wishlist/${product.id}/toggle/`);
  } catch (err) {
    setWishlist(previousWishlist);
    console.error("Wishlist sync failed:", err);
  }
};


  const isWishlisted = (productId) =>
    wishlist.some(item => item.id === productId);


 // cart

  const fetchCart = async () => {
  const token = localStorage.getItem("access");
  if (!token) {
    setCart([]);
    setCartChecked(true);
    return;
  }

  try {
    const res = await api.get('cart/');
    setCart(
      res.data.map(item => ({
        ...item.product,
        quantity: item.quantity,
      }))
    );
  } catch (err) {
    console.error("Fetch cart failed", err);
  } finally {
    setCartChecked(true);
  }
};

  useEffect(() => {
  fetchProducts(); 
  
  const token = localStorage.getItem("access");
  if (token) {
    fetchCart();
    fetchWishlist(); 
  } else {
    setCartChecked(true);
  }
}, []);

  
const addToCart = async (product) => {
  const previousCart = [...cart];

  const existingItem = cart.find(item => item.id === product.id);
  let updatedCart;

  if (existingItem) {
    updatedCart = cart.map(item =>
      item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
  } else {
    updatedCart = [...cart, { ...product, quantity: 1 }];
  }
  setCart(updatedCart);

  try {
    await api.post(`cart/${product.id}/add/`);
  } catch (err) {
    setCart(previousCart);
    throw err; 
  }
};


  const decreaseFromCart = async (id) => {
  const previousCart = [...cart];
  const updatedCart = cart
    .map((item) =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item
    )
    .filter((item) => item.quantity > 0);

  setCart(updatedCart);

  try {
    await api.post(`cart/${id}/decrease/`);
  } catch (err) {
    setCart(previousCart);
    toast.error("Could not update cart");
  }
};

const removeFromCart = async (id) => {
  const previousCart = [...cart];
  setCart(cart.filter((item) => item.id !== id));

  try {
    await api.delete(`cart/${id}/remove/`);
  } catch (err) {
    setCart(previousCart); 
    toast.error("Could not remove item");
  }
};

  return (
    <ShopContext.Provider
      value={{
        products,
        fetchProducts,

        cart,
        addToCart,
        cartChecked,
        fetchCart,
        decreaseFromCart,
        removeFromCart,


        wishlist,
        fetchWishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

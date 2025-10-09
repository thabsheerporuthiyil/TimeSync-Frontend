import { createContext, useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export const ShopContext = createContext();

export function ShopProvider({ children }) {
  const { user, setUser } = useContext(UserContext);

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProductStock = (id, newQuantity) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p))
    );
  };

  const updateUser = async (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    try {
      await axios.patch(`http://localhost:5000/users/${user.id}`, updates);
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  // Cart
  const addToCart = async (product) => {
    if (!user) return;
    const exists = (user.cart || []).find((item) => item.id === product.id);
    let newCart;
    // if exist add quantity 1
    if (exists) {
      newCart = user.cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      newCart = [...(user.cart || []), { ...product, quantity: 1 }];
    }
    await updateUser({ cart: newCart });
  };

  const decreaseFromCart = async (id) => {
    if (!user) return;
    const newCart = [];
    for (let item of user.cart) {
      if (item.id === id && item.quantity > 1) {
        newCart.push({ ...item, quantity: item.quantity - 1 });
      } else if (item.id !== id) {
        newCart.push(item);
      }
    }
    await updateUser({ cart: newCart });
  };

  // remove an item from cart
  const removeFromCart = async (id) => {
    if (!user) return;
    const newCart = (user.cart || []).filter((item) => item.id !== id);
    await updateUser({ cart: newCart });
  };

  const clearCart = async () => {
    if (!user) return;
    await updateUser({ cart: [] });
  };

  // Wishlist
  const addToWishlist = async (product) => {
    if (!user) return;
    if (user.wishlist?.some((item) => item.id === product.id)) return;
    const newWishlist = [...(user.wishlist || []), product];
    await updateUser({ wishlist: newWishlist });
  };

  const removeFromWishlist = async (id) => {
    if (!user) return;
    const newWishlist = (user.wishlist || []).filter((item) => item.id !== id);
    await updateUser({ wishlist: newWishlist });
  };


  const toggleWishlist = async (product) => {
  if (!user) return;

  const alreadyInWishlist = user.wishlist?.some((item) => item.id === product.id);

  let newWishlist;
  if (alreadyInWishlist) {
    newWishlist = user.wishlist.filter((item) => item.id !== product.id);
  } else {
    newWishlist = [...(user.wishlist || []), product];
  }

  await updateUser({ wishlist: newWishlist });
  return !alreadyInWishlist; // return true if added, false if removed
};


  return (
    <ShopContext.Provider
      value={{
        cart: user?.cart || [],
        wishlist: user?.wishlist || [],
        products,
        fetchProducts,
        addToCart,
        decreaseFromCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        clearCart,
        updateProductStock,
        toggleWishlist
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

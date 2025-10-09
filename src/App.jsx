import Navbar from "./Components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Watches from "./Pages/Watches";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import About from "./Pages/About";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import ProductPage from "./Pages/ProductPage";
import { ToastContainer } from "react-toastify";
import Payment from "./Pages/Payment";
import ProtectedRoute from "./Components/ProtectedRoute";
import OrderConfirmation from "./Pages/OrderConfirmation";
import Orders from "./Pages/Orders";
import Footer from "./Components/Footer";
import AdminDashboard from "./Pages/Admin/DashboardSideBar";
import AdminRoute from "./Pages/Admin/AdminRoute";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
    
      {!isAdminRoute && <Navbar />}

      <ToastContainer position="top-center" autoClose={2000} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watches" element={<Watches />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
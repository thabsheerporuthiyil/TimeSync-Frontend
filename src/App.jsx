import Navbar from "./Components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Watches from "./Pages/Watches";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Signup from "./Pages/Signup";
import About from "./Pages/About";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import ProductPage from "./Pages/ProductPage";
import { Toaster } from 'sonner';
import Payment from "./Pages/Payment";
import ProtectedRoute from "./Components/ProtectedRoute";
import OrderConfirmation from "./Pages/OrderConfirmation";
import Orders from "./Pages/Orders";
import Footer from "./Components/Footer";
import AdminDashboard from "./Pages/Admin/DashboardSideBar";
import AdminRoute from "./Pages/Admin/AdminRoute";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";
import Notifications from "./Pages/Notifications";
import ScrollToTop from "../ScrollToTop";
import PublicRoute from "./Components/PublicRoute";


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#111827', // text-gray-900
            border: '1px solid #f3f4f6', // border-gray-100
            borderRadius: '12px',
            padding: '16px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontFamily: 'serif',
          },
        }}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/watches" element={<Watches />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />

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
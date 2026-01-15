import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ShopContext } from "../context/ShopContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Package, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Mail, 
  ArrowRight,
  Clock
} from "lucide-react";
import api from "../api/axios";

export default function Profile() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const { wishlist, cart } = useContext(ShopContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("accounts/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-[#fafafa] pt-32 px-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-48 mb-12 mx-auto md:mx-0"></div>
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 h-[500px] bg-gray-100 rounded-3xl"></div>
            <div className="h-[300px] bg-gray-100 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-600 block mb-3">
              Member Dashboard
            </span>
            <h1 className="text-4xl font-serif text-gray-900 tracking-tight">
              Welcome back, <span className="italic text-gray-400 font-light">{user.full_name.split(' ')[0]}</span>
            </h1>
          </div>
          <button 
            onClick={() => navigate('/watches')}
            className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            Continue Shopping <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Main Content: Left Column */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Identity Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-900 p-8 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white text-3xl font-serif shadow-xl shadow-blue-900/20">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-serif text-white">{user.full_name}</h2>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Mail size={14} className="text-blue-500" /> {user.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <ShieldCheck size={14} className="text-green-500" /> Verified {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 grid sm:grid-cols-2 gap-10 bg-white">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Personal Details</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] text-gray-400 uppercase tracking-tighter">Full Identity</p>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{user.full_name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 uppercase tracking-tighter">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-50 text-green-700 mt-1">
                        {user.blocked ? "Suspended" : "Active Member"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div className="flex flex-col justify-end items-start sm:items-end">
                  <button className="text-[11px] font-bold uppercase tracking-widest text-blue-600 hover:text-gray-900 transition-colors">
                    Edit Preferences
                  </button>
                </div> */}
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-gray-900">Purchase History</h3>
                <Link to="/orders" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600">View All</Link>
              </div>

              {profile.orders?.length ? (
                <div className="grid gap-4">
                  {profile.orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{order.id.toString().slice(-6).toUpperCase()}</p>
                          <p className="text-sm font-medium text-gray-900 mt-0.5">₹{Number(order.total_amount).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-2">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                  <p className="text-sm text-gray-400 font-light italic">Your acquisition history is currently empty.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-8 pb-4 border-b border-gray-50">Vault Summary</h3>
              
              <div className="space-y-6">
                {[
                  { label: "Orders", val: profile.orders?.length || 0, icon: <Package size={16}/>, path: '/orders' },
                  { label: "Wishlist", val: wishlist?.length || 0, icon: <Heart size={16}/>, path: '/wishlist' },
                  { label: "Cart Items", val: cart?.length || 0, icon: <ShoppingBag size={16}/>, path: '/cart' }
                ].map((item) => (
                  <Link to={item.path} key={item.label} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-blue-600 transition-colors">
                      <span className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">{item.icon}</span>
                      <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-lg font-serif text-gray-900">{item.val}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
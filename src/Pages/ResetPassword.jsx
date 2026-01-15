import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from 'sonner';
import { Lock, ShieldCheck } from "lucide-react";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await api.post(`accounts/reset-password/${uid}/${token}/`, {
        password,
      });
      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        
        {/* Form Card */}
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            {/* Minimal Icon Header */}
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Set New Password
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Please choose a strong password to secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password here"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password again"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Updating password..." : "Reset Password"}
            </button>
          </form>
        </div>

        {/* Brand Footer */}
        <p className="text-center text-gray-400 text-xs mt-8 uppercase tracking-widest">
          Time<span className="text-blue-600">Sync</span> Security
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
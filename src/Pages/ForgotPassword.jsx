import { useState } from "react";
import api from "../api/axios";
import { toast } from 'sonner';
import { Mail, ArrowLeft } from "lucide-react"; // Icons for a premium feel
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("accounts/forgot-password/", { email });
      toast.success("Reset link sent to your email");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        {/* Back to Login Link */}
        <Link 
          to="/login" 
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Form Card */}
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            {/* Minimal Icon Header */}
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Forgot Password
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your mail"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        </div>

        {/* Footer Support Text */}
        <p className="text-center text-gray-400 text-xs mt-8 uppercase tracking-widest">
          Secured by Time<span className="text-blue-600">Sync</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
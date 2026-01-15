import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import signVideo from '../assets/signvideo.mp4';
import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setPasswordError("");

    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post(ENDPOINTS.REGISTER, {
        email,
        full_name: name,
        password,
      });
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data?.email) {
        setMessage("Email already exists.");
      } else {
        setMessage("Signup failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center pt-22 pb-12 px-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden min-h-[700px]">
        
        {/* Left Side: Signup Form */}
        <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl font-serif text-gray-900 tracking-tight mb-3">
              Create an <span className="italic text-gray-400">Account</span>
            </h2>
            <p className="text-gray-400 text-sm tracking-wide uppercase font-bold">
              Join the TimeSync Heritage
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold absolute -top-2 left-3 bg-white px-2 z-10">
                Full Name
              </label>
              <div className="flex items-center border border-gray-200 bg-white rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all px-4 py-3.5 shadow-sm">
                <User className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                  type="text"
                  placeholder="Enter Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold absolute -top-2 left-3 bg-white px-2 z-10">
                Email Address
              </label>
              <div className="flex items-center border border-gray-200 bg-white rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all px-4 py-3.5 shadow-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                  type="email"
                  placeholder="Enter Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold absolute -top-2 left-3 bg-white px-2 z-10">
                Password
              </label>
              <div className="flex items-center border border-gray-200 bg-white rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all px-4 py-3.5 shadow-sm">
                <Lock className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold absolute -top-2 left-3 bg-white px-2 z-10">
                Confirm Password
              </label>
              <div className="flex items-center border border-gray-200 bg-white rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all px-4 py-3.5 shadow-sm">
                <Lock className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Error Message for Password */}
            {passwordError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold text-center">
                {passwordError}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-gray-900 text-white font-bold py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group hover:bg-blue-600 shadow-lg shadow-gray-200 disabled:opacity-70"
              type="submit"
            >
              {loading ? (
                <span className="animate-pulse">PROCESSING...</span>
              ) : (
                <>
                  BECOME A MEMBER <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center text-xs font-bold uppercase tracking-widest ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          <div className="mt-10 text-center text-sm text-gray-400">
            Already a member?
            <Link to='/login' className="font-bold text-gray-900 hover:text-blue-600 ml-2 border-b border-gray-900 hover:border-blue-600 pb-0.5 transition-all">
              Login here
            </Link>
          </div>
        </div>

        {/* Right Side: Video Branding */}
        <div className="relative hidden md:block overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={signVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
          <div className="absolute bottom-16 left-12 right-12 z-20 text-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 block mb-4">
              The Collection
            </span>
            <h2 className="text-5xl font-serif tracking-tight leading-tight">
              Time is the <br />Ultimate <span className="italic opacity-70">Luxury</span>
            </h2>
            <div className="h-[1px] w-20 bg-white/40 mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
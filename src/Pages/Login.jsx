import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import logVideo from "../assets/logvideo.mp4";
import { useGoogleLogin } from "@react-oauth/google";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login, googleLogin } = useContext(UserContext);

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Note: useGoogleLogin returns an access_token, not a credential string
        const user = await googleLogin(tokenResponse.access_token);
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } catch (err) {
        const errorCode = err.response?.data?.detail;
        if (errorCode === "ACCOUNT_BLOCKED") {
          setMessage("Your account has been blocked by admin.");
        }
      }
    },
    onError: () => setMessage("Google login failed. Please try again."),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = await login(email, password);
      navigate("/");
    } catch (err) {
      const errorCode = err.response?.data?.detail;

      if (errorCode === "ACCOUNT_BLOCKED") {
        setMessage("Your account has been blocked by admin.");
      } else if (errorCode === "INVALID_CREDENTIALS") {
        setMessage("Invalid email or password.");
      } else {
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await googleLogin(credentialResponse.credential);
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorCode = err.response?.data?.detail;
      if (errorCode === "ACCOUNT_BLOCKED") {
        setMessage("Your account has been blocked by admin.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center pt-24 pb-12 px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden min-h-[650px]">

        {/* Left Side: Video Branding */}
        <div className="relative hidden md:block overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={logVideo} type="video/mp4" />
          </video>
          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10 to-transparent"></div>

          <div className="absolute bottom-16 left-12 right-12 z-20 text-white">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 block mb-4">
              Welcome Back
            </span>
            <h2 className="text-5xl font-serif tracking-tight leading-tight">
              Mastery in <br /> Every <span className="italic opacity-70">Detail</span>
            </h2>
            <div className="h-[1px] w-20 bg-white/40 mt-8"></div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-serif text-gray-900 tracking-tight mb-3">
              Sign <span className="italic text-gray-400">In</span>
            </h2>
            <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase font-bold">
              Access your TimeSync Collection
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold absolute -top-2 left-3 bg-white px-2 z-10">
                Email Address
              </label>
              <div className="flex items-center border border-gray-200 bg-white rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all px-4 py-3.5 shadow-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold absolute -top-2 left-3 bg-white px-2 z-10">
                Password
              </label>
              <div className="flex items-center border border-gray-200 bg-white rounded-xl focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all px-4 py-3.5 shadow-sm">
                <Lock className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" size="sm" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 tracking-wide uppercase">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-gray-900 text-white font-bold py-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group hover:bg-blue-600 shadow-lg shadow-gray-200"
              type="submit"
            >
              {loading ? (
                <span className="animate-pulse tracking-widest uppercase">Verifying...</span>
              ) : (
                <>
                  SIGN IN <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-gray-400"><span className="bg-white px-4 font-bold">Or Continue With</span></div>
            </div>

            {/* Google Login Wrapper */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => googleLoginTrigger()}
                className="w-full border border-gray-200 bg-white text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm group"
              >
                <img
                  src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  alt="Google"
                />
                <span className="text-[11px] uppercase tracking-widest font-bold">
                  Continue with Google
                </span>
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-6 p-3 rounded-lg bg-red-50 text-red-600 text-center text-[11px] font-bold uppercase tracking-widest">
              {message}
            </div>
          )}

          <div className="mt-10 text-center text-sm text-gray-400">
            New to TimeSync?
            <Link to="/signup" className="font-bold text-gray-900 hover:text-blue-600 ml-2 border-b border-gray-900 hover:border-blue-600 pb-0.5 transition-all">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import logVideo from '../assets/logvideo.mp4';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!email.trim() || !password.trim()) {
      setMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        `https://timesync-e-commerce.onrender.com/users?email=${email.trim()}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setMessage('Invalid email or password.');
        return;
      }

      const loggedInUser = data[0];

      if (loggedInUser.blocked) {
        setMessage('Your account has been blocked. Contact support.');
        return;
      }

      if (loggedInUser.password !== password) {
        setMessage('Invalid email or password.');
        return;
      }

      // Save to context & localStorage
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      setMessage('Login successful! Redirecting...');
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen font-sans px-4 sm:px-6 md:px-0">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* Video Section */}
        <div className="relative w-full md:w-1/2 min-h-[400px] md:min-h-full hidden md:block">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={logVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white p-10">
            <h2 className="text-5xl font-bold tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-lg text-gray-300">
              Step into the world of luxury timepieces.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-800">
          <h2 className="text-4xl font-bold text-white text-center mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:text-white"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:text-white"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className={`w-full bg-white text-gray-800 font-bold py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 ${
                loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-900 hover:text-white'
              }`}
              type="submit"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-blue-400 font-semibold">{message}</p>
          )}

          <div className="mt-6 text-center text-white">
            Don’t have an account? 
            <Link to="/signup" className="font-semibold text-white hover:underline ml-1">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import signVideo from '../assets/signvideo.mp4';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const checkResponse = await fetch(`https://timesync-e-commerce.onrender.com/users?email=${email}`);
      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        setMessage('Email is already registered. Please log in.');
        setLoading(false);
        return;
      }

      const userData = { name, email, password, role: 'user' };
      const response = await fetch('https://timesync-e-commerce.onrender.com/users', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Signup successful! Redirecting...');
        console.log('User created:', data);

        
        setName('');
        setEmail('');
        setPassword('');

        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* Signup Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-800">
          <h2 className="text-4xl font-bold text-white text-center mb-6">Sign Up</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:text-white"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-white font-semibold">{message}</p>
          )}
          
          <div className="mt-6 text-center text-white">
            Already have an account? 
            <Link to='/login' className="font-semibold text-white hover:underline ml-1">
              Login
            </Link>
          </div>
        </div>
        
        {/* Video Section */}
        <div className="relative w-full md:w-1/2 min-h-[400px] md:min-h-full hidden md:block">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={signVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
          
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white p-10">
            <h2 className="text-5xl font-bold tracking-tight">Join Our Community</h2>
            <p className="mt-2 text-lg text-gray-300">
              Discover the perfect timepiece for your collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

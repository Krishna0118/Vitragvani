import React, { useState } from 'react';
import { User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Exact Vitragvani Style Constants
  const theme = {
    maroon: '#5E1914',
    saffron: '#F29221',
    cream: '#FFF9F1',
    gold: '#D4AF37'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const endpoint = isSignUp ? '/register' : '/login';
    const payload = isSignUp 
      ? { first_name: firstName, last_name: lastName, email, password }
      : { email, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Save user info to LocalStorage so App.tsx can find it
        if (!isSignUp) {
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate('/'); // Go back to Librarian
            window.location.reload(); // Refresh to update the Header name
        } else {
             alert('Registration Successful! Please Login.');
             setIsSignUp(false);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert("Something went wrong. Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F1] font-sans">
      {/* Back to Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-[#5E1914] hover:text-[#F29221] transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back to Library
      </button>

      <div className="max-w-md w-full mx-4">
        {/* Branding/Logo Area */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#5E1914] tracking-tight">Vitragvani</h1>
          <div className="h-1 w-24 bg-[#F29221] mx-auto mt-2"></div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-[#5E1914] py-6 px-8">
            <h2 className="text-xl font-semibold text-white">
              {isSignUp ? 'Join the Community' : 'Welcome Back'}
            </h2>
            <p className="text-[#D4AF37] text-sm opacity-90">
              {isSignUp ? 'Create an account to save your search history' : 'Login to sync your library across devices'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5E1914] uppercase mb-1">First Name</label>
                  <input 
                    type="text" 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F29221]" 
                    placeholder="Atma" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5E1914] uppercase mb-1">Last Name</label>
                  <input 
                    type="text" 
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F29221]" 
                    placeholder="Ram" 
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#5E1914] uppercase mb-1">Email / Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F29221] focus:border-[#F29221] outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5E1914] uppercase mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F29221] focus:border-[#F29221] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#F29221] hover:bg-[#d9821e] text-white font-bold py-3 rounded shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              {isSignUp ? 'REGISTER' : 'LOG IN'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Already a member?' : "New to Smart Librarian?"}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#5E1914] font-bold hover:underline"
              >
                {isSignUp ? 'Login Here' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>

        {/* Optional Guest Access Note */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © 2026 Vitragvani Trust. All Divine Knowledge is Free.
        </p>
      </div>
    </div>
  );
};

export default Login;
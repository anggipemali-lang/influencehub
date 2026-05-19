import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Mail, 
  Lock, 
  ArrowRight,
  Terminal,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, loginWithGoogle } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import SimpleCaptcha from '../../components/ui/SimpleCaptcha';
import Navbar from '../../components/layout/Navbar';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user, profile } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isCaptchaValid) {
      toast.error("Please complete the captcha correctly");
      return;
    }

    setLoading(true);
    try {
      const resp = await loginUser(email, password);
      toast.success(`Welcome back, ${resp.displayName}!`);
      // Redirect based on role
      navigate(`/dashboard/${resp.role}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Default to influencer for new Google users during login screen 
      // (usually you'd ask if it's a first time, but service handles existing)
      const profile = await loginWithGoogle('influencer');
      toast.success(`Successfully logged in as ${profile.displayName}`);
      navigate(`/dashboard/${profile.role}`);
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center font-sans">
      <Navbar />
      <div className="flex-1 w-full flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
              <Rocket className="text-sky-900 w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 uppercase">InfluenceHub</span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-10">Enter your credentials to access your dashboard.</p>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 transition-all font-sans"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-sm font-bold text-sky-900 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 transition-all font-sans"
                  required
                />
              </div>
            </div>

            <SimpleCaptcha onVerify={setIsCaptchaValid} />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-sky-900 text-white font-bold py-4 rounded-2xl hover:bg-sky-950 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
             <button 
               onClick={handleGoogleLogin}
               className="border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-700 hover:bg-slate-50 transition-all"
             >
               <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
               Google
             </button>
             <button className="border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-700 hover:bg-slate-50 transition-all">
               <Terminal className="w-4 h-4" />
               GitHub
             </button>
          </div>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Don't have an account? <Link to="/register" className="font-bold text-sky-900 hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>

      {/* Right side - Illustration/Intro */}
      <div className="hidden lg:flex w-1/2 bg-[#A7D8FF] items-center justify-center p-12 overflow-hidden relative">
        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
             <div className="p-8 bg-white/20 backdrop-blur-3xl rounded-[3rem] border border-white/30 shadow-2xl skew-y-3">
               <div className="flex gap-4 mb-6">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-16 h-16 rounded-2xl bg-white/30 animate-pulse"></div>
                 ))}
               </div>
               <div className="h-4 w-3/4 bg-white/30 rounded-full mb-3"></div>
               <div className="h-4 w-1/2 bg-white/30 rounded-full"></div>
             </div>
          </motion.div>
          <h2 className="text-4xl font-bold text-[#003366] mb-6">Empowering brands through intelligent connections.</h2>
          <p className="text-[#003366]/70 text-lg">Join 5,000+ brands and 50,000+ influencers already using InfluenceFinder to grow their presence.</p>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#003366]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>
      </div>
    </div>
  );
};

export default Login;

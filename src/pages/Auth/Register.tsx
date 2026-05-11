import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Mail, 
  Lock, 
  ArrowRight,
  Briefcase,
  UserCheck,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import toast from 'react-hot-toast';
import SimpleCaptcha from '../../components/ui/SimpleCaptcha';
import Navbar from '../../components/layout/Navbar';

const Register: React.FC = () => {
  const [role, setRole] = useState<'brand' | 'influencer' | 'admin'>('brand');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (!isCaptchaValid) {
      toast.error("Please complete the captcha correctly");
      return;
    }

    setLoading(true);
    try {
      const displayName = `${firstName} ${lastName}`;
      
      // Security check: Only this specific email can be an admin
      if (role === 'admin' && email.toLowerCase() !== 'anggipemali@gmail.com') {
        toast.error("You are not authorized to create an Admin account.");
        setLoading(false);
        return;
      }
      
      const profile = await registerUser(email, password, role, displayName);
      toast.success("Account created successfully!");
      navigate(`/dashboard/${profile.role}`);
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        toast.error("Sign-up method disabled. Please enable Email/Password at: console.firebase.google.com");
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error("An account with this email already exists. Please log in instead.");
      } else {
        toast.error(error.message || "Registration failed");
      }
    } finally {
      setLoading(false);
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

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 mb-8">Choose your role to get started.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button 
              onClick={() => setRole('brand')}
              className={`p-4 rounded-2xl border transition-all text-left group ${
                role === 'brand' 
                  ? 'border-sky-900 bg-sky-50' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                role === 'brand' ? 'bg-sky-900 text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'
              }`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-900">Brand</p>
              <p className="text-xs text-slate-500 line-clamp-1">Hiring</p>
            </button>
            <button 
              onClick={() => setRole('influencer')}
              className={`p-4 rounded-2xl border transition-all text-left group ${
                role === 'influencer' 
                  ? 'border-sky-900 bg-sky-50' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                role === 'influencer' ? 'bg-sky-900 text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'
              }`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-900">Influencer</p>
              <p className="text-xs text-slate-500 line-clamp-1">Creator</p>
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`p-4 rounded-2xl border transition-all text-left group ${
                role === 'admin' 
                  ? 'border-sky-900 bg-sky-50' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                role === 'admin' ? 'bg-sky-900 text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-900">Admin</p>
              <p className="text-xs text-slate-500 line-clamp-1">System</p>
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                   <input 
                     type="text" 
                     value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                     placeholder="Jane"
                     className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 transition-all font-sans"
                     required
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                   <input 
                     type="text" 
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                     placeholder="Doe"
                     className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 transition-all font-sans"
                     required
                   />
                </div>
             </div>

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
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 transition-all font-sans"
                  required
                />
              </div>
            </div>

            <SimpleCaptcha onVerify={setIsCaptchaValid} />

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-sky-900 text-white font-bold py-4 rounded-2xl hover:bg-sky-950 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 font-medium">
            Already have an account? <Link to="/login" className="font-bold text-sky-900 hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right side - Illustration/Intro */}
      <div className="hidden lg:flex w-1/2 bg-[#003366] items-center justify-center p-12 overflow-hidden relative">
        <div className="relative z-10 max-w-lg">
           <h2 className="text-5xl font-bold text-white mb-8 leading-tight">Start your journey with the smartest platform.</h2>
           <div className="space-y-6">
              {[
                "Access 50,000+ verified influencers worldwide.",
                "AI-powered matching for better campaign results.",
                "Real-time analytics and predictive performance tools.",
                "Secure payments and built-in legal contracts."
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#A7D8FF] flex items-center justify-center text-[#003366]">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <p className="text-slate-300 font-medium">{text}</p>
                </div>
              ))}
           </div>
        </div>
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#A7D8FF 1px, transparent 0)', backgroundSize: '30px 30px' }} />
      </div>
      </div>
    </div>
  );
};

export default Register;

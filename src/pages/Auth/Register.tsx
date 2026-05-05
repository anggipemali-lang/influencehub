import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Mail, 
  Lock, 
  User,
  ArrowRight,
  Briefcase,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Navbar from '../../components/layout/Navbar';

const Register: React.FC = () => {
  const [role, setRole] = useState<'brand' | 'influencer'>('brand');

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="flex-1 w-full flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-[#A7D8FF] rounded-xl flex items-center justify-center">
              <Rocket className="text-[#003366] w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">InfluenceFinder</span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500 mb-8">Choose your role to get started.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setRole('brand')}
              className={`p-4 rounded-2xl border transition-all text-left group ${
                role === 'brand' 
                  ? 'border-[#003366] bg-[#003366]/5' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                role === 'brand' ? 'bg-[#003366] text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'
              }`}>
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-900">Brand</p>
              <p className="text-xs text-slate-500">I want to hire influencers</p>
            </button>
            <button 
              onClick={() => setRole('influencer')}
              className={`p-4 rounded-2xl border transition-all text-left group ${
                role === 'influencer' 
                  ? 'border-[#003366] bg-[#003366]/5' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                role === 'influencer' ? 'bg-[#003366] text-white' : 'bg-white text-slate-400 group-hover:text-slate-600'
              }`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-900">Influencer</p>
              <p className="text-xs text-slate-500">I want to collaborate</p>
            </button>
          </div>

          <form className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#A7D8FF] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#A7D8FF] transition-all"
                  />
                </div>
             </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#A7D8FF] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="Min 8 characters"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#A7D8FF] transition-all"
                />
              </div>
            </div>

            <button className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 mt-4">
              Create Account
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500">
            Already have an account? <Link to="/login" className="font-bold text-[#003366] hover:underline">Log in</Link>
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

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Users, Search, BarChart3, ShieldCheck } from 'lucide-react';

import Navbar from '../components/layout/Navbar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#A7D8FF]/20 text-[#003366] text-xs font-bold uppercase tracking-wider mb-6">
              AI-Powered Influencer Marketing
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8">
              Find the Perfect <span className="text-[#003366] relative decoration-[#A7D8FF] underline decoration-8 underline-offset-4">Influencer</span> for Your Brand
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
              An intelligent platform that helps brands discover the best influencers based on niche, engagement, audience insights, and campaign budget.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary text-lg">Find Influencers</button>
              <button className="btn-secondary text-lg">Start Campaign</button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="card-premium aspect-square flex items-center justify-center overflow-hidden bg-slate-50 relative">
               {/* Patterned background */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#003366 1px, transparent 0)', backgroundSize: '24px 24px' }} />
               <img 
                 src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                 alt="Influencer" 
                 className="relative z-10 w-4/5 h-4/5 object-cover rounded-2xl shadow-2xl skew-y-3"
               />
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="absolute top-10 right-10 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
               >
                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <BarChart3 className="w-5 h-5" />
                 </div>
                 <div>
                   <div className="text-xs text-slate-500">Match Score</div>
                   <div className="text-lg font-bold text-slate-900">98%</div>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features for Brands</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Elevate your marketing strategy with advanced AI tools and real-time analytics.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "AI Discovery", desc: "Our AI analyzes millions of profiles to find your perfect match." },
              { icon: Target, title: "Precision Targeting", desc: "Filter by location, age, gender, and deep audience interests." },
              { icon: Users, title: "Audience Insights", desc: "Detailed demographics and engagement quality audits." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:border-[#A7D8FF] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#A7D8FF]/30 flex items-center justify-center text-[#003366] mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Rocket className="text-[#A7D8FF] w-6 h-6" />
            <span className="text-xl font-bold text-white">InfluenceFinder</span>
          </div>
          <div className="text-sm">
            © 2026 InfluenceFinder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

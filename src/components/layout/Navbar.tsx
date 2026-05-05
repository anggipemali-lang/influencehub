import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Bell, Search, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname === '/find';

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#A7D8FF] rounded-xl flex items-center justify-center">
            <Rocket className="text-[#003366] w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 hidden sm:block">InfluenceFinder</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/find" className="hover:text-[#003366] transition-colors">Find Influencers</Link>
          <Link to="/campaigns" className="hover:text-[#003366] transition-colors">Campaigns</Link>
          <Link to="/analytics" className="hover:text-[#003366] transition-colors">Analytics</Link>
        </div>

        <div className="flex items-center gap-4">
          {!isDashboard ? (
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-[#003366]">Login</Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-sm">Join Now</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button className="hidden sm:flex p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <Link to="/profile" className="flex items-center gap-2 p-1 pl-3 bg-slate-50 rounded-full border border-slate-100 hover:border-[#A7D8FF] transition-all">
                <span className="text-xs font-bold text-slate-700 hidden sm:block">John Doe</span>
                <div className="w-8 h-8 rounded-full bg-[#A7D8FF] flex items-center justify-center text-[#003366] font-bold text-xs">
                  JD
                </div>
              </Link>
            </div>
          )}
          
          <button 
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all" 
            onClick={() => {
              if (onMenuClick) {
                onMenuClick();
              } else {
                setIsOpen(!isOpen);
              }
            }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Legacy for non-dashboard) */}
      {!onMenuClick && isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-100 p-6 space-y-4"
        >
          <Link to="/find" className="block text-slate-600 font-medium">Find Influencers</Link>
          <Link to="/campaigns" className="block text-slate-600 font-medium">Campaigns</Link>
          <Link to="/analytics" className="block text-slate-600 font-medium">Analytics</Link>
          <Link to="/pricing" className="block text-slate-600 font-medium">Pricing</Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
             <Link to="/login" className="btn-secondary text-center">Login</Link>
             <Link to="/register" className="btn-primary text-center">Sign Up</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

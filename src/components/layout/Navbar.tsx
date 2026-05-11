import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Bell, Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { logout } from '../../services/authService';
import toast from 'react-hot-toast';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname === '/find';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docSnap = await getDoc(doc(db, 'users', u.uid));
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <Rocket className="text-sky-900 w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 hidden sm:block uppercase">InfluenceHub</span>
        </Link>

        {/* Desktop Nav - Hidden by request to use hamburger instead */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600 opacity-0 pointer-events-none absolute h-0 overflow-hidden">
          <Link to="/find" className="hover:text-sky-900 transition-colors">Find Influencers</Link>
          <Link to="/campaigns" className="hover:text-sky-900 transition-colors">Campaigns</Link>
          <Link to="/analytics" className="hover:text-sky-900 transition-colors">Analytics</Link>
          {profile?.role === 'admin' && (
            <Link to="/dashboard/admin" className="text-sky-900 font-bold border-l border-slate-200 pl-8">Admin Panel</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-sky-900">Login</Link>
              <Link to="/register" className="bg-sky-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-950 transition-all">Join Now</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button className="hidden sm:flex p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <Link to="/profile/edit" className="flex items-center gap-2 p-1 pl-3 bg-slate-50 rounded-full border border-slate-100 pr-1 hover:border-sky-300 transition-all">
                <span className="text-xs font-bold text-slate-700 hidden sm:block">{profile?.displayName || 'Loading...'}</span>
                <div className="w-8 h-8 rounded-full bg-sky-900 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                    profile ? getInitials(profile.displayName) : '...'
                  )}
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <button 
            className="hidden md:block p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all" 
            onClick={onMenuClick || (() => setIsOpen(!isOpen))}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Hamburger Menu Overlay (if onMenuClick is not provided) */}
      {isOpen && !onMenuClick && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-slate-100 p-8 space-y-6 shadow-2xl absolute top-20 left-0 w-full z-[100]"
        >
          <Link to="/find" className="block text-slate-600 font-medium">Find Influencers</Link>
          <Link to="/campaigns" className="block text-slate-600 font-medium">Campaigns</Link>
          <Link to="/analytics" className="block text-slate-600 font-medium">Analytics</Link>
          {profile?.role && (
            <Link to={`/dashboard/${profile.role}`} className="block text-sky-900 font-bold">My Dashboard</Link>
          )}
          {!user ? (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link to="/login" className="border border-slate-200 text-center py-3 rounded-xl font-bold">Login</Link>
              <Link to="/register" className="bg-sky-900 text-white text-center py-3 rounded-xl font-bold">Sign Up</Link>
            </div>
          ) : (
             <button 
               onClick={handleLogout}
               className="w-full pt-4 border-t border-slate-100 text-red-600 font-bold flex items-center justify-center gap-2"
             >
               <LogOut className="w-5 h-5" />
               Log Out
             </button>
          )}
        </motion.div>
      )}
    </nav>
  );
};


export default Navbar;

import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  MessageSquare, 
  Calendar,
  Instagram,
  Youtube,
  Twitter,
  Github
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { logout } from '../../services/authService';
import toast from 'react-hot-toast';

interface SidebarItemProps {
  icon: any;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => (
  <Link
    to={href}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1 ${
      active 
        ? 'bg-[#A7D8FF] text-[#003366]' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const docSnap = await getDoc(doc(db, 'users', u.uid));
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        }
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

  return (
    <aside className="w-full bg-white flex flex-col p-4">
      <div className="flex-1">
        <div className="mb-8 px-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            href={userRole ? `/dashboard/${userRole}` : '/'} 
            active={path.includes('/dashboard')} 
          />
          {userRole === 'admin' ? (
             <>
               <SidebarItem icon={Users} label="All Users" href="/dashboard/admin" active={path === '/dashboard/admin'} />
               <SidebarItem icon={BarChart3} label="System Stats" href="/analytics" active={path === '/analytics'} />
             </>
          ) : (
            <>
              <SidebarItem icon={Search} label="Find Influencers" href="/find" active={path === '/find'} />
              <SidebarItem icon={Calendar} label="Campaigns" href="/campaigns" active={path === '/campaigns'} />
              <SidebarItem icon={MessageSquare} label="Messages" href="/messages" active={path === '/messages'} />
              <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" active={path === '/analytics'} />
            </>
          )}
        </div>

        <div className="px-4 mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">External</p>
          <div className="flex gap-2">
             <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Instagram size={18} /></button>
             <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Twitter size={18} /></button>
             <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all"><Youtube size={18} /></button>
          </div>
        </div>

        <div className="px-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Settings</p>
          <SidebarItem icon={Users} label="My Team" href="/settings/team" active={path === '/settings/team'} />
          <SidebarItem icon={Settings} label="General Settings" href="/settings" active={path === '/settings'} />
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 mb-6">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

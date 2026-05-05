import React from 'react';
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
import { Link, useLocation } from 'react-router-dom';

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
  const path = location.pathname;

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen sticky top-0 pt-24 px-4 flex flex-col overflow-y-auto">
      <div className="flex-1">
        <div className="mb-8 px-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard/brand" active={path === '/dashboard/brand'} />
          <SidebarItem icon={Search} label="Find Influencers" href="/find" active={path === '/find'} />
          <SidebarItem icon={Calendar} label="Campaigns" href="/campaigns" active={path === '/campaigns'} />
          <SidebarItem icon={MessageSquare} label="Messages" href="/messages" active={path === '/messages'} />
          <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" active={path === '/analytics'} />
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
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-all font-medium">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

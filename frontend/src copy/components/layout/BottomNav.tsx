import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const { profile } = useAuth();
  const userRole = profile?.role || null;

  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Home', 
      href: userRole ? `/dashboard/${userRole}` : '/' 
    },
    { 
      icon: Search, 
      label: 'Find', 
      href: '/find' 
    },
    { 
      icon: Calendar, 
      label: 'Camps', 
      href: '/campaigns' 
    },
    { 
      icon: BarChart3, 
      label: 'Stats', 
      href: '/analytics' 
    },
    { 
      icon: User, 
      label: 'Profile', 
      href: '/profile/edit' 
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 z-50 px-6 py-3 flex items-center justify-between pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = path === item.href || (item.href.includes('/dashboard') && path.includes('/dashboard'));
        
        return (
          <Link 
            key={item.label}
            to={item.href}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-sky-900' : 'text-slate-400'}`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'fill-sky-50' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;

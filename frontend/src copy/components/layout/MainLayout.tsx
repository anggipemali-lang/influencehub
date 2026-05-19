import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showSidebar = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex">
        {showSidebar && (
          <>
            {/* Sidebar Overlay (Now for all sizes if it's toggleable) */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar Drawer (Unified) */}
            <div className={`
              fixed top-0 left-0 h-full z-[70] w-72 bg-white transition-transform duration-500 ease-in-out shadow-2xl border-r border-slate-100
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <div className="p-8 flex justify-between items-center border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-900 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-900/20">
                    <span className="text-white font-black text-xl italic uppercase">I</span>
                  </div>
                  <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">Influence</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all hover:rotate-90">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="h-[calc(100%-100px)] overflow-y-auto no-scrollbar">
                <Sidebar />
              </div>
            </div>
          </>
        )}

        <main className="flex-1 min-w-0 pb-24 md:pb-8">
          <div className="px-4 py-8 md:px-8 lg:px-12 pt-28 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;

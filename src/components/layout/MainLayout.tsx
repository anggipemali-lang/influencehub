import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
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
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Mobile Sidebar */}
            <div className={`
              fixed top-0 left-0 h-full z-50 w-64 bg-white transition-transform duration-300 lg:hidden
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <div className="p-6 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#003366] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg italic">I</span>
                  </div>
                  <span className="font-bold text-xl tracking-tight text-slate-900">Influence</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <Sidebar />
            </div>
          </>
        )}

        <main className={`flex-1 transition-all ${showSidebar ? 'lg:ml-0' : ''}`}>
          <div className="px-4 py-8 md:px-8 lg:px-12 pt-28">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Settings, 
  BarChart3, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle,
  FileText
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';

const AdminDashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Control Center</h1>
          <p className="text-slate-500">Monitor and manage the InfluenceFinder ecosystem.</p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-premium flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">4,231</p>
              </div>
            </div>
            <div className="card-premium flex items-center gap-4">
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Campaigns</p>
                <p className="text-2xl font-bold text-slate-900">188</p>
              </div>
            </div>
            <div className="card-premium flex items-center gap-4">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue (MTD)</p>
                <p className="text-2xl font-bold text-slate-900">$84,500</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
             <div className="card-premium">
               <h3 className="font-bold text-slate-900 mb-6">Verification Requests</h3>
               <div className="space-y-4">
                 {[
                   { name: "John Doe", type: "Influencer", platform: "TikTok", status: "Pending" },
                   { name: "Global Brands Inc", type: "Brand", platform: "LinkedIn", status: "Pending" }
                 ].map((req, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                        <div>
                          <p className="font-bold text-slate-900">{req.name}</p>
                          <p className="text-xs text-slate-500">{req.type} • {req.platform}</p>
                        </div>
                     </div>
                     <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all">
                       Review
                     </button>
                   </div>
                 ))}
               </div>
             </div>

             <div className="card-premium">
               <h3 className="font-bold text-slate-900 mb-6">System Health</h3>
               <div className="space-y-6">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-sm font-medium text-slate-700">Database API</span>
                   </div>
                   <span className="text-xs text-slate-400">99.9% uptime</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-sm font-medium text-slate-700">AI Matching Engine</span>
                   </div>
                   <span className="text-xs text-slate-400">Active</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                     <span className="text-sm font-medium text-slate-700">Payment Gateway</span>
                   </div>
                   <span className="text-xs text-slate-400">Maintenance soon</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
    </MainLayout>
  );
};

export default AdminDashboard;

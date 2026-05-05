import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Search, 
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Week 1', value: 4000 },
  { name: 'Week 2', value: 3000 },
  { name: 'Week 3', value: 5000 },
  { name: 'Week 4', value: 2780 },
  { name: 'Week 5', value: 1890 },
  { name: 'Week 6', value: 6390 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="card-premium h-full">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-20 text-slate-900`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const BrandDashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Nike Team 👋</h1>
            <p className="text-slate-500">Here's what's happening with your campaigns today.</p>
          </div>
          <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Campaigns" value="12" change="+2 this month" icon={Calendar} color="bg-blue-500" />
            <StatCard title="Active Influencers" value="48" change="+12.5%" icon={Users} color="bg-purple-500" />
            <StatCard title="Total Engagement" value="1.2M" change="+18.2%" icon={TrendingUp} color="bg-green-500" />
            <StatCard title="Budget Spent" value="$24.5k" change="-4.1%" icon={DollarSign} color="bg-amber-500" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Chart */}
            <div className="lg:col-span-2 card-premium">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Engagement Overview</h3>
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs outline-none">
                  <option>Last 30 Days</option>
                  <option>Last 6 Months</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A7D8FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#A7D8FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#003366" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Campaign List */}
            <div className="card-premium">
              <h3 className="font-bold text-slate-900 mb-6">Active Campaigns</h3>
              <div className="space-y-6">
                {[
                  { name: "Summer Launch", status: "Active", budget: "$10,000", progress: 75 },
                  { name: "Tech Review Series", status: "Active", budget: "$5,000", progress: 30 },
                  { name: "Holiday Gift Guide", status: "Draft", budget: "$15,000", progress: 0 }
                ].map((campaign, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <p className="font-bold text-slate-900 group-hover:text-[#003366] transition-colors">{campaign.name}</p>
                         <p className="text-xs text-slate-500">{campaign.budget} budget</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#A7D8FF]" 
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 text-sm font-semibold text-[#003366] hover:bg-[#A7D8FF] hover:bg-opacity-10 rounded-xl transition-all">
                View All Campaigns
              </button>
            </div>
          </div>
        </div>
    </MainLayout>
  );
};

export default BrandDashboard;

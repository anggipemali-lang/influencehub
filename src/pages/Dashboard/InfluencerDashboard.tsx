import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  DollarSign,
  Camera,
  Video,
  MessageCircle
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const analyticsData = [
  { name: 'Mon', followers: 2100, engagement: 400 },
  { name: 'Tue', followers: 2300, engagement: 450 },
  { name: 'Wed', followers: 2200, engagement: 380 },
  { name: 'Thu', followers: 2600, engagement: 520 },
  { name: 'Fri', followers: 2800, engagement: 610 },
  { name: 'Sat', followers: 3200, engagement: 750 },
  { name: 'Sun', followers: 3100, engagement: 700 },
];

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="card-premium">
    <div className={`p-3 rounded-2xl ${color} bg-opacity-20 text-slate-900 w-fit mb-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const InfluencerDashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-[#A7D8FF] flex items-center justify-center text-[#003366] text-3xl font-bold border-4 border-white shadow-xl">
                SB
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">Sophia Bloom</h1>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Camera className="w-3 h-3" /> @sophiabloom
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="text-xs font-bold text-slate-400">Fashion & Beauty</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
               <button className="btn-secondary">Edit Profile</button>
               <button className="btn-primary">View Analytics</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total Earnings" value="$12,450" icon={DollarSign} color="bg-green-500" />
            <StatCard title="Engagement Rate" value="5.8%" icon={TrendingUp} color="bg-purple-500" />
            <StatCard title="Average Likes" value="8.2k" icon={Heart} color="bg-red-500" />
            <StatCard title="Reach" value="124k" icon={Eye} color="bg-blue-500" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 card-premium">
              <h3 className="font-bold text-slate-900 mb-6">Audience Growth</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                    <Line type="monotone" dataKey="followers" stroke="#003366" strokeWidth={3} dot={{ r: 4, fill: '#003366' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-premium">
              <h3 className="font-bold text-slate-900 mb-6">New Offers</h3>
              <div className="space-y-6">
                {[
                  { brand: "Glossier", campaign: "Spring Refresh", budget: "$1,200" },
                  { brand: "ZARA", campaign: "Eco-Line Promo", budget: "$2,500" }
                ].map((offer, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                       <div>
                         <p className="font-bold text-slate-900">{offer.brand}</p>
                         <p className="text-xs text-slate-500">{offer.campaign}</p>
                       </div>
                       <span className="text-sm font-bold text-[#003366]">{offer.budget}</span>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100">Decline</button>
                       <button className="flex-1 py-2 bg-[#A7D8FF] text-[#003366] rounded-xl text-xs font-bold hover:bg-opacity-90">Accept</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-all">
                View All Offers
              </button>
            </div>
          </div>
        </div>
    </MainLayout>
  );
};

export default InfluencerDashboard;

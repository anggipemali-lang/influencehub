import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar,
  Download,
  Share2,
  PieChart as PieIcon,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import Navbar from '../components/layout/Navbar';
import { getAnalyticsForUser, AnalyticsSummary } from '../services/analyticsService';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const pieData = [
  { name: 'Instagram', value: 45, color: '#0EA5E9' },
  { name: 'TikTok', value: 35, color: '#0C4A6E' },
  { name: 'YouTube', value: 20, color: '#7DD3FC' },
];

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'brand' | 'influencer'>('influencer');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userSnap.exists()) {
          const userRole = userSnap.data().role as 'brand' | 'influencer';
          setRole(userRole);
          const data = await getAnalyticsForUser(auth.currentUser.uid, userRole);
          setAnalytics(data);
        }
      } catch (error) {
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-sky-900 animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-slate-500 font-bold uppercase tracking-widest">Please log in to view analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Deep Analytics</h1>
            <p className="text-slate-500 font-medium">Real-time performance tracking for your {role} presence.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-sky-900 text-white rounded-2xl font-bold hover:bg-sky-950 transition-all shadow-lg shadow-sky-900/20">
              <Share2 className="w-4 h-4" />
              Share Report
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-sky-50 rounded-2xl text-sky-900">
                <Users className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12%
              </span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Reach</p>
            <h3 className="text-2xl font-black text-slate-900">{(analytics.totalReach / 1000).toFixed(1)}k</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-900">
                <Target className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 5%
              </span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Engagement Rate</p>
            <h3 className="text-2xl font-black text-slate-900">{analytics.avgEngagement}%</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-900">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-black text-red-600 bg-red-50 px-2 py-1 rounded-full">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> 2%
              </span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Conversion Rate</p>
            <h3 className="text-2xl font-black text-slate-900">{analytics.conversionRate}%</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-900">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                Static
              </span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Campaigns</p>
            <h3 className="text-2xl font-black text-slate-900">{analytics.totalCampaigns}</h3>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Performace over time</h3>
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-black outline-none uppercase">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.chartData}>
                  <defs>
                    <linearGradient id="colorAna" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12, fontWeight: 700}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12, fontWeight: 700}} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0C4A6E" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorAna)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Side Charts */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-sky-900" />
                Channel Distribution
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                 {pieData.map((item) => (
                   <div key={item.name} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
                       <span className="text-sm font-bold text-slate-600 uppercase">{item.name}</span>
                     </div>
                     <span className="text-sm font-black text-slate-900">{item.value}%</span>
                   </div>
                 ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-sky-900 p-8 rounded-[2.5rem] text-white shadow-xl">
               <h3 className="text-lg font-black uppercase tracking-tight mb-4">AI Insight</h3>
               <p className="text-sky-100 text-sm leading-relaxed mb-6 font-medium">
                 Your engagement is peaking on <span className="text-white font-black">Saturdays</span>. We recommend launching new content between <span className="text-white font-black">6PM - 8PM</span> for maximum reach.
               </p>
               <button className="w-full py-4 bg-sky-800 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-sky-700 transition-all">
                 Generate Strategy
               </button>
            </motion.div>
          </div>
        </div>

        {/* Secondary Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Quarterly Growth Comparison</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontVariant: 'small-caps'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8'}} />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                   {analytics.chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0C4A6E' : '#0EA5E9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;

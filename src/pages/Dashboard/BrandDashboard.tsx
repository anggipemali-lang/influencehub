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
import { getBrandCampaigns, getCampaignApplications, reviewApplication, Campaign, CampaignApplication, getBrandOffers, Offer } from '../../services/campaignService';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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
    <h3 className="text-slate-500 text-sm font-medium mb-1 tracking-tight uppercase">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const BrandDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applications, setApplications] = useState<CampaignApplication[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      try {
        const [campaignData, profileSnap, offersData] = await Promise.all([
          getBrandCampaigns(auth.currentUser.uid),
          getDoc(doc(db, 'users', auth.currentUser.uid)),
          getBrandOffers(auth.currentUser.uid)
        ]);
        setCampaigns(campaignData);
        setOffers(offersData);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }

        // Fetch applications for all brand campaigns
        if (campaignData.length > 0) {
          const allApps = await Promise.all(
            campaignData.map(c => getCampaignApplications(c.id!))
          );
          setApplications(allApps.flat().filter(a => a.status === 'pending'));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReview = async (appId: string, status: 'approved' | 'rejected') => {
    try {
      await reviewApplication(appId, status);
      setApplications(prev => prev.filter(a => a.id !== appId));
      toast.success(`Application ${status}!`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 uppercase">Welcome back, {profile?.displayName || 'Brand'} 👋</h1>
            <p className="text-slate-500 font-medium">Here's what's happening with your campaigns today.</p>
          </div>
          <Link to="/campaigns/create" className="bg-sky-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 w-full sm:w-auto justify-center hover:bg-sky-950 transition-all shadow-lg shadow-sky-900/20">
            <Plus className="w-4 h-4" />
            New Campaign
          </Link>
        </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Campaigns" value={campaigns.length.toString()} change="+2 this month" icon={Calendar} color="bg-blue-500" />
            <StatCard title="Active Influencers" value={(offers.filter(o => o.status === 'accepted').length).toString()} change="+0%" icon={Users} color="bg-purple-500" />
            <StatCard title="Pending Review" value={(applications.length + offers.filter(o => o.status === 'pending').length).toString()} change="New" icon={TrendingUp} color="bg-green-500" />
            <StatCard title="Budget Spent" value={`$${campaigns.reduce((acc, curr) => acc + curr.budget, 0).toLocaleString()}`} change="0%" icon={DollarSign} color="bg-amber-500" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Applications List */}
            <div className="card-premium lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 uppercase tracking-tight">Active Requests</h3>
                <div className="flex gap-2">
                   <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase">{applications.length} Apps</span>
                   <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase">{offers.filter(o => o.status === 'pending').length} Offers</span>
                </div>
              </div>
              <div className="space-y-4">
                {applications.length === 0 && offers.filter(o => o.status === 'pending').length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-4">No pending requests to review.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded text-[8px] font-black uppercase">Application</span>
                              <p className="font-bold text-slate-900">{app.influencerName}</p>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 italic">"{app.message}"</p>
                         </div>
                         <div className="flex gap-2">
                            <button 
                              onClick={() => handleReview(app.id!, 'rejected')}
                              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all uppercase"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleReview(app.id!, 'approved')}
                              className="px-4 py-2 bg-sky-900 text-white rounded-xl text-xs font-bold hover:bg-sky-950 transition-all uppercase"
                            >
                              Approve
                            </button>
                         </div>
                      </div>
                    ))}
                    {offers.filter(o => o.status === 'pending').map((offer) => (
                      <div key={offer.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[8px] font-black uppercase">Sent Offer</span>
                              <p className="font-bold text-slate-900">Waiting for response...</p>
                            </div>
                            <p className="text-xs text-slate-500 italic">Targeting influencer ID: {offer.influencerId.substring(0, 8)}...</p>
                         </div>
                         <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase">
                            Pending
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Campaign List */}
            <div className="card-premium overflow-hidden">
              <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-tight">Your Campaigns</h3>
              <div className="space-y-6">
                {campaigns.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-4">No campaigns launched yet.</p>
                ) : (
                  campaigns.slice(0, 3).map((campaign, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                         <div>
                           <p className="font-bold text-slate-900 group-hover:text-sky-900 transition-colors uppercase text-sm">{campaign.title}</p>
                           <p className="text-xs text-slate-500 font-bold">${campaign.budget.toLocaleString()} budget</p>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-sky-900" 
                          style={{ width: `20%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link to="/campaigns" className="block text-center w-full mt-8 py-3 text-sm font-bold text-sky-900 hover:bg-sky-50 rounded-xl transition-all uppercase tracking-wider">
                View All Marketplace
              </Link>
            </div>
          </div>
        </div>
    </MainLayout>
  );
};

export default BrandDashboard;

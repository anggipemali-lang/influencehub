import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { getInfluencerOffers, respondToOffer, Offer } from '../../services/campaignService';
import toast from 'react-hot-toast';

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
    <p className="text-slate-500 text-sm font-medium mb-1 tracking-tight uppercase">{title}</p>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const InfluencerDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const offersData = await getInfluencerOffers(user.uid);
        setOffers(offersData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleRespond = async (offerId: string, status: 'accepted' | 'rejected') => {
    try {
      await respondToOffer(offerId, status);
      setOffers(prev => prev.filter(o => o.id !== offerId));
      toast.success(`Offer ${status}!`);
    } catch (error) {
      toast.error("Failed to respond to offer");
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-sky-100 flex items-center justify-center text-sky-900 text-3xl font-bold border-4 border-white shadow-xl overflow-hidden">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  profile ? getInitials(profile.displayName) : '...'
                )}
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1 uppercase tracking-tight">{profile?.displayName || 'Loading...'}</h1>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Camera className="w-3 h-3" /> @{profile?.handle || profile?.displayName?.toLowerCase().replace(/\s+/g, '_') || 'username'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Creator</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
               <Link to="/profile/edit" className="px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Edit Profile</Link>
               <Link to="/campaigns" className="bg-sky-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-sky-950 transition-all shadow-lg shadow-sky-900/20">Find Campaigns</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total Earnings" value="$1,240" icon={DollarSign} color="bg-green-500" />
            <StatCard title="Engagement Rate" value={`${profile?.engagementRate || 0}%`} icon={TrendingUp} color="bg-purple-500" />
            <StatCard title="Total Followers" value={profile?.followersCount?.toLocaleString() || '0'} icon={Heart} color="bg-red-500" />
            <StatCard title="Potential Reach" value={Math.floor((profile?.followersCount || 0) * 0.72).toLocaleString()} icon={Eye} color="bg-blue-500" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 card-premium">
              <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-tight">Audience Growth</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                    <Line type="monotone" dataKey="followers" stroke="#0C4A6E" strokeWidth={3} dot={{ r: 4, fill: '#0C4A6E' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-premium">
              <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-tight">Collaboration Offers</h3>
              <div className="space-y-6">
                {offers.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-4">No active collaboration offers.</p>
                ) : (
                  offers.map((offer) => (
                    <div key={offer.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3">
                       <div>
                          <p className="font-bold text-slate-900">{offer.brandName}</p>
                          <p className="text-xs text-slate-500 italic">"{offer.message}"</p>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => handleRespond(offer.id!, 'rejected')}
                            className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 uppercase"
                          >
                            Decline
                          </button>
                          <button 
                            onClick={() => handleRespond(offer.id!, 'accepted')}
                            className="flex-1 py-2 bg-sky-900 text-white rounded-xl text-xs font-bold hover:bg-sky-950 uppercase"
                          >
                            Accept
                          </button>
                       </div>
                    </div>
                  ))
                )}
              </div>
              <Link to="/campaigns" className="block text-center w-full mt-8 py-3 text-sm font-bold text-sky-900 hover:bg-sky-50 rounded-xl transition-all uppercase tracking-wider">
                Explore Campaigns
              </Link>
            </div>
          </div>
        </div>
    </MainLayout>
  );
};

export default InfluencerDashboard;

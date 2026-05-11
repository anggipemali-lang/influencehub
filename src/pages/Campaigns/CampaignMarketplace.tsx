import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Briefcase, 
  DollarSign, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  Rocket
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { getCampaigns, applyToCampaign, Campaign } from '../../services/campaignService';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CampaignMarketplace: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCampaigns();
        setCampaigns(data);
        
        if (auth.currentUser) {
          const profileSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data());
          }
        }
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
        toast.error("Global error fetching campaigns");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (campaignId: string) => {
    if (!auth.currentUser) {
      toast.error("Please login to apply");
      return;
    }
    if (userProfile?.role !== 'influencer') {
      toast.error("Only influencers can apply to campaigns");
      return;
    }

    const message = window.prompt("Why do you want to join this campaign?");
    if (!message) return;

    setApplyingId(campaignId);
    try {
      await applyToCampaign(campaignId, message, userProfile.displayName);
      toast.success("Application submitted!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Campaign Marketplace</h1>
            <p className="text-slate-500 font-medium">Find the perfect brand collaboration for your audience.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search campaigns..." 
                  className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-sky-300 transition-all w-full md:w-64 font-sans"
                />
             </div>
             <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-sky-900 animate-spin" />
            <p className="text-slate-500 font-bold">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
             <div className="w-20 h-20 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="text-sky-900 w-10 h-10" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-2">No active campaigns found</h2>
             <p className="text-slate-500 mb-8 max-w-md mx-auto">Check back later or try adjusting your search filters to find available opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, idx) => (
              <motion.div 
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-900 font-black text-xl group-hover:bg-sky-900 group-hover:text-white transition-colors">
                    {campaign.brandName?.[0] || 'C'}
                  </div>
                  <div className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-black uppercase tracking-wider">
                    {campaign.status}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-900 transition-colors">{campaign.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                  {campaign.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4 text-sky-900" />
                    <span className="text-sm font-bold truncate">${campaign.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-4 h-4 text-sky-900" />
                    <span className="text-sm font-bold">Open</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleApply(campaign.id!)}
                  disabled={applyingId === campaign.id}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-sky-900 transition-all disabled:opacity-50"
                >
                  {applyingId === campaign.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Apply Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CampaignMarketplace;

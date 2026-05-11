import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Camera, 
  Video, 
  MessageCircle, 
  Sparkles,
  Loader2,
  X,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  BarChart3,
  Users,
  Target,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getAllInfluencers, InfluencerStats } from '../services/profileService';
import { generateRecommendation } from '../services/aiService';
import { sendOffer } from '../services/campaignService';
import MainLayout from '../components/layout/MainLayout';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const FindInfluencers: React.FC = () => {
  const [influencers, setInfluencers] = useState<InfluencerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNiche, setActiveNiche] = useState('All');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [brandDescription, setBrandDescription] = useState('');
  const [budget, setBudget] = useState(1000);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerStats | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllInfluencers();
        setInfluencers(data);
        
        if (auth.currentUser) {
          const profileSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data());
          }
        }
      } catch (error) {
        toast.error("Failed to fetch influencers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRequestPartnership = async () => {
    if (!selectedInfluencer) return;
    if (!auth.currentUser) {
      toast.error("Please login first");
      return;
    }
    if (userProfile?.role !== 'brand') {
      toast.error("Only brands can request partnerships");
      return;
    }

    const message = window.prompt(`Message for ${selectedInfluencer.displayName}:`, "We love your content and want to collaborate!");
    if (!message) return;

    setRequesting(true);
    try {
      await sendOffer(selectedInfluencer.uid, message, userProfile.displayName);
      toast.success("Partnership request sent!");
      setSelectedInfluencer(null);
    } catch (error) {
      toast.error("Failed to send request");
    } finally {
      setRequesting(false);
    }
  };

  const niches = ['All', 'Beauty', 'Fashion', 'Technology', 'Gaming', 'Food', 'Travel', 'Fitness'];

  const handleAiSearch = async () => {
    if (!brandDescription.trim()) {
      toast.error('Please describe your brand or campaign');
      return;
    }

    setIsAiLoading(true);
    try {
      const responseText = await generateRecommendation(brandDescription, budget, influencers);
      if (responseText) {
        // Try to parse JSON from AI response
        const jsonMatch = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
          setAiResult(JSON.parse(jsonMatch[0]));
        } else {
          setAiResult(responseText);
        }
      } else {
        toast.error('Failed to get AI recommendation. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during AI matching.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-4">Discover Top Talent</h1>
          <p className="text-slate-600 text-sm md:text-base">Browse and filter thousands of verified influencers for your next campaign.</p>
        </div>

        {/* AI Recommendations Banner */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="mb-8 md:mb-12 overflow-hidden relative rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#082F49] p-6 md:p-10 text-white shadow-2xl shadow-sky-900/20"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-sky-400/20 rounded-xl backdrop-blur-sm border border-white/10">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-sky-300" />
              </div>
              <span className="text-sky-300 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">AI Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">Match with AI Precision</h2>
            <p className="text-sky-100/80 text-sm md:text-lg mb-6 md:mb-8 leading-relaxed">Stop guessing. Let our proprietary AI engine scan through thousands of influencers to find the ones that perfectly align with your brand values.</p>
            <button 
              onClick={() => setIsAiModalOpen(true)}
              className="w-full sm:w-auto bg-sky-400 text-sky-950 font-bold px-8 py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-white transition-all shadow-xl shadow-sky-400/20 flex items-center justify-center gap-3 group"
            >
              Launch AI Matchmaker
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 hidden lg:block">
            <div className="absolute top-10 right-10 w-64 h-64 border-4 border-sky-400 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-40 w-48 h-48 border-2 border-white rounded-full blur-2xl" />
          </div>
          <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block">
            <BrainCircuit className="w-64 h-64 text-sky-400 opacity-10" />
          </div>
        </motion.div>

        {/* Filters bar */}
        <div className="bg-white p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 mb-8 md:mb-10 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, niche..."
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:border-sky-300 focus:bg-white transition-all text-slate-800 text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {niches.map(niche => (
              <button
                key={niche}
                onClick={() => setActiveNiche(niche)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                  activeNiche === niche 
                    ? 'bg-sky-900 text-white shadow-lg shadow-sky-950/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
          <button className="hidden md:flex p-4 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:text-sky-900 transition-all text-slate-500">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-sky-900 animate-spin mb-4" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Scanning our talent database...</p>
            </div>
          ) : influencers
            .filter(inf => 
              (activeNiche === 'All' || (inf.niche && inf.niche.includes(activeNiche))) &&
              ((inf.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((influencer, i) => (
            <motion.div
              key={influencer.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="relative mb-4 md:mb-6 overflow-hidden rounded-2xl md:rounded-3xl">
                <img 
                  src={influencer.photoURL || `https://ui-avatars.com/api/?name=${influencer.displayName}&background=0C4A6E&color=fff`} 
                  alt={influencer.displayName}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 md:top-4 md:right-4 p-2 md:p-2.5 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl text-red-500 shadow-lg cursor-pointer hover:scale-110 transition-transform active:scale-95">
                   <Star className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex gap-1.5 md:gap-2">
                   {(influencer.platforms || ['Instagram']).slice(0, 2).map((p, j) => (
                     <div key={j} className="p-1.5 md:p-2 bg-black/40 backdrop-blur-md rounded-lg md:rounded-xl text-white">
                        {p === 'Instagram' && <Camera size={12} className="md:w-3.5 md:h-3.5" />}
                        {p === 'YouTube' && <Video size={12} className="md:w-3.5 md:h-3.5" />}
                        {p === 'TikTok' && <MessageCircle size={12} className="md:w-3.5 md:h-3.5" />}
                        {p === 'Twitter' && <TrendingUp size={12} className="md:w-3.5 md:h-3.5" />}
                     </div>
                   ))}
                </div>
              </div>
              <div className="mb-4 md:mb-6">
                <div className="flex justify-between items-start mb-1 md:mb-2 text-wrap pr-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg md:text-xl text-slate-900 group-hover:text-sky-900 transition-colors line-clamp-1">{influencer.displayName}</h3>
                    {influencer.verified && (
                      <ShieldCheck className="w-4 h-4 text-sky-600 fill-sky-50" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                    <span className="text-[10px] md:text-xs font-bold font-mono">4.9</span>
                    <Star className="w-3 md:w-3.5 h-3 md:h-3.5 fill-current" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] md:text-sm mb-3 md:mb-4">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="line-clamp-1">{influencer.location || 'Global'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(influencer.niche || ['Lifestyle']).slice(0, 2).map(n => (
                    <span key={n} className="px-2 md:px-3 py-1 md:py-1.5 bg-slate-50 text-slate-500 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold uppercase tracking-wider">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4 pb-4 md:pb-6 border-b border-slate-100">
                <div>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Audience</p>
                  <p className="font-bold text-slate-900 text-sm md:text-lg">
                    {influencer.followersCount ? (influencer.followersCount > 1000000 ? `${(influencer.followersCount / 1000000).toFixed(1)}M` : `${(influencer.followersCount / 1000).toFixed(0)}k`) : '0'}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Engagement</p>
                  <p className="font-bold text-green-600 text-sm md:text-lg">{influencer.engagementRate || '0'}%</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedInfluencer(influencer)}
                className="w-full mt-4 md:mt-6 py-3 md:py-4 bg-slate-50 text-sky-900 font-bold rounded-xl md:rounded-2xl hover:bg-sky-100 transition-all border border-transparent hover:border-sky-200 text-sm md:text-base uppercase tracking-wider"
              >
                View Full Analytics
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {isAiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 md:p-12">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div>
                    <div className="flex items-center gap-2 text-sky-900 mb-1 md:mb-2">
                       <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                       <span className="font-bold text-[10px] md:text-sm uppercase tracking-widest">AI Matchmaker</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">Find your target influencers</h2>
                  </div>
                  <button 
                    onClick={() => setIsAiModalOpen(false)}
                    className="p-2 md:p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl md:rounded-2xl transition-colors"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                {!aiResult && !isAiLoading ? (
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-slate-700 mb-2 md:mb-3">Describe your brand and goal</label>
                      <textarea 
                        rows={3}
                        placeholder="e.g., We are a sustainable skincare brand..."
                        className="w-full p-4 md:p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] outline-none focus:border-sky-300 focus:bg-white transition-all text-slate-800 resize-none text-sm"
                        value={brandDescription}
                        onChange={(e) => setBrandDescription(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2 md:mb-3 text-xs md:text-sm font-bold">
                        <label className="text-slate-700">Campaign Budget</label>
                        <span className="text-sky-900">${budget.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" 
                        min="500" 
                        max="50000" 
                        step="500"
                        className="w-full accent-sky-900"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                      />
                      <div className="flex justify-between mt-1 md:mt-2 text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <span>$500</span>
                        <span>$50k+</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleAiSearch}
                      className="w-full bg-sky-900 text-white rounded-2xl py-4 md:py-5 text-base md:text-lg flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-sky-900/10 font-bold"
                    >
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                      Find My Matches
                    </button>
                  </div>
                ) : isAiLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-8">
                       <Loader2 className="w-20 h-20 text-[#A7D8FF] animate-spin" />
                       <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#003366]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">AI is analyzing {influencers.length} profiles...</h3>
                    <p className="text-slate-500 max-w-sm">Calculating engagement rates, niche alignment, and ROI potential for your brand.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-sky-50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-sky-200 mb-6 md:mb-8 max-h-[40vh] overflow-y-auto">
                       <h3 className="font-bold text-sky-900 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                         <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                         Top AI Recommendations
                       </h3>
                       <div className="space-y-3">
                         {(Array.isArray(aiResult) ? aiResult : []).length > 0 ? (
                           aiResult.map((item: any, i: number) => (
                             <div key={i} className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
                               <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                 <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-sky-100 rounded-lg md:rounded-xl flex items-center justify-center text-sky-900 font-bold text-lg md:text-xl">
                                   {i + 1}
                                 </div>
                                 <div className="overflow-hidden">
                                   <p className="font-bold text-slate-900 text-sm md:text-base truncate">{item.name}</p>
                                   <p className="text-[10px] md:text-xs text-slate-500 truncate">{item.relevance || 'Niche Match'}</p>
                                 </div>
                               </div>
                               <div className="text-right shrink-0">
                                 <p className="text-[8px] md:text-xs font-bold text-slate-400 uppercase leading-none md:mb-1">Score</p>
                                 <p className="text-base md:text-xl font-bold text-sky-900">{item.matchScore || item.score}%</p>
                                </div>
                             </div>
                           ))
                         ) : (
                            <div className="text-slate-800 text-sm prose max-w-none prose-p:text-xs md:prose-p:text-sm">
                               {typeof aiResult === 'string' ? aiResult : 'Analysis complete. Review the best matches below.'}
                            </div>
                         )}
                       </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setAiResult(null)}
                        className="flex-1 py-3 text-sky-900 font-bold hover:bg-slate-50 rounded-xl transition-all border border-slate-200 text-sm"
                      >
                        Refine
                      </button>
                      <button 
                        onClick={() => setIsAiModalOpen(false)}
                        className="flex-[2] bg-sky-900 text-white rounded-xl py-3 font-bold text-sm shadow-lg shadow-sky-900/10"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Analytics Modal */}
      <AnimatePresence>
        {selectedInfluencer && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInfluencer(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
            >
               <div className="flex flex-col md:flex-row">
                  {/* Left Sidebar */}
                  <div className="md:w-1/3 bg-slate-50 p-8 border-r border-slate-100">
                     <div className="text-center mb-8">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-sky-900 mx-auto mb-6 p-1 relative shadow-2xl">
                           <img 
                              src={selectedInfluencer.photoURL || `https://ui-avatars.com/api/?name=${selectedInfluencer.displayName}&background=0C4A6E&color=fff`} 
                              className="w-full h-full rounded-[2.3rem] object-cover"
                              alt="Influencer"
                           />
                           <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-50 flex items-center justify-center">
                              <Star className="w-4 h-4 text-white fill-current" />
                           </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{selectedInfluencer.displayName}</h2>
                        <p className="text-sky-900 font-bold text-sm tracking-widest opacity-60 uppercase mb-4">@{selectedInfluencer.handle || 'influencer'}</p>
                        
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                           {(selectedInfluencer.niche || []).map(n => (
                             <span key={n} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase">{n}</span>
                           ))}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                           <MapPin className="w-3 h-3 text-sky-900" />
                           {selectedInfluencer.location || 'Global'}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                           <div className="p-2 bg-sky-50 text-sky-900 rounded-lg">
                              <Target className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-400 uppercase">Primary Platform</p>
                              <p className="font-black text-slate-900">{selectedInfluencer.platforms?.[0] || 'Instagram'}</p>
                           </div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                           <div className="p-2 bg-sky-50 text-sky-900 rounded-lg">
                              <Users className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-400 uppercase">Followers</p>
                              <p className="font-black text-slate-900">{selectedInfluencer.followersCount?.toLocaleString() || '0'}</p>
                           </div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                           <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                              <TrendingUp className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-400 uppercase">Engagement</p>
                              <p className="font-black text-slate-900">{selectedInfluencer.engagementRate || '0'}%</p>
                           </div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                           <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                              <Target className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-400 uppercase">Reach Score</p>
                              <p className="font-black text-slate-900">{(selectedInfluencer.engagementRate || 0) * 12}/100</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 p-8 md:p-12">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Growth Trend</h3>
                           <p className="text-sm text-slate-500 font-medium italic">Verified by InfluenceHub AI Engine</p>
                        </div>
                        <button onClick={() => setSelectedInfluencer(null)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                           <X className="w-6 h-6" />
                        </button>
                     </div>

                     <div className="h-[250px] w-full mb-10">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={[
                              { name: 'Jan', value: (selectedInfluencer.followersCount || 0) * 0.8 },
                              { name: 'Feb', value: (selectedInfluencer.followersCount || 0) * 0.85 },
                              { name: 'Mar', value: (selectedInfluencer.followersCount || 0) * 0.92 },
                              { name: 'Apr', value: (selectedInfluencer.followersCount || 0) * 0.98 },
                              { name: 'May', value: (selectedInfluencer.followersCount || 0) },
                           ]}>
                              <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 700}} dy={10} />
                              <YAxis hide />
                              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                              <Area type="monotone" dataKey="value" stroke="#0C4A6E" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>

                     <div className="grid grid-cols-2 gap-6 pb-8 border-b border-slate-100 mb-8">
                        <div>
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Audience Demographics</h4>
                           <div className="space-y-3">
                              {[
                                 { label: 'Gen Z', value: 65, color: 'bg-sky-900' },
                                 { label: 'Millennials', value: 25, color: 'bg-sky-400' },
                                 { label: 'Others', value: 10, color: 'bg-slate-200' }
                              ].map(demo => (
                                 <div key={demo.label}>
                                    <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase mb-1">
                                       <span>{demo.label}</span>
                                       <span>{demo.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                       <div className={`h-full ${demo.color}`} style={{ width: `${demo.value}%` }}></div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="flex flex-col justify-center items-center bg-slate-50 rounded-3xl p-6 border border-slate-100 border-dashed">
                           <BarChart3 className="w-12 h-12 text-sky-900 opacity-20 mb-4" />
                           <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                              Real-time post analysis indicates high conversion in <span className="text-sky-900">Lifestyle & E-commerce</span> categories.
                           </p>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <button 
                          onClick={handleRequestPartnership}
                          disabled={requesting}
                          className="flex-1 py-4 bg-sky-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-950 transition-all shadow-xl shadow-sky-900/20 disabled:opacity-50"
                        >
                           {requesting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Request Partnership"}
                        </button>
                        <button className="flex items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
                           <Star className="w-6 h-6 text-amber-400" />
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default FindInfluencers;

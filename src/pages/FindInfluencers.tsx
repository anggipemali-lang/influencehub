import React, { useState } from 'react';
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
  BrainCircuit
} from 'lucide-react';
import { mockInfluencers } from '../services/influencerService';
import { generateRecommendation } from '../services/aiService';
import MainLayout from '../components/layout/MainLayout';
import toast from 'react-hot-toast';

const FindInfluencers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNiche, setActiveNiche] = useState('All');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [brandDescription, setBrandDescription] = useState('');
  const [budget, setBudget] = useState(1000);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const niches = ['All', 'Beauty', 'Fashion', 'Technology', 'Gaming', 'Food', 'Travel', 'Fitness'];

  const handleAiSearch = async () => {
    if (!brandDescription.trim()) {
      toast.error('Please describe your brand or campaign');
      return;
    }

    setIsAiLoading(true);
    try {
      const responseText = await generateRecommendation(brandDescription, budget, mockInfluencers);
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Discover Top Talent</h1>
          <p className="text-slate-600">Browse and filter thousands of verified influencers for your next campaign.</p>
        </div>

        {/* AI Recommendations Banner */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="mb-12 overflow-hidden relative rounded-[2.5rem] bg-gradient-to-br from-[#003366] via-[#004B99] to-[#002244] p-10 text-white shadow-2xl shadow-blue-900/20"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#A7D8FF]/20 rounded-xl backdrop-blur-sm border border-white/10">
                <Sparkles className="w-6 h-6 text-[#A7D8FF]" />
              </div>
              <span className="text-[#A7D8FF] font-bold text-xs uppercase tracking-[0.2em]">AI Intelligence</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">Match with AI Precision</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">Stop guessing. Let our proprietary AI engine scan through thousands of influencers to find the ones that perfectly align with your brand values and ROI targets.</p>
            <button 
              onClick={() => setIsAiModalOpen(true)}
              className="bg-[#A7D8FF] text-[#003366] font-bold px-8 py-4 rounded-2xl hover:bg-white transition-all shadow-xl shadow-blue-400/20 flex items-center gap-3 group"
            >
              Launch AI Matchmaker
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 hidden lg:block">
            <div className="absolute top-10 right-10 w-64 h-64 border-4 border-[#A7D8FF] rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-40 w-48 h-48 border-2 border-white rounded-full blur-2xl" />
          </div>
          <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block">
            <BrainCircuit className="w-64 h-64 text-[#A7D8FF] opacity-10" />
          </div>
        </motion.div>

        {/* Filters bar */}
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 mb-10 flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, niche, or location..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#A7D8FF] focus:bg-white transition-all text-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {niches.map(niche => (
              <button
                key={niche}
                onClick={() => setActiveNiche(niche)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeNiche === niche 
                    ? 'bg-[#003366] text-white shadow-xl shadow-blue-900/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
          <button className="p-4 bg-white border border-slate-200 rounded-xl hover:border-[#A7D8FF] hover:text-[#003366] transition-all text-slate-500">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {mockInfluencers
            .filter(inf => 
              (activeNiche === 'All' || inf.niche.includes(activeNiche)) &&
              (inf.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((influencer, i) => (
            <motion.div
              key={influencer.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-premium group"
            >
              <div className="relative mb-6 overflow-hidden rounded-3xl">
                <img 
                  src={influencer.photoURL} 
                  alt={influencer.displayName}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-2xl text-red-500 shadow-lg cursor-pointer hover:scale-110 transition-transform active:scale-95">
                   <Star className="w-5 h-5" />
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                   {influencer.platforms.slice(0, 2).map((p, j) => (
                     <div key={j} className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-white">
                        {p === 'Instagram' && <Camera size={14} />}
                        {p === 'YouTube' && <Video size={14} />}
                        {p === 'TikTok' && <MessageCircle size={14} />}
                        {p === 'Twitter' && <TrendingUp size={14} />}
                     </div>
                   ))}
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-slate-900 group-hover:text-[#003366] transition-colors">{influencer.displayName}</h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg">
                    <span className="text-xs font-bold font-mono">4.9</span>
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{influencer.location}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {influencer.niche?.slice(0, 3).map(n => (
                    <span key={n} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audience</p>
                  <p className="font-bold text-slate-900 text-lg">{(influencer.followersCount! / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Engagement</p>
                  <p className="font-bold text-green-600 text-lg">{influencer.engagementRate}%</p>
                </div>
              </div>

              <button className="w-full mt-6 py-4 bg-slate-50 text-[#003366] font-bold rounded-2xl hover:bg-[#A7D8FF] hover:bg-opacity-20 transition-all border border-transparent hover:border-[#A7D8FF]">
                View Full Analytics
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {isAiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 text-[#003366] mb-2">
                       <Sparkles className="w-5 h-5" />
                       <span className="font-bold text-sm uppercase tracking-widest">AI Matchmaker</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">Find your target influencers</h2>
                  </div>
                  <button 
                    onClick={() => setIsAiModalOpen(false)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {!aiResult && !isAiLoading ? (
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Describe your brand and campaign goal</label>
                      <textarea 
                        rows={4}
                        placeholder="e.g., We are a sustainable skincare brand launching a new organic sunscreen. We want to reach eco-conscious travelers and beauty enthusiasts..."
                        className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:border-[#A7D8FF] focus:bg-white transition-all text-slate-800 resize-none"
                        value={brandDescription}
                        onChange={(e) => setBrandDescription(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-3 text-sm font-bold">
                        <label className="text-slate-700">Campaign Budget</label>
                        <span className="text-[#003366]">${budget.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" 
                        min="500" 
                        max="50000" 
                        step="500"
                        className="w-full accent-[#003366]"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                      />
                      <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        <span>$500</span>
                        <span>$50,000+</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleAiSearch}
                      className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10"
                    >
                      <Sparkles className="w-6 h-6" />
                      Find My Perfect Matches
                    </button>
                  </div>
                ) : isAiLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-8">
                       <Loader2 className="w-20 h-20 text-[#A7D8FF] animate-spin" />
                       <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#003366]" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">AI is analyzing {mockInfluencers.length} profiles...</h3>
                    <p className="text-slate-500 max-w-sm">Calculating engagement rates, niche alignment, and ROI potential for your brand.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-[#A7D8FF]/10 p-6 rounded-[2rem] border border-[#A7D8FF]/30 mb-8">
                       <h3 className="font-bold text-[#003366] mb-4 flex items-center gap-2">
                         <Sparkles className="w-5 h-5" />
                         Top AI Recommendations
                       </h3>
                       <div className="space-y-4">
                         {(Array.isArray(aiResult) ? aiResult : []).length > 0 ? (
                           aiResult.map((item: any, i: number) => (
                             <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-[#A7D8FF]/20 rounded-xl flex items-center justify-center text-[#003366] font-bold text-xl">
                                   {i + 1}
                                 </div>
                                 <div>
                                   <p className="font-bold text-slate-900">{item.name}</p>
                                   <p className="text-xs text-slate-500">{item.relevance || 'Niche Match'}</p>
                                 </div>
                               </div>
                               <div className="text-right">
                                 <p className="text-xs font-bold text-slate-400 uppercase">Match Score</p>
                                 <p className="text-xl font-bold text-[#003366]">{item.matchScore || item.score}%</p>
                               </div>
                             </div>
                           ))
                         ) : (
                            <div className="text-slate-800 text-sm prose max-w-none">
                               {typeof aiResult === 'string' ? aiResult : 'Analysis complete. Review the best matches below.'}
                            </div>
                         )}
                       </div>
                    </div>
                    <button 
                      onClick={() => setAiResult(null)}
                      className="w-full py-4 text-[#003366] font-bold hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      Refine Parameters
                    </button>
                    <button 
                      onClick={() => setIsAiModalOpen(false)}
                      className="w-full btn-primary py-5 text-lg"
                    >
                      Done, View Details
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default FindInfluencers;

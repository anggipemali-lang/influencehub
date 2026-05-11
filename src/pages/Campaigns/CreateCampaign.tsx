import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  ArrowLeft, 
  DollarSign, 
  AlignLeft, 
  Type,
  Target,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { createCampaign } from '../../services/campaignService';
import toast from 'react-hot-toast';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CreateCampaign: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !budget) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const userSnap = await getDoc(doc(db, 'users', auth.currentUser!.uid));
      const brandName = userSnap.exists() ? userSnap.data().displayName : 'Brand';

      await createCampaign({
        title,
        description,
        budget: Number(budget),
        brandName,
        status: 'active'
      });

      toast.success("Campaign launched successfully!");
      navigate('/dashboard/brand');
    } catch (error: any) {
      toast.error(error.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <Link 
          to="/dashboard/brand" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-900 font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-sky-900 rounded-2xl flex items-center justify-center text-white">
                 <Rocket className="w-8 h-8" />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">New Campaign</h1>
                 <p className="text-slate-500 font-medium">Launch your next viral marketing drive.</p>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                 <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">Campaign Title</label>
                 <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Summer Fitness Challenge 2024"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 transition-all font-sans font-medium"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">Budget (USD)</label>
                 <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="number" 
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="5000"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 transition-all font-sans font-medium"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">Brief & Requirements</label>
                 <div className="relative">
                    <AlignLeft className="absolute left-4 top-5 text-slate-400 w-5 h-5" />
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what you're looking for in influencers, the timeline, and expected deliverables..."
                      rows={6}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 transition-all font-sans font-medium resize-none"
                      required
                    />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-sky-900 text-white rounded-2xl font-black text-lg hover:bg-sky-950 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-sky-900/20"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Launch Campaign
                    <CheckCircle2 className="w-6 h-6" />
                  </>
                )}
              </button>
           </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCampaign;

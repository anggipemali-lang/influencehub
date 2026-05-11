import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Settings, 
  BarChart3, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle,
  FileText,
  UserPlus,
  X,
  Camera,
  MapPin,
  Tag,
  Target,
  Sparkles,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import { createManualProfile, ManualProfileData, approveVerification, rejectVerification } from '../../services/adminService';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalType, setModalType] = useState<'influencer' | 'brand'>('influencer');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ManualProfileData>>({
    role: 'influencer',
    niche: [],
    platforms: ['Instagram']
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (!docSnap.exists() || docSnap.data().role !== 'admin') {
        toast.error("Access denied. Admin only.");
        navigate('/');
        return;
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (checking) return;

    const q = query(collection(db, 'users'), where('verificationRequested', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(docs);
    });

    return () => unsubscribe();
  }, [checking]);

  const handleOpenModal = (type: 'influencer' | 'brand') => {
    setModalType(type);
    setFormData({ 
      role: type, 
      niche: [], 
      platforms: type === 'influencer' ? ['Instagram'] : [],
      displayName: '',
      email: '',
      location: '',
      handle: '',
      photoURL: ''
    });
    setIsModalOpen(true);
  };

  const handleApprove = async (userId: string) => {
    try {
      await approveVerification(userId);
      toast.success("Profile verified successfully!");
      setIsReviewModalOpen(false);
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await rejectVerification(userId);
      toast.success("Verification request rejected");
      setIsReviewModalOpen(false);
    } catch (error) {
      toast.error("Rejection failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createManualProfile(formData as ManualProfileData);
      toast.success(`${modalType === 'influencer' ? 'Influencer' : 'Brand'} added successfully!`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to add profile. Check permissions.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-sky-900 animate-spin" />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Admin Control Center</h1>
            <p className="text-slate-500 font-medium">Monitor and manage the InfluenceFinder ecosystem.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => handleOpenModal('influencer')}
              className="flex items-center gap-2 px-6 py-3 bg-sky-900 text-white rounded-2xl font-bold text-sm hover:bg-sky-950 transition-all shadow-lg shadow-sky-900/20"
            >
              <UserPlus className="w-4 h-4" /> Add Influencer
            </button>
            <button 
              onClick={() => handleOpenModal('brand')}
              className="flex items-center gap-2 px-6 py-3 border border-slate-200 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Add Brand
            </button>
          </div>
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
                 {requests.length === 0 ? (
                   <p className="text-slate-400 text-sm italic py-4 text-center">No pending verification requests.</p>
                 ) : (
                   requests.map((req) => (
                     <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-4">
                          <img 
                            src={req.photoURL || `https://ui-avatars.com/api/?name=${req.displayName}&background=0C4A6E&color=fff`} 
                            className="w-10 h-10 rounded-full object-cover" 
                            alt=""
                          />
                          <div>
                            <p className="font-bold text-slate-900">{req.displayName}</p>
                            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">{req.role} • {req.handle || 'no handle'}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                         <button 
                           onClick={() => {
                             setSelectedUser(req);
                             setIsReviewModalOpen(true);
                           }}
                           className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all font-sans"
                         >
                           Review
                         </button>
                         <button 
                           onClick={() => handleApprove(req.id)}
                           className="px-4 py-2 bg-sky-900 text-white rounded-xl text-xs font-bold hover:bg-sky-950 transition-all font-sans"
                         >
                           Accept
                         </button>
                       </div>
                     </div>
                   ))
                 )}
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

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Add New {modalType}</h2>
                  <p className="text-slate-500 text-sm font-bold">Manual profile creation</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.displayName || ''}
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                    <input 
                      type="text" 
                      value={formData.location || ''}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Handle (@)</label>
                    <input 
                      type="text" 
                      value={formData.handle || ''}
                      onChange={(e) => setFormData({...formData, handle: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                    />
                  </div>
                </div>

                {modalType === 'influencer' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Followers Count</label>
                      <input 
                        type="number" 
                        value={formData.followersCount || ''}
                        onChange={(e) => setFormData({...formData, followersCount: Number(e.target.value)})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement %</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={formData.engagementRate || ''}
                        onChange={(e) => setFormData({...formData, engagementRate: Number(e.target.value)})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Niche (Comma separated)</label>
                  <input 
                    type="text" 
                    onChange={(e) => setFormData({...formData, niche: e.target.value.split(',').map(s => s.trim())})}
                    placeholder="Fashion, Gaming, Technology"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                  />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Photo</label>
                   <div className="flex items-center gap-4">
                      <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50">
                         <Camera className="w-6 h-6 text-slate-300" />
                         <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Upload Photo</span>
                         <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({...formData, photoURL: reader.result as string});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                      </label>
                      {formData.photoURL && (
                         <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
                            <img src={formData.photoURL} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setFormData({...formData, photoURL: ''})}
                              className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                              <X className="w-6 h-6" />
                            </button>
                         </div>
                      )}
                   </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-sky-900 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-sky-950 transition-all shadow-xl shadow-sky-900/20 flex items-center justify-center gap-3"
                >
                  {loading ? 'Processing...' : `Create ${modalType} Profile`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && selectedUser && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Review Request</h2>
                  <p className="text-slate-500 text-sm font-bold">{selectedUser.role} Profile Verification</p>
                </div>
                <button onClick={() => setIsReviewModalOpen(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <img 
                    src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${selectedUser.displayName}&background=0C4A6E&color=fff`} 
                    className="w-20 h-20 rounded-[2rem] object-cover shadow-lg" 
                    alt=""
                  />
                  <div>
                    <p className="text-xl font-bold text-slate-900">{selectedUser.displayName}</p>
                    <p className="text-sm text-slate-500 uppercase font-black tracking-widest">@{selectedUser.handle || 'no_handle'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Followers</p>
                    <p className="text-lg font-bold text-slate-900">{selectedUser.followersCount?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagement</p>
                    <p className="text-lg font-bold text-slate-900">{selectedUser.engagementRate || '0'}%</p>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-lg font-bold text-slate-900">{selectedUser.location || 'N/A'}</p>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Niche</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedUser.niche && Array.isArray(selectedUser.niche) ? selectedUser.niche.map((n: string) => (
                        <span key={n} className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md text-[10px] font-bold uppercase">{n}</span>
                      )) : <span className="text-slate-400 italic">None</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                    onClick={() => handleReject(selectedUser.id)}
                    className="flex-1 py-4 border-2 border-red-100 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedUser.id)}
                    className="flex-[2] py-4 bg-sky-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-950 transition-all shadow-xl shadow-sky-900/20"
                  >
                    Approve & Verify
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default AdminDashboard;

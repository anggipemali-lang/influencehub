import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Camera, 
  MapPin, 
  Tag, 
  Users, 
  TrendingUp, 
  Save, 
  Loader2,
  ArrowLeft,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { updateInfluencerProfile, InfluencerStats } from '../../services/profileService';
import toast from 'react-hot-toast';

const EditProfile: React.FC = () => {
  const { profile, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<InfluencerStats>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      if (profile) {
        setFormData(profile);
      }
      setLoading(false);
    }
  }, [authLoading, user, profile, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await updateInfluencerProfile(user.uid, formData);
      toast.success("Profile updated successfully!");
      navigate(`/dashboard/${formData.role}`);
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-sky-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-32">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-sky-900 transition-colors uppercase text-sm tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="bg-sky-900 h-32 relative">
             <div className="absolute -bottom-12 left-12 w-24 h-24 rounded-[2rem] bg-white p-1 shadow-lg">
                <img 
                  src={formData.photoURL || `https://ui-avatars.com/api/?name=${formData.displayName}&background=0C4A6E&color=fff`} 
                  className="w-full h-full rounded-[1.8rem] object-cover"
                  alt="Avatar"
                />
             </div>
          </div>

          <form onSubmit={handleSave} className="p-12 pt-20 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text"
                    value={formData.displayName || ''}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Handle (@)</label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text"
                    value={formData.handle || ''}
                    onChange={(e) => setFormData({...formData, handle: e.target.value})}
                    placeholder="sophiabloom"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Profile Photo</label>
              <div className="flex flex-col items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-slate-100 rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all group overflow-hidden">
                  {formData.photoURL ? (
                    <div className="relative w-full h-full">
                      <img src={formData.photoURL} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black text-white text-xs uppercase tracking-widest">
                        Click to change photo
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-10 h-10 text-slate-300 mb-2 group-hover:text-sky-900 transition-colors" />
                      <p className="mb-2 text-sm text-slate-500 font-bold">Click or drag to upload photo</p>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">JPG, PNG or PDF (Max 2MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          toast.error("File size too large (>2MB)");
                          return;
                        }
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
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, photoURL: ''})}
                    className="mt-4 text-xs font-black text-red-500 uppercase tracking-widest hover:underline"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="New York, USA"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Niche</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text"
                    value={formData.niche?.[0] || ''}
                    onChange={(e) => setFormData({...formData, niche: [e.target.value]})}
                    placeholder="Fashion, Beauty"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Followers</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="number"
                    value={formData.followersCount || ''}
                    onChange={(e) => setFormData({...formData, followersCount: Number(e.target.value)})}
                    placeholder="1200000"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Engagement Rate (%)</label>
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="number"
                    step="0.1"
                    value={formData.engagementRate || ''}
                    onChange={(e) => setFormData({...formData, engagementRate: Number(e.target.value)})}
                    placeholder="4.5"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-sky-300 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                disabled={saving}
                className="flex-1 py-5 bg-sky-900 text-white rounded-2xl font-black text-lg hover:bg-sky-950 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-sky-900/20 uppercase tracking-widest"
              >
                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Save Changes
                    <Save className="w-5 h-5" />
                  </>
                )}
              </button>

              {!formData.verified && !formData.verificationRequested && (
                <button 
                  type="button"
                  onClick={async () => {
                    if (!user) return;
                    setSaving(true);
                    try {
                      await updateInfluencerProfile(user.uid, { verificationRequested: true });
                      setFormData(prev => ({ ...prev, verificationRequested: true }));
                      toast.success("Verification request sent!");
                    } catch (error) {
                      toast.error("Request failed");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="px-8 py-5 border-2 border-amber-500 text-amber-600 rounded-2xl font-black text-xs hover:bg-amber-50 transition-all flex items-center justify-center gap-3 disabled:opacity-70 uppercase tracking-widest"
                >
                  Request Verification
                </button>
              )}

              {formData.verificationRequested && !formData.verified && (
                <div className="px-8 py-5 bg-amber-50 text-amber-600 rounded-2xl font-black text-xs flex items-center justify-center gap-3 uppercase tracking-widest border border-amber-100">
                  <AlertCircle className="w-4 h-4" />
                  Verification Pending
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;

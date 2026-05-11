import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { UserRole } from './authService';

export interface Campaign {
  id?: string;
  title: string;
  description: string;
  brandId: string;
  brandName: string;
  budget: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdAt: any;
  targetAudience?: string[];
}

export interface CampaignApplication {
  id?: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: any;
  reviewedAt?: any;
}

export const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'brandId' | 'createdAt'>) => {
  if (!auth.currentUser) throw new Error("Authentication required");

  const newCampaign = {
    ...campaignData,
    brandId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    status: 'active' as const
  };

  const docRef = await addDoc(collection(db, 'campaigns'), newCampaign);
  return { id: docRef.id, ...newCampaign };
};

export const getCampaigns = async () => {
  const q = query(collection(db, 'campaigns'), where('status', '==', 'active'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
};

export const getBrandCampaigns = async (brandId: string) => {
  const q = query(collection(db, 'campaigns'), where('brandId', '==', brandId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
};

export const applyToCampaign = async (campaignId: string, message: string, influencerName: string) => {
  if (!auth.currentUser) throw new Error("Authentication required");

  const application = {
    campaignId,
    influencerId: auth.currentUser.uid,
    influencerName,
    message,
    status: 'pending' as const,
    appliedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'applications'), application);
  return { id: docRef.id, ...application };
};

export const getCampaignApplications = async (campaignId: string) => {
  const q = query(collection(db, 'applications'), where('campaignId', '==', campaignId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CampaignApplication));
};

export const reviewApplication = async (applicationId: string, status: 'approved' | 'rejected') => {
  const docRef = doc(db, 'applications', applicationId);
  await updateDoc(docRef, {
    status,
    reviewedAt: serverTimestamp()
  });
};

export interface Offer {
  id?: string;
  brandId: string;
  brandName: string;
  influencerId: string;
  campaignId: string | null;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
}

export const sendOffer = async (influencerId: string, message: string, brandName: string) => {
  if (!auth.currentUser) throw new Error("Authentication required");

  const offer: Omit<Offer, 'id'> = {
    brandId: auth.currentUser.uid,
    brandName,
    influencerId,
    campaignId: null, // Optional Link to campaign
    message,
    status: 'pending',
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'offers'), offer);
  return { id: docRef.id, ...offer };
};

export const getInfluencerOffers = async (influencerId: string) => {
  const q = query(
    collection(db, 'offers'), 
    where('influencerId', '==', influencerId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
};

export const getBrandOffers = async (brandId: string) => {
  const q = query(
    collection(db, 'offers'), 
    where('brandId', '==', brandId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
};

export const respondToOffer = async (offerId: string, status: 'accepted' | 'rejected') => {
  const docRef = doc(db, 'offers', offerId);
  await updateDoc(docRef, {
    status,
    respondedAt: serverTimestamp()
  });
};

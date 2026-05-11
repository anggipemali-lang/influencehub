import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from './authService';

export interface InfluencerStats extends UserProfile {
  location?: string;
  niche?: string[];
  platforms?: string[];
  followersCount?: number;
  engagementRate?: number;
  photoURL?: string;
  handle?: string;
  verified?: boolean;
  verificationRequested?: boolean;
}

export const updateInfluencerProfile = async (uid: string, data: Partial<InfluencerStats>) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, data);
};

export const getAllInfluencers = async (): Promise<InfluencerStats[]> => {
  // Only return influencers who are verified
  const q = query(
    collection(db, 'users'), 
    where('role', '==', 'influencer'),
    where('verified', '==', true)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as InfluencerStats));
};

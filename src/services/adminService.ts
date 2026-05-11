import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserRole } from './authService';

export interface ManualProfileData {
  displayName: string;
  email: string;
  role: 'influencer' | 'brand';
  niche: string[];
  location: string;
  followersCount?: number;
  engagementRate?: number;
  photoURL?: string;
  handle?: string;
  platforms?: string[];
}

export const createManualProfile = async (data: ManualProfileData) => {
  try {
    // Generate a random ID for profiles created manually by admin
    // In a real app, you'd might use Firebase Admin SDK to create auth users
    // For this context, we'll create user documents that the marketplace can read
    const manualId = `manual_${data.role}_${Date.now()}`;
    const docRef = doc(db, 'users', manualId);
    
    const profile = {
      ...data,
      uid: manualId,
      createdAt: new Date().toISOString(),
      isManual: true, // Flag to identify admin-created profiles
      verified: true
    };

    await setDoc(docRef, profile);
    return manualId;
  } catch (error) {
    console.error("Error creating manual profile:", error);
    throw error;
  }
};

export const approveVerification = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { 
      verified: true, 
      verificationRequested: false 
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error approving verification:", error);
    throw error;
  }
};

export const rejectVerification = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { 
      verificationRequested: false 
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error rejecting verification:", error);
    throw error;
  }
};

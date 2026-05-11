import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'brand' | 'influencer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: string;
}

export const registerUser = async (email: string, password: string, role: UserRole, displayName: string) => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      role,
      displayName,
      createdAt: new Date().toISOString()
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), profile);

    return profile;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch profile
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const profile = docSnap.data() as UserProfile;
      // Auto-upgrade to admin if email matches
      if (profile.email.toLowerCase() === 'anggipemali@gmail.com' && profile.role !== 'admin') {
        const updatedProfile = { ...profile, role: 'admin' as UserRole };
        await setDoc(docRef, updatedProfile);
        return updatedProfile;
      }
      return profile;
    } else {
      throw new Error("User profile not found");
    }
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const loginWithGoogle = async (role: UserRole) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if profile exists
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Create new profile
      const finalRole = (user.email?.toLowerCase() === 'anggipemali@gmail.com') ? 'admin' : role;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        role: finalRole as UserRole,
        displayName: user.displayName || 'Anonymous',
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, profile);
      return profile;
    }

    const profile = docSnap.data() as UserProfile;
    // Auto-upgrade existing profile to admin if email matches
    if ((profile.email.toLowerCase() === 'anggipemali@gmail.com' || (user.email && user.email.toLowerCase() === 'anggipemali@gmail.com')) && profile.role !== 'admin') {
      const updatedProfile = { ...profile, role: 'admin' as UserRole };
      await setDoc(docRef, updatedProfile);
      return updatedProfile;
    }

    return profile;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};

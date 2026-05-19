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
  console.log("Mock create manual profile", data);
  return `manual_${Date.now()}`;
};

export const approveVerification = async (userId: string) => {
  console.log("Mock approve verification", userId);
  return true;
};

export const rejectVerification = async (userId: string) => {
  console.log("Mock reject verification", userId);
  return true;
};

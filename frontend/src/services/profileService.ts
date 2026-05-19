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
  pricing: {
    post: number;
    story: number;
    reels?: number;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const updateInfluencerProfile = async (uid: string, data: Partial<InfluencerStats>) => {
  // In a real app, this would call PATCH /api/users/:uid
  // For now we'll just mock it or assume it's handled in memory if we add the endpoint
  console.log("Mock update profile", uid, data);
};

export const getAllInfluencers = async (): Promise<InfluencerStats[]> => {
  const now = new Date().toISOString();
  // Mock data for demonstration
  return [
    {
      uid: 'inf1',
      displayName: 'Sarah Jenkins',
      email: 'sarah@example.com',
      role: 'influencer',
      handle: 'sarah_j',
      niche: ['Fashion', 'Beauty'],
      followersCount: 1250000,
      engagementRate: 4.8,
      location: 'Los Angeles, USA',
      verified: true,
      pricing: { post: 1500, story: 500, reels: 2000 },
      createdAt: now
    },
    {
      uid: 'inf2',
      displayName: 'Mike Chen',
      email: 'mike@example.com',
      role: 'influencer',
      handle: 'techmike',
      niche: ['Technology', 'Gaming'],
      followersCount: 850000,
      engagementRate: 5.2,
      location: 'San Francisco, USA',
      pricing: { post: 2500, story: 800, reels: 3000 },
      createdAt: now
    },
    {
      uid: 'inf3',
      displayName: 'Elena Rodriguez',
      email: 'elena@example.com',
      role: 'influencer',
      handle: 'elena_travel',
      niche: ['Travel', 'Food'],
      followersCount: 450000,
      engagementRate: 6.1,
      location: 'Madrid, Spain',
      verified: true,
      pricing: { post: 1000, story: 300, reels: 1200 },
      createdAt: now
    },
    {
      uid: 'inf4',
      displayName: 'David Kwok',
      email: 'david@example.com',
      role: 'influencer',
      handle: 'davidfitness',
      niche: ['Fitness', 'Health'],
      followersCount: 2200000,
      engagementRate: 3.5,
      location: 'London, UK',
      verified: true,
      pricing: { post: 4000, story: 1500, reels: 5000 },
      createdAt: now
    }
  ];
};
